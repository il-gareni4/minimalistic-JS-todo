$(function () {
    const toDo = localStorage.getItem("toDoList") ? JSON.parse(localStorage.getItem("toDoList")) : [];
    const input = $(".bottom-bar__input")[0];
    const toDoListElem =  $(".todo-list");

    refreshToDo();

    function refreshToDo() {
        toDoListElem.html("");
        let i = 0;
        for (let obj of toDo) {
            let elem = document.createElement("div");
            elem.classList.add("todo-container");
            elem.innerHTML =    `<label class="checkbox-container">${obj.text}\n
                                    <input data-number="${i}" type="checkbox" ${obj.checked ? "checked" : ""}>\n
                                    <span class="checkmark"></span>\n
                                </label>`;
            elem.firstChild.childNodes[1].addEventListener("change", function (event) {
                toDo[+event.target.dataset.number].checked = event.target.checked;
                localStorage.setItem("toDoList", JSON.stringify(toDo));
            });
            toDoListElem[0].insertAdjacentElement("afterbegin", elem);
            i++;
        }
    }

    $(".cancel").click(function () {
        input.value = "";
        $(".cancel").css("display", "none");
    });

    $(".bottom-bar__btn").click(function (event) {
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