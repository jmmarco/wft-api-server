import { renderAcronyms, paginatedResults, randomAcronyms } from "./utils";
import { Acronym, sequelize } from "./index";
import { Op } from "sequelize";

const routes = (app) => {
  app.get("/", (req, res) => {
    const help = `
    <pre>
      Welcome to the World Texting Foundation, also known as WTF.

      Use an Authorization header to work with your own data:
      i.e: fetch(url, { headers: { 'Authorization': 'whatever-you-want' }})
      
      The following endpoints are available:
      - GET /acronym?from=50&limit=10&search=:search
      - GET /acronym/:acronym
      - GET /random/:count?
      - POST /acronym
      - PUT /acronym/:acronym
      - DELETE /acronym/:acronym
    </pre>
    `;
    res.status(200).send(help);
  });

  // Check if user is authorized
  app.use((req, res, next) => {
    // Our token is the key "Authorization" and any value found in the Headers
    const token = req.get("Authorization");

    if (token) {
      req.token = token;
      next();
    } else {
      res.status(403).send({
        error:
          "Please provide an Authorization header to identify yourself: { Authorization: 'WHATEVER' } ",
      });
    }
  });

  // All acronyms
  app.get("/acronyms", (req, res) => {
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
  app.post("/acronym", (req, res) => {

    const { acronym, definition } = req.body;

    Acronym.create({
      acronym: acronym,
      definition: definition,
    })
    .then((success) => {
      res.status(200).send(success);
    })
    .catch((err) => {
      const [ValidationErrorItem] = err.errors;
      const { message } = ValidationErrorItem;
      res.status(403).send(`Something went wrong: ${message}`);
    });

  });

  // --> /acronym/:acronym
  app.put("/acronym/:acronym", (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(403).json({ error: "No authorization headers sent!" });
    }

    next();
  });
};

export default routes;
