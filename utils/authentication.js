const JWT = require('jsonwebtoken');
const secret = "your-secrect-key";


function createUserToken(user) {

    const payload = {
        id: user._id,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role

    }
    const token = JWT.sign(payload, secret);
    return token;
}

function validateToken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}

module.exports = {  createUserToken,validateToken };
