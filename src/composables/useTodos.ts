import { ref, computed } from 'vue'
import type { Todo, TodoFilter } from '../types/todo'
import { todoService } from '../services/todoService'

export function useTodos() {
  const todos = ref<Todo[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)
  const filter = ref<TodoFilter>('all')
  const deleteId = ref<number | null>(null)

  const loadTodos = async () => {
    loading.value = true
    error.value = null
    try {
      todos.value = await todoService.getTodos()
    } catch (err) {
      console.error('Error fetching todos:', err)
      error.value = 'An unexpected error occurred while fetching the todos.'
      todos.value = []
    } finally {
      loading.value = false
    }
  }

  const addTodo = async (taskName: string, deadline: string | null) => {
    error.value = null
    const newTodoData = {
      taskName: taskName.trim(),
      deadline: deadline ? new Date(deadline).toISOString() : null,
      done: false
    }

    try {
      const createdTodo = await todoService.createTodo(newTodoData)
      todos.value.push(createdTodo)
    } catch (err) {
      console.error('Error creating todo:', err)
      error.value = 'An unexpected error occurred while creating the todo.'
    }
  }

  const toggleDone = async (id: number) => {
    const todo = todos.value.find((t) => t.id === id)
    if (!todo) return

    error.value = null
    const updatedTodo = { ...todo, done: !todo.done }

    try {
      const result = await todoService.updateTodo(id, updatedTodo)
      const index = todos.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        todos.value[index] = result
      }
    } catch (err) {
      console.error('Error updating todo:', err)
      error.value = 'Failed to update todo'
    }
  }

  const confirmDelete = async () => {
    if (deleteId.value === null) return
    const id = deleteId.value
    error.value = null

    try {
      await todoService.deleteTodo(id)
      todos.value = todos.value.filter((t) => t.id !== id)
      deleteId.value = null
    } catch (err) {
      console.error('Error deleting todo:', err)
      error.value = 'Failed to delete todo'
      deleteId.value = null
    }
  }

  const isOverdue = (todo: Todo): boolean => {
    return !!(todo.deadline && new Date(todo.deadline) < new Date() && !todo.done)
  }

  const filteredTodos = computed(() => {
    return todos.value.filter((todo) => {
      if (filter.value === 'all') return true
      if (filter.value === 'active') return !todo.done && !isOverdue(todo)
      if (filter.value === 'completed') return todo.done
      return true
    })
  })

  const itemsLeft = computed(() => {
    return todos.value.filter(t => !t.done).length
  })

  return {
    todos,
    loading,
    error,
    filter,
    deleteId,
    filteredTodos,
    itemsLeft,
    loadTodos,
    addTodo,
    toggleDone,
    confirmDelete,
    isOverdue
  }
}
