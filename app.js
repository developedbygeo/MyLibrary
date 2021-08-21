let myLibrary = [];
let objectArray = [];
let newBook;
let allBooks = JSON.parse(localStorage.getItem("allBooks"));
let targetedObj;
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
window.addEventListener('load', handleDelete);
window.addEventListener('load', enableEditing);

openBookFormBtn.addEventListener("click", () => {
  addBookForm.classList.toggle("add-book-active");
  library.classList.toggle("library-inactive");
  openBookFormBtn.classList.add("add-active");
  clearEntries()
  setTimeout(() => {
    openBookFormBtn.classList.remove("add-active");
  }, 300);
});
closeBookFormBtn.addEventListener("click", () => {
  addBookForm.classList.remove("add-book-active");
  library.classList.remove("library-inactive");
});

commitBookEntryBtn.addEventListener("click", () => {
  if (fieldChecker() && bookExistsChecker()) {
    console.log("truuuu");
    temporaryEntry();
    clearEntries();
    adjustLayout(populateObject());
    menuToggle();
    setToLocalStorage();
    applyMethods();
    handleRead()
    handleDelete()
    enableEditing()
    newBook = new Book();
    myLibrary = [];
    allFields.forEach(field=>{
      field.style.border = 'none';
      field.placeholder = ''
    })
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
    objectArray.forEach((book) => {
      const errorComment = document.querySelector(".error-msg");
      const bookTitleField =
        bookTitle.name.charAt(0).toUpperCase() + bookTitle.name.slice(1);
      if (book.title === bookTitle.value) {
        console.log("Error");
        errorComment.classList.add("error-active");
        errorComment.textContent = `${bookTitleField} already exists.`;
        console.log('ERRAWR')
        ++counter;
      } else {
        counter += 0;
      }
    });
    if (counter > 0) {
      return false;
    } else {
      const errorComment = document.querySelector(".error-msg");
      console.log(titleParentDiv.lastElementChild);
      errorComment.textContent = '';
      return true;
    }
  }
}
function clearEntries() {
  allFields.forEach((field) => {
    field.value = "";
  });
  bookStatus.selectedIndex = 0;
  bookDate.value = ''
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
function addDelete(book) {
  book.deleteStatus = false;
  if (!book.deleteProcess) {
    book.deleteProcess = function () {
      Object.keys(book).forEach((key) => {
        delete book[key];
      });
      delete book
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
// function handleDelete(){
//   const deleteBtns = document.querySelectorAll('.book-button-delete');
//   if(deleteBtns){
//     deleteBtns.forEach(button=>
//       button.addEventListener('click', ()=>{
//       const parentDivID = button.offsetParent.id
//       const parentDiv = button.offsetParent
//       // console.log(parentDiv)
//       const targetedObj = objectArray.find(function(book){
//         if(book.id == parentDivID){
//           book.deleteProcess()
//         }
//       })
//       // objectArray[parentDivID].deleteProcess();
//       // objectArray.splice(parentDivID, 1)
//       parentDiv.remove()
//       // remapID()
//       setToLocalStorage();
//     }))
//   }
//   else{
//     return;
//   }
// }
function handleDelete(){
  const deleteBtns = document.querySelectorAll('.book-button-delete')
  if(deleteBtns){
        deleteBtns.forEach(button=>{
      const parentDivID = button.offsetParent.id
      const parentDiv = button.offsetParent
      button.addEventListener('click', ()=>{
         targetedObj = objectArray.find(function(book, index){
          if(book){
          if(book.id == parentDivID){
      objectArray.splice(index, 1)
      parentDiv.remove();
      setToLocalStorage();
    } else{
      return
    }
          }
        })
      })
        })

  }else{
    return;
  }
}
// allows for individual book editing and pushes to localStorage
function enableEditing(){
  const editBtns = document.querySelectorAll('.book-button-edit');
  const editForm = document.querySelector('.update-book');
  const titleEditInput = document.querySelector('#edit-title-field')
  const authorEditInput = document.querySelector('#edit-author-field')
  const pagesEditInput = document.querySelector('#edit-pages-field')
  const languageEditInput = document.querySelector('#edit-language-field')
  const dateEditInput = document.querySelector('#edit-date-field')
  const confirmBtn = document.querySelector('.edit-book-btn');
  const discardBtn = document.querySelector('.discard-edits-btn')
  const closeBtn = document.querySelector('.edit-book-close');
  editBtns.forEach(button=>button.addEventListener('click', ()=>{
    const parentDivID = button.offsetParent.id
    const parentDiv = button.offsetParent
    const parentTitle = parentDiv.querySelector('.book-title')
    const parentAuthor = parentDiv.querySelector('.author')
    const parentPages = parentDiv.querySelector('.pages')
    const parentLanguage = parentDiv.querySelector('.language')
    const parentDate = parentDiv.querySelector('.publishing')
    const {title, author, pages, language, date} = objectArray[parentDivID]
    editForm.classList.toggle('update-book-active')
    library.classList.toggle('library-inactive');
    titleEditInput.value = title;
    authorEditInput.value = author;
    pagesEditInput.value = pages;
    languageEditInput.value = language;
    dateEditInput.value = date;
    confirmBtn.addEventListener('click', ()=>{
      objectArray[parentDivID].title = parentTitle.textContent = titleEditInput.value;
      objectArray[parentDivID].author = parentAuthor.textContent = authorEditInput.value;
      objectArray[parentDivID].pages = parentPages.textContent = pagesEditInput.value;
      objectArray[parentDivID].language = parentLanguage.textContent = languageEditInput.value;
      objectArray[parentDivID].date = parentDate.textContent = dateEditInput.value;
      editForm.classList.remove('update-book-active');
      library.classList.remove('library-inactive')
      setToLocalStorage();
    })
  }))
  discardBtn.addEventListener('click', ()=>{
    const allEditFields = document.querySelectorAll('.edit-input');
    allEditFields.forEach(field=>field.value = '')
    editForm.classList.remove('update-book-active');
    library.classList.remove('library-inactive');
  })
  closeBtn.addEventListener('click', ()=>{
    editForm.classList.remove('update-book-active')
    library.classList.remove('library-inactive')
  })
}
