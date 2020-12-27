const express = require('express');
const {Header} = require('../../model/General/header');
const {Press, validateInput} = require('../../model/resource/press');
const {Report} = require('../../model/resource/report');
const {Blog} = require('../../model/resource/blog');
const {Subscribe} = require('../../model/General/subscribe');
const {  DownloaderHelper } = require('node-downloader-helper')
const router = express.Router();
const multer = require('multer');
const upload_ = multer({dest : 'public/images/uploads/general'});
const upload_press = multer({dest : 'public/images/uploads/press'});
const upload_report_file = multer({dest : 'public/images/uploads/report'});
const upload_blog = multer({dest : 'public/images/uploads/blog'});
const path = require('path')




/* GET Resource press page. */
router.get('/resource/press',  async function(req, res, next) {
       

    let search = req.query.search;
    console.log("getting error", search);


    const header = await Header.find()
    if(!header) return res.status(404).send("NO Header image");
    let press
    if(search){
    press = await Press.find({title : {$regex: `${search}`, $options: 'i'}});
      if(press.length === 0) {
        req.flash('success', "Press Article Not found")
        press = await Press.find();
      }
    }else{
      press = await Press.find();
    }
     
  
     
    if(!press) return res.status(404).send("No Press articles available");
    


    res.render('resource/press', { 
        title: 'Resources',
        header,
        presses:press
      });
});

router.get('/resource/press/:id',  async function(req, res, next) {
       
  const article = await Press.findOne({_id: req.params.id});
  if(!article) return res.status(404).send("This article is not available");

  res.render('resource/pressdetail', { 
      title: 'Resources',
      article
    });
});

router.get('/resource/blog/:id',  async function(req, res, next) {
     //using same variable press here in order to use thesame detail template  
  const article = await Blog.findOne({_id: req.params.id});
  if(!article) return res.status(404).send("This article is not available");

  res.render('resource/blogdetail', { 
      title: 'Resources',
      article
    });
});
/* GET Resource report page. */
router.get('/resource/report',  async function(req, res, next) {
       
   
  let search = req.query.search;

  const header = await Header.find()
  if(!header) return res.status(404).send("NO Header image");

  let report
  if(search){
    report = await Report.find({title : {$regex: `${search}`, $options: 'i'}});
    if(press.length === 0) {
      req.flash('success', "Report Not found")
      report = await Report.find();
    }
  }else{
    report = await Report.find();
  }
   

   
  if(!report) return res.status(404).send("No report available");
  


  res.render('resource/report', { 
      title: 'Resources',
      header,
      reports:report
    });
});
/* GET Resource blog page. */
router.get('/resource/blog',  async function(req, res, next) {
       
    const header = await Header.find()
   
    if(!header) return res.status(404).send("NO Header image");

    const blog = await Blog.find();
    if(!blog) return res.status(404).send("No report available");

    res.render('resource/blog', { 
        title: 'Resources',
        header,
        blogs:blog
      });
});

/** Report download*/

router.post('/resource/report/download/:id', async(req, res, next)=>{

  const homePath =  path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/')




   console.log("From yusuf", homePath);
  let report = await Report.findOne({_id:req.params.id});
 
       if(!report){
           req.flash('error', "Report not available for download") 
           res.location('/resource/report/');
           res.redirect('/resource/report/');
       }

  
      // these are the default options
       const options = {
           method: 'GET', // Request Method Verb
           // Custom HTTP Header ex: Authorization, User-Agent
           headers: {"Content-Type" : "application/octet-stream"},
           retry: false,
           fileName: {name: report.title, ext: "pdf"}, 
           override: { skip: true, skipSmaller: true },
           forceResume: false, // If the server does not return the "accept-ranges" header but it does support it
           removeOnStop: true, // remove the file when is stopped (default:true)
           removeOnFail: true, // remove the file when fail (default:true)    
           httpRequestOptions: {}, // Override the http request options  
           httpsRequestOptions: {} // Override the https request options, ex: to add SSL Certs
       };   

    const dl = new DownloaderHelper(report.filename, homePath, options);
    dl
      .on('end', downloadInfo =>{
        req.flash('success', 'Download Completed')
        res.location('/resource/report/');
        res.redirect('/resource/report/');
        console.log('Download Completed', downloadInfo);
      })
      .on('skip', skipInfo => {
        req.flash('success', 'Download skipped. File already exists')
        res.location('/resource/report/');
        res.redirect('/resource/report/');
        console.log('Download Completed', skipInfo);
      })
      .on('error', err => {
        req.flash('error', 'Failed to download. Please check your network')
        res.location('/resource/report/');
        res.redirect('/resource/report/');
        console.log('Download Completed', err);
      }) 
      dl.start(); 
 
 });


/* Administrator section */
/* GET Administrator Resourcepage. */
router.get('/administrator/resources',  function(req, res, next) {

    res.render('admin/resource', { 
        title: 'Resource'
      });
});

router.post('/administrator/upload/press',  upload_press.single('photo'), async(req, res, next)=>{

  let  mainImageName
  if(req.file){
      mainImageName                = req.file.filename;
  }else{
   console.log('Not uploading photo...');
   mainImageName = 'noimage.png';
  }

  //setting the name of the image
  req.body.photo = `${req.protocol}://${req.headers.host}/images/uploads/press/${mainImageName}`; 
 

  req.body.url = `${req.protocol}://${req.headers.host}`;
  const press = new Press(req.body);

  if(!press) {
       req.flash('error', "Failed Add new press artitcle")
      return res.status(400).render('admin/resource', {
       data: req.body
     })
   }

   await press.save();
   req.flash('success', 'New Press artitle added');
   res.location('/administrator/resources');
   res.redirect('/administrator/resources');

})

//Blog post upload
router.post('/administrator/upload/blog',  upload_blog.single('photo'), async(req, res, next)=>{

  let  mainImageName
  if(req.file){
      mainImageName                = req.file.filename;
  }else{
   console.log('Not uploading photo...');
   mainImageName = 'noimage.png';
  }

  //setting the name of the image
  req.body.photo = `${req.protocol}://${req.headers.host}/images/uploads/blog/${mainImageName}`; 
 

  req.body.url = `${req.protocol}://${req.headers.host}`;
  const blog = new Blog(req.body);

  if(!blog) {
       req.flash('error', "Failed Add new Blog artitcle")
      return res.status(400).render('admin/resource', {
       data: req.body
     })
   }

   await blog.save();
   req.flash('success', 'New Blog artitle added');
   res.location('/administrator/resources');
   res.redirect('/administrator/resources');

})

//Press comment sections
router.post('/press/addcomment', async(req, res, next)=>{




  let comment ={
    name: req.body.name,
    email: req.body.email,
    commentBody: req.body.commentBody
  }

   let pressComments = await Press.findOneAndUpdate({_id:req.body.commentid},
    {  
        $push:{
          "comments": comment 
      }   

   },{new:true}) 
  

  if(!pressComments) {
    req.flash('error', "Failed to Add comments")
    return res.status(400).render('resource/detail', {
    data: req.body
  })
}

  req.flash('success', 'Your comment is added');
  res.location(`/resource/press/${req.body.commentid}`);
  res.redirect(`/resource/press/${req.body.commentid}`);

});

//Blog comment section
router.post('/blog/addcomment', async(req, res, next)=>{


  let comment ={
    name: req.body.name,
    email: req.body.email,
    commentBody: req.body.commentBody
  }

   let blogComments = await Blog.findOneAndUpdate({_id:req.body.commentid},
    {  
        $push:{
          "comments": comment 
      }   

   },{new:true}) 
  

  if(!blogComments) {
    req.flash('error', "Failed to Add comments")
    return res.status(400).render('resource/detail', {
    data: req.body
  })
}

  req.flash('success', 'Your comment is added');
  res.location(`/resource/blog/${req.body.commentid}`);
  res.redirect(`/resource/blog/${req.body.commentid}`);

});

/** Subscriptions */

router.post('/subscription', async(req, res, next)=>{


 let subscribe = await Subscribe.findOne({email:req.body.email});

      if(subscribe){
          req.flash('error', "Your are already subscribed to our platform") 
          res.location(req.body.urlpath);
          res.redirect( req.body.urlpath);
      }

      subscribe = new Subscribe(req.body);

  if(!subscribe)  return res.status(400).send("failed to save subscription");


      await subscribe.save();
      req.flash('success', 'Thank you for subscribing to our platform');
      res.location(req.body.urlpath);
      res.redirect( req.body.urlpath);


});


router.post('/administrator/upload/report',  upload_report_file.fields([{name:'filename', maxCount: 1},{name:'photo', maxCount: 1}]), async(req, res, next)=>{
  

  let  coverImage, FileData
  if(req.files){
    coverImage                = req.files.photo[0].filename;
    FileData                  = req.files.filename[0].filename;
  }else{
   console.log('Not uploading file...');
  }


    //setting the name of the image
    req.body.photo = `${req.protocol}://${req.headers.host}/images/uploads/report/${coverImage}`;
    req.body.filename = `${req.protocol}://${req.headers.host}/images/uploads/report/${FileData}`; 
 


    const report = new Report(req.body);
  
    if(!report) {
         req.flash('error', "Failed Add new Report ")
        return res.status(400).render('admin/resource', {
         data: req.body
       })
     }
  
     await report.save();
     req.flash('success', 'New Report added');
     res.location('/administrator/resources');
     res.redirect('/administrator/resources');

})
module.exports = router