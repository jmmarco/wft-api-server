import Sequelize from "sequelize";
import he from "he";

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: true,
    rejectUnauthorized: false
  }
});

// sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'postgres',
//   protocol: 'postgres',
//   dialectOptions: {
//       ssl: true
//   }
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