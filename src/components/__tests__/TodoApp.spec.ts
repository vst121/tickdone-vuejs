import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TodoApp from '../TodoApp.vue'
import { useTodos } from '../../composables/useTodos'

import { ref } from 'vue'

// Mock the composable
vi.mock('../../composables/useTodos', () => ({
  useTodos: vi.fn()
}))

describe('TodoApp.vue', () => {
  const mockUseTodos = {
    loading: ref(false),
    error: ref<string | null>(null),
    filter: ref('all'),
    deleteId: ref<number | null>(null),
    filteredTodos: ref<any[]>([]),
    itemsLeft: ref(0),
    loadTodos: vi.fn(),
    addTodo: vi.fn(),
    toggleDone: vi.fn(),
    confirmDelete: vi.fn(),
    isOverdue: vi.fn().mockReturnValue(false)
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useTodos).mockReturnValue(mockUseTodos as any)
    // Reset refs
    mockUseTodos.loading.value = false
    mockUseTodos.error.value = null
    mockUseTodos.filter.value = 'all'
    mockUseTodos.deleteId.value = null
    mockUseTodos.filteredTodos.value = []
    mockUseTodos.itemsLeft.value = 0
  })

  it('renders "No todos yet!" when list is empty', async () => {
    mockUseTodos.filteredTodos.value = []
    const wrapper = mount(TodoApp)
    expect(wrapper.text()).toContain('No todos yet!')
  })

  it('renders todos when they exist', async () => {
    mockUseTodos.filteredTodos.value = [
      { id: 1, taskName: 'Learn Testing', done: false, deadline: null }
    ]
    const wrapper = mount(TodoApp)
    expect(wrapper.text()).toContain('Learn Testing')
    expect(wrapper.find('.todo-item').exists()).toBe(true)
  })

  it('calls loadTodos on mount', () => {
    mount(TodoApp)
    expect(mockUseTodos.loadTodos).toHaveBeenCalled()
  })

  it('submits a new todo when form is submitted', async () => {
    const wrapper = mount(TodoApp)
    const taskInput = wrapper.find('input[type="text"]')
    
    await taskInput.setValue('New Task')
    await wrapper.find('form').trigger('submit.prevent')

    expect(mockUseTodos.addTodo).toHaveBeenCalledWith('New Task', '')
  })

  it('shows loading state', async () => {
    mockUseTodos.loading.value = true
    const wrapper = mount(TodoApp)
    expect(wrapper.text()).toContain('Loading tasks...')
  })

  it('shows error message', async () => {
    mockUseTodos.error.value = 'Failed to load'
    const wrapper = mount(TodoApp)
    expect(wrapper.text()).toContain('Failed to load')
  })

  it('changes filter when filter buttons are clicked', async () => {
    const wrapper = mount(TodoApp)
    const buttons = wrapper.findAll('.filters button')
    
    // Find "Completed" button (index 2 based on template)
    await buttons[2]!.trigger('click')
    expect(mockUseTodos.filter.value).toBe('completed')
    
    await buttons[1]!.trigger('click')
    expect(mockUseTodos.filter.value).toBe('active')
  })

  it('opens delete confirmation dialog when delete button is clicked', async () => {
    mockUseTodos.filteredTodos.value = [
      { id: 1, taskName: 'To be deleted', done: false, deadline: null }
    ]
    const wrapper = mount(TodoApp)
    
    await wrapper.find('.delete-btn').trigger('click')
    expect(mockUseTodos.deleteId.value).toBe(1)
  })
})
