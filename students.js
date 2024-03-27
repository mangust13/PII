const addButton = document.querySelector(".main-button-add");
const modal = document.getElementById("myModal");
const closeButton = document.querySelector("#myModal .close");
const closeRemoveButton = document.querySelector("#removeStudentModal .close");
const addStudentForm = document.getElementById("addStudentForm");
const editButtons = document.querySelectorAll(".edit-button");
const removeButtons = document.querySelectorAll(".remove-button");
const removeStudentModal = document.getElementById("removeStudentModal");
const confirmRemoveButton = document.getElementById("confirmRemove");
const cancelRemoveButton = document.getElementById("cancelRemove");

let rowToRemove = null;

addButton.addEventListener("click", () => {
  document.getElementById("modal-content-title").textContent = "Add Student";

  document.querySelector('#addStudentForm button[type="submit"]').textContent =
    "Submit";
  modal.style.display = "block";
});

closeButton.addEventListener("click", () => {
  resetModalAndForm();
});

editButtons.forEach((button) => {
  button.addEventListener("click", handleEdit);
});

removeButtons.forEach((button) => {
  button.addEventListener("click", handleRemove);
});

closeRemoveButton.addEventListener("click", () => {
  removeStudentModal.style.display = "none";
});

confirmRemoveButton.addEventListener("click", () => {
  if (rowToRemove !== null) {
    rowToRemove.remove();
    rowToRemove = null;
    removeStudentModal.style.display = "none";
  }
});

cancelRemoveButton.addEventListener("click", () => {
  rowToRemove = null;
  removeStudentModal.style.display = "none";
});

function handleEdit(event) {
  const row = event.target.closest("tr");
  const cells = row.querySelectorAll("td");

  document.getElementById("group").value = cells[1].textContent;
  const nameSurname = cells[2].textContent.split(" ");
  document.getElementById("name").value = nameSurname[0];
  document.getElementById("surname").value = nameSurname[1];
  document.getElementById("gender").value = cells[3].textContent;
  document.getElementById("birthday").value = unformatBirthday(
    cells[4].textContent
  );

  document.getElementById("modal-content-title").textContent = "Edit Student";

  document.querySelector('#addStudentForm button[type="submit"]').textContent =
    "Save";

  row.classList.add("editing");
  modal.style.display = "block";
}

function handleRemove(event) {
  const row = event.target.closest("tr");
  row.remove();
}

function formatBirthday(birthday) {
  const [year, month, day] = birthday.split("-");
  return `${day}.${month}.${year}`;
}

function unformatBirthday(birthday) {
  const [day, month, year] = birthday.split(".");
  return `${year}-${month}-${day}`;
}

function resetModalAndForm() {
  document.getElementById("group").value = "";
  document.getElementById("name").value = "";
  document.getElementById("surname").value = "";
  document.getElementById("gender").value = "";
  document.getElementById("birthday").value = "2005-08-01";

  document.getElementById("group").selectedIndex = 0;
  document.getElementById("gender").selectedIndex = 0;

  const editingRow = document.querySelector(".editing");
  if (editingRow) {
    editingRow.classList.remove("editing");
  }

  modal.style.display = "none";
}

addStudentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const group = document.getElementById("group").value;
  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const gender = document.getElementById("gender").value;
  const birthday = document.getElementById("birthday").value;

  const editingRow = document.querySelector(".editing");

  if (editingRow) {
    editingRow.cells[1].textContent = group;
    editingRow.cells[2].textContent = `${name} ${surname}`;
    editingRow.cells[3].textContent = gender;
    editingRow.cells[4].textContent = formatBirthday(birthday);
    editingRow.classList.remove("editing");
  } else {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
              <td><input type="checkbox" class="table-checkbox"/></td>
              <td>${group}</td>
              <td>${name} ${surname}</td>
              <td>${gender}</td>
              <td>${formatBirthday(birthday)}</td> 
              <td class="table-status"><span class="circle"></span></td>
                  <td>
                    <button class="edit-button">
                      <img src="img/edit.png" class="nav-but" />
                    </button>
                    <button class="remove-button">
                      <img src="img/delete.png" class="nav-but" />
                    </button>
                  </td>
          `;

    const tableBody = document.querySelector(".main-table tbody");
    tableBody.appendChild(newRow);

    newRow.querySelector(".edit-button").addEventListener("click", handleEdit);
    newRow
      .querySelector(".remove-button")
      .addEventListener("click", handleRemove);
  }

  addStudentForm.reset();
  modal.style.display = "none";
});

document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("table");
  const checkboxHead = table.querySelector(".checkbox-head");

  checkboxHead.addEventListener("change", function (event) {
    const isChecked = event.target.checked;
    const checkboxes = table.querySelectorAll(".table-checkbox");

    checkboxes.forEach(function (checkbox) {
      checkbox.checked = isChecked;
      const circle = checkbox.closest("tr").querySelector(".circle");
      if (circle) {
        circle.style.backgroundColor = isChecked ? "green" : "#8c8c8c";
      }
    });
  });

  table.addEventListener("change", function (event) {
    if (event.target.classList.contains("table-checkbox")) {
      const isChecked = event.target.checked;
      const circle = event.target.closest("tr").querySelector(".circle");
      if (circle) {
        circle.style.backgroundColor = isChecked ? "green" : "#8c8c8c";
      }
    }
  });
});

function sendAddEditStudentFormDataToServer(
  serverPath,
  id,
  groupField,
  firstNameField,
  lastNameField,
  genderField,
  birthdayField
) {
  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      console.log("Response from server:", xhr.responseText);
    }
  };

  let queryString =
    "idValue=" +
    id +
    "&groupFieldValue=" +
    groupField +
    "&firstNameFieldValue=" +
    firstNameField +
    "&lastNameFieldValue=" +
    lastNameField +
    "&genderFieldValue=" +
    genderField +
    "&birthdayFieldValue=" +
    birthdayField;
  let requestURL = serverPath + "?" + queryString;

  xhr.open("GET", requestURL);
  xhr.send();

  console.log("GET request sent to:", requestURL, xhr);
}
