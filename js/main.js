$(function () {
    const toDo = localStorage.getItem("toDoList") ? JSON.parse(localStorage.getItem("toDoList")) : [];
    const input = $(".bottom-bar__input")[0];
    const input2 = $(".bottom-bar__input");
    const toDoListElem = $(".todo-list");

    refreshToDo();

    toDoListElem.height(window.innerHeight - 130);
    input2.width($(window).width() - 20 - 110);

    window.addEventListener("resize", function f() {
        toDoListElem.height(window.innerHeight - 130);
        input2.width($(window).width() - 20 - 110);
        $(".edit__input").each((i, elem) => elem.style.width = `${window.innerWidth - 100 - 55}px`)
    });

    function refreshToDo() {
        toDoListElem.html("");
        const currentColor = $("body").data("colorScheme");
        let i = 0;
        for (let obj of toDo) {
            let elem = document.createElement("div");
            elem.classList.add("todo-container");
            elem.dataset.number = String(i);
            elem.dataset.colorScheme = currentColor;
            elem.innerHTML =    `<label class="checkbox-container" data-color-scheme="${currentColor}">${obj.text}\n
                                    <input data-number="${i}" type="checkbox" ${obj.checked ? "checked" : ""}>\n
                                    <span class="checkmark" data-color-scheme="${currentColor}"></span>\n
                                </label>
                                <input class="edit__input" type="text" value="" data-color-scheme="${currentColor}" style="width: ${window.innerWidth - 100 - 55}px" hidden>
                                <ul>
                                    <li class="edit" data-color-scheme="${currentColor}"></li>
                                    <li class="delete" data-color-scheme="${currentColor}"></li>
                                </ul>`;
            toDoListElem[0].insertAdjacentElement("afterbegin", elem);
            i++;
        }
    }

    toDoListElem.click(function (event) {
        const target = $(event.target)
        if (target.is("input") && target.attr("type") === "checkbox") setCheckboxState(target);
        else if (target.is("li") && target.hasClass("delete")) deleteToDo(target);
        else if (target.is("li") && target.hasClass("edit")) updateToDo(target);
        else if (target.is("li") && target.hasClass("ready")) updateToDoReady(target);
    });

    function setCheckboxState(target) {
        toDo[+target.data("number")].checked = target.prop("checked");
        localStorage.setItem("toDoList", JSON.stringify(toDo));
    }

    function deleteToDo(target) {
        const number = +target.parents(".todo-container").data("number");
        toDo.splice(number, 1);
        localStorage.setItem("toDoList", JSON.stringify(toDo));
        refreshToDo();
    }

    function updateToDo(target) {
        const editButton =  target;
        const toDoText = target.parents(".todo-container").children(".checkbox-container");
        const editInput = target.parents(".todo-container").children(".edit__input");
        editInput.val(toDoText[0].textContent.trim());
        editInput.show();
        editInput.focus();
        editButton.removeClass("edit");
        editButton.addClass("ready");
        editInput.keydown(function(keyEvent) {
            if (keyEvent.key === "Enter") {
                updateToDoReady(target)
            }
        });
    }

    function updateToDoReady(target) {
        const editButton =  target;
        const toDoText = target.parents(".todo-container").children(".checkbox-container")[0].firstChild;
        const editInput = target.parents(".todo-container").children(".edit__input");
        const toDoNumber = target.parents(".todo-container").data("number");
        toDoText.textContent = editInput.val();
        toDo[+toDoNumber].text = editInput.val();
        localStorage.setItem("toDoList", JSON.stringify(toDo));
        editButton.removeClass("ready");
        editButton.addClass("edit");
        editInput.hide();
    }

    $(".cancel").click(function () {
        input2.val("");
        $(".cancel").css("display", "none");
    });

    $(".bottom-bar__btn").click(addToDo);

    function addToDo() {
        if (input2.val()) {
            toDo.push({text: input.value, checked: false})
            localStorage.setItem("toDoList", JSON.stringify(toDo));
            input2.val("");
            $(".cancel").css("display", "none");
            refreshToDo();
        }
    }

    input2[0].addEventListener("input", function () {
        if (input.value === "") {
            $(".cancel").css("display", "none");
        } else {
            $(".cancel").css("display", "block");
        }
    });

    input2.keydown(function (event) {
        if (event.key === "Enter") addToDo();
    });

    $(".left-menu__btn").click(function () {
        const leftButton = $(".left-menu__btn");
        if (leftButton[0].dataset.active === "false") {
            $(".wrapper").css("left", "+=100px");
            $(".left-menu__main").css("left", "+=100px");
            leftButton.css("left", "+=100px");
            leftButton[0].dataset.active = "true";
        } else {
            $(".wrapper").css("left", "-=100px");
            $(".left-menu__main").css("left", "-=100px");
            leftButton.css("left", "-=100px");
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
                elem.style.transition = "background-color 0.2s, color 0.3s, border 0.3s";
                elem.addEventListener("transitionend", transEnd)
            }
        }
    });

    window.addEventListener("unload", function () {
        localStorage.setItem("colorScheme", document.body.dataset.colorScheme);
    });
});