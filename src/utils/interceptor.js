const clientService = require('../config/dbhook');
const { logrequest, log } = require('../utils/loggerutil');

const appMiddleware = (req, res, next) => {

    if (req.path === '/validate-license') {
        return next();
    }

    const appId = req.headers['x-app-id'] || req.query.appId;
    const userId = req.headers['x-user-id'] || req.query.userId;

    if (!appId || !userId) {
        return res.status(400).json({ error: 'Missing appId/userId' });
    }

    clientService(appId);
    next();

    const key = appId.slice(5);

    logrequest(`${'*'.repeat(6) + appId.slice(6)}-${userId}-${req.method}-${req.url}`, key);

};

const MAX_CONCURRENT = process.env.MAX_CONCURRENT;
const MAX_QUEUE = process.env.MAX_QUEUE; //  waiting + running =  max total

let activeRequests = 0;
const requestQueue = [];

function requestLimiter(req, res, next) {
    // Total in system = active + queued
    const totalInSystem = activeRequests + requestQueue.length;

    if (activeRequests < MAX_CONCURRENT) {
        // Below concurrency limit — process immediately
        handleRequest(req, res, next);
    } else if (requestQueue.length < MAX_QUEUE) {
        // Queue is not full — add to queue
        requestQueue.push(() => handleRequest(req, res, next));
    } else {
        // Too many total requests — reject with 503
        log(totalInSystem);
        res.status(503).send('Server too busy. Try again later.');
    }
}

function handleRequest(req, res, next) {
    activeRequests++;
    // When request completes, try to process next in queue
    res.on('finish', () => {
        activeRequests--;
        if (requestQueue.length > 0) {
            const nextQueued = requestQueue.shift();
            nextQueued();
        }
    });
    next(); // Pass control to next middleware or route
}

// const MAX_CONCURRENT_REQUESTS = 1000;
// let activeRequests = 0;
// const requestQueue = [];
// function queueMiddleware(req, res, next) {
//   const processRequest = () => {
//     activeRequests++;

//     // Hook into response end to release slot
//     res.on('finish', () => {
//       activeRequests--;

//       // If there's something in the queue, process the next one
//       if (requestQueue.length > 0) {
//         const nextReq = requestQueue.shift();
//         nextReq();
//       }
//     });

//     next(); // proceed to the next middleware/route handler
//   };

//   if (activeRequests < MAX_CONCURRENT_REQUESTS) {
//     processRequest();
//   } else {
//     // Too many active requests: enqueue the request
//     requestQueue.push(processRequest);
//   }
// }



module.exports = { appMiddleware, requestLimiter }