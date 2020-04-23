import Sequelize from "sequelize";
import he from "he";

export const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        // Ref.: https://github.com/brianc/node-postgres/issues/2009
        rejectUnauthorized: false,
      },
      keepAlive: true,
    },
    ssl: true,
  });
}

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