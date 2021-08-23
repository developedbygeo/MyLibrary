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
const statsBtn = document.querySelector('.my-stats-btn')
const statsCloseBtn = document.querySelector('.stats-close')
// Form & Form Fields (inputs)
const statsPage = document.querySelector('.my-stats')
const addBookForm = document.querySelector(".add-book");
const allFields = document.querySelectorAll(".data");
const bookTitle = document.querySelector(".title-field");
const bookAuthor = document.querySelector(".author-field");
const bookPages = document.querySelector(".pages-field");
const bookLanguage = document.querySelector(".language-field");
const bookDate = document.querySelector(".date-field");
const bookStatus = document.querySelector(".read-field");
// Edit Fields
const editParentTitle = document.querySelector('#edit-title-field');
const editParentAuthor = document.querySelector('#edit-author-field');
const editParentPages = document.querySelector('#edit-pages-field');
const editParentLanguage = document.querySelector('#edit-language-field');
const editParentDate = document.querySelector('#edit-date-field');

// Event Listeners
window.addEventListener("DOMContentLoaded", localStorageCheck);
window.addEventListener("DOMContentLoaded", applyMethods);
window.addEventListener("DOMContentLoaded", dateHandling);
window.addEventListener("load", handleRead);
window.addEventListener('load', handleDelete);
window.addEventListener('load', enableEditing);
window.addEventListener("load", calculateStats)

statsBtn.addEventListener('click', ()=>{
  statsPage.classList.toggle('my-stats-active');
})

statsCloseBtn.addEventListener('click', ()=>{
  statsPage.classList.remove('my-stats-active')
})

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
    temporaryEntry();
    clearEntries();
    adjustLayout(populateObject());
    menuToggle();
    setToLocalStorage();
    applyMethods();
    handleRead()
    handleDelete()
    enableEditing()
    calculateStats()
    newBook = new Book();
    myLibrary = [];
    allFields.forEach(field=>{
      field.style.border = 'none';
      field.placeholder = ''
    })
  } else {
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
  newBook.id = performance.now()
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
  if(book){
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
}else{
  return;
}
}

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
  if(book){
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
}else{
  return;
}
}
function addDelete(book) {
  if(book){
  book.deleteStatus = false;
  if (!book.deleteProcess) {
    book.deleteProcess = function () {
      Object.keys(book).forEach((key) => {
        delete book[key];
      });
      delete book
    };
  }
}else{
  return;
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
        const target = objectArray.find(book=>(book.id) == parentDivID);
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
        target.status = readSpan.textContent;
        setToLocalStorage();
      })
    );
  } else {
    return;
  }
}

function handleDelete(){
    const deleteBtns = document.querySelectorAll('.book-button-delete')
    if(deleteBtns){
      deleteBtns.forEach(button=>{
      const parentDivID = button.offsetParent.id
      const parentDiv = button.offsetParent
      button.addEventListener('click', ()=>{
        const targetIndex = objectArray.findIndex(book=>(book.id) == parentDivID)
        objectArray.splice(targetIndex, 1);
        parentDiv.remove();
        setToLocalStorage();
      })
      })
    }else{
      return;
    }
}
// allows for individual book editing and pushes to localStorage
function enableEditing(){
  // Buttons and Form
  const editBtns = document.querySelectorAll('.book-button-edit');
  const confirmBtn = document.querySelector('.edit-book-btn');
  const discardBtn = document.querySelector('.discard-edits-btn')
  const closeBtn = document.querySelector('.edit-book-close');
  const editForm = document.querySelector('.update-book');
  const objectIDSignifier = editForm.querySelector('.book-id')
  // loops over and finds the respective book based on id
  editBtns.forEach(button=>button.addEventListener('click', (e)=>{
    const bookObj = objectArray.find(book=>book.id == e.target.offsetParent.id);
    editForm.classList.toggle('update-book-active')
    library.classList.toggle('library-inactive');
    const {title, author, pages, language, date} = bookObj;
    editParentTitle.value = title;
    editParentAuthor.value = author;
    editParentPages.value = pages;
    editParentLanguage.value = language;
    editParentDate.value = date;
    objectIDSignifier.textContent = bookObj.id
  }))
    confirmBtn.addEventListener('click', ()=>{
      const bookObj = objectArray.find(book=>book.id == objectIDSignifier.textContent)
      const parentDiv = document.getElementById(`${objectIDSignifier.textContent}`)
      const parentTitleDiv = parentDiv.querySelector('.book-title');
      const parentAuthorDiv = parentDiv.querySelector('.author');
      const parentPagesDiv = parentDiv.querySelector('.pages');
      const parentLanguageDiv = parentDiv.querySelector('.language');
      const parentDateDiv = parentDiv.querySelector('.publishing');
      bookObj.title = parentTitleDiv.innerText = editParentTitle.value;
      bookObj.author = parentAuthorDiv.textContent = editParentAuthor.value;
      bookObj.pages = parentPagesDiv.textContent = editParentPages.value;
      bookObj.language = parentLanguageDiv.textContent = editParentLanguage.value;
      bookObj.date = parentDateDiv.textContent = editParentDate.value;
      editForm.classList.remove('update-book-active');
      library.classList.remove('library-inactive')
      setToLocalStorage();
    })
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

// Date handling
function dateHandling(){
  const today = new Date();
  let day = today.getDate();
  let month = today.getMonth()+1;
  let year = today.getFullYear();
  if(day<10){
    day = `0${day}`
  }if(month<10){
    month = `0${month}`
  }
  let currentDate = `${year}-${month}-${day}`
  bookDate.setAttribute("max", currentDate)
  }

// Stats

function calculateStats(){
  const booksRead = document.querySelector('.books-read');
  const booksTotal = document.querySelector('.books-total');
  const outOfSpans = document.querySelectorAll('.outof')
  const pagesRead = document.querySelector('.pages-read');
  const pagesTotal = document.querySelector('.pages-total');
  const authorsUnique = document.querySelector('.unique-authors');
  const favoriteAuthor = document.querySelector('.favorite-author');
  const favoriteLanguage = document.querySelector('.language-one');
  const dateAverage = document.querySelector('.average-date');
  let readBooks = 0;
  let totalBooks = 0;
  let readPages = 0;
  let totalPages = 0;
  let authorsArray = []
  let languageArray = []
  let dateArray = []
  if(objectArray.length > 0){
  // total read books and read pages
  objectArray.find(object=>{
    if(object.status == "Yes"){
      readBooks++;
      readPages += +object.pages
    }
  })
  // total books
  objectArray.forEach(object=>{
    totalBooks++
    totalPages += +object.pages
    authorsArray.push(object.author)
    languageArray.push(object.language)
    if(object.date.length > 0){
      dateArray.push(object.date)
    }
  })
  // find unique
  const unique = (value, index, self) =>{
    return self.indexOf(value) === index
  }
  // filtering to find the total of unique authors
  let uniqueAuthors = authorsArray.filter(unique)
  // finding the most common in specified array (author or language)
  function mostCommon(array){
    const hash = array.reduce((acc, val)=>{
      acc[val] = (acc[val] || 0) +1
      return acc
    },{})
    return Object.keys(hash).reduce((a, b)=> hash[a] > hash[b] ? a:b)
  }
  console.log(mostCommon(uniqueAuthors))
  // finding the average publishing date
  function averageDate(){
    let formattedStrings = [];
    dateArray.forEach(date=>{
      const substring = date.substring(0,4);
      formattedStrings.push(substring);
    })
    const formattedDateNumbers = formattedStrings.map(i=>Number(i))
    const result = Math.round(formattedDateNumbers.reduce((p, c)=>p + c, 0) / formattedStrings.length)
    return result;
  }
  function percentageCalc(a, b){
    return Math.round((((100 * a) / b) + Number.EPSILON)*100)/100
  }
  outOfSpans.forEach(span=>span.textContent = ' out of ')
  booksRead.textContent = readBooks;
  booksTotal.textContent = `${totalBooks} - (${percentageCalc(readBooks, totalBooks)}%)`;
  pagesRead.textContent = readPages;
  pagesTotal.textContent = `${totalPages} - (${percentageCalc(readPages, totalPages)}%)`;
  authorsUnique.textContent = mostCommon(uniqueAuthors).length
  favoriteAuthor.textContent = mostCommon(authorsArray);
  favoriteLanguage.textContent = mostCommon(languageArray)
  dateAverage.textContent = averageDate();
} else{
  booksRead.textContent = 'Data Unavailable';
  pagesRead.textContent = 'Data Unavailable';
  authorsUnique.textContent = 'Data Unavailable';
  favoriteAuthor.textContent = 'Data Unavailable';
  favoriteLanguage.textContent = 'Data Unavailable';
  dateAverage.textContent = 'Data Unavailable';
  return;
}
}
