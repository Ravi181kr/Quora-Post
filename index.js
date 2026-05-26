const express = require("express");
const app = express();
const port = 8080;
const path = require('path');
const { v4:uuidv4 } = require("uuid");
const methodOverride = require('method-override');

app.use(express.urlencoded({extended: true}));  //express understand encoded url
app.use(methodOverride('_method'));     // form only works with GET & POST Request.So, to also use PATCH & DELETE Request by methodOverride

app.set("view engine", "ejs");      // set ejs engine
app.set("views", path.join(__dirname,"/views"));    //set path for run our server from outside/anywhere from index.js 's directory

app.use(express.static(path.join(__dirname,"/public")));    // use for css & js file for our views/template which are in public directory and also set path to run from anywhere

let posts = [
    {
        id: uuidv4(),
        username: "Ravi",
        content: "I love coding"
    },
    {
        id: uuidv4(),
        username: "Raman",
        content: "I like to play cricket"
    },
    {
        id: uuidv4(),
        username: "Rahul",
        content: "I got my 1st internship"
    }
];

// Show all post --> GET Request
app.get('/posts',(req,res)=>{
    res.render("index.ejs", {posts});
});

// Create New Post --> POST Request
app.get('/posts/new',(req,res)=>{
    res.render("form.ejs");
});

app.post('/posts',(req,res)=>{
    let {username,content} = req.body;
    let id = uuidv4();
    posts.push({id,username,content});
    res.redirect("/posts");
});

// Show post in details
app.get('/posts/:id',(req,res)=>{
    let {id} = req.params;
    let post = posts.find((p)=> id === p.id);
    if (!post) {
        return res.send("Post not found");
    }
    res.render("show.ejs", { post });
});

//Edit post --> PATCH Request
app.patch('/posts/:id',(req,res)=>{
    let { id } = req.params;
    let post = posts.find((p)=> id === p.id);
    let newContent = req.body.content;
    post.content = newContent;
    res.redirect("/posts");
});

app.get('/posts/:id/edit',(req,res)=>{
    let { id } = req.params;
    let post = posts.find( (p) => p.id === id );
    res.render('edit.ejs', {post});
});

//Delete Post --> DELETE Request
app.delete('/posts/:id',(req,res) =>{
    let { id } = req.params;
    posts = posts.filter( (p) => p.id !== id );
    res.redirect("/posts");
});

app.listen(port, ()=>{
    console.log(`Backend listing on port ${port}`);
});