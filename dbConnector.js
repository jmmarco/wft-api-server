import Sequelize from "sequelize";
import he from "he";

if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     match[4],
    host:     match[3],
    logging:  true //false
  })
} else {
  // the application is executed on the local machine ... use sqlite3
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'acronyms.sqlite'
  });
}

// export const sequelize = new Sequelize("acronyms", process.env.DB_USER, process.env.DB_PASS, {
//   dialect: "postgres",
//   host: process.env.DATABASE_URL
// });

// Define the Model
export const Acronym = sequelize.define("acronym", {
  acronym: { type: Sequelize.STRING, allowNull: false },
  definition: { type: Sequelize.STRING, allowNull: false },
});

// Sync the model with the database
export function syncAndPopulate(arr) {
  Acronym.sync({ force: true }).then(() => {
    arr.forEach((item) => {
      return Acronym.create({
        acronym: item.acronym,
        definition: he.decode(item.definition),
      });
    });
  });
}


export sequelize;