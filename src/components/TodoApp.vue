<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTodos } from '../composables/useTodos'

const {
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
} = useTodos()

const taskName = ref('')
const deadline = ref('')

onMounted(() => {
  loadTodos()
})

const handleSubmit = async () => {
  if (!taskName.value.trim()) return
  await addTodo(taskName.value, deadline.value)
  taskName.value = ''
  deadline.value = ''
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="todo-container">
    <div class="todo-card">
      <header class="todo-header">
        <h1>Todos</h1>
        <p class="subtitle">Focus on your productivity</p>
      </header>

      <form @submit.prevent="handleSubmit" class="todo-form">
        <div class="input-group">
          <input
            v-model="taskName"
            type="text"
            placeholder="What needs to be done?"
            required
            class="task-input"
          />
          <input
            v-model="deadline"
            type="datetime-local"
            class="deadline-input"
          />
          <button type="submit" class="add-button">
            <span class="icon">+</span>
          </button>
        </div>
      </form>

      <div class="filters">
        <button
          v-for="f in ['all', 'active', 'completed']"
          :key="f"
          @click="filter = f as any"
          :class="{ active: filter === f }"
          class="filter-btn"
        >
          {{ f.charAt(0).toUpperCase() + f.slice(1) }}
        </button>
      </div>

      <div v-if="loading" class="status-msg">
        <div class="spinner"></div>
        Loading tasks...
      </div>

      <div v-else-if="error" class="status-msg error">
        {{ error }}
      </div>

      <div v-else class="todo-list">
        <TransitionGroup name="list">
          <div
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="todo-item"
            :class="{ done: todo.done, overdue: isOverdue(todo) }"
          >
            <div class="todo-content">
              <label class="checkbox-container">
                <input
                  type="checkbox"
                  :checked="todo.done"
                  @change="toggleDone(todo.id)"
                />
                <span class="checkmark"></span>
              </label>
              
              <div class="todo-details">
                <span class="task-name">{{ todo.taskName }}</span>
                <span v-if="todo.deadline" class="task-deadline">
                  {{ isOverdue(todo) ? 'Overdue: ' : '' }}{{ formatDate(todo.deadline) }}
                </span>
              </div>
            </div>

            <button @click="deleteId = todo.id" class="delete-btn" title="Delete task">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </TransitionGroup>

        <div v-if="filteredTodos.length === 0" class="empty-state">
          No tasks found.
        </div>
      </div>

      <footer class="todo-footer">
        <span>{{ itemsLeft }} items left</span>
      </footer>
    </div>

    <!-- Deletion Modal -->
    <Teleport to="body">
      <div v-if="deleteId !== null" class="modal-overlay">
        <div class="modal-content">
          <h3>Delete Task?</h3>
          <p>Are you sure you want to remove this task? This action cannot be undone.</p>
          <div class="modal-actions">
            <button @click="deleteId = null" class="btn-cancel">Cancel</button>
            <button @click="confirmDelete" class="btn-delete">Delete</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.todo-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Outfit', sans-serif;
}

.todo-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.todo-header {
  padding: 2.5rem 2rem 1.5rem;
  text-align: center;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
}

.todo-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -1px;
}

.subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
  font-size: 1rem;
}

.todo-form {
  padding: 2rem;
  border-bottom: 1px solid #f1f5f9;
}

.input-group {
  display: flex;
  gap: 0.75rem;
  background: #f8fafc;
  padding: 0.5rem;
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.input-group:focus-within {
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.task-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.75rem;
  font-size: 1rem;
  outline: none;
}

.deadline-input {
  border: none;
  background: #f1f5f9;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #64748b;
  outline: none;
}

.add-button {
  background: #6366f1;
  color: white;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.add-button:hover {
  background: #4f46e5;
  transform: translateY(-2px);
}

.filters {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
}

.filter-btn {
  border: none;
  background: white;
  padding: 0.5rem 1.25rem;
  border-radius: 100px;
  font-size: 0.9rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-btn.active {
  background: #6366f1;
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.todo-list {
  padding: 1rem;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: white;
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
}

.todo-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: #e2e8f0;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.todo-details {
  display: flex;
  flex-direction: column;
}

.task-name {
  font-weight: 500;
  color: #1e293b;
  transition: all 0.3s;
}

.task-deadline {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.todo-item.done .task-name {
  text-decoration: line-through;
  color: #cbd5e1;
}

.todo-item.overdue .task-deadline {
  color: #ef4444;
  font-weight: 600;
}

.todo-item.overdue {
  border-left: 4px solid #ef4444;
}

/* Custom Checkbox */
.checkbox-container {
  position: relative;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 24px;
  width: 24px;
  background-color: #f1f5f9;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.2s;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #e2e8f0;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #10b981;
  border-color: #10b981;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 8px;
  top: 4px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.delete-btn {
  background: transparent;
  border: none;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0.5rem;
  border-radius: 8px;
}

.delete-btn:hover {
  color: #ef4444;
  background: #fef2f2;
}

.status-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #64748b;
  gap: 1rem;
}

.status-msg.error {
  color: #ef4444;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  font-style: italic;
}

.todo-footer {
  padding: 1.25rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #64748b;
}

/* Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 24px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-content h3 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: #1e293b;
}

.modal-content p {
  color: #64748b;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  font-weight: 500;
}

.btn-delete {
  flex: 1;
  padding: 0.75rem;
  border-radius: 12px;
  border: none;
  background: #ef4444;
  color: white;
  cursor: pointer;
  font-weight: 500;
}

.btn-delete:hover {
  background: #dc2626;
}
</style>
