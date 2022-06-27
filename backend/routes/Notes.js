const express = require("express");
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require("../Schema/Notes");
const {body , validationResult} = require('express-validator');

router.get('/fetchallnotes', fetchuser , async(req , res)=>{
    try {
        const notes = await Notes.find({user:req.user.id});
        res.json(notes);
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})




//Create Note
router.post("/addnote", fetchuser ,[
    body('title').isLength({ min: 5 }),
    body('description').isLength({ min: 5 }),
], async (req , res)=>{
    const {title , description , tag} = req.body;
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const note = new Notes({
        title , description , tag, user:req.user.id
    })
    const savenote = await note.save();
    res.json(savenote);
})


///Update note
router.put('/updatenote/:id' , fetchuser ,async(req , res)=>{
    const {title , description , tag} = req.body;

    //Create a newNote object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag}


    //Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(401).send('Not Allowed')}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not \\")
    }
    note = await Notes.findByIdAndUpdate(req.params.id , {$set: newNote} , {new:true})
    res.json({note});

    })


    ///Delete Note
    router.delete("/deletenote/:id" ,fetchuser , async(req, res)=>{
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(401).send('Not Allowed')}
    
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not \\")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json("Delete successFully");
    
        })

module.exports = router;