// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// Timestamp Microservice endpoint
app.get("/api/:date?", (req, res) => {
  let dateParam = req.params.date;

  let date;

  // Check if dateParam is undefined (empty param)
  if (!dateParam) {
    date = new Date();
  } else if (!isNaN(dateParam)) {
    // It's a Unix timestamp (in milliseconds or seconds)
    // If it's 13 digits, assume milliseconds. If 10, convert from seconds.
    const timestamp = dateParam.length === 13 ? parseInt(dateParam) : parseInt(dateParam) * 1000;
    date = new Date(timestamp);
  } else {
    // Try parsing it as a date string
    date = new Date(dateParam);
  }

  // Invalid date check
  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  // Valid response
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});




// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
