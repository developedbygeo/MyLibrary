let myLibrary = [];
class Book {
  constructor(author, pages, language, date, status) {
    this.author = author;
    this.pages = pages;
    this.language = language;
    this.date = date;
    this.status = status;
  }
}
const library = document.querySelector(".library");
// Buttons
const openBookFormBtn = document.querySelector(".add");
const closeBookFormBtn = document.querySelector(".add-book-close");
const commitBookEntryBtn = document.querySelector(".add-book-btn");
// Form & Form Fields (inputs)
const addBookForm = document.querySelector(".add-book");
const allFields = document.querySelectorAll(".data");
const bookTitle = document.querySelector(".title-field");
const bookAuthor = document.querySelector(".author-field");
const bookPages = document.querySelector(".pages-field");
const bookLanguage = document.querySelector(".language-field");
const bookDate = document.querySelector(".date-field");
const bookStatus = document.querySelector(".read-field");

// Event Listeners
openBookFormBtn.addEventListener("click", () => {
  addBookForm.classList.toggle("add-book-active");
  library.classList.toggle("library-inactive");
  openBookFormBtn.classList.add("add-active");
  setTimeout(() => {
    openBookFormBtn.classList.remove("add-active");
  }, 300);
});
closeBookFormBtn.addEventListener("click", () => {
  openBookFormBtn.classList.remove("add-book-active");
  library.classList.remove("library-inactive");
});

commitBookEntryBtn.addEventListener("click", () => {
  fieldChecker();
  if (fieldChecker) {
    console.log("truuuu");
    temporaryEntry();
    clearEntries();
    console.log(populateObject());
  } else {
    return;
  }
});

// Functions
function temporaryEntry() {
  const tempArr = ([title, author, pages, lang, date, status] = [
    bookTitle.value,
    bookAuthor.value,
    bookPages.value,
    bookLanguage.value,
    bookDate.value,
    bookStatus.value,
  ]);
  myLibrary.push(...tempArr);
}
function fieldChecker() {
  allFields.forEach((field) => {
    let fieldName = field.name.charAt(0).toUpperCase() + field.name.slice(1);
    if (field.value.length >= 1) {
      return true;
    } else {
      field.style.border = "2px solid red";
      field.placeholder = `${fieldName} is required`;
      return false;
    }
  });
}
function clearEntries() {
  allFields.forEach((field) => {
    field.value = "";
  });
  bookStatus.selectedIndex = 0;
}
function populateObject() {
  let newBook = new Book(...myLibrary);
  return newBook;
}
