const main = document.getElementById("main");
const getAll = document.getElementById("all-books");
const create = document.getElementById("new-book");
const update = document.getElementById("update")

getAll.addEventListener("click", evt => {
    evt.preventDefault();
    clear(main);
    fetch("http://localhost:4000/allBooks", {
        method: "GET"
    })
    .then(res => res.json())
    .then(books => bookList(books))
})

// adds a book
create.addEventListener("click", evt => {
    evt.preventDefault();
    clear(main);

    // making form
    let formContainer = document.createElement("div");
    let newBook = document.createElement("form");
    newBook.id = "form";
    let titleInput = document.createElement("input");
    titleInput.setAttribute("placeholder", "enter title");
    let authorInput = document.createElement("input");
    authorInput.setAttribute("placeholder", "enter author name");
    let copiesInput = document.createElement("input");
    copiesInput.setAttribute("placeholder", "enter how many copies");
    let addBook = document.createElement("button");
    addBook.innerHTML = "Add Book"
    newBook.appendChild(titleInput);
    newBook.appendChild(authorInput);
    newBook.appendChild(copiesInput);
    newBook.appendChild(addBook);
    formContainer.appendChild(newBook)
    main.appendChild(formContainer);
    // listner for the create button
    addBook.addEventListener("click", evt => {
        evt.preventDefault();
        createBook(titleInput.value, authorInput.value, copiesInput.value);
    })
})

// sends req to add book
function createBook(title, author, copies) {
    clear(main);

    let bookBody = {
        title: title,
        author: author,
        copies: copies
    }
    fetch("http://localhost:4000/addBook", {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json"
        }),

        body: JSON.stringify(bookBody)
        
    })
    .then(res => console.log(res.json()))
    
    // success message and button to go home page
    main.innerHTML = "Book Added"
    let home = document.createElement("button");
    home.innerHTML = "return home";
    main.appendChild(home);
    home.addEventListener("click", evt => {
        evt.preventDefault();
        window.location = "http://127.0.0.1:5500/public/index.html"
    })
}


// GETs all books and displays them on page
function bookList(books) {
    books.allBooks.forEach(book => {
        let theBook = document.createElement("div");
        theBook.id = "book";
        let title = document.createElement("h2");
        title.setAttribute("book-id", book._id)
        title.innerHTML = book.title;
        let author = document.createElement("p");
        author.innerHTML = book.author;
        let copies = document.createElement("p");
        copies.innerHTML = "copies: " + book.copies;
        theBook.appendChild(title);
        theBook.appendChild(author);
        theBook.appendChild(copies);
        main.appendChild(theBook);
    })
    let home = document.createElement("button");
    home.innerHTML = "return home";
    main.appendChild(home);
    home.addEventListener("click", evt => {
        evt.preventDefault();
        window.location = "http://127.0.0.1:5500/public/index.html"
    })
}

// displays form for update
update.addEventListener("click", evt => {
    evt.preventDefault();
    clear(main);

    // making update form
    let formContainer = document.createElement("div");
    let updateBook = document.createElement("form");
    updateBook.id = "form";
    let bookId = document.createElement("input");
    bookId.setAttribute("placeholder", "enter book id");
    let titleInput = document.createElement("input");
    titleInput.setAttribute("placeholder", "enter title");
    let authorInput = document.createElement("input");
    authorInput.setAttribute("placeholder", "enter author name");
    let copiesInput = document.createElement("input");
    copiesInput.setAttribute("placeholder", "enter how many copies");
    let update = document.createElement("button");
    update.innerHTML = "Update"
    updateBook.appendChild(bookId);
    updateBook.appendChild(titleInput);
    updateBook.appendChild(authorInput);
    updateBook.appendChild(copiesInput);
    updateBook.appendChild(update);
    formContainer.appendChild(updateBook)
    main.appendChild(formContainer);
    // listner for the create button
    update.addEventListener("click", evt => {
        evt.preventDefault();
        bookUpdate(bookId.value, titleInput.value, authorInput.value, copiesInput.value);
    })
})

//updates one book
function bookUpdate(id, title, author, copies) {
    clear(main);

    let bookBody = {
        id: id,
        title: title,
        author: author,
        copies: copies
    }
    fetch("http://localhost:4000/updateBook", {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json"
        }),

        body: JSON.stringify(bookBody)
        
    })
    .then(res => console.log(res.json()))

    // return home button
    main.innerHTML = "Book Updated"
    let home = document.createElement("button");
    home.innerHTML = "return home";
    main.appendChild(home);
    home.addEventListener("click", evt => {
        evt.preventDefault();
        window.location = "http://127.0.0.1:5500/public/index.html"
    })
}



// clears the buttons away
function clear(parent) {
    while(parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild);
    }
}