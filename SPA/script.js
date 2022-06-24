class NewUser {
  constructor() {
    this.table = document.querySelector("#userTable");
    this.btnSubmit = document.querySelector("#userForm-btn");
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

  addNewUserInTable(name, phone) {
    let tr = document.createElement("TR");
    tr.setAttribute("class", "table__tr-row");

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
}

class FormNewUser extends NewUser {
  constructor() {
    super();
    this.form = document.forms.userForm;
    this.validForm = new Map();
  }

  setValidMap() {
    [...this.form.elements].forEach((input, index) => {
      if (input.tagName === "INPUT") {
        this.validForm.set(input.name, false);
      }
    });
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
    [...this.form.elements].forEach((input, index) => {
      if (input.tagName === "INPUT") {
        input.onblur = () => {
          this.validateForm(input);
        };

        if (input.name === "phone") {
          input.oninput = (e) => {
            let value = e.target.value;
            e.target.value = this.inputNumber(value);
          };
        }
      }
    });
  }

  submitHandlers() {
    let _this = this;
    this.btnSubmit.onclick = async () => {
      _this.addNewUserInTable(_this.form.name.value, _this.form.phone.value);

      let response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: _this.form.name.value,
          phone: _this.form.phone.value,
        }),
      })
        .then((response) => {
          if (response.ok) {
            _this.form.reset();
            _this.disabledBtn(false);
            _this.setValidMap();
          }
        })
        .catch((error) => console.log(error));
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

  setUserInTable(data) {
    let _this = this;

    data.forEach((elem, index) => {
      _this.addNewUserInTable(elem.name, elem.phone);
    });
  }

  async getUser() {
    let _this = this;

    let response = await fetch("http://localhost:3000/users", {
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
    _this.upgradeTableBtns("save");

    parent.querySelectorAll("td").forEach((td, index) => {
      if (!td.classList.contains("table__td-btn")) {
        td.querySelector("input").setAttribute("readonly", "");
        td.querySelector("input").removeEventListener(
          "blur",
          _this.validateTable
        );
      }
      if (td.classList.contains("table__td-phone")) {
        td.querySelector("input").removeEventListener(
          "input",
          _this.phoneInput
        );
      }
    });
  }

  changeElement() {
    let _this = this;

    this.table.onclick = (e) => {
      let target = e.target;
      let parentBtnRow;

      if (target.closest(".table__btn_type_edit")) {
        let dataAction = target.getAttribute("data-action");
        parentBtnRow = target.closest(".table__tr-row");

        if (dataAction === "edit") {
          _this.setSaveMode(target, parentBtnRow);
          if (this.btnSubmit.getAttribute("disabled") === null) {
            this.stateBtnForm = "disabled";
            this.disabledBtn(false);
          }
        } else if (dataAction === "save" && _this.error === true) {
          _this.setEditMode(target, parentBtnRow);
          if (this.stateBtnForm === "disabled") {
            this.disabledBtn(true);
          }
        }
      } else if (target.closest(".table__btn_type_delete")) {
        parentBtnRow = target.closest(".table__tr-row");
        parentBtnRow.remove();
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
