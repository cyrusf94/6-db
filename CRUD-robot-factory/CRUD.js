const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/factory');
const db = mongoose.connection

db.on('error', console.error.bind(console, "connection error"));

const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);
function ask(questionText) {
    return new Promise((resolve, reject) => {
        rl.question(questionText, resolve);
    });
}

async function start() {
    const robotSchema = new mongoose.Schema({
        creatorName: String,
        robotName: String,
        robotColor: String,
        killer: Boolean,
        friend: Boolean,
        serialNumber: Number,
        date: Date
    })

    const Robot = mongoose.model("robots", robotSchema);

    let action = await ask(
        "Welcome to the robot factory! What do you want to do? (Create, Read, Update, Delete)\n"
    )

    if (action.toLowerCase() === 'create') {
        let creatorName = await ask('Who is the creator?\n');
        let robotName = await ask("what is the robots name\n");
        let robotColor = await ask("what color is the robot?\n");
        let friend = await ask("is the robot a friend? enter Y or N\n")
        if (friend.toLowerCase() === "n") {
            friend = false;
            killer = true;
            console.log("oh no! a killer robot");
        } else if (friend.toLowerCase() === "y") {
            friend = true;
            killer = false;
            console.log("a friend");
        }
        let serialNumber = await ask("what is the serial number\n");
        date = new Date();

        const response = new Robot({
            creatorName: creatorName,
            robotName: robotName,
            robotColor: robotColor,
            friend: friend || null,
            killer: killer || null,
            serialNumber: serialNumber,
            date: date,
        })
        await response.save();
        console.log("your robot has been created!")
        
    } else if (action.toLowerCase() === "read") {
        const allRobots = await Robot.find();
        console.log(allRobots);
        
    } else if (action.toLowerCase() === "update") {
        let allRobots = await Robot.find();
        console.log(allRobots);
        let updateTarget = await ask(
            "what is the ID of the robot you want to update?\n"
        );
        let updateField = await ask(
            "what field do you want to update?\n"
        );
        let update = await ask("enter a new value\n");
        
        await Robot.updateOne({ _id: updateTarget }, { $set: { [updateField]: update} });
        console.log("your robot has been updated");

    } else if (action.toLowerCase() === 'delete') {
        let allRobots = await Robot.find();
        console.log(allRobots);
        
        let target = await ask(
            "what is the ID of the entry do you want to delete?\n"
        );
        await Robot.deleteOne({ _id: target });
        console.log("your entry has been deleted");
        
    } else {
        console.log("invalid entry, try again");
        
    }
    process.exit();
}

start();