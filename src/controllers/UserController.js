const { userService } =require('../services/UserService');

class UserController {

    async login(req , res ) {
        console.log(req.body);
        
        let result = await userService.loginService(req.body);
        console.log(result);
        res.status(result.status).send(result);
    }

    async userLogin(req , res ) {
        let result = await userService.userLoginService(req.body);
        // console.log(result);
        res.status(result.status).send(result);
    }

    async addUser(req , res ) {
        console.log(req.body);
        
        let status = await userService.addUser(req.body);
        res.send(status);
    }

    async updateUserInfo(req , res ) {
        let Users = await userService.updateUser(req.body);
        res.send(Users);
    }
    
    async getUsers(req , res ) {
        let response = await userService.getUsers({ page: req.query.page || 1,size: req.query.size || 10 });
        res.status(response.status).send(response);
    }

    async getUserByIdName(req , res ) {
        let response = await userService.getUserByIdName({ size: req.query.size || 3 });
        res.status(response.status).send(response.data);
    }

     async getUserWithIdName(req , res ) {
        let response = await userService.getUserWithIdName();
        res.status(response.status).send(response.data);
    }

    async deleteUser(req , res ) {
        let result = await userService.deleteUser(req.body);
        // console.log(result);
        res.status(result.status).send(result);
    }

    async updateDb(req , res ) {
        // console.log(req.body);
        let result = await userService.executeQuery(req.body);
        res.send(result);
    }
}

const userController = new UserController();

module.exports={
    userController
}