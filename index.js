import express from "express";
import fs from "fs";
import { mapAndTransform } from "./utils";
import routes from "./routes";
import Sequelize from "sequelize";
import he from "he";

// Define port, app and file for Express
const PORT = 3001;
const app = express();
const file = "acronyms.json";

app.use(express.urlencoded({ extended: true })).use(express.json());

// Read the the data file
fs.readFile(file, { encoding: "utf8" }, (err, data) => {
  if (err) throw err;

  // Pass the transformed array to populate the DB
  syncAndPopulate(mapAndTransform(data));

  // Setup all routes
  routes(app, Acronym);
});

// Server conf
const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${server.address().port}`);
});

// Instantiate the DB
export const sequelize = new Sequelize("database", "admin", "admin", {
  dialect: "sqlite",
  storage: "./acronyms.sqlite",
});

// Authenticate with DB
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Define the Model
export const Acronym = sequelize.define("acronym", {
  acronym: { type: Sequelize.STRING, allowNull: false },
  definition: { type: Sequelize.STRING, allowNull: false },
});

// Sync the model with the database
function syncAndPopulate(arr) {
  Acronym.sync({ force: true }).then(() => {
    arr.forEach((item) => {
      return Acronym.create({
        acronym: item.acronym,
        definition: he.decode(item.definition),
      });
    });
  });
}
