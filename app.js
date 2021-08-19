let myLibrary = [];
let objectArray = [];
let newBook;
let allBooks = JSON.parse(localStorage.getItem("allBooks"));
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
const clearBookEntryBtn = document.querySelector(".clear-book-btn");
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
window.addEventListener("DOMContentLoaded", localStorageCheck);
window.addEventListener("DOMContentLoaded", applyMethods);
window.addEventListener("load", handleRead);

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
  if (fieldChecker() && bookExistsChecker()) {
    console.log("truuuu");
    temporaryEntry();
    clearEntries();
    adjustLayout(populateObject());
    menuToggle();
    // console.log(objectArray);
    // localStorageCheck();
    // localStorageHandler();
    setToLocalStorage();
    applyMethods();
    newBook = new Book();
    myLibrary = [];
  } else {
    console.log("falseeeeeee");
    return;
  }
});
clearBookEntryBtn.addEventListener("click", clearEntries);

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
      counter++;
    } else {
      field.style.border = "3px solid #cb69c1";
      field.placeholder = `${fieldName} is required.`;
    }
  });
  if (counter === 4) {
    return true;
  } else {
    return false;
  }
}
// Checks whether title already exists and pops an error if it does
function bookExistsChecker() {
  const titleParentDiv = document.querySelector(".add-title");
  let counter = 0;
  if (allBooks === null) {
    return true;
  } else if (allBooks !== null) {
    allBooks.forEach((book) => {
      const errorComment = document.querySelector(".error-msg");
      const bookTitleField =
        bookTitle.name.charAt(0).toUpperCase() + bookTitle.name.slice(1);
      if (book.title === bookTitle.value) {
        console.log("Error");
        errorComment.classList.add("error-active");
        errorComment.textContent = `${bookTitleField} already exists.`;
        // TODO only one error comment should exist. Can fix that with a fixed p in HTMl
        // and only modify the textContent (instead of creating an element)
        titleParentDiv.appendChild(errorComment);
        ++counter;
      } else {
        counter += 0;
        // errorComment.classList.remove("error-active");
      }
    });
    if (counter > 0) {
      return false;
    } else {
      console.log(titleParentDiv.lastElementChild);
      titleParentDiv.lastElementChild.remove();
      return true;
    }
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
  objectArray.push(newBook);
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
// function localStorageCheck() {
//   // parses any localStorage Entries
//   if (allBooks.length === 0) {
//     localStorage.setItem("allBooks", JSON.stringify(objectArray));
//     console.log("Setting item to localstorage");
//     console.log(objectArray);
//   } else {
//     console.log("Books found");
//     allBooks = JSON.parse(localStorage.getItem("allBooks"));
//     allBooks.forEach((book) => {
//       adjustLayout(book);
//     });
//   }
// }
function localStorageCheck() {
  // parses any localStorage entries
  if (allBooks === null) {
    return;
  } else if (allBooks.length > 0) {
    console.log("Books found");
    // allBooks = JSON.parse(localStorage.getItem("allBooks"));
    allBooks.forEach((book) => {
      adjustLayout(book);
      objectArray.push(book);
    });
  }
}
function setToLocalStorage() {
  localStorage.setItem("allBooks", JSON.stringify(objectArray));
}
// handles read button and applies method to existing obj
function applyMethods() {
  objectArray.forEach((book) => {
    addRead(book);
    addDelete(book);
  });
}

function addRead(book) {
  if (!book.read) {
    book.read = function () {
      if (book.status === "no") {
        book.status = "yes";
      } else if (book.status === "yes") {
        book.status = "no";
      } else {
        book.status = "yes";
      }
    };
  } else {
    return;
  }
}
// TODO fix the deleteProcess
function addDelete(book) {
  book.deleteStatus = false;
  if (!book.deleteProcess) {
    book.deleteProcess = function () {
      delete Object.entries(book);
    };
  }
}
function handleRead() {
  const readBtns = document.querySelectorAll(".book-button-read");
  if (readBtns) {
    readBtns.forEach((button) =>
      button.addEventListener("click", () => {
        // gets the respective read span
        const readSpan =
          button.offsetParent.children[5].lastElementChild.childNodes[1];
        // getting the parent with the identifier id
        const parentDivID = button.offsetParent.id;
        console.log(button);
        console.log(readSpan);
        switch (readSpan.textContent) {
          case "Not Provided":
            readSpan.textContent = "Yes";
            break;
          case "Yes":
            readSpan.textContent = "No";
            break;
          case "No":
            readSpan.textContent = "Yes";
            break;
        }
        // update the object in the objectArray and passes it to localStorage
        objectArray[parentDivID].status = readSpan.textContent;
        setToLocalStorage();
      })
    );
  } else {
    return;
  }
}
