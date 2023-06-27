require("dotenv").config()

const express = require("express"),
    app = express(),
    { MongoClient } = require("mongodb"),
    PORT = process.env.PORT,
    HOST = process.env.HOST,
    DB_URL = process.env.DB_URL;

const client = new MongoClient(DB_URL);

async function db() {
    try {
        await client.connect()
        const init = await client.db("mongoqueries").collection("inventory");
        
        // await init.insertMany([
        //     { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
        //     { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A" },
        //     { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
        //     { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
        //     { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" }
        // ]);
        return init;
    } catch(err) {
        console.log(err)
    }
}

app.get("/findall", async (req, res) => {
    try {
        const connect = await db();
        const findAll = await connect.find({}).toArray();
        
        if (findAll.length === 0) throw Error("Nothing is in here");

        res.status(200).json({
            findAll
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
        
    }
})

app.get("/findone/:item", async (req, res) => {
    try {
        const { item } = req.params;
        const connect = await db();
        const found = await connect.findOne({item});
        
        if (!found) throw Error("item not found");

        res.status(200).json({
            found
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: `${err}`
        })
    }
})

app.get("/findquery/:item/:status", async (req, res) => {
    try {
        const { item, status } = await req.params;
        const connect = await db();
        const findQuery = await connect.find({item, status}).toArray();
        console.log(findQuery.length)
        if (findQuery.length === 0) throw Error("item doesnt exist")

        res.status(200).json({
            findQuery
        })
    } catch (err) {
        res.status(500).json({
            message: `${err}`
        })
    }
})

app.get("/operators", async (req, res) => {
    const connect = await db();
    /* 
        * $or $and $not operators look for multiple queries in one
        * $gt/e $lt/e look for number ranges
        * .sort() allows us to sort alphabetically or numerically
            * (1) in ascending order
            * (-1) in descending order 
        * $in allows us to search a field of document against
        an array of items
            * ex: item matching against array of [many, items]
    */
    const orOperator = await connect.find({
        $or: [
            { "size.h": 22.85 },
            { item: "notebook"}
        ]
    }).toArray()

    const rangeOperator = await connect.find({
        qty: { $gt: 20, $lte: 45}
    }).sort({qty: -1}).toArray()

    const inOperator = await connect.find({
        item: { $in: ["journal", "notebook"]}
    }).toArray()

    res.status(200).json(rangeOperators);
})

app.listen(PORT, HOST, () => {
    console.log(`[server] listening on ${HOST}:${PORT}`);
})