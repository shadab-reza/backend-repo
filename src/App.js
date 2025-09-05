const express = require('express')
const { routes } = require("./AppRoutes");
const cors = require('cors');
const {appMiddleware,requestLimiter} = require('./utils/interceptor');


const App = express();

App.use(cors({
  origin: '*'
}))

App.get('/', (req, res) => {
  res.sendFile('index.html', { root: './' });
});

App.get('/home', (req, res) => {
  res.sendFile('home.html', { root: './' });
});

App.get('/v1', (req, res) => {
  res.sendFile('indexv1.html', { root: './' });
});

App.use(express.json());
App.use(express.urlencoded({ extended: true }));

// Use the middleware
App.use(requestLimiter);
App.use(appMiddleware);

App.use(routes)

module.exports = {
  App
}

