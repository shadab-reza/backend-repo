const Jwt =require('jsonwebtoken');
const fs =require('fs');
const env =require('dotenv');
const path=require('path');


env.config();

class JsonToken {

    issuer = 'madarsa';          // Issuer 
    audience = 'http://madarsa.in'; // Audience
    maxAge = '24h'
     algorithm = 'RS256'
    PASSKEY=process.env.PASSKEY||'';
     privateKey = fs.readFileSync(path.resolve('resources/jwtRS256.key'), 'utf8');

    constructor() {}
    generateToken(data) {
        // console.log(PASSKEY);
        const token = Jwt.sign(data, { passphrase: `${this.PASSKEY}`, key: this.privateKey },{ issuer: this.issuer, subject: data.user, audience: this.audience, algorithm: `${this.algorithm}`, expiresIn: this.maxAge });
        return token;
    }

    verifyToken(token) {
        const userToken  = Jwt.verify(
            token,
            this.privateKey,
            { issuer: this.issuer, algorithms:[`${this.algorithm}`], maxAge:`${this.maxAge}`},
            (err, decode) => {
                if (err) {
                    return { tokenExp: true, error: err };
                }
                return { tokenExp: false, decode };
            },
        );
        // console.log(userToken);
        
       return userToken;
    }
}

const jsonToken = new JsonToken()

module.exports={
    jsonToken
}