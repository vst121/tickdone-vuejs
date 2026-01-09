import type { Todo } from '../types/todo'

// Utility to handle URL construction without double slashes
const getUrl = (path: string) => {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
  return `${baseUrl}/${path.replace(/^\//, '')}`
}

// Local storage fallback for when the API is not available
const STORAGE_KEY = 'tickdone_todos_mock'
const getLocalTodos = (): Todo[] => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
const saveLocalTodos = (todos: Todo[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(getUrl('todos'))
      if (!response.ok) throw new Error('Failed to fetch todos')
      const data = await response.json()
      saveLocalTodos(data) // Sync local storage for offline use
      return data
    } catch (err) {
      console.warn('API Error, falling back to local storage:', err)
      return getLocalTodos()
    }
  },

  async createTodo(todo: Partial<Todo>): Promise<Todo> {
    try {
      const response = await fetch(getUrl('todos'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
      })
      if (!response.ok) throw new Error('Failed to create todo')
      const created = await response.json()
      
      const local = getLocalTodos()
      saveLocalTodos([...local, created])
      
      return created
    } catch (err) {
      console.warn('API Error, saving to local storage:', err)
      const local = getLocalTodos()
      const newTodo: Todo = {
        ...todo,
        id: Date.now(),
        done: todo.done || false,
        taskName: todo.taskName || 'Untitled',
        deadline: todo.deadline || null
      } as Todo
      saveLocalTodos([...local, newTodo])
      return newTodo
    }
  },

  async updateTodo(id: number, todo: Todo): Promise<Todo> {
    try {
      const response = await fetch(getUrl(`todos/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
      })
      if (!response.ok) throw new Error('Failed to update todo')
      const updated = await response.json()
      
      const local = getLocalTodos()
      saveLocalTodos(local.map(t => t.id === id ? updated : t))
      
      return updated
    } catch (err) {
      console.warn('API Error, updating local storage:', err)
      const local = getLocalTodos()
      const updated = { ...todo, id }
      saveLocalTodos(local.map(t => t.id === id ? updated : t))
      return updated
    }
  },

  async deleteTodo(id: number): Promise<void> {
    try {
      const response = await fetch(getUrl(`todos/${id}`), {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete todo')
      
      const local = getLocalTodos()
      saveLocalTodos(local.filter(t => t.id !== id))
    } catch (err) {
      console.warn('API Error, deleting from local storage:', err)
      const local = getLocalTodos()
      saveLocalTodos(local.filter(t => t.id !== id))
    }
  }
}
