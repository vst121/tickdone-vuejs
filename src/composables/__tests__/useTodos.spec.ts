import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTodos } from '../useTodos'
import { todoService } from '../../services/todoService'

vi.mock('../../services/todoService', () => ({
  todoService: {
    getTodos: vi.fn(),
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn()
  }
}))

describe('useTodos', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('loadTodos should update todos and loading state', async () => {
    const mockTodos = [{ id: 1, taskName: 'Test Task', done: false, deadline: null }]
    vi.mocked(todoService.getTodos).mockResolvedValue(mockTodos)

    const { todos, loading, loadTodos } = useTodos()
    
    expect(loading.value).toBe(true)
    await loadTodos()
    
    expect(todos.value).toEqual(mockTodos)
    expect(loading.value).toBe(false)
  })

  it('addTodo should call service and update todos list', async () => {
    const newTodo = { id: 2, taskName: 'New Task', done: false, deadline: null }
    vi.mocked(todoService.createTodo).mockResolvedValue(newTodo)

    const { todos, addTodo } = useTodos()
    await addTodo('New Task', null)

    expect(todoService.createTodo).toHaveBeenCalled()
    expect(todos.value).toContainEqual(newTodo)
  })

  it('toggleDone should update todo status', async () => {
    const initialTodo = { id: 1, taskName: 'Test', done: false, deadline: null }
    const updatedTodo = { ...initialTodo, done: true }
    
    vi.mocked(todoService.getTodos).mockResolvedValue([initialTodo])
    vi.mocked(todoService.updateTodo).mockResolvedValue(updatedTodo)

    const { todos, loadTodos, toggleDone } = useTodos()
    await loadTodos()
    await toggleDone(1)

    expect(todoService.updateTodo).toHaveBeenCalledWith(1, updatedTodo)
    expect(todos.value[0].done).toBe(true)
  })

  it('confirmDelete should remove todo from list', async () => {
    const todo = { id: 1, taskName: 'Test', done: false, deadline: null }
    vi.mocked(todoService.getTodos).mockResolvedValue([todo])
    vi.mocked(todoService.deleteTodo).mockResolvedValue(undefined)

    const { todos, loadTodos, deleteId, confirmDelete } = useTodos()
    await loadTodos()
    
    deleteId.value = 1
    await confirmDelete()

    expect(todoService.deleteTodo).toHaveBeenCalledWith(1)
    expect(todos.value).toHaveLength(0)
    expect(deleteId.value).toBe(null)
  })

  it('filteredTodos should return items based on filter', async () => {
    const mockTodos = [
      { id: 1, taskName: 'Active', done: false, deadline: null },
      { id: 2, taskName: 'Done', done: true, deadline: null }
    ]
    vi.mocked(todoService.getTodos).mockResolvedValue(mockTodos)

    const { filter, filteredTodos, loadTodos } = useTodos()
    await loadTodos()

    filter.value = 'all'
    expect(filteredTodos.value).toHaveLength(2)

    filter.value = 'active'
    expect(filteredTodos.value).toHaveLength(1)
    expect(filteredTodos.value[0].taskName).toBe('Active')

    filter.value = 'completed'
    expect(filteredTodos.value).toHaveLength(1)
    expect(filteredTodos.value[0].taskName).toBe('Done')
  })
})
