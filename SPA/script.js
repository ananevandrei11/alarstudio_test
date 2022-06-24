class NewUser {
	constructor() {

	}


}


class FormNewUser {
  constructor() {
		//super();
    this.form = document.forms.userForm;
    this.btnSubmit = document.querySelector("#userForm-btn");
    this.table = document.querySelector("#userTable");
    this.validForm = new Map();
  }

  disabledBtn(bool) {
    bool
      ? this.btnSubmit.removeAttribute("disabled")
      : this.btnSubmit.setAttribute("disabled", "");
  }

  setValidMap() {
    [...this.form.elements].forEach((input, index) => {
      if (input.tagName === "INPUT") {
        this.validForm.set(input.name, false);
      }
    });
  }

  checkValidMap() {
    for (let valid of this.validForm.values()) {
      if (!valid) {
        this.disabledBtn(false);
        return false;
      } else {
        this.disabledBtn(true);
      }
    }
  }

  checkEmptyValue(value) {
    let error = value.trim() !== "" ? true : false;
    return error;
  }

  validateForm(input) {
    let parentInput = input.closest(".filed-input");
    let errorElem = parentInput.querySelector(".filed-input__message");
    let currentError;

    switch (input.name) {
      case "name":
      case "phone":
        currentError = this.checkEmptyValue(input.value);
        currentError
          ? (errorElem.innerText = "")
          : (errorElem.innerText = "error");
        this.validForm.set(input.name, currentError);
        this.checkValidMap();
        break;

      default:
        this.checkValidMap();
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
          this.inputNumber(input);
        }
      }
    });
  }

  inputNumber(input) {
    input.oninput = (e) => {
      let value = e.target.value;
      e.target.value = value.replace(/[^+\-\d]/g, "");
    };
  }

  submitHandlers() {
    let _this = this;
    this.btnSubmit.onclick = () => {
      _this.addNewUserInTable();
      _this.form.reset();
      _this.disabledBtn(false);
      _this.setValidMap();
    };
  }

  addNewUserInTable() {
    let tr = document.createElement("TR");
    let tdName = document.createElement("TD");
    let tdPhone = document.createElement("TD");
    let tdBtn = document.createElement("TD");
    tdName.innerHTML = `<span>${this.form.elements.name.value}</span>`;
    tdPhone.innerHTML = `<span>${this.form.elements.phone.value}</span>`;
    tdBtn.innerHTML = "<button>Edit</button><button>Delete</button>";
    tr.append(tdName);
    tr.append(tdPhone);
    tr.append(tdBtn);
    this.table.querySelector("tbody").append(tr);
  }

  init() {
    this.setValidMap();
    this.changeHandlers();
    this.submitHandlers();
  }
}



let formUser = new FormNewUser();
formUser.init();
