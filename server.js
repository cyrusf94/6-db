require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb")
const app = express();
const Library = require("./library");

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const DB_URL = process.env.DB_URL;

const collection = new Library(DB_URL, "library", "books");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get("/allBooks", async (req, res) => {
    try {
        let allBooks = await collection.allBooks();
        res.status(200).json({
            allBooks
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

app.post("/addBook", async (req, res) => {
    try {
        let info = await req.body;
        collection.addBook(info);
        
        res.status(200).json({
            message: "book added"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

app.post("/updateBook", async (req, res) => {
    try {
        let body = await req.body;
        let update = {
            "title": body.title,
            "author": body.author,
            "copies": body.copies
        }
        
        let id = await body.id
        collection.changeBook(id, update);
        
        res.status(200).json({
            message: "book updated"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

app.listen(PORT, HOST, () => {
    console.log(`[server] listening on ${HOST}:${PORT}`)
})