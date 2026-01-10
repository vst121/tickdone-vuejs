import { describe, it, expect, vi, beforeEach } from 'vitest'
import { todoService } from '../todoService'

describe('todoService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('getTodos should fetch and return todos', async () => {
    const mockTodos = [{ id: 1, taskName: 'Test Task', done: false, deadline: null }]
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTodos)
    } as Response)

    const result = await todoService.getTodos()
    expect(result).toEqual(mockTodos)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/todos'))
  })

  it('createTodo should post and return new todo', async () => {
    const newTodo = { taskName: 'New Task', done: false, deadline: null }
    const resTodo = { id: 1, ...newTodo }
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(resTodo)
    } as Response)

    const result = await todoService.createTodo(newTodo)
    expect(result).toEqual(resTodo)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/todos'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newTodo)
      })
    )
  })

  it('updateTodo should put and return updated todo', async () => {
    const todo = { id: 1, taskName: 'Updated Task', done: true, deadline: null }
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(todo)
    } as Response)

    const result = await todoService.updateTodo(1, todo)
    expect(result).toEqual(todo)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/todos/1'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(todo)
      })
    )
  })

  it('deleteTodo should send delete request', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true
    } as Response)

    await todoService.deleteTodo(1)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/todos/1'),
      expect.objectContaining({
        method: 'DELETE'
      })
    )
  })

  it('should throw error if response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      statusText: 'Not Found'
    } as Response)

    await expect(todoService.getTodos()).rejects.toThrow('Failed to fetch todos: Not Found')
  })
})
