import type { Todo } from '../types/todo'

// Utility to handle URL construction without double slashes
const getUrl = (path: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  return `${baseUrl}/${path.replace(/^\//, '')}`
}

// Local storage fallback for when the API is not available
const STORAGE_KEY = 'tickdone_todos_mock'
const getLocalTodos = (): Todo[] => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
const saveLocalTodos = (todos: Todo[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))

export const todoService = {
  async getTodos(): Promise<Todo[]> {
    const response = await fetch(getUrl('todos'))
    if (!response.ok) throw new Error('Failed to fetch todos: ' + response.statusText)
    return await response.json()
  },

  async createTodo(todo: Partial<Todo>): Promise<Todo> {
    const response = await fetch(getUrl('todos'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    })
    if (!response.ok) throw new Error('Failed to create todo: ' + response.statusText)
    return await response.json()
  },

  async updateTodo(id: number, todo: Todo): Promise<Todo> {
    const response = await fetch(getUrl(`todos/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    })
    if (!response.ok) throw new Error('Failed to update todo: ' + response.statusText)
    return await response.json()
  },

  async deleteTodo(id: number): Promise<void> {
    const response = await fetch(getUrl(`todos/${id}`), {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete todo: ' + response.statusText)
  }
}
