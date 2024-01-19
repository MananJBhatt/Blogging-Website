const {createHmac, randomBytes} = require('node:crypto');
const crypto = require('crypto');
const { Schema, model } = require('mongoose');
const { createUserToken } = require('../utils/authentication');
const  userSchema  = new Schema({

    firstName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
        
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: '/images/default.png'
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
}, { timestamps: true });

userSchema.pre("save", function (next) {   
    
    const user = this;
    
    if (!user.isModified("password")) return ;


    const salt= randomBytes(16).toString();
    const hashedpassword = createHmac("sha256",salt)
    .update(user.password)
    .digest("hex");

    this.salt=salt;
    this.password=hashedpassword;
    
    next();
});

userSchema.static('matchPasswordAndGenerateToken', async function (email,password){
    // const user = await this.findOne({email});
    // console.log('User',user)    

    // if(!user) throw new Error('User not found');

    // const salt = user.salt;
    // const hashedpassword = user.password;


    // const userHash =crypto.createHmac('sha256',salt)
    // .update(user.password)
    // .digest('hex');
    const user = await this.findOne({email});
    // console.log('User', user)    

    if (!user) throw new Error('User not found');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userHash = crypto.createHmac('sha256', salt)
        .update(password)
        .digest('hex');


    // console.log(userHash);
    // console.log(hashedPassword);

    if(userHash !== hashedPassword) throw new Error('Invalid password');

    const token = createUserToken(user);
    return token;
})

const user = model('user', userSchema);

module.exports = user;
