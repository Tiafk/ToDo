
document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.querySelector(".wrapper-task__block-task");
  const finishedWrapper = document.querySelector(".wrapper-task__finished");
  const finishedContainer = document.querySelector(".wrapper-task__finished .finished-container");
  let numComplited;

  // Сохраненные задачи
  let arr = [];
  if (localStorage.getItem("taskObject") !== null) {
    arr = JSON.parse(localStorage.getItem("taskObject"));
  }

  function loadTask() {
    for (let index = 0; index < arr.length; index++) {
      if (arr[index].status == "active") {
        taskList.insertAdjacentHTML(
          `afterbegin`,
          `
            <li class="task" data-value="${arr[index]["value"]}">
              <label class="checkbox-container">
                <input type="checkbox">
                <span></span>
                </label>
                <p class="text">${arr[index]["value"]}</p>
            </li>
          `
        );
      } else if (arr[index].status == "complited") {
        finishedContainer.insertAdjacentHTML(
          `afterbegin`,
          `
            <li class="task complited" data-value="${arr[index]["value"]}">
              <label class="checkbox-container">
                <input type="checkbox" checked>
                <span></span>
                </label>
                <p class="text">${arr[index]["value"]}</p>
            </li>
          `
        );
      }
    }
    if (finishedWrapper.querySelector(".task") !== null) {
      finishedWrapper.classList.add("visible");
    } else {
      finishedWrapper.classList.remove("visible");
    }
    numComplited = finishedContainer.querySelectorAll(".task").length;
    document.querySelector(".counter p").textContent = numComplited;
  }
  loadTask();

  // ==> Создание задач 🎶
  const blockTaskCreate = document.querySelector(".wrapper-task__task-create");
  const popUp = document.querySelector(".pop-up");
  const cancel = document.querySelector(".wrapper-task__task-create .pop-up__btn-block .cancel");

  // открытие и закрытие попапа создания
  function openCreateTaskPopup(target) {
    // Открытие/Закрытие
    if (target.closest(".wrapper-task__task-create") && !blockTaskCreate.classList.contains("open")) {
      blockTaskCreate.classList.add("open");
      popUp.classList.add("visible");
    } else if (target == cancel) {
      blockTaskCreate.classList.remove("open");
      popUp.classList.remove("visible");
    }
  }

  // Создание задачи
  const taskInput = document.querySelector(".pop-up__note input");

  function createTask(target) {
    if (target.closest(".pop-up__btn-block .save")) {
      taskList.insertAdjacentHTML(
        `afterbegin`,
        `
        <li class="task" data-value="${taskInput.value}">
          <label class="checkbox-container">
            <input type="checkbox">
            <span></span>
            </label>
            <p class="text">${taskInput.value}</p>
        </li>
      `
      );
      popUp.classList.remove("visible");
      blockTaskCreate.classList.remove("open");
    }
  }

  // Редактирование
  // function editTask(target) {
  //   for (let i = 0; i < taskList.length; index++) {
  //     target == arr[index].value
  //     taskInput.value = arr[index].textContent;
  //     console.log(i);
  //   }
  // }

  const complitedBtn = document.querySelector(".wrapper-task__finished .finished-btn");

  // открытие и закрытие списка завершенных задач 🎶
  function finishedTasksToggle(target) {
    if (target.closest(".wrapper-task__finished .finished-btn")) {
      finishedContainer.classList.toggle("visible");
      complitedBtn.classList.toggle("arrowdrop");
    }
  }

  // ==> Функционал завершенных задач 🎶
  function changeTask(target) {
    let value;
    if (target.checked == true && target.closest(".checkbox-container input")) {
      target.classList.add("complited");
      target.classList.add("removing");

      value = target.closest(".task").querySelector(".text").textContent;

      for (let index = 0; index < arr.length; index++) {
        if (value == arr[index].value) {
          arr[index].status = "complited";
        }
      }

      setTimeout(() => {
        target.closest(".task").remove();
        finishedContainer.insertAdjacentHTML(
          `afterbegin`,
          `
          <li class="task complited" data-value="${value}">
            <label class="checkbox-container">
              <input type="checkbox" checked>
              <span></span>
              </label>
              <p class="text">${value}</p>
          </li>
        `
        );
      }, 200);
    } else if (target.checked == false && target.closest(".wrapper-task__finished")) {
      target.classList.remove("complited");
      target.classList.add("removing");
      value = target.closest(".task").querySelector(".text").textContent;

      for (let index = 0; index < arr.length; index++) {
        if (value == arr[index].value) {
          arr[index].status = "active";
        }
      }

      setTimeout(() => {
        target.closest(".task").remove();
        taskList.insertAdjacentHTML(
          `afterbegin`,
          `
          <li class="task" data-value="${value}">
            <label class="checkbox-container">
              <input type="checkbox">
              <span></span>
              </label>
              <p class="text">${value}</p>
          </li>
        `
        );
      }, 200);
    }
    localStorage.setItem("taskObject", JSON.stringify(arr));
  }

  // счетчик завершенных задач 🎶
  let observer = new MutationObserver(() => {
    numComplited = finishedContainer.querySelectorAll(".task").length;
    document.querySelector(".counter p").textContent = numComplited;
    if (numComplited == 0) {
      finishedContainer.closest(".wrapper-task__finished").classList.remove("visible");
    } else {
      finishedContainer.closest(".wrapper-task__finished").classList.add("visible");
    }
  });

  observer.observe(finishedContainer, {
    childList: true,
  });

  // LocalSorage
  const btnSave = document.querySelector(".wrapper-task__task-create .pop-up__btn-block .save");

  function changeHamdler(target) {
    if (target == btnSave) {
      let obj = {};
      obj["value"] = taskInput.value;
      obj["status"] = "active";
      arr.push(obj);

      localStorage.setItem("taskObject", JSON.stringify(arr));
    }
  }

  // события при клике
  document.addEventListener("click", (e) => {
    target = e.target;
    openCreateTaskPopup(target);
    finishedTasksToggle(target);
    createTask(target);
    changeTask(target);
    changeHamdler(target);
    editTask(target);
  });
});
