import { cloneTemplate, createElement } from "../function/dom.js";
import { ToDoItem } from "./ToDoItem.js";

export class ToDoList {
  /**@type {Todo[]} */
  #todolist = [];
  /**@type {HTMLUListElement} */
  #listNotCompleted;
  #listCompleted;

  constructor(todos) {
    this.#todolist = todos;
    console.log(this.#todolist);
  }

  appendTo() {
    this.#listNotCompleted = document.getElementById("list-not-completed");
    this.#listCompleted = document.getElementById("list-completed");

    if (!this.#listNotCompleted || !this.#listCompleted) {
      throw new Error("Lists elements not found");
    }

    this.#todolist.forEach((todo) => {
      const t = new ToDoItem(todo);
      if (todo.completed) {
        this.#listCompleted.append(t.element);
      } else {
        this.#listNotCompleted.append(t.element);
      }
    });

    this.#count();
    // event listener

    this.#listNotCompleted.addEventListener(
      "updateItem",
      ({ detail: todo }) => {
        this.#onUpdate();
      }
    );

    this.#listNotCompleted.addEventListener("toggle", (e) => {
      this.#onToggle(e);
    });

    this.#listNotCompleted.addEventListener("add", (e) => {
      this.#onAdd(e);
    });

    this.#listCompleted.addEventListener("toggle", (e) => {
      this.#onToggle(e);
    });

    this.#listNotCompleted.addEventListener("delete", ({ detail: todo }) => {
      this.#onDelete(todo);
    });

    this.#listCompleted.addEventListener("delete", ({ detail: todo }) => {
      this.#onDelete(todo);
    });

    let addButton = document.getElementById("add-todo");
    addButton.addEventListener("click", (e) => {
      this.#onAdd(e);
    });
  }
  /**
   * @param {Object?} param1
   */

  #onAdd(e) {
    console.log("detail", e.detail);

    const newTodo = {
      id: crypto.randomUUID(),
      title: null,
      completed: false,
    };
    const item = new ToDoItem(newTodo);

    if (e.detail.id) {
      const refNode = this.#listNotCompleted.querySelector(
        `[data-id="${e.detail.id}"]`
      );
      refNode.insertAdjacentElement("afterend", item.element);
      const index = this.#todolist.findIndex((item) => item.id === e.detail.id);
      if (index) {
        this.#todolist.splice(index + 1, 0, newTodo);
      } else {
        this.#todolist.push(newTodo);
      }
    } else {
      this.#listNotCompleted.append(item.element);
      this.#todolist.push(newTodo);
    }

    console.log(this.#todolist);
    // Ajouter le focus
    const input = item.element.querySelector('input[type="text"]');
    input.focus();

    // Supprimer si l'utilisateur quitte sans modifier
    input.addEventListener(
      "blur",
      (e) => {
        if (!input.value.trim()) {
          item.remove(e);
        }
      },
      { once: true }
    ); // L'événement ne se déclenche qu'une fois
  }

  #onUpdate() {
    localStorage.setItem("todos", JSON.stringify(this.#todolist));
    this.#count();
  }

  #onDelete(todo) {
    this.#todolist = this.#todolist.filter((t) => t.id !== todo.id);
    // Réorganiser tous les ordres
    // this.#todolist.forEach((t, index) => {
    //   t.order = index + 1;
    //   // Mettre à jour l'ordre dans le DOM
    //   const item = this.#listNotCompleted.querySelector(`[data-id="${t.id}"]`);
    //   if (item) {
    //     item._todoItem.updateOrder(index + 1);
    //   }
    // });

    console.log(this.#todolist);
    this.#onUpdate();
  }

  #onToggle({ detail: todo, target }) {
    todo.completed = !todo.completed;
    const item = target.closest("li");
    const targetList = todo.completed
      ? this.#listCompleted
      : this.#listNotCompleted;
    targetList.append(item);
    this.#onUpdate();
  }

  #count() {
    document.getElementById("todo-title").innerHTML = this.#todolist.filter(
      (t) => !t.completed
    ).length;
    document.getElementById("done-title").innerHTML = this.#todolist.filter(
      (t) => t.completed
    ).length;
  }
}
