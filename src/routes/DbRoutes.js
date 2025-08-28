const express = require('express');
const dbservice = require('../services/dbservice');

const secureRoutes = express.Router();

secureRoutes.post("/execute", async (req, res) => {
    const query=req.body.query;
    console.log(req.body);
    
    let result={"info":"bad request"};
    if(query){
        result = await dbservice.execute(query);
    }
    res.status(400).send(result)
});


module.exports = {
    secureRoutes
}