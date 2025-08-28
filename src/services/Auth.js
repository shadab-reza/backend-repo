const { jsonToken } =require( "../utils/TokenService");
const { info } =require( "console");

class AuthService {
  constructor() { }

  authenticate(req , res , next) {
    let infostring='Auth Success';
    try {

      let token = req.headers['authorization']?.split(' ')[1];
      // console.log(req.headers);
      // console.log(token);

      if (!token) {
        infostring='Not Authorized!'
        throw new Error();
      }

      let authRes = jsonToken.verifyToken(token);
      console.log(authRes.decode.user);

      if (authRes.tokenExp) {
        infostring='Not Authorized!'
        throw new Error();
      }
      next();
    } catch (err) {
      // console.log(err);      
      res.status(400).send({infostring});
    }

  }
}

 const authService = new AuthService()
 module.exports={
  authService
 }