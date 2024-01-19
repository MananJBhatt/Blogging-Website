require('dotenv').config();
const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const path = require('path');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const checkForAuthenticationCookie = require('./middlewares/authentication');
const Blog = require('./models/blog');
const User = require('./models/user');

mongoose.connect(process.env.MONGO_URL).then((e) => { console.log('Connected to DB') });


app.set('view engine', 'ejs');


app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    if(req.user){
        const user = await User.findById(req.user.id);
        res.render('home',{
            name:user.firstName,
            user:req.user,
            blogs:allBlogs,
        });
    }else{
        res.render('home',{
            user:null,
            blogs:allBlogs,
        });
    }
    
});

app.use('/user', userRoute);
app.use('/blog', blogRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
