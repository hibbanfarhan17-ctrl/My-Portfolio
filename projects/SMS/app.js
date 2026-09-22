// ===========================
// DOM Elements
// ===========================

let name = document.getElementById("name");
let roll = document.getElementById("roll");
let birth = document.getElementById("birth");
let div1 = document.getElementById("div1");

let stdData = JSON.parse(localStorage.getItem("students")) || [];

let editId = null;

// ===========================
// Initial Load
// ===========================

displayStudents();

// ===========================
// Add Student
// ===========================

function addStudent() {

    let stdName = name.value.trim();
    let stdRoll = roll.value.trim();
    let stdBirth = birth.value;

    if (stdName === "" || stdRoll === "" || stdBirth === "") {

        alert("Please fill all fields.");

        return;

    }

    let student = {

        id: Date.now(),

        stdName: stdName,

        stdRoll: stdRoll,

        stdBirth: stdBirth

    };

    stdData.push(student);

    localStorage.setItem("students", JSON.stringify(stdData));

    name.value = "";
    roll.value = "";
    birth.value = "";

    displayStudents();

}

// ===========================
// Display Students
// ===========================

function displayStudents(data = stdData) {

    div1.innerHTML = `

    <div class="table-section">

        <div class="table-header-actions">

            <div class="counter">

                Total Students :
                <span>${data.length}</span>

            </div>

            <div class="sort-buttons">

                <button
                    class="sortBtn"
                    onclick="sortAZ()">

                    Sort A-Z ↑

                </button>

                <button
                    class="sortBtn"
                    onclick="sortZA()">

                    Sort Z-A ↓

                </button>

            </div>

        </div>

        <div class="table-wrapper">

            <table>

                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Roll No</th>

                        <th>Date of Birth</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody id="studentTableBody">

                </tbody>

            </table>

        </div>

    </div>

    `;

    let tbody = document.getElementById("studentTableBody");

    if (data.length === 0) {

        tbody.innerHTML = `

        <tr>

            <td colspan="4" class="noData">

                No Student Found

            </td>

        </tr>

        `;

        return;

    }

    data.forEach((student) => {

        tbody.innerHTML += `

        <tr>

            <td>${student.stdName}</td>

            <td>${student.stdRoll}</td>

            <td>${student.stdBirth}</td>

            <td>

                <button

                    class="button editBtn"

                    onclick="editStudent(${student.id})">

                    Edit

                </button>

                <button

                    class="button deleteBtn"

                    onclick="deleteStudent(${student.id})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

// ===========================
// Delete Student
// ===========================

function deleteStudent(id) {

    if (confirm("Delete this student?")) {

        stdData = stdData.filter(

            student => student.id !== id

        );

        localStorage.setItem(

            "students",

            JSON.stringify(stdData)

        );

        displayStudents();

    }

}

// ===========================
// Edit Student
// ===========================

function editStudent(id) {

    let student = stdData.find(

        student => student.id === id

    );

    name.value = student.stdName;

    roll.value = student.stdRoll;

    birth.value = student.stdBirth;

    editId = id;

    document.getElementById("addBtn").style.display = "none";

    document.getElementById("saveBtn").style.display = "block";

}

// ===========================
// Save Student
// ===========================

function saveStudent() {

    let stdName = name.value.trim();
    let stdRoll = roll.value.trim();
    let stdBirth = birth.value;

    if (stdName === "" || stdRoll === "" || stdBirth === "") {

        alert("Please fill all fields.");

        return;

    }

    for (let i = 0; i < stdData.length; i++) {

        if (stdData[i].id === editId) {

            stdData[i].stdName = stdName;
            stdData[i].stdRoll = stdRoll;
            stdData[i].stdBirth = stdBirth;

            break;

        }

    }

    localStorage.setItem(
        "students",
        JSON.stringify(stdData)
    );

    displayStudents();

    name.value = "";
    roll.value = "";
    birth.value = "";

    editId = null;

    document.getElementById("addBtn").style.display = "block";

    document.getElementById("saveBtn").style.display = "none";

}

// ===========================
// Search Students
// ===========================

function searchStudents() {

    let search = document
        .getElementById("searchBar")
        .value
        .toLowerCase();

    let filtered = stdData.filter(student =>

        student.stdName.toLowerCase().includes(search) ||

        student.stdRoll.toLowerCase().includes(search) ||

        student.stdBirth.toLowerCase().includes(search)

    );

    displayStudents(filtered);

}

// ===========================
// Sort A-Z
// ===========================

function sortAZ() {

    stdData.sort(function (a, b) {

        return a.stdName.localeCompare(b.stdName);

    });

    localStorage.setItem(
        "students",
        JSON.stringify(stdData)
    );

    displayStudents();

}

// ===========================
// Sort Z-A
// ===========================

function sortZA() {

    stdData.sort(function (a, b) {

        return b.stdName.localeCompare(a.stdName);

    });

    localStorage.setItem(
        "students",
        JSON.stringify(stdData)
    );

    displayStudents();

}

// ===========================
// Dark / Light Mode
// ===========================

const themeToggle = document.getElementById("themeToggle");

// Load Saved Theme

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark-mode");

    themeToggle.innerHTML = "☀️ Light Mode";

}

// Toggle Theme

themeToggle.onclick = function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        themeToggle.innerHTML = "☀️ Light Mode";

        localStorage.setItem("theme", "dark");

    } else {

        themeToggle.innerHTML = "🌙 Dark Mode";

        localStorage.setItem("theme", "light");

    }

};