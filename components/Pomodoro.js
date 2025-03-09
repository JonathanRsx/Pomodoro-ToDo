import { cloneTemplate } from "../function/dom.js";

export class Pomodoro {
  #states = {
    focus: { title: "Focus", color: "#9D1DF3", duration: 60 * 25 },
    shortBreak: { title: "Short Break", color: "#442FFC", duration: 60 * 5 },
    longBreak: { title: "Long Break", color: "#04CE9F", duration: 60 * 15 },
  };
  #currentState;
  #currentTime;
  #focusCount = 0;
  #element;
  #interval;

  constructor() {
    const pomodoro = cloneTemplate("pomodoro-template").firstElementChild;
    const buttonStart = pomodoro.querySelector("#start");
    buttonStart.addEventListener("click", () => this.onTimerStart());
    const buttonPause = pomodoro.querySelector("#pause");
    buttonPause.addEventListener("click", () => this.onPause());
    const buttonSkip = pomodoro.querySelector("#skip");
    buttonSkip.addEventListener("click", () => this.changeState());

    document.getElementById("pomodoro-main").append(pomodoro);
    this.#element = pomodoro;
    this.#currentState = this.#states.longBreak;
    this.changeState();
  }

  onTimerStart() {
    this.#element.querySelector("#start").setAttribute("hidden", "");
    this.#element.querySelector("#pause").removeAttribute("hidden");
    this.#element.querySelector("#skip").removeAttribute("hidden");
    const progress = this.#element.querySelector("#progress");

    this.#interval = setInterval(() => {
      this.#currentTime--;

      document.getElementById("pomodoro-value").innerText = this.formatTime(
        this.#currentTime
      );

      progress.style.width = `${
        ((this.#currentState.duration - this.#currentTime) /
          this.#currentState.duration) *
        100
      }%`;

      if (this.#currentTime === -1) {
        clearInterval(this.#interval);
        this.changeState();
      }
    }, 1000);
  }

  changeState() {
    clearInterval(this.#interval);
    this.#element.querySelector("#start").removeAttribute("hidden");
    this.#element.querySelector("#skip").setAttribute("hidden", "");
    this.#element.querySelector("#pause").setAttribute("hidden", "");
    this.#element.querySelector("#progress").style.width = 0;
    if (this.#currentState.title === "Focus") {
      if (this.#focusCount === 3) {
        this.#currentState = this.#states.longBreak;

        this.#focusCount = 0;
      } else {
        this.#currentState = this.#states.shortBreak;
      }
    } else {
      this.#currentState = this.#states.focus;
      this.#focusCount++;
    }
    this.#currentTime = this.#currentState.duration;
    // console.log(this.#currentState);
    this.#element.querySelector("#pomodoro-value").innerText = this.formatTime(
      this.#currentState.duration
    );
    this.#element.querySelector("#session").innerText =
      this.#currentState.title;
    this.#element.querySelector(".indicator").style.backgroundColor =
      this.#currentState.color;
  }

  onPause() {
    this.#element.querySelector("#start").removeAttribute("hidden");
    this.#element.querySelector("#pause").setAttribute("hidden", "");
    clearInterval(this.#interval);
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Ajouter un 0 si moins de 10
    const displaySeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${minutes}:${displaySeconds}`;
  }
}
