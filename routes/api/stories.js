const express = require("express");
const router = express.Router();
const Joi = require('joi');
const Story = require("../../models/Story");

router.get('/',async(req,res)=>{
  const stories = await Story.find();
  res.send(stories);
});

router.post("/", async(req, res) => {
    // Form validation
    const {error} = validateStory(req.body);
    // Check validation
    if (error) {
      console.log("This",error);
     return res.status(400).json(error);
    }
    let story=await Story.findOne({ title: req.body.title });
      if (story) return res.status(400).json({ title: "Title already exists" });
        story = new Story({
          title: req.body.title,
          content:req.body.content,
          date: (new Date()).getDate() +"-"+ ((new Date()).getMonth()+1) +"-"+ (new Date()).getFullYear(),
        });

        await story.save();
      
        res.status(200).send(story);
});    

router.put('/:id',async(req,res)=>{
  const story = await Story.findById(req.params.id);
  if(!story) return;

  story.totalViews = req.body.totalViews;
  const result = await story.save();
  console.log(result);
})

function validateStory(req){
    const schema = {
        title:Joi.string(),
        content:Joi.string()
    }
    return Joi.validate(req,schema);
}

module.exports = router;