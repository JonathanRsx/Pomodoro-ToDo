import { Pomodoro } from "./components/Pomodoro.js";
import { ToDoList } from "./components/ToDoList.js";
import { cloneTemplate } from "./function/dom.js";

const todoInStorage = localStorage.getItem("todos")?.toString();

let defaultToDoItem = {
  id: crypto.randomUUID(),
  title: null,
  completed: false,
};

let todos = [];
if (todoInStorage) {
  todos = JSON.parse(todoInStorage);
} else {
  todos.push(defaultToDoItem);
}

const list = new ToDoList(todos);
list.appendTo();

const pomodoro = new Pomodoro();
