$(function () {
    const toDo = localStorage.getItem("toDoList") ? JSON.parse(localStorage.getItem("toDoList")) : [];
    const input = $(".bottom-bar__input")[0];
    const toDoListElem = $(".todo-list");

    refreshToDo();

    toDoListElem.css("height", `${window.innerHeight - 130}px`)

    window.addEventListener("resize", function f() {
        toDoListElem.css("height", `${window.innerHeight - 130}px`)
    });

    function refreshToDo() {
        toDoListElem.html("");
        let i = 0;
        const currentColor = document.body.dataset.colorScheme;
        for (let obj of toDo) {
            let elem = document.createElement("div");
            elem.classList.add("todo-container");
            elem.dataset.number = String(i);
            elem.dataset.colorScheme = currentColor;
            elem.innerHTML =    `<label class="checkbox-container" data-color-scheme="${currentColor}">${obj.text}\n
                                    <input data-number="${i}" type="checkbox" ${obj.checked ? "checked" : ""}>\n
                                    <span class="checkmark" data-color-scheme="${currentColor}"></span>\n
                                </label>
                                <input class="edit__input" type="text" value="" data-color-scheme="${currentColor}" hidden>
                                <ul>
                                    <li class="edit" data-color-scheme="${currentColor}"></li>
                                    <li class="delete" data-color-scheme="${currentColor}"></li>
                                </ul>`;
            toDoListElem[0].insertAdjacentElement("afterbegin", elem);
            i++;
        }
    }

    toDoListElem.click(function (event) {
        if (event.target.tagName === "INPUT" && event.target.type === "checkbox") setCheckbox(event);
        else if (event.target.tagName === "LI" && event.target.classList.contains("delete")) deleteToDo(event);
        else if (event.target.tagName === "LI" && event.target.classList.contains("edit")) updateToDo(event);
        else if (event.target.tagName === "LI" && event.target.classList.contains("ready")) updateToDoReady(event);
    });

    function setCheckbox(event) {
        toDo[+event.target.dataset.number].checked = event.target.checked;
        localStorage.setItem("toDoList", JSON.stringify(toDo));
    }

    function deleteToDo(event) {
        const number = +event.target.parentElement.parentElement.dataset.number;
        toDo.splice(number, 1);
        localStorage.setItem("toDoList", JSON.stringify(toDo));
        refreshToDo();
    }

    function updateToDo(event) {
        const editButton =  event.target;
        const toDoText = event.target.parentElement.parentElement.firstChild.firstChild;
        const editInput = event.target.parentElement.parentElement.childNodes[2];
        editInput.value = toDoText.textContent.trim();
        editInput.hidden = false;
        editInput.focus();
        editButton.classList.remove("edit");
        editButton.classList.add("ready");
        editInput.addEventListener("keydown", function(keyEvent) {
            toDoText.textContent = editInput.value;
            if (keyEvent.key === "Enter") {
                updateToDoReady(event)
            }
        });
    }

    function updateToDoReady(event) {
        const editButton =  event.target;
        const toDoText = event.target.parentElement.parentElement.firstChild.firstChild;
        const editInput = event.target.parentElement.parentElement.childNodes[2];
        const toDoNumber = toDoText.parentElement.parentElement.dataset.number;
        editInput.hidden = true;
        toDo[toDoNumber].text = editInput.value;
        localStorage.setItem("toDoList", JSON.stringify(toDo));
        editButton.classList.remove("ready");
        editButton.classList.add("edit");
    }

    $(".cancel").click(function () {
        input.value = "";
        $(".cancel").css("display", "none");
    });

    $(".bottom-bar__btn").click(function () {
        toDo.push({text: input.value, checked: false})
        localStorage.setItem("toDoList", JSON.stringify(toDo));
        input.value = "";
        $(".cancel").css("display", "none");
        refreshToDo();
    });

    input.addEventListener("input", function () {
        if (input.value === "") {
            $(".cancel").css("display", "none");
        } else {
            $(".cancel").css("display", "block");
        }
    });

    $(".left-menu__btn").click(function () {
        const leftButton = $(".left-menu__btn");
        if (leftButton[0].dataset.active === "false") {
            $(".wrapper").css("left", "100px");
            $(".left-menu__main").css("left", "0");
            leftButton.css("left", "108px");
            leftButton[0].dataset.active = "true";
        } else {
            $(".wrapper").css("left", "0");
            $(".left-menu__main").css("left", "-100px");
            leftButton.css("left", "8px");
            leftButton[0].dataset.active = "false";
        }
    });

    $('.color-scheme__btn').click(function (event) {
        if (event.target.className === "color-scheme__btn") {
            if (event.target.dataset.active === "false") {
                event.target.dataset.active = "true";
            } else {
                event.target.dataset.active = "false";
            }
        }
    });

    document.addEventListener("click", function (event) {
        const button = $(".color-scheme__btn")[0];
        if (!Object.entries(event.composedPath()).map(arr => arr[1]).includes(button)) {
            button.dataset.active = "false";
        }
    });



    $(".color").click(function (event) {
        const color = event.target.classList[0];
        const currentColor = document.body.dataset.colorScheme;
        $('.color-active')[0].classList.remove("color-active");
        event.target.classList.add("color-active");
        function transEnd(event) {
            event.target.style.transition = "";
            event.target.removeEventListener("transitionend", transEnd)
        }
        for (const elem of document.querySelectorAll("[data-color-scheme]")) {
            if (color !== currentColor) {
                elem.dataset.colorScheme = color;
                elem.style.transition = "background-color 0.5s, color 0.6s, border 0.6s";
                elem.addEventListener("transitionend", transEnd)
            }
        }
    });
});