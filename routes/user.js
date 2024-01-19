const {Router}= require('express');
const User = require('../models/user');

const router = Router();

router.get('/signin', (req, res) => {    
   return res.render('signin');
});

router.get('/signup', (req, res) => {    
   return res.render('signup');
});

router.post('/signin', async function (req, res)  {    
    try {
        const {email,password}= req.body;
    const token = await User.matchPasswordAndGenerateToken(email,password)
    
    return res.cookie('token',token).redirect('/');
    } catch (error) {
        res.render('signin',{error:"Invalid email or password"});
    }
});


router.post('/signup', async (req, res) => {  
    const {firstName,email,password}= req.body;
    await User.create({
        firstName,
        email,
        password,
    });
    return res.redirect('/');
}); 

router.get('/logout', (req, res) => {    
    return res.clearCookie('token').redirect('/');
 }); 

module.exports = router;
