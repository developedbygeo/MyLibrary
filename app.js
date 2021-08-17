let myLibrary = [];
let objectArray = [];
let newBook;
class Book {
  constructor(title, author, pages, language, date, status) {
    this.title = title;
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
  addBookForm.classList.remove("add-book-active");
  library.classList.remove("library-inactive");
});

commitBookEntryBtn.addEventListener("click", () => {
  // fieldChecker();
  if (fieldChecker()) {
    console.log("truuuu");
    temporaryEntry();
    clearEntries();
    // populateObject();
    adjustLayout(populateObject());
    menuToggle();
    console.log(objectArray);
    newBook = new Book();
    myLibrary = [];
  } else {
    console.log("falseeeeeee");
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
// to check whether all fields have been filled-in prior to submission
function fieldChecker() {
  let counter = 0;
  allFields.forEach((field) => {
    let fieldName = field.name.charAt(0).toUpperCase() + field.name.slice(1);
    if (field.value.length >= 1) {
      // return true;
      counter++;
    } else {
      field.style.border = "2px solid red";
      field.placeholder = `${fieldName} is required`;
    }
  });
  if (counter === 5) {
    return true;
  } else {
    return false;
  }
}
function clearEntries() {
  allFields.forEach((field) => {
    field.value = "";
  });
  bookStatus.selectedIndex = 0;
}
// Creating new book through the constructor & assigning new id based on array length.
function populateObject() {
  let newBook = new Book(...myLibrary);
  // const { title, author, pages, language, date, status } = myLibrary;
  // let newBook = new Book(title, author, pages, language, date, status);
  newBook.id = objectArray.length;
  objectArray.unshift(newBook);
  return newBook;
}
function menuToggle() {
  addBookForm.classList.remove("add-book-active");
  library.classList.remove("library-inactive");
}
// Adds new div from the template, copies over the values returned from populateObject
// and assigns the returned id to the last child
function adjustLayout(book) {
  const templateBook = document.querySelector(".book-structure").content;
  const tempCopy = document.importNode(templateBook, true);
  const bookTitle = tempCopy.querySelector(".book-title");
  const bookAuthor = tempCopy.querySelector(".author");
  const bookPages = tempCopy.querySelector(".pages");
  const bookLang = tempCopy.querySelector(".language");
  const bookDate = tempCopy.querySelector(".publishing");
  const bookReadStatus = tempCopy.querySelector(".read");
  const { title, author, pages, language, date, status, id } = book;
  [
    bookTitle.textContent,
    bookAuthor.textContent,
    bookPages.textContent,
    bookLang.textContent,
    bookDate.textContent,
    bookReadStatus.textContent,
  ] = [title, author, pages, language, date, status];
  library.appendChild(tempCopy);
  const addedBook = library.lastElementChild;
  addedBook.setAttribute("id", id);
}
