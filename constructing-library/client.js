require("dotenv").config();
const Library = require("./library")
const DB_URL = process.env.DB_URL;

let collection = new Library(DB_URL, "library", "books");

let query = { "title": "Franny and Zooey"};
let info = {"title": "The Hobbit", "author": "J.R.R. Tolkien", "copies": 2}

collection.connected();

async function start() {

    // ? all books
    let allBooks = await collection.allBooks()
    allBooks.forEach(book => {
        console.log(book)
    })

    // ? one book
    let oneBook = await collection.findOneBook("649b178799143599c6f6ccc7")
    console.log(oneBook)

    // ? find many books with query
    // let findManyBooks = await collection.findManyBooks(query)
    // findManyBooks.forEach(book => console.log(book))

    // ? add one book
    // let addBook = await collection.addBook(info)

    // ? update book
    // await collection.changeBook("649b179799143599c6f6ccc8", {"title": "Paper towns"})

    // ? remove book
    // await collection.removeBook("649b2bb78e3e3d19e91efc00")

}

start()