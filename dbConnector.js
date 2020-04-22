import Sequelize from "sequelize";
import he from "he";

export const sequelize = new Sequelize("acronyms", process.env.DB_USER, process.env.DB_PASS, {
  dialect: "postgres",
  host: process.env.DATABASE_URL
});

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