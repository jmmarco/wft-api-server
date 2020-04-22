import express from "express";
import fs from "fs";
import { mapAndTransform } from "./utils";
import { syncAndPopulate }  from './dbConnector'
import routes from "./routes";


// Define port, app and file for Express
const PORT = process.env.PORT || 8080;
const app = express();
const file = "acronyms.json";

app.use(express.urlencoded({ extended: true })).use(express.json());

// Read the the data file
fs.readFile(file, { encoding: "utf8" }, (err, data) => {
  if (err) throw err;

  // Pass the transformed array to populate the DB
  syncAndPopulate(mapAndTransform(data));

  // Setup all routes
  routes(app);
});

// Server conf
const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${server.address().port}`);
});
