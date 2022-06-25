class NewUser {
  constructor() {
    this.table = document.querySelector("#userTable");
    this.btnSubmit = document.querySelector("#userForm-btn");
    this.url = "http://localhost:8000/";
    this.totalUserId = [];
    this.lastIdUser;
    this.readyResponse;
  }

  checkEmptyValue(value) {
    let error = value.trim() !== "" ? true : false;
    return error;
  }

  inputNumber(value) {
    return value.replace(/[^+\-\d]/g, "");
  }

  disabledBtn(bool) {
    bool ? this.btnSubmit.removeAttribute("disabled") : this.btnSubmit.setAttribute("disabled", "");
  }

  addNewUserInTable(id = 0, name, phone) {
    let tr = document.createElement("TR");
    tr.setAttribute("class", "table__tr-row");
    tr.setAttribute("data-id", id);

    let tdName = document.createElement("TD");
    tdName.setAttribute("class", "table__td table__td-name");
    tdName.setAttribute("data-input", "name");

    let tdPhone = document.createElement("TD");
    tdPhone.setAttribute("class", "table__td table__td-phone");
    tdPhone.setAttribute("data-input", "phone");

    let tdBtn = document.createElement("TD");
    tdBtn.setAttribute("class", "table__td table__td-btn");

    tdName.innerHTML = `<input readonly maxlength="50" type="text" value="${name}">`;
    tdPhone.innerHTML = `<input readonly maxlength="18" type="text" value="${phone}">`;
    tdBtn.innerHTML = `<button class="table__btn table__btn_type_edit" data-action="edit">Edit</button>
											<button class="table__btn table__btn_type_delete">Delete</button>`;
    tr.append(tdName);
    tr.append(tdPhone);
    tr.append(tdBtn);
    this.table.querySelector("tbody").append(tr);
  }

  setUserInTable(data) {
    let _this = this;
    data.forEach((elem, index) => {
      _this.totalUserId.push(elem.id);
      _this.addNewUserInTable(elem.id, elem.name, elem.phone);
    });
    this.lastIdUser = Math.max(...this.totalUserId);
  }

  async getUser() {
    let _this = this;

    let response = await fetch(`${this.url}users`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        _this.setUserInTable(data);
      })
      .catch((error) => console.log(error));
  }

  async postUser(id, name, phone) {
    let _this = this;

    let response = await fetch(`${this.url}users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name,
        phone,
      }),
    })
      .then((response) => {
        if (response.ok) {
          _this.readyResponse = new Promise((resolve) => {
            resolve(true);
          });
        }
      })
      .catch((error) => console.log(error));
  }

  async deleteUser(id) {
    let response = await fetch(`${this.url}users/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  }

  async upgradeUser(id, name, phone) {
    let response = await fetch(`${this.url}users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name,
        phone,
      }),
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error)
      });
  }
}

class FormNewUser extends NewUser {
  constructor() {
    super();
    this.form = document.forms.userForm;
    this.validForm = new Map();
  }

  setValidMap() {
    let _this = this;
    [...this.form.elements].forEach((input, index) => {
      if (input.tagName === "INPUT") {
        _this.validForm.set(input.name, false);
      }
    });
  }

  checkValidMap(validMap, btn) {
    for (let valid of validMap.values()) {
      if (!valid) {
        this.disabledBtn(false);
        return false;
      } else {
        this.disabledBtn(true);
      }
    }
  }

  validateForm(input) {
    let parentInput = input.closest(".filed-input");
    let errorElem = parentInput.querySelector(".filed-input__message");
    let currentError;

    switch (input.name) {
      case "name":
      case "phone":
        currentError = this.checkEmptyValue(input.value);
        currentError ? (errorElem.innerText = "") : (errorElem.innerText = "error");
        this.validForm.set(input.name, currentError);
        this.checkValidMap(this.validForm, this.btnSubmit);
        break;

      default:
        this.checkValidMap(this.validForm, this.btnSubmit);
        break;
    }
  }

  changeHandlers() {
    let _this = this;

    [...this.form.elements].forEach((input, index) => {
      if (input.tagName === "INPUT") {
        input.onblur = () => {
          _this.validateForm(input);
        };

        if (input.name === "phone") {
          input.oninput = (e) => {
            let value = e.target.value;
            e.target.value = _this.inputNumber(value);
          };
        }
      }
    });
  }

  submitHandlers() {
    let _this = this;

    this.btnSubmit.onclick = async () => {
      _this.addNewUserInTable(_this.form.name.value, _this.form.phone.value);
      _this.postUser(this.lastIdUser + 1, _this.form.name.value, _this.form.phone.value);
      _this.readyResponse.then((data) => {
        _this.form.reset();
        _this.disabledBtn(false);
        _this.setValidMap();
      });
    };
  }

  init() {
    this.setValidMap();
    this.changeHandlers();
    this.submitHandlers();
  }
}

class UpgradeUser extends NewUser {
  constructor() {
    super();
    this.stateBtnForm;
    this.validMap = new Map();
    this.error = true;
  }

  upgradeTableBtns(action) {
    let btnsEdit = document.querySelectorAll(".table__btn_type_edit");
    btnsEdit.forEach((btn, index) => {
      if (action === "edit" && btn.getAttribute("data-action") === "edit") {
        btn.setAttribute("disabled", "");
      } else if (action === "save") {
        btn.removeAttribute("disabled");
      }
    });
  }

  phoneInput(e) {
    let text = e.target.value;
    e.target.value = this.inputNumber(text);
  }

  checkValidMap(validMap) {
    for (let valid of validMap.values()) {
      if (!valid) {
        this.error = false;
        return false;
      } else {
        this.error = true;
      }
    }
  }

  validateTable(e) {
    let currentError;
    let input = e.target;
    let inputParent = input.closest(".table__td");
    let inputName = inputParent.getAttribute("data-input");

    switch (inputName) {
      case "name":
      case "phone":
        currentError = this.checkEmptyValue(input.value);
        currentError ? inputParent.classList.remove("table__td-error") : inputParent.classList.add("table__td-error");
        this.validMap.set(inputName, currentError);
        this.checkValidMap(this.validMap);
        break;

      default:
        console.log("Nothing Input");
        break;
    }
  }

  setSaveMode(elem, parent) {
    let _this = this;

    elem.setAttribute("data-action", "save");
    elem.innerText = "Save";
    this.upgradeTableBtns("edit");

    parent.querySelectorAll("td").forEach((td, index) => {
      if (!td.classList.contains("table__td-btn")) {
        td.querySelector("input").removeAttribute("readonly");
        _this.validMap.set(td.getAttribute("data-input"), true);
        td.querySelector("input").addEventListener("blur", _this.validateTable.bind(_this));
      }
      if (td.classList.contains("table__td-phone")) {
        td.querySelector("input").addEventListener("input", _this.phoneInput.bind(_this));
      }
    });
  }

  setEditMode(elem, parent) {
    let _this = this;

    elem.setAttribute("data-action", "edit");
    elem.innerText = "Edit";
    this.upgradeTableBtns("save");

    parent.querySelectorAll("td").forEach((td, index) => {
      if (!td.classList.contains("table__td-btn")) {
        td.querySelector("input").setAttribute("readonly", "");
        td.querySelector("input").removeEventListener("blur", _this.validateTable);
      }
      if (td.classList.contains("table__td-phone")) {
        td.querySelector("input").removeEventListener("input", _this.phoneInput);
      }
    });
  }



  changeElement() {
    let _this = this;

    this.table.onclick = (e) => {
      e.preventDefault();
      let target = e.target;
      let parentBtnRow;
      let userId;
      let userName;
      let userPhone;

      if (target.closest(".table__btn_type_edit")) {
        let dataAction = target.getAttribute("data-action");
        parentBtnRow = target.closest(".table__tr-row");
        userId = parentBtnRow.getAttribute("data-id");
        userName = parentBtnRow.querySelector('.table__td-name input').value;
        userPhone = parentBtnRow.querySelector('.table__td-phone input').value;

        if (dataAction === "edit") {
          _this.setSaveMode(target, parentBtnRow);
          if (_this.btnSubmit.getAttribute("disabled") === null) {
            _this.stateBtnForm = "disabled";
            _this.disabledBtn(false);
          }
        } else if (dataAction === "save" && _this.error === true) {
          _this.upgradeUser(userId, userName, userPhone);
          _this.setEditMode(target, parentBtnRow);
          if (_this.stateBtnForm === "disabled") {
            _this.disabledBtn(true);
          }
        }
      } else if (target.closest(".table__btn_type_delete")) {
        parentBtnRow = target.closest(".table__tr-row");
        userId = parentBtnRow.getAttribute("data-id");
        _this.deleteUser(userId);
        //parentBtnRow.remove();
      }
    };
  }

  init() {
    this.getUser();
    this.changeElement();
  }
}

let formUser = new FormNewUser();
formUser.init();

let upgradeUserInTable = new UpgradeUser();
upgradeUserInTable.init();
