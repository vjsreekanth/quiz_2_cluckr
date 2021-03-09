const express = require('express')
const app = express()
const knex = require('./db/client')
const logger = require('morgan')
app.use(logger('dev'))
app.set("view engine", "ejs")
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))
const cookieParser = require('cookie-parser')
const { request } = require('express')
const { response } = require('express')
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))



const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30;

app.use((request, response, next) => {
  // Read cookies from "request.cookies". It is available when "cookie-parser"
  // middleware is used (use "cookie-parser" middleware before this middleware).
  // It's an object with key/value pairs of each cookie coming from the request.
  const { username } = request.cookies

  // Set properties on "response.locals" to create variables that are global
  // to all of our rendered templates including any partial views. The following 
  // line means that a variable named "username" will be availabe in all of our views.
  response.locals.username = username

  // The third argument in this middleware function is a callback usually named "next".
  // If the middleware doesn't terminate the response (e.g. response.send, response.render),
  // we should invoke next() to tell Express that this middleware has completed and to 
  // move on to the next middleware in the pipeline. Otherwise our request will hang.
  next()
})

// to show home page
app.get('/',(req, res)=>{
  res.render('welcome')
})

// to render cluck entry form
app.get('/newCluck', (req, res)=>{
  res.render('newCluck')

})

//to view index page
app.get('/clucks', (req, res)=>{
  knex
		('clucks')
    .orderBy('created_at', 'DESC')
		.then(clucks => {
			// array of objects
			console.table(clucks);


  res.render('index', { clucks })

  });
});



// Sign In
app.post('/sign_in', (req, res)=>{
  
  const { username } = req.body
  res.cookie("username", username, { maxAge: COOKIE_MAX_AGE })
  
  res.redirect('/')
})

// Sign Out
app.post('/sign_out', (request, response) => {
  // Deletes the cookie named 'username'
  response.clearCookie('username')
  response.redirect('/')
})

app.post('/clucks', (req, res)=>{
  console.log(req.body.content)
  const content = req.body.content
  const image_url = req.body.image_url
  const username = req.cookies.username || 'Anonymous'

  knex('clucks')
    .insert({
      image_url,
      username,
      content,
    }, "*") // 2nd arg of "*" outputs an array of objects representing the rows that we inserted
    .then((clucks) => {
      console.table(clucks)
      // This path is from the host, not /articles
      // It allows us to redirect to other routers
      res.redirect('/clucks') 
    });

});









const PORT = process.env.PORT || 5000
const ADDRESS = 'localhost' 

app.listen(PORT, ADDRESS, () => {
    console.log(`Server listenning on http://${ADDRESS}:${PORT}`)
  })