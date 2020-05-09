$(function () {
    const toDo = localStorage.getItem("toDoList") ? JSON.parse(localStorage.getItem("toDoList")) : [];
    const input = $(".bottom-bar__input")[0];
    const toDoListElem =  $(".todo-list");

    refreshToDo();

    toDoListElem.css("height", `${window.innerHeight - 80}px`)

    window.addEventListener("resize", function f() {
        toDoListElem.css("height", `${window.innerHeight - 80}px`)
        console.log()
    });

    function refreshToDo() {
        toDoListElem.html("");
        let i = 0;
        for (let obj of toDo) {
            let elem = document.createElement("div");
            elem.classList.add("todo-container");
            elem.dataset.number = String(i);
            elem.innerHTML =    `<label class="checkbox-container">${obj.text}\n
                                    <input data-number="${i}" type="checkbox" ${obj.checked ? "checked" : ""}>\n
                                    <span class="checkmark"></span>\n
                                </label>
                                <input class="edit__input" type="text" value="" hidden>
                                <ul>
                                    <li class="edit"></li>
                                    <li class="delete"></li>
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
        const number = event.originalEvent.path[2].dataset.number;
        toDo.splice(number, 1);
        localStorage.setItem("toDoList", JSON.stringify(toDo));
        refreshToDo();
    }

    function updateToDo(event) {
        const editButton =  event.target;
        const toDoText = event.originalEvent.path[2].firstChild.firstChild;
        const editInput = event.originalEvent.path[2].childNodes[2];
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
        const toDoText = event.originalEvent.path[2].firstChild.firstChild;
        const editInput = event.originalEvent.path[2].childNodes[2];
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


});