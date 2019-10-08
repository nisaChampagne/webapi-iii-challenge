const express = require('express');
const USER = require('./userDb')
const Post = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    const { name } = req.body
    USER.insert({ name })
     .then(user => {
         res.status(201).json(user)
     })
     .catch(err => {
         console.log(err)
         res.status(500).json({ error: " error inserting user"})
     })
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
    const post = req.body
    Post.insert(post)
    .then(post => {
        res.status(201).json(post)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: "Error adding Post"})
    })
});

router.get('/', (req, res) => {
  USER.get()
    .then(users =>{
        res.status(200).json(users)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: "Error getting users"})
    })
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user);
    // const { id } = req.params;
    // User.getById(id)
    //   .then(user => {
    //     if (user) {
    //       res.status(200).json(user);
    //     } else {
    //       res.status(404).json({error: "User with id does not exist"});
    //     }
    //   });
  });

router.get('/:id/posts', validateUserId, (req, res) => {
    const { id }= req.params
    USER.getUserPosts(id)
        .then(posts => res.status(200).json(posts))
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "error getting user posts"})
        })
});

router.delete('/:id', validateUserId, (req, res) => {
    const { id } =req.user
    USER.remove(id)
    .then(()=>{
        res.status(204).end()
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: "Error deleting User"})
    })
});

router.put('/:id', validateUserId, (req, res) => {
 const { id } = req.params
 const { name } = req.body
    USER.update(id, {name} )
       .then(updated => {
           if(updated){
            USER.getById(id)
            .then(user => res.status(200).json(user))
            .catch(err => {
                console.log(err)
                res.status(500).json({error: "Error getting User"})
            })
           }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "Error getting updated user"})
        })
    });

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params
    USER.getById(id)
     .then(user => {
         if (user){
            req.user = user
            next();
         }else {
             res.status(404).json({ error: "User with id does not exist"})
         }
     })
};

function validateUser(req, res, next) {
    const { name }= req.body
    if(!name){
        return res.status(400).json({ error: "Name required"})
    }
    if (typeof name !== "string"){
        return res.status(400).json({ eror: "Name must be a string"})
    }
    next();
};

function validatePost(req, res, next) {
    const { id: user_id} = req.params
    const { text } = req.body

    if (!req.body){
        return res.status(400).json({error: "Post requires Body"})
    }
    if (!text){
        return res.status(400).json({error: "Post requires text"})
    }
    req.body = { user_id, text}
    next()
};

module.exports = router;