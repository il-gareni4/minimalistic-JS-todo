"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

$(function () {
  var toDo = localStorage.getItem("toDoList") ? JSON.parse(localStorage.getItem("toDoList")) : [];
  var input = $(".bottom-bar__input")[0];
  var toDoListElem = $(".todo-list");
  refreshToDo();
  toDoListElem.css("height", "".concat(window.innerHeight - 130, "px"));
  window.addEventListener("resize", function f() {
    toDoListElem.css("height", "".concat(window.innerHeight - 130, "px"));
  });

  function refreshToDo() {
    toDoListElem.html("");
    var i = 0;
    var currentColor = document.body.dataset.colorScheme;

    var _iterator = _createForOfIteratorHelper(toDo),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var obj = _step.value;
        var elem = document.createElement("div");
        elem.classList.add("todo-container");
        elem.dataset.number = String(i);
        elem.dataset.colorScheme = currentColor;
        elem.innerHTML = "<label class=\"checkbox-container\" data-color-scheme=\"".concat(currentColor, "\">").concat(obj.text, "\n\n                                    <input data-number=\"").concat(i, "\" type=\"checkbox\" ").concat(obj.checked ? "checked" : "", ">\n\n                                    <span class=\"checkmark\" data-color-scheme=\"").concat(currentColor, "\"></span>\n\n                                </label>\n                                <input class=\"edit__input\" type=\"text\" value=\"\" data-color-scheme=\"").concat(currentColor, "\" hidden>\n                                <ul>\n                                    <li class=\"edit\" data-color-scheme=\"").concat(currentColor, "\"></li>\n                                    <li class=\"delete\" data-color-scheme=\"").concat(currentColor, "\"></li>\n                                </ul>");
        toDoListElem[0].insertAdjacentElement("afterbegin", elem);
        i++;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  toDoListElem.click(function (event) {
    if (event.target.tagName === "INPUT" && event.target.type === "checkbox") setCheckbox(event);else if (event.target.tagName === "LI" && event.target.classList.contains("delete")) deleteToDo(event);else if (event.target.tagName === "LI" && event.target.classList.contains("edit")) updateToDo(event);else if (event.target.tagName === "LI" && event.target.classList.contains("ready")) updateToDoReady(event);
  });

  function setCheckbox(event) {
    toDo[+event.target.dataset.number].checked = event.target.checked;
    localStorage.setItem("toDoList", JSON.stringify(toDo));
  }

  function deleteToDo(event) {
    var number = +event.target.parentElement.parentElement.dataset.number;
    toDo.splice(number, 1);
    localStorage.setItem("toDoList", JSON.stringify(toDo));
    refreshToDo();
  }

  function updateToDo(event) {
    var editButton = event.target;
    var toDoText = event.target.parentElement.parentElement.firstChild.firstChild;
    var editInput = event.target.parentElement.parentElement.childNodes[2];
    editInput.value = toDoText.textContent.trim();
    editInput.hidden = false;
    editInput.focus();
    editButton.classList.remove("edit");
    editButton.classList.add("ready");
    editInput.addEventListener("keydown", function (keyEvent) {
      toDoText.textContent = editInput.value;

      if (keyEvent.key === "Enter") {
        updateToDoReady(event);
      }
    });
  }

  function updateToDoReady(event) {
    var editButton = event.target;
    var toDoText = event.target.parentElement.parentElement.firstChild.firstChild;
    var editInput = event.target.parentElement.parentElement.childNodes[2];
    var toDoNumber = toDoText.parentElement.parentElement.dataset.number;
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
    toDo.push({
      text: input.value,
      checked: false
    });
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
    var leftButton = $(".left-menu__btn");

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
    var button = $(".color-scheme__btn")[0];

    if (!Object.entries(event.composedPath()).map(function (arr) {
      return arr[1];
    }).includes(button)) {
      button.dataset.active = "false";
    }
  });
  $(".color").click(function (event) {
    var color = event.target.classList[0];
    var currentColor = document.body.dataset.colorScheme;
    $('.color-active')[0].classList.remove("color-active");
    event.target.classList.add("color-active");

    function transEnd(event) {
      event.target.style.transition = "";
      event.target.removeEventListener("transitionend", transEnd);
    }

    var _iterator2 = _createForOfIteratorHelper(document.querySelectorAll("[data-color-scheme]")),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var elem = _step2.value;

        if (color !== currentColor) {
          elem.dataset.colorScheme = color;
          elem.style.transition = "background-color 0.5s, color 0.6s, border 0.6s";
          elem.addEventListener("transitionend", transEnd);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  });
});