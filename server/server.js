// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const port = 8000;
const SECRET = "abc123";

const Answer = require("./models/answers");
const Question = require("./models/questions");
const Tag = require("./models/tags");
const User = require("./models/user");
const Comment = require("./models/comments");

try {
    mongoose.connect("mongodb://127.0.0.1:27017/fake_so", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(`Conencted to MongoDB`);
} catch (err) {
    console.log("Error connecting to MongoDB");
}
let db = mongoose.connection;
app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const verifyJWT = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, SECRET);
            req.user = await User.findById(decoded.id);
            next();
        } catch (error) {
            res.status(401).json("Not authorized");
        }
    }
};

// Questions methods
app.get("/posts/question", async (req, res) => {
    const questions = await Question.find().sort({ ask_date_time: -1 });
    res.json(questions);
});

app.get("/posts/question/answers/:id", async (req, res) => {
    const question = await Question.findById(req.params.id);
    res.json(question.answers);
});

app.get("/posts/question/byUser/:id", async (req, res) => {
    const questions = await Question.find({ asked_by_Id: req.params.id });
    res.json(questions);
});

app.post("/posts/question", async (req, res) => {
    const question = await Question.create({
        title: req.body.title,
        text: req.body.text,
        summary: req.body.summary,
        tags: req.body.tags,
        answers: req.body.answers,
        asked_by: req.body.asked_by,
        asked_by_Id: req.body.asked_by_Id,
        ask_date_time: req.body.ask_date_time,
        views: req.body.views,
    });
    res.json(question);
});

app.put("/posts/question/:id", async (req, res) => {
    const updatedQuestion = await Question.findByIdAndUpdate(
        req.params.id,
        req.body
    );
    res.json({ updatedQuestion });
});

app.delete("/posts/question/:id", async (req, res) => {
    const updatedQuestion = await Question.findByIdAndDelete(req.params.id);
    res.json({ updatedQuestion });
});

// Answers methods
app.get("/posts/answer", async (req, res) => {
    const answers = await Answer.find().sort({ ans_date_time: -1 });
    res.json(answers);
});

app.get("/posts/answer/byId/:id", async (req, res) => {
    const answer = await Answer.findById(req.params.id);
    res.json(answer);
});

app.get("/posts/answer/byUser/:id", async (req, res) => {
    const answers = await Answer.find({ ans_by_Id: req.params.id });
    res.json(answers);
});

app.post("/posts/answer", async (req, res) => {
    const answer = await Answer.create({
        text: req.body.text,
        ans_by: req.body.ans_by,
        ans_date_time: req.body.ans_date_time,
        ans_by_Id: req.body.ans_by_Id,
    });
    res.json(answer);
});

app.put("/posts/answer/:id", async (req, res) => {
    const updatedAnswer = await Answer.findByIdAndUpdate(
        req.params.id,
        req.body
    );
    res.json({ updatedAnswer });
});

app.delete("/posts/answer/:id", async (req, res) => {
    const updatedAnswer = await Answer.findByIdAndDelete(req.params.id);
    res.json({ updatedAnswer });
});

// Tags methods
app.get("/posts/tag", async (req, res) => {
    const tags = await Tag.find();
    res.json(tags);
});

app.get("/posts/tag/find/:name", async (req, res) => {
    let tagname = req.params.name;
    const tag = await Tag.findOne({ name: tagname });
    res.json(tag);
});

app.get("/posts/tag/byUser/:id", async (req, res) => {
    const tags = await Tag.find({ created_by_Id: req.params.id });
    res.json(tags);
});

app.put("/posts/tag/edit/:name", async (req, res) => {
    let tag = await Tag.findOne({ name: req.params.name });
    let tagid = tag._id;
    let response = await Tag.findByIdAndUpdate(tagid, req.body);
    res.json(response);
});

app.post("/posts/tag", async (req, res) => {
    const tag = await Tag.create({
        name: req.body.name,
        created_by_Id: req.body.created_by_Id,
    });
    res.json(tag);
});

app.delete("/posts/tag/:name", async (req, res) => {
    let tag = await Tag.findOne({ name: req.params.name });
    let tagid = tag._id;
    let response = await Tag.findByIdAndDelete(tagid);
    res.json(response);
});

//user methods
app.post("/posts/user", async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            message: "User exists",
        });
    }
    const salt = await bcrypt.genSalt();
    const bcryptPass = await bcrypt.hash(password, salt);
    const user = await User.create({
        name,
        email,
        password: bcryptPass,
        reputation: 0,
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            reputation: user.reputation,
            registerationTime: user.registerationTime,
            upvoted: user.upvoted,
            downvoted: user.downvoted,
        });
    } else {
        res.status(400);
        throw new Error("Invalid registration");
    }
});

app.post("/posts/user/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            reputation: user.reputation,
            registerationTime: user.registerationTime,
            upvoted: user.upvoted,
            downvoted: user.downvoted,
        });
    } else {
        return res.json({ errMessage: "Invalid credentials" });
    }
});

app.get("/posts/user/byId/:id", async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            reputation: user.reputation,
            registerationTime: user.registerationTime,
            upvoted: user.upvoted,
            downvoted: user.downvoted,
        });
    } else {
        return res.json({ errMessage: "Invalid id" });
    }
});

app.get("/posts/user/email", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        res.json({
            message: "email found",
        });
    } else {
        res.json({
            message: "email not used",
        });
    }
});

app.put("/posts/user/:id", async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body);
    res.json({ updatedUser });
});

app.get("/posts/user/upvoted/:id", async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    res.json(user.upvoted);
});

app.get("/posts/user/downvoted/:id", async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    res.json(user.downvoted);
});

app.get("/posts/user/rep/:id", async (req, res) => {
    let question = await Question.findOne({ _id: req.params.id });
    let asked_by = question.asked_by_Id;
    let user = await User.findOne({ _id: asked_by });
    let rep = user.reputation;
    if (user) {
        res.json({ user: user, rep: rep });
    } else {
        res.json("error");
    }
});

app.get("/posts/user/rep/byanswer/:id", async (req, res) => {
    let answer = await Answer.findOne({ _id: req.params.id });
    let ans_by = answer.ans_by_Id;
    let user = await User.findOne({ _id: ans_by });
    let rep = user.reputation;
    if (user) {
        res.json({ user: user, rep: rep });
    } else {
        res.json("error");
    }
});

app.put("/posts/user/rep/:id", async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    res.json(user.reputation);
});

app.post("/posts/comment", async (req, res) => {
    const comment = await Comment.create({
        text: req.body.text,
        username: req.body.username,
    });
    res.json(comment);
});

generateToken = (id) => {
    return jwt.sign({ id }, SECRET, {
        expiresIn: "50d",
    });
};

// process.on("SIGINT", () => {
//     if (db) {
//         db.close()
//             .then((result) => console.log(""))
//             .catch((err) => console.log(err));
//     }
//     console.log("Server closed. Database instance disconnected");
// });

app.listen(port, () => console.log(`Server started on port ${port}...`));
