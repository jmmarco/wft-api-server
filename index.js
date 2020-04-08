const express = require("express");
const fs = require("fs");
var utils = require('./utils')


const PORT = 3001;
const app = express();

let masterList = null;

fs.readFile("acronyms.json", { encoding: "UTF8" }, (err, data) => {
  if (err) throw err;

  masterList = utils.mapAndTransform(JSON.parse(data));
});



// GET Routes
app.get("/acronyms/", (req, res) => {
  const buffer = utils.renderAcronyms(masterList)
  res.send(buffer);
});

app.get("/acronym/:acronym", (req, res) => {
  const { acronym } = req.params;

  const acronymFound = masterList.find(
    (item) => item.acronym === acronym.toUpperCase()
  );

  let response = null;

  if (acronymFound) {
    response = `acronym entered is ${JSON.stringify(acronymFound)}`;
  } else {
    response = `Nothing found for entry ${req.params.acronym}`;
  }

  res.status(200).send(response);
});


app.get("/random/:count?", (req, res) => {
  // console.log(req.param)
  const { count } = req.params

  const result = utils.randomAcronyms(masterList, count)

  const buffer = utils.renderAcronyms(result)

  res.status(200)
  .send(`Count is ${count} and result is: ${buffer}`)
})

app.get("*", (req, res) => {
  res.sendStatus(404);
});



// Server conf
const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${server.address().port}`);
});
