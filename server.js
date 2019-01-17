const express = require('express');
const fs = require('fs')
const hbs = require('hbs')

const port = process.env.PORT || 3000; //port for our app which heroku will use for the app 

var app = express();


// import an express.js view ebngine for handlebars.js
hbs.registerPartials(__dirname + '/views/partials')

//set the view engine to handlebars
app.set('view engine', 'hbs');

//make express use some built-in middleware (app.use)
//if this is present, we are in maintenance mode

// app.use((req, res, next) => {
//     res.render('maintenance.hbs')
// })

//we use middleware below to make a timestamp, and 
//pull info from the request object - which contains all info
//about the request, the method, the device used etc. 
app.use((request, response, next) => {
    var now = new Date().toString();
    var log = (`${now}: ${request.method} ${request.url}`);
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) =>{
        if (err){
            console.log('Unable to append to server.log')
        }
    });

    next();
})

//__dirname is the name of the parent directory, so we concatenate this with /public 
app.use(express.static(__dirname + '/public'))



hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
})

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})

// set up a handler for a http get request
// takes 2 arguments- the url, and what to send to the person who made the request
// the 2nd argument (the fucntion) takes 2 very important arguments itself, the request and the results
// req stores a bunch of info about the request coming in, the headers used, and body info, the method used for the request, the path
// res lets you cutomize what data is sent back 

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to the home page',
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    })
})

//bad route - when a request fails - send back json data with error message property- error handling this request
app.get('/bad', (req, res) => {
    res.send({
        error: 'Error handling request'
    });
});


//app.listen takes 2 arguments, the port to listen to, and a function
app.listen(port, () => {
    console.log(`server is up on port ${port}`)
});