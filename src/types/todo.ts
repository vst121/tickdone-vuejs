export interface Todo {
  id: number;
  taskName: string;
  deadline: string | null;
  done: boolean;
}

export type TodoFilter = 'all' | 'active' | 'completed';
