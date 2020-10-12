// Express app dependencies.
const koa = require('koa');
const json = require("koa-json");
const bodyParser = require("koa-bodyParser")


const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

// Koa middlewares { body-parser, cors, morgan... }
const app = new koa()

app.use(cors)
app.use(json())
app.use(bodyParser())

// Import API Routes.
const routes = require("./src/routes/index");
// Add routes as middleware.
app.use("/v1/api",routes);


// Port for Server
const port = process.env.PORT || 8000;

// Express Server 
app.listen(port, () => {
    console.log('Server listening at port %s', port);
  });
  