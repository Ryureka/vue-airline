const GuideService = require('../../../models/guideservice')
const Tag = require('../../../models/tag')
const Review = require('../../../models/review')
const User = require('../../../models/user')

exports.findReview = (req, res) => {
  console.log('findReview');
    GuideService.findOne({ _id : req.params.id })
      .populate('reviews')
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
};

exports.deleteGuideService = (req,res) =>{
  console.log(req)
  const respond=()=>{
    res.json({
      message:"delete GuideService OK"
    })
  }

  const onError = (error) => {
      res.status(403).json({
          message: error.message
      })
  }
  GuideService.deleteByTitle(req.params,req.params.title)
  .then(respond)
  .then(onError)
}

exports.updateGuideService = (req, res) => {
    GuideService.findOne({user:req.params.user,title:req.params.title}, (err,guideservice) => {
        if (guideservice) {
              console.log(guideservice)
              let id=guideservice._id
              GuideService.update({ _id: id }, { $set: req.body }, function(err, output){
                  if(err) res.status(500).json({ error: 'database failure' });
                  console.log(output);
                  if(!output.n) return res.status(404).json({ error: 'guideservice not found' });
                  res.json( { message: 'guideservice updated' } );
              })
          if(err) res.status(500).json({err})
        }
        if(err) res.status(500).json({err})
      })
}

exports.findGSAll=(req,res)=>{
  GuideService.find()
  .populate({path:'tags',model:Tag})
  .populate({path:'reviews',model:Review})
  .populate({path:'user',model:User,select:'-password'})
  .then((result) => {
    res.json(result);
  })
  .catch((error) => {
    res.status(500).json({ error:error });
  });
}

exports.SearchGS=(req,res)=>{
  const keyword = req.params.keyword
  console.log(keyword);
  GuideService.find()
  .or([{city_eng: { $regex: '.*' + keyword + '.*' }},
      {city_kor: { $regex: '.*' + keyword + '.*' }},
      {nation_eng: { $regex: '.*' + keyword + '.*' }},
      {nation_kor: { $regex: '.*' + keyword + '.*' }}])
  .then(
      guideservices => {
          console.log(guideservices);
          res.json({guideservices})
      }
  )
  // res.json({message:'message'})
}

exports.findGSById=(req,res)=>{
  console.log(req.params);
  GuideService.findOne({_id:req.params.id})
  .then((result) => {
    res.json(result);
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
}

exports.findGSByUserObIdTitle = (req,res)=>{
  const onError = (error) => {
      res.status(403).json({
          message: error.message
      })
  }
  console.log('findGSByUserObIdTitle');
  GuideService.findGSByUserObIdTitle(req.params.userObId,req.params.title)
  .then(
      guideservice => {
          res.json(guideservice)
      }
  )
  .catch(onError)
}


exports.createGuideService = (req,res) =>{
  console.log(req.body);
  tagsName=req.body.tags;
  req.body.tags=[];
  console.log(tagsName);
  console.log(req.body.tags);
  var GS=new GuideService(req.body);
  let guideserviceId=GS._id
  GS.save(err => {
    for (var i = 0; i < tagsName.length; i++) {
      const tag = new Tag({tag:tagsName[i]})
      tag.guideservice=GS._id
      console.log(tag);
      tag.save()
        .then((result) => {
          GuideService.findOne({_id:guideserviceId}, (err, guideservice) => {
            console.log(tag);
              if(err) res.status(500).json({err})
              if (guideservice) {
                  guideservice.tags.push(tag);
                  guideservice.save();
              }
          });
        })
    }
    if (err) res.status(500).send(err);
    res.json(GS);
  })
}
