import express from 'express'
import fs from 'fs'
import { mapAndTransform } from './utils'
import routes from './routes'
import Sequelize from 'sequelize'
import { userInfo } from 'os'
import he from 'he'


const PORT = 3001;
const app = express();

let masterList = null


fs.readFile("acronyms.json", { encoding: "utf8" }, (err, data) => {
  if (err) throw err;
  masterList = mapAndTransform(JSON.parse(data))
  routes(app, Acronym);
});




app.get('/', (req, res) => {
  Acronym.findAll()
    .then((acronyms) => {
      res.json(acronyms)
    })
  // res
  //   .status(200)
  //   .json('hello')
})


// Server conf
const server = app.listen(PORT, () => {
  console.log(`Express server running on port ${server.address().port}`);
});

// Instantiate the DB
const sequelize = new Sequelize('database', 'admin', 'admin', {
  dialect: 'sqlite',
  storage: './acronyms.sqlite'
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Define the Model
export const Acronym = sequelize.define('acronym', {
  acronym: { type: Sequelize.STRING },
  definition: { type: Sequelize.STRING }
});


Acronym.sync({ force: true }).then(() => {
  // Now the `users` table in the database corresponds to the model definition
  masterList.forEach(item => {
    return Acronym.create({
      acronym: item.acronym,
      definition: he.decode(item.definition)
    });
  })
});


function setup() {

}
