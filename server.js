//David Acevedo
//A01196678
//Lab 7

//server running on port 8080

const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const uuid = require('uuid')

app.use(jsonParser)

let posts = [
    {
        id: uuid.v4(),
        title: 'First Post',
        content: 'Content 1',
        author: 'davidacevedo',
        publishDate: '24-Mar-2019'
    },
    {
        id: uuid.v4(),
        title: 'Second Post',
        content: 'Content 2',
        author: 'davidacevedo',
        publishDate: '24-Mar-2019'
    },
    {
        id: uuid.v4(),
        title: 'Third Post',
        content: 'Content 3',
        author: 'myAuthor',
        publishDate: '24-Mar-2019'
    },
]

//get request of all blog posts
app.get('/blog-posts', (req, res) => {
    res.status(200).json({
        message: "Successfully sent the list of blog posts",
        status: 200,
        posts
    })
    return
});

//get by author
app.get('/blog-posts/:author', (req, res) => {
    let author = req.params.author

    if (!author) {
        res.status(406).json({
            message: 'No author specified',
            status: 406
        })
    }

    const postsByAuthor = []
    posts.forEach(function (item, index) {
        if (item.author == author) {
            postsByAuthor.push(item)
        }
    })

    if (postsByAuthor.length === 0) {
        res.status(404).json({
            message: `Posts by'${author}' not found`,
            status: 404
        })
    } else {
        res.status(200).json({
            message: `Posts by'${author}' found`,
            posts: postsByAuthor
        })
    }
    return
});

//post request
app.post('/blog-posts', jsonParser, (req, res) => {
    let requiredFields = ["title", "content", "author", "publishDate"];

    //Validate that we receive both of the params
    //Send error with status 406 "Missing fields"
    for (let i = 0; i < requiredFields.length; i++) {
        let currentField = requiredFields[i];

        if (!(currentField in req.body)) {
            res.status(406).json({
                message: `Missing field ${currentField} in body.`,
                status: 406
            })
            return
        }
    }

    let objectToAdd = {
        id: uuid.v4(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    }
    posts.push(objectToAdd)

    res.status(201).json({
        message: "Post added",
        status: 201
    })
    return
});

//delete request
app.delete('/blog-posts', jsonParser, (req, res) =>{
    
    if (!(req.params.id)) {
        res.status(406).json({
            message: 'Missing field id in params.',
            status: 406
        })
    }

    if (!("id" in req.body)) {
        res.status(406).json({
            message: 'Missing field id in body.',
            status: 406
        })
    }

    if (req.params.id != req.body.id) {
        return res.status(406).json({
            message: `ID '${req.body.id}' in body different than ID '${req.params.id}' in params.`,
            status: 406
        }).send("Finish")
    }

    let id = req.params.id
    posts.forEach(function(item,index) {
        if (id == item.id) {
            posts.splice(index,1)
            res.status(204).json({
                message: `Successfully deleted post with id: ${item.id}.`,
                status: 204
            })
            return
        }
    })

    res.status(404).json({
        message: 'Post was not found',
        status: 404
    })
});

//put request
app.put('/blog-posts/:id', (req,res) => {
    
    let id = req.params.id

    //STATUS 406 IF ID MISSING IN PARAMS
    if (!(id)) {
        res.status(406).json({
            message: 'Missing field id in params.',
            status: 406
        })
    }

    if (req.body.length == 0) {
        res.status(404).json({
            message: `Empty body.`,
            status: 404
        }).send("Finish")
    }

    posts.forEach(item => {
        if (item.id == id) {
            empty = true
            for (let key in req.body) {
                if (key == 'title' || key == 'content' || key == 'author') {
                    item[key] = req.body[key]
                    empty = false
                }
                else if (key == 'publishDate') {
                    item[key] = new Date(req.body[key])
                    empty = false
                }
            }
            if (empty) {
                return res.status(404).json({
                    message: 'Empty body.',
                    status: 404
                }).send("Finish")
            }
            else
                res.status(204).json({
                    message: `Post with id '${id}' successfully updated.`,
                    status: 204
                }).send("Finish")
        }
    })

    res.status(404).json({
        message: 'Post was not found',
        status: 404
    })
});

app.listen(8080, () => {
    console.log(`App running in 8080`)
});