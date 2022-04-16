// Import express
const express = require("express");
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' });
var urlencodedParser = bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoded' })
const session = require("express-session");
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();
const fs = require("fs")
var cookieParser = require('cookie-parser');
// Middleware to make the `user` object available for all views
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
const origin = ['http://localhost:3000', 'http://localhost:5000','https://nodogoro-ecommerce.herokuapp.com']
if (process.env.NODE_ENV === 'development') {
  origin.push('http://localhost:3000')
  origin.push('http://localhost:5000')
}
app.use(cors({
  origin: origin,
  credentials: true,
  optionSuccessStatus: 200
}));

//Require Route Handlers
//configuring APIs
const stripeWebhooks = require('./webhooks/stripeWebHooks')
//we have to configure the webhook before using bodyParserMiddleware since it parses the body of all requests which is not what we want for the stripe webhook
app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhooks);
app.use(bodyParser.json({ limit: '50mb' }))
const onlinePayments = require("./routes/api/onlinePayments");
const orders = require('./routes/api/orders');
const users = require('./routes/api/users');
app.use(express.json());
app.use("/api/orders", orders)
app.use("/api/users", users)
app.use("/api/onlinePayments", onlinePayments)



//Getting Mongo's connection URI
const db = process.env.MONGODB_URI;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//Connecting to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

//production mode

const indexPath = path.resolve(__dirname, '../client', 'build', 'index.html');
app.all('/', function (req, res) {
  res.redirect("/MyOrders");
});
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'));
  // Homepage
  app.get("*", (req, res) => {
    const pathArr = req.path.split("/");
    fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
      if (err) {
        console.error('Error during file reading', err);
        return res.status(404).end()
      }
      return res.send(htmlData);
    });

  }
  );
}
app.get('/', (req, res) => res.send('Homepage'));


app.use((req, res, next) => {
  res.status(404).send({ error: "sorry can't find that!" });
})
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({ error: 'something broke!' });
})

//app.use('/static', express.static(path.join(__dirname, 'public')))


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
