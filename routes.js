import { renderAcronyms, paginatedResults, randomAcronyms } from "./utils";
import { Acronym, sequelize } from "./index";
import { Op } from "sequelize";

const routes = (app) => {
  console.log("INSTANCE", sequelize);

  // All acronyms
  app.get("/acronyms", (req, res) => {
    Acronym.findAll().then((acronyms) => {
      res.json(acronyms);
    });
  });

  app.get("/", (req, res) => {
    Acronym.findAll().then((acronyms) => {
      res.json(acronyms);
    });
  });

  // Search with offset and limit
  app.get("/acronym?", (req, res, next) => {
    const { from, limit, search } = req.query;
    Acronym.findAndCountAll({
      where: { acronym: { [Op.like]: `%${search}` } },
      limit: limit,
      offset: parseInt(from),
    }).then((results) => {
      if (parseInt(from) >= results.count) {
        res.json({
          ...results,
          next: "false",
          tip: `Enter an offset aka 'from' value between 0 and ${
            results.count - 1
          }.`,
        });
      } else {
        res.json({ ...results, next: "true" });
      }
    });
  });

  // Single acronym
  app.get("/acronym/:acronym", (req, res) => {
    const { acronym } = req.params;
    Acronym.findOne({
      where: { acronym: { [Op.like]: `%${acronym}` } },
    }).then((results) => {
      res.json(results);
    });
  });

  // Random amount of acronyms
  app.get("/random/:count?", (req, res) => {
    const { count } = req.params;

    Acronym.findAll({
      limit: count,
      order: sequelize.random(),
    }).then((acronyms) => {
      res.json(acronyms);
    });
  });

  // Non matching routes return 404 by default
  app.get("*", (req, res) => {
    res.sendStatus(404);
  });

  /* POST */

  app.post("/acronym", bodyParser.json(), (req, res) => {
 
    console.log("BODY", req.body);

    const { acronym, definition } = req.body

    Acronym.create({
      acronym: acronym,
      definition: definition
    })
    .then(success => {
      console.log('HEY', success)
      // res.body('Success', success)
      res.status(200).send(success) 
    })
    .catch(err => {
      console.log('something went kaput', err)
      res.send('something went kaput', err)
    })

  });
};

export default routes;
