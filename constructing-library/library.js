require("dotenv").config();

const { MongoClient, ObjectId } = require("mongodb");
const DB_URL = process.env.DB_URL;

class Library {
    constructor(dbUrl, dbName, collName) {
        this.dbUrl = dbUrl;
        this.dbName = dbName;
        this.collName = collName;
        this.dbClient;
    }

    async connected() {
        console.log(`connecting to ${this.dbUrl}...`)
        this.dbClient = MongoClient.connect(this.dbUrl);
        console.log(`connected to database`)
    }

    async client() {
        //console.log(`connecting to ${this.dbUrl}`)
        this.dbClient = MongoClient.connect(this.dbUrl);
        //console.log(`connected to database`)
        return this.dbClient;
    }

    async test() {
        const client = await this.client()
        client.close();
    }

    async collection() {
        const client = await this.client();
        const db = client.db(this.dbName);
        const collection = db.collection(this.collName);
        return collection;
    }

    async allBooks() {
        const collection = await this.collection();
        return collection.find({}).toArray();
    }

    async findOneBook(id) {
        const docId =  new ObjectId(id);
        const collection = await this.collection();
        return collection.find(docId).toArray();
    }

    async findManyBooks(query) {
        const collection = await this.collection();
        return collection.find(query).toArray();
    }
    
    async addBook(info) {
        const collection = await this.collection();

        if (!(info instanceof Object)) throw Error("Incorrect data type")
        await collection.insertOne(info);
        console.log("your book was added")
    }

    async changeBook(id, newInfo) {
        const mongoId = new ObjectId(id);
        const infoObj = { $set: newInfo }
        const collection = await this.collection();
        const result = await collection.updateOne({ _id: mongoId }, infoObj);

        if (result.modifiedCount === 0) throw Error("Cannot change book")
        
        
        return result;
    }

    async removeBook(id) {
        const mongoId = new ObjectId(id);
        const collection = await this.collection();
        const result = await collection.deleteOne({ _id: mongoId});
        if (result.deletedCount) {
            return "Nothing to delete"
        } else {
            return "Book removed"
        }
    }
}


module.exports = Library;