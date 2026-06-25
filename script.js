/* -------------------------------------------------------
   CONSTANTS (CONFIGURATION VALUES)
------------------------------------------------------- */

// Key used to store student data in LocalStorage
const STORAGE_KEY = "students";

// Number of students after which the table becomes scrollable
const SCROLL_THRESHOLD = 4;


/* -------------------------------------------------------
   APPLICATION STATE
------------------------------------------------------- */

// Load students from LocalStorage
// If no data exists, initialize with an empty array
let students = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Tracks which student is being edited
// -1 means no student is currently being edited
let editIndex = -1;


/* -------------------------------------------------------
   DOM ELEMENT REFERENCES
------------------------------------------------------- */

// Form element
const form = document.getElementById("studentForm");

// Table body where student rows will be inserted
const tableBody = document.getElementById("studentTableBody");

// Scroll container for student records
const scrollContainer = document.getElementById("scrollContainer");

// Submit button
const submitBtn = document.getElementById("submitBtn");

// Cancel edit button
const cancelBtn = document.getElementById("cancelBtn");

// Message area for validation or success messages
const formMessage = document.getElementById("formMessage");

// Text displaying number of saved students
const recordCount = document.getElementById("recordCount");

// Message shown when no students exist
const emptyState = document.getElementById("emptyState");


/* -------------------------------------------------------
   LOCAL STORAGE MANAGEMENT
------------------------------------------------------- */

// Saves the student array to LocalStorage
function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}


/* -------------------------------------------------------
   FORM MESSAGE SYSTEM
------------------------------------------------------- */

// Displays validation or success message
function setMessage(message, type = "error") {

  // Insert text into message container
  formMessage.textContent = message;

  // Apply CSS class based on message type
  formMessage.className = `form-message${type === "success" ? " success" : ""}`;
}

// Clears message text
function clearMessage() {
  setMessage("", "error");
}


/* -------------------------------------------------------
   FORM MODE MANAGEMENT
------------------------------------------------------- */

// Switch form between ADD mode and EDIT mode
function updateFormMode() {

  // Check if we are editing a student
  const isEditing = editIndex !== -1;

  // Change button text accordingly
  submitBtn.textContent = isEditing ? "Update Student" : "Add Student";

  // Show or hide cancel button
  cancelBtn.hidden = !isEditing;
}


/* -------------------------------------------------------
   SCROLL CONTROL FOR TABLE
------------------------------------------------------- */

// Enables scrolling when student records exceed threshold
function updateScrollState() {

  // Determine if scrolling is required
  const shouldScroll = students.length > SCROLL_THRESHOLD;

  // Toggle CSS class for scroll
  scrollContainer.classList.toggle("scroll-enabled", shouldScroll);

  // Set max height dynamically
  scrollContainer.style.maxHeight = shouldScroll ? "310px" : "none";
}


/* -------------------------------------------------------
   SUMMARY INFORMATION (STUDENT COUNT)
------------------------------------------------------- */

// Updates student count and empty state message
function updateSummary() {

  const count = students.length;

  // Display student count
  recordCount.textContent = `${count} student${count === 1 ? "" : "s"} saved`;

  // Show or hide empty message
  emptyState.classList.toggle("visible", count === 0);
}


/* -------------------------------------------------------
   FORM RESET FUNCTION
------------------------------------------------------- */

// Clears form and resets editing mode
function resetFormState() {

  form.reset();

  // Reset editing index
  editIndex = -1;

  // Restore button text and hide cancel button
  updateFormMode();
}


/* -------------------------------------------------------
   FORM VALIDATION
------------------------------------------------------- */

// Validates student object before saving
function validateStudent(student) {

  // Regular expressions for validation
  const nameRegex = /^[A-Za-z ]+$/;
  const idRegex = /^\d+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactRegex = /^\d{10,}$/;

  // Check for empty fields
  if (!student.name || !student.id || !student.email || !student.contact) {
    return "All fields are required. Empty rows are not allowed.";
  }

  // Validate name
  if (!nameRegex.test(student.name)) {
    return "Student name must contain only letters and spaces.";
  }

  // Validate student ID
  if (!idRegex.test(student.id)) {
    return "Student ID must contain only numbers.";
  }

  // Validate email
  if (!emailRegex.test(student.email)) {
    return "Enter a valid email address.";
  }

  // Validate contact number
  if (!contactRegex.test(student.contact)) {
    return "Contact number must contain at least 10 digits.";
  }

  // Ensure Student ID is unique
  const duplicateIndex = students.findIndex(
    (entry, index) => entry.id === student.id && index !== editIndex
  );

  if (duplicateIndex !== -1) {
    return "Student ID must be unique.";
  }

  // No validation errors
  return "";
}


/* -------------------------------------------------------
   DISPLAY STUDENTS IN TABLE
------------------------------------------------------- */

// Renders student data into the table
function displayStudents() {

  // Clear existing rows
  tableBody.innerHTML = "";

  // Loop through student array
  students.forEach((student, index) => {

    // Create table row
    const row = document.createElement("tr");

    // Insert student data into row
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.id}</td>
      <td>${student.email}</td>
      <td>${student.contact}</td>
      <td class="action-cell">
        <button type="button" class="edit-btn" data-action="edit" data-index="${index}">Edit</button>
        <button type="button" class="delete-btn" data-action="delete" data-index="${index}">Delete</button>
      </td>
    `;

    // Append row to table
    tableBody.appendChild(row);
  });

  // Update UI states
  updateSummary();
  updateScrollState();
}


/* -------------------------------------------------------
   FORM SUBMISSION HANDLER
------------------------------------------------------- */

form.addEventListener("submit", (event) => {

  // Prevent page reload
  event.preventDefault();

  // Create student object from form input
  const student = {
    name: document.getElementById("name").value.trim(),
    id: document.getElementById("studentId").value.trim(),
    email: document.getElementById("email").value.trim(),
    contact: document.getElementById("contact").value.trim()
  };

  // Validate student data
  const validationError = validateStudent(student);

  if (validationError) {
    setMessage(validationError);
    return;
  }

  // ADD student
  if (editIndex === -1) {

    students.push(student);

    setMessage("Student record added successfully.", "success");

  } else {

    // UPDATE student
    students[editIndex] = student;

    setMessage("Student record updated successfully.", "success");
  }

  // Save data
  saveStudents();

  // Reset form
  resetFormState();

  // Re-render table
  displayStudents();
});


/* -------------------------------------------------------
   TABLE BUTTON EVENTS (EDIT / DELETE)
------------------------------------------------------- */

tableBody.addEventListener("click", (event) => {

  const action = event.target.dataset.action;
  const index = event.target.dataset.index;

  if (action === "edit") {

    const student = students[index];

    document.getElementById("name").value = student.name;
    document.getElementById("studentId").value = student.id;
    document.getElementById("email").value = student.email;
    document.getElementById("contact").value = student.contact;

    editIndex = index;

    updateFormMode();
  }

  if (action === "delete") {

    students.splice(index, 1);

    saveStudents();
    displayStudents();
  }

});


/* -------------------------------------------------------
   INITIALIZE APP
------------------------------------------------------- */

// Render students when page loads
displayStudents();