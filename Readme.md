
# Student Registration System ###

Simple student registration system built with HTML, CSS, and JavaScript DOM manipulation.

## Features ###

- Add, edit, and delete student records
- Local storage persistence after page refresh
- Validation for name, student ID, email, and contact number
- Empty submission prevention
- Dynamic vertical scrollbar for larger record lists
- Responsive layout for mobile, tablet, and desktop

## Project Files ###

- `index.html`
- `style.css`
- `script.js`

## How to Run ###

1. Open `index.html` in a browser.
2. Fill out the form and submit a student record.
3. Use the edit and delete buttons in the records table as needed.

## Validation Rules ###

- Name accepts letters and spaces only
- Student ID accepts numbers only
- Email must be in a valid email format
- Contact number accepts numbers only and must contain at least 10 digits
- All fields are required

## Notes ###

- Data is stored in the browser using `localStorage`.
- The table enables vertical scrolling automatically when the record list grows.