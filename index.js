import express from 'express'
import cors from 'cors'
import fs from 'fs'

let posts = []
if (fs.existsSync("./posts.txt")) {
    posts = JSON.parse(fs.readFileSync("./posts.txt"));
  }

const app = express();
app.use(express.json());
app.use(cors());

app.post("/posts", (req, res) => {
    posts.push({id: posts.length + 1, comments:[] , commentCount: 0,  ...req.body, contentPreview: "Hardcoded porque não tem opção no front"})
    fs.writeFileSync("./posts.txt", JSON.stringify(posts));
    res.send("Ok")
})

app.get("/posts", (req, res) => {
    res.send(posts)
})

app.get("/posts/:id", (req, res) => {
    const objIndex = posts.findIndex((obj => parseInt(req.params.id)));
    res.send(posts[objIndex])
})

app.get("/posts/:id/comments", (req, res) => {
    const objIndex = posts.findIndex((obj => parseInt(req.params.id)));
    res.send(posts[objIndex].comments)
})

app.post("/posts/:id/comments", (req, res) => {
    const objIndex = posts.findIndex((obj => parseInt(req.params.id)));
    posts[objIndex].comments = [...posts[objIndex].comments, {...req.body, id: posts.filter((t) => (parseInt(t.id) === parseInt(req.body.postId)))[0].comments.length + 1} ]
    posts[objIndex].commentCount = posts[objIndex].commentCount + 1;
    fs.writeFileSync("./posts.txt", JSON.stringify(posts));
    res.send("Ok")
})

app.put("/posts/:id",  (req, res) => {
    const objIndex = posts.findIndex((obj => parseInt(req.params.id)));
    posts[objIndex].title = req.body.title
    posts[objIndex].content = req.body.content
    posts[objIndex].coverUrl = req.body.coverUrl
    fs.writeFileSync("./posts.txt", JSON.stringify(posts));
    res.send("Ok")
})

app.delete("/posts/:id",  (req, res) => {
    const objIndex = posts.findIndex((obj => parseInt(req.params.id)));
    posts = posts.splice(objIndex, 1)
    fs.writeFileSync("./posts.txt", JSON.stringify(posts));
    res.send("Ok")
})

app.listen(5000, () => console.log("Servidor Rodando !"))