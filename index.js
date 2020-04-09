import express from 'express'
import fs from 'fs'

var utils = require("./utils");

const PORT = 3001;
const app = express();

let masterList = null;

fs.readFile("acronyms.json", { encoding: "UTF8" }, (err, data) => {
  if (err) throw err;
  masterList = utils.mapAndTransform(JSON.parse(data));
});

// --- GET Routes ----

// Complex search
// /acronym?from=50&limit=10&search=:search
app.get("/acronym?", (req, res) => {
  const { from, limit, search } = req.query

  if (parseInt(from) < 0 || parseInt(from) == 0 ) {
    return res.json({ "error": 'invalid '})
  }

  const results = utils.paginatedResults(masterList, from, limit, search)

  console.log('results is: ', results)

  res
  .status(200)
  .json(results)
  // .send(req.query)
})

// All acronyms
app.get("/acronyms/", (req, res) => {
  const buffer = utils.renderAcronyms(masterList);
  res.send(buffer);
});



// Single acronym
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

  res.status(200).json(acronymFound);
});

// Random amount of acronyms
app.get("/random/:count?", (req, res) => {
  const { count } = req.params;

  const result = utils.randomAcronyms(masterList, count);
  const buffer = utils.renderAcronyms(result);

  res.status(200).send(`Count is ${count} and result is: ${buffer}`);
});

// Non matching routes return 404 by default
app.get("*", (req, res) => {
  res.sendStatus(404);
});

// Server conf
const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${server.address().port}`);
});
