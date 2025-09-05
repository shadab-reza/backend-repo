// config.js
// const generatedCodes = new Set();

// function generateUniqueAlphanumericCode(length = 10) {
//   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let code;

//   do {
//     code = '';
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * chars.length);
//       code += chars[randomIndex];
//     }
//   } while (generatedCodes.has(code));

//   generatedCodes.add(code);
//   return code;
// }
// Example usage:
// const code1 = generateUniqueAlphanumericCode();
// console.log('Code 1:', code1);

// const code2 = generateUniqueAlphanumericCode();
// console.log('Code 2:', code2);

// const code3 = generateUniqueAlphanumericCode();
// console.log('Code 3:', code3);

// Setting up pool for appid: MASTERSHAD
// Setting up pool for appid: 1STB1tNfUx
// Setting up pool for appid: PNozKFxWwz



module.exports = {
  demoapp: {
    appid: 'DEMOAPPKEY',
    config: {
      user: process.env.user,
      host: process.env.host,
      database: process.env.database,
      password: process.env.password,
      port: process.env.dbport
    }
  },
   app1: {
    appid: '1STB1tNfUx',
    config: {
      user: 'postgres',
      host: 'localhost',
      database: 'appdb1',
      password: 'admin',
      port: 5432
    }
  },
   app2: {
    appid: 'PNozKFxWwz',
    config: {
      user: 'postgres',
      host: 'localhost',
      database: 'appdb2',
      password: 'admin',
      port: 5432
    }
  }
};
