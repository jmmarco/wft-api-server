const express = require("express");
const fs = require("fs");

const PORT = 3001;
const app = express();

function mapAndTransform(arr) {
  // console.log('fired', arr)
  return arr.map((acr) => {
    const entry = Object.entries(acr)[0];
    return {
      acronym: entry[0],
      translation: entry[1],
    };
  });
}

let masterList = null;

fs.readFile("acronyms.json", { encoding: "UTF8" }, (err, data) => {
  if (err) throw err;

  masterList = mapAndTransform(JSON.parse(data));
});

app.get("/acronyms/", (req, res) => {
  let buffer = "";

  masterList.forEach((acr) => {
    buffer += `<p>${JSON.stringify(acr)}</p>`;
  });

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

app.get("*", (req, res) => {
  res.sendStatus(404);
});

const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${server.address().port}`);
});
