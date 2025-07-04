// todo.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const TODO_FILE = "todo.csv";

type Todo = {
  id: string;
  task: string;
  done: boolean;
};

async function createTodoFileIfNotExists(): Promise<void> {
  const file = Bun.file(TODO_FILE);
  if (await file.exists()) {
    return;
  }
  await Bun.write(TODO_FILE, "id,task,done\n");
}

async function readTodos(): Promise<Todo[]> {
  try {
    const text = await Bun.file(TODO_FILE).text();
    const lines = text.trim().split("\n").slice(1);
    return lines.filter(Boolean).map(line => {
      // Better CSV parsing - handle commas in task names
      const firstComma = line.indexOf(',');
      const lastComma = line.lastIndexOf(',');
      
      if (firstComma === -1 || lastComma === -1 || firstComma === lastComma) {
        // Fallback to simple split if format is unexpected
        const [id, task, done] = line.split(",");
        return { id: id || "", task: task || "", done: done === "true" };
      }
      
      const id = line.substring(0, firstComma);
      const task = line.substring(firstComma + 1, lastComma);
      const done = line.substring(lastComma + 1);
      
      return { id, task, done: done === "true" };
    });
  } catch (error) {
    console.error("Error reading todos:", error);
    return [];
  }
}

async function writeTodos(todos: Todo[]): Promise<void> {
  try {
    const body = todos.map(t => `${t.id},"${t.task.replace(/"/g, '""')}",${t.done}`).join("\n");
    await Bun.write(TODO_FILE, "id,task,done\n" + body);
  } catch (error) {
    console.error("Error writing todos:", error);
    throw error;
  }
}

async function addTodo(task: string): Promise<Todo> {
  const todos = await readTodos();
  const newTodo: Todo = {
    id: (todos.length + 1).toString(),
    task,
    done: false,
  };
  await writeTodos([...todos, newTodo]);
  console.log(`Added: "${task}"`);
  return newTodo;
}

async function completeTodo(id: string): Promise<Todo | null> {
  const todos = await readTodos();
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) {
    console.warn(`No todo with id ${id}`);
    return null;
  }
  todos[idx].done = true;
  await writeTodos(todos);
  console.log(`Completed #${id}: "${todos[idx].task}"`);
  return todos[idx];
}

async function deleteTodo(id: string): Promise<boolean> {
  const todos = await readTodos();
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) {
    console.warn(`No todo with id ${id}`);
    return false;
  }
  todos.splice(idx, 1);
  await writeTodos(todos);
  console.log(`Deleted todo #${id}`);
  return true;
}

async function fetchTodos(): Promise<Todo[]> {
  return readTodos();
}

async function fetchPendingTodos(): Promise<Todo[]> {
  return (await readTodos()).filter(t => !t.done);
}

async function fetchCompletedTodos(): Promise<Todo[]> {
  return (await readTodos()).filter(t => t.done);
}

function displayTodos(todos: Todo[], title: string): void {
  console.log(`\n${title}:`);
  if (todos.length === 0) {
    console.log("  No tasks found!");
    return;
  }

  todos.forEach(todo => {
    const status = todo.done ? "✅" : "⭕";
    console.log(`  ${status} ${todo.id}. ${todo.task}`);
  });
}

async function interactiveMode(): Promise<void> {
  console.log("Welcome to your Todo App!");

  while (true) {
    console.log("\n" + "=".repeat(40));
    console.log("TODO APP - What would you like to do?");
    console.log("=".repeat(40));
    console.log("1. Add a new task");
    console.log("2. Complete a task");
    console.log("3. View all tasks");
    console.log("4. View pending tasks");
    console.log("5. View completed tasks");
    console.log("6. Exit");

    const choice = prompt("Enter your choice (1-6): ");

    switch (choice) {
      case "1":
        const task = prompt("Enter the task: ");
        if (task?.trim()) {
          await addTodo(task.trim());
        } else {
          console.log("Task cannot be empty!");
        }
        break;

      case "2":
        const pendingTodos = await fetchPendingTodos();
        if (pendingTodos.length === 0) {
          console.log("No pending tasks! You're all caught up!");
          break;
        }

        displayTodos(pendingTodos, "Pending Tasks");
        const id = prompt("Enter task ID to complete: ");
        if (id?.trim()) {
          await completeTodo(id.trim());
        } else {
          console.log("Invalid task ID!");
        }
        break;

      case "3":
        const allTasks = await fetchTodos();
        displayTodos(allTasks, "All Tasks");
        break;

      case "4":
        const pending = await fetchPendingTodos();
        displayTodos(pending, "Pending Tasks");
        break;

      case "5":
        const completed = await fetchCompletedTodos();
        displayTodos(completed, "Completed Tasks");
        break;

      case "6":
        console.log("Thanks for using Todo App! Goodbye!");
        return;

      default:
        console.log("Invalid option! Please choose 1-6.");
    }

    prompt("\nPress Enter to continue...");
  }
}

// API Setup
function buildApi() {
  const app = new Hono();
  
  // Add CORS support
  app.use('*', cors());

  // GET routes - View all tasks
  app.get('/todos', async c => {
    try {
      const todos = await fetchTodos();
      return c.json({ success: true, data: todos });
    } catch (error) {
      console.error("Error fetching todos:", error);
      return c.json({ success: false, error: "Failed to fetch todos" }, 500);
    }
  });

  // GET routes - View pending tasks
  app.get('/todos/pending', async c => {
    try {
      const todos = await fetchPendingTodos();
      return c.json({ success: true, data: todos });
    } catch (error) {
      console.error("Error fetching pending todos:", error);
      return c.json({ success: false, error: "Failed to fetch pending todos" }, 500);
    }
  });

  // GET routes - View completed tasks
  app.get('/todos/completed', async c => {
    try {
      const todos = await fetchCompletedTodos();
      return c.json({ success: true, data: todos });
    } catch (error) {
      console.error("Error fetching completed todos:", error);
      return c.json({ success: false, error: "Failed to fetch completed todos" }, 500);
    }
  });

  // Root route
  app.get('/', c => {
    return c.json({ 
      message: 'Todo API is running!',
      endpoints: {
        'GET /todos': 'Get all todos',
        'GET /todos/pending': 'Get pending todos',
        'GET /todos/completed': 'Get completed todos'
      }
    });
  });

  return app;
}

// Entry Point
async function main() {
  try {
    await createTodoFileIfNotExists();

    if (process.argv.includes('--api')) {
      const app = buildApi();
      const port = process.env.PORT || 3000;
      
      console.log("Starting Todo API server...");
      Bun.serve({ 
        port: Number(port), 
        fetch: app.fetch,
        development: true
      });
      console.log(`API server is running at http://localhost:${port}`);
      console.log(`API documentation available at http://localhost:${port}/`);
    } else {
      await interactiveMode();
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

if (import.meta.main) {
  main();
}