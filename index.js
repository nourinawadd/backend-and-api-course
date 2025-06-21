const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.get("/", (req, res) => {
  res.send("Hello from the home route!");
});

app.get("/api/hello", (req, res) => {
  res.json({ greeting: "hello API" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

app.get("/api/:date?", (req, res) => {
  let dateParam = req.params.date;
  let date;

  if (!dateParam) {
    date = new Date();
  } else if (!isNaN(dateParam)) {
    date = new Date(parseInt(dateParam));
  } else {
    date = new Date(dateParam);
  }

  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString(),
  });
});
