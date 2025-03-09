import { cloneTemplate, createElement } from "../function/dom.js";

export class ToDoItem {
  #element;
  #todo;

  constructor(todo) {
    this.#todo = todo;
    const li = cloneTemplate("todolist-item").firstElementChild;
    this.#element = li;

    // Ajouter l'id et la référence à l'instance
    this.#element.dataset.id = todo.id;
    this.#element._todoItem = this;

    const input = li.querySelector("input[type='text']");
    input.setAttribute("value", todo.title ? todo.title : "");
    const checkbox = li.querySelector("input[type='checkbox']");
    if (todo.completed) {
      checkbox.setAttribute("checked", "");
    }
    const button = li.querySelector("button");
    // banch event
    input.addEventListener("change", (e) => this.update(e));
    input.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "Enter":
          e.preventDefault();

          if (e.target.value.trim()) {
            const event = new CustomEvent("add", {
              detail: this.#todo,
              bubbles: true,
            });

            this.#element.dispatchEvent(event);
            break;
          }
        case "ArrowUp": {
          const previous = this.#element.previousElementSibling;
          const input = previous.querySelector('input[type="text"]');
          input.focus();
          setTimeout(() => {
            input.selectionStart = input.selectionEnd = input.value.length;
          }, 0);
          break;
        }
        case "ArrowDown": {
          const next = this.#element.nextElementSibling;
          const input = next.querySelector('input[type="text"]');
          input.focus();
          break;
        }
      }
    });
    checkbox.addEventListener("change", (e) => this.toggle(e.currentTarget));
    button.addEventListener("click", (e) => this.remove(e));
  }

  // get private property
  get element() {
    return this.#element;
  }

  update(e) {
    const value = e.target.value;

    if (value) {
      this.#todo.title = e.target.value;
      e.currentTarget.setAttribute("value", this.#todo.title);
      const event = new CustomEvent("updateItem", {
        detail: this.#todo,
        bubbles: true,
      });

      this.#element.dispatchEvent(event);
    } else {
      this.remove(e);
    }
  }

  /**
   * @param {PointerEvent} e
   */
  remove(e) {
    console.log(this.#todo);
    const event = new CustomEvent("delete", {
      detail: this.#todo,
      bubbles: true,
    });
    this.#element.dispatchEvent(event);
    this.#element.remove();
  }

  toggle(e) {
    const event = new CustomEvent("toggle", {
      detail: this.#todo,
      bubbles: true,
    });

    this.#element.dispatchEvent(event);
  }

  //   updateOrder(newOrder) {
  //     this.#todo.order = newOrder;
  //   }
}
