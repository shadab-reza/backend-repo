const bcrypt = require('bcryptjs');

class Encrypt {

    constructor() {
        this.salt=bcrypt.genSaltSync(10);
    }

    cryptPassword(password) {
        const hash = bcrypt.hashSync(password, this.salt);
        // console.log(hash);
        return hash;       
    }

    comparePassword(pwdText, hash) {
        let test=bcrypt.compareSync(pwdText, hash); 
        // console.log(test);
        return test;
    }
}

const encrypt = new Encrypt();
module.exports=encrypt;

// let hash=encrypt.encryptPwd('test');
// let assert=encrypt.comparePwd('test',hash);
// console.log(assert);
