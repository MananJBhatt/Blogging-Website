const { Router } = require('express');
const multer = require('multer');
const Blog = require('../models/blog');
const path = require('path');
const Comment = require('../models/comment');
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);

    }
  });

const upload = multer({ storage: storage })


router.get('/add-new-blog', (req, res) => {
    console.log(req.user);
    return res.render('addNewBlog', {
        user: req.user
    });
});

router.post('/',upload.single('coverImage') ,async (req, res) => { 
    const {title,body}=req.body;
    console.log(req.user.id);
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user.id,
        coverImageURL:`/uploads/${req.file.filename}`,
    });  
     res.redirect(`/blog/${blog._id}`);
});

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
    return res.render('blog', {
        user: req.user,
        blog,
        comments,
    });
});

router.post('/comment/:blogId', async (req, res) => {
    await Comment.create({
        content: req.body.content,
        createdBy: req.user.id,
        blogId: req.params.blogId,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
