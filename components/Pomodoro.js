import { cloneTemplate } from "../function/dom.js";

export class Pomodoro {
  #state;
  #currentTime;
  #focus = 60 * 2;
  #shortBreak = 60 * 1;
  #longBreak = 60 * 5;
  #startTime = 0;
  #focusCount = 0;
  #element;
  #interval;

  constructor() {
    //this.#state = "Focus";
    //this.#startTime = this.#focus;
    //this.#currentTime = this.#startTime;
    const pomodoro = cloneTemplate("pomodoro-template").firstElementChild;
    const buttonStart = pomodoro.querySelector("#start");
    buttonStart.addEventListener("click", () => this.onTimerStart());
    const buttonPause = pomodoro.querySelector("#pause");
    buttonPause.addEventListener("click", () => this.onPause());
    const buttonSkip = pomodoro.querySelector("#skip");
    buttonSkip.addEventListener("click", () => this.changeState());
    // const timer = pomodoro.querySelector("#pomodoro-value");
    // timer.innerText = this.#focus;
    document.getElementById("pomodoro-main").append(pomodoro);
    this.#element = pomodoro;
    this.changeState();
  }

  onTimerStart() {
    this.#element.querySelector("#start").setAttribute("hidden", "");
    this.#element.querySelector("#pause").removeAttribute("hidden");
    this.#element.querySelector("#skip").removeAttribute("hidden");
    const progress = this.#element.querySelector("#progress");

    this.#interval = setInterval(() => {
      this.#currentTime--;
      console.log("intervalle", this.#currentTime);
      document.getElementById("pomodoro-value").innerText = this.formatTime(
        this.#currentTime
      );
      console.log(progress);
      progress.style.width = `${
        ((this.#startTime - this.#currentTime) / this.#startTime) * 100
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
    if (this.#state === "Focus") {
      if (this.#focusCount === 3) {
        this.#state = "Long Break";
        this.#startTime = this.#longBreak;

        this.#focusCount = 0;
      } else {
        this.#state = "Short Break";
        this.#startTime = this.#shortBreak;
      }
    } else {
      this.#state = "Focus";
      this.#focusCount++;
      this.#startTime = this.#focus;
    }
    this.#currentTime = this.#startTime;
    this.#element.querySelector("#pomodoro-value").innerText = this.formatTime(
      this.#startTime
    );
    this.#element.querySelector("#session").innerText = this.#state;
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
