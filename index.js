import express from 'express'
import fs from 'fs'
import { mapAndTransform } from './utils'
import routes from './routes'

const PORT = 3001;
const app = express();



fs.readFile("acronyms.json", { encoding: "UTF8" }, (err, data) => {
  if (err) throw err;
  const masterList = mapAndTransform(JSON.parse(data));
  routes(app, masterList);
});


// Server conf
const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${server.address().port}`);
});
