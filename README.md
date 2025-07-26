# 📝 Todo Application

A modern, feature-rich todo application built with TypeScript and Bun, featuring both command-line interface (CLI) and REST API modes.

## ✨ Features

- **Dual Interface**: Interactive CLI mode and RESTful API
- **Data Persistence**: CSV-based storage for simplicity
- **Type Safety**: Full TypeScript implementation
- **Modern Runtime**: Built with Bun for fast performance
- **CORS Support**: API accessible from web applications
- **Task Management**: Add, complete, delete, and view todos
- **Status Tracking**: Separate views for pending and completed tasks

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) runtime (version 1.0 or higher)

### Installation

1. **Clone or download the project** to your local machine
2. **Navigate to the project directory**
3. **Install dependencies** if any are required
4. **Run the application** using the appropriate command for your desired mode

## 📖 Usage

### CLI Mode

The CLI provides an interactive menu-driven interface:

```
========================================
TODO APP - What would you like to do?
========================================
1. Add a new task
2. Complete a task
3. View all tasks
4. View pending tasks
5. View completed tasks
6. Exit
```

**Example CLI Session:**
The CLI will prompt you to enter your choice, then guide you through adding tasks, viewing your todo list, and managing your tasks interactively.

### API Mode

Start the API server using the appropriate command with the --api flag. The server will run on localhost port 3000 by default.

#### Available Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/` | API information | JSON with available endpoints |
| `GET` | `/todos` | Get all todos | `{ success: true, data: Todo[] }` |
| `GET` | `/todos/pending` | Get pending todos | `{ success: true, data: Todo[] }` |
| `GET` | `/todos/completed` | Get completed todos | `{ success: true, data: Todo[] }` |

#### Example API Usage

You can use any HTTP client (like curl, Postman, or your browser) to make requests to the available endpoints. The API returns JSON responses with a consistent format including success status and data payload.

## 🏗️ Project Structure

```
todo/
├── todo.ts          # Main application file
├── todo.csv         # Data storage (auto-generated)
└── README.md        # This file
```

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `TODO_FILE`: CSV file path (default: "todo.csv")

### Data Format

Todos are stored in CSV format with columns for id, task description, and completion status.

## 🛠️ Development

### Prerequisites

- Bun runtime
- TypeScript knowledge
- Basic understanding of REST APIs

### Running in Development

1. **Start API server** using the appropriate command with the --api flag
2. **Test endpoints** using your preferred HTTP client or web browser

### Code Structure

- **Data Functions**: `readTodos()`, `writeTodos()`, `addTodo()`, etc.
- **CLI Interface**: `interactiveMode()`, `displayTodos()`
- **API Routes**: `buildApi()` with Hono framework
- **Main Entry**: `main()` function with mode detection

## 🔍 API Documentation

### Base URL
The API runs on localhost port 3000 by default.

### Endpoints

#### GET /
Returns API information and available endpoints.

**Response:**
Returns a JSON object with API information and a list of available endpoints.

#### GET /todos
Returns all todos (both pending and completed).

**Response:**
Returns a JSON object with success status and an array of todo items, each containing id, task description, and completion status.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include your Bun version and operating system

## 🙏 Acknowledgments

- Built with [Bun](https://bun.sh/) - The fast JavaScript runtime
- Web framework: [Hono](https://hono.dev/) - Fast, Lightweight, Web-standards
- TypeScript for type safety

---

**Happy Todo-ing! 🎉** 