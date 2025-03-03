const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const flash = require('connect-flash');
const moment = require('moment');
const path = require('path');
const upload = require('./config/multerconfig');
const user = require('./models/user');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(session({
    secret: "jai",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.get("/", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    let posts = await postModel.find().populate("user");
    res.render("index", { user, posts, moment });
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user");

    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid);
    } else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }

    await post.save();
    res.redirect("/");
});

app.get("/user/posts", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    res.render("userPosts", { user, moment });
});

app.get('/post/create', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    res.render('create', { user });
});

app.get("/profile/pic", isLoggedIn, async (req, res) => {
    res.render("profilepic");
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user");

    res.render("edit", { post });
});

app.get("/delete/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOneAndDelete({ _id: req.params.id });

    res.redirect("/user/posts");
});

app.get("/login", (req, res) => {
    res.render("login", { message: req.flash('message') });
});

app.get("/register", (req, res) => {
    res.render("register", { message: req.flash('message') });
});

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/login");
});

app.post("/upload", isLoggedIn, upload.single("image"), async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.profilepic = req.file.filename;
    await user.save();
    res.redirect('/post/create');
})

app.post("/register", async (req, res) => {
    let { username, name, age, email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (user) {
        req.flash('message', 'User already registered');
        return res.redirect("/register");
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            let user = userModel.create({
                username,
                name,
                age,
                email,
                password: hash
            });
            let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
            res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });
            return res.redirect("/");
        });
    });
});

app.post("/login", async (req, res) => {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (!user) {
        req.flash('message', 'User Not Registerd.');
        return res.redirect('/login');
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
            res.cookie("token", token);
            res.status(200);
            req.flash('message', "Login Successfully.");
            return res.redirect("/");
        } else {
            req.flash('message', 'Incorrect Password.');
            return res.redirect('/login');
        }
    });
});

app.post("/post", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let { content } = req.body;

    let post = await postModel.create({
        user: user._id,
        content
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect("/user/posts");
});

app.post("/edit/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content });
    res.redirect("/user/posts");
});

function isLoggedIn(req, res, next) {
    if (!req.cookies.token) {
        res.redirect("/login");
    } else {
        let data = jwt.verify(req.cookies.token, "shhhh");
        req.user = data;
        next();
    }
}

app.listen(3000);