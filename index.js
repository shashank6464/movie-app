// Creating the server for all APIs
// Routing Url APIs,{Get,Post,Delete etc}
// Configuring middleware ==> example: app.use
const express = require("express")

// Get the method(Get/Post/Delete etc) log from client side
const logger = require("morgan")

// from request body json it will extract data from it.
const bodyParser = require("body-parser")

// Connecting the mongoDb database
const mongoose = require("mongoose")

// Only verifing the token...
const jwt = require("jsonwebtoken")

// import routes for Users
const userRoutes = require("./Routes/routesUsers")

// import routes for Movies
const moviesRoutes = require("./Routes/routesMovies")



// Initializing the (Server)
const app = express();

// configuraing the middleware for morgan logger and body-parser
app.use(logger('dev'))

//  convert into json format
app.use(bodyParser.json())


// start server at port: 8081
var PORT = 3000;
app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});

// Default Route ()
app.get("/",(req,res) => {
    res.send("<h2>   Welcome To                   </h2>"+
            " <h1>   movie - app              </h1>"+
            " <h2>                </h2>");
})

// connecting to a databse with mongoose library (mongoose.connect())
const uri = "mongodb+srv://shashank:12345@cluster0.dmji71d.mongodb.net/node_jwt?retryWrites=true&w=majority"
mongoose.connect(
    uri,{
        useNewUrlParser:true
    }).then( () => {
        console.log("Database Connected");

    }).catch(
        (err)=>{
            console.log(err);
        }
    )


// Setting a secret key with random string for jwt initial token
app.set("secret_key","qwertyuiop")



// make a function for GetAllMovies Api call to restrict unAuthorized user.
const userValidation = (req, res, next) => {
    jwt.verify(req.headers["x-access-token"],req.app.get('secret_key'),(error,decoded) => {
            if(error) { next(error);  }
            next();
    })
}


// Default path for User routes/Controller
app.use("/users",userRoutes);
app.use("/movies",userValidation,moviesRoutes);