import express from 'express'
import fs from 'fs'
import { mapAndTransform } from './utils'

const PORT = 3001;
const app = express();

let masterList = null;

fs.readFile("acronyms.json", { encoding: "UTF8" }, (err, data) => {
  if (err) throw err;
  masterList = utils.mapAndTransform(JSON.parse(data));
});


// Server conf
const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${server.address().port}`);
});
