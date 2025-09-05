const { pgClient } = require('./DBConfig');

function clientDbHook(client) {
  pgClient.initClient(client);
}

module.exports = clientDbHook


// function withMethodHook(ClassConstructor, hookFn) {
//   return new Proxy(ClassConstructor, {
//     construct(target, argsList, newTarget) {
//       const instance = Reflect.construct(target, argsList, newTarget);

//       return new Proxy(instance, {
//         get(target, prop, receiver) {
//           const value = Reflect.get(target, prop, receiver);

//           if (typeof value === 'function' && prop !== 'constructor') {
//             return function (...args) {
//               hookFn(prop, args); // Run the hook
//               return value.apply(this, args);
//             };
//           }

//           return value;
//         }
//       });
//     }
//   });
// }
// function globalMethodHook(methodName, args) {
//   console.log(`[HOOK] Method "${methodName}" called with:`);
// }
// const HookedService = withMethodHook(DbConfig, globalMethodHook);
// const service = new HookedService();
// module.exports = {
//     service
// }
