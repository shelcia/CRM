export type TodoAuthor = { name: string; image: string };

export type Todo = {
  _id: string;
  columnId: string;
  projectId: string;
  title: string;
  description: string;
  author: TodoAuthor;
  date: string;
};

export type Column = {
  _id: string;
  name: string;
  order: number;
  todos: Todo[];
};

export type Project = {
  _id: string;
  name: string;
  date: string;
  totalTasks: number;
  doneTasks: number;
};
