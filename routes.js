import { handleSequelizeError, capitalizeFirstLetter } from "./utils";
import { Acronym, sequelize } from "./dbConnector";
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

  // Check if authorization headers are present
  app.use((req, res, next) => {
    // Our token is the key "Authorization" and any value found in the Headers
    const token = req.get("Authorization");

    if (token) {
      req.token = token;
      next();
    } else {
      res.status(403).send({
        error:
          "Please provide an Authorization header to identify yourself. Like this: { Authorization: 'WHATEVER' } ",
      });
    }
  });

  // GET --> /acronym?from=50&limit=10&search=:search
  app.get("/acronym?", (req, res, next) => {
    const { from, limit, search } = req.query;

    if (!search || !limit || !from) {
      res.send({
        error:
          "You must provide: 'from', 'limit' and 'search' in your request.",
        example: "/acronym?from=1&limit=10&search=YO",
      });
    }

    Acronym.findAndCountAll({
      where: {
        [Op.or]: [
          {
            acronym: {
              [Op.like]: `%${capitalizeFirstLetter(search)}%`,
            },
          },
          {
            acronym: {
              [Op.like]: `%${search.toUpperCase()}%`,
            },
          },
        ],
      },
      limit: parseInt(limit),
      offset: parseInt(from),
    }).then((results) => {
      const pageCount = Math.ceil(results.count / parseInt(limit));
      const next = results.rows.length !== 1 ? "True" : "False";

      // Set response headers 'next' to indicate if there are more results
      res.set({
        next: next,
      });

      // Also set it in the response object
      res.json({
        ...results,
        next,
      });
    });
  });

  // GET --> /acronym/:acronym
  app.get("/acronym/:acronym", (req, res) => {
    const { acronym } = req.params;

    console.log("ACRONYM", acronym);

    if (!acronym) {
      res.send({});
    }

    Acronym.findOne({
      where: {
        [Op.or]: [
          {
            acronym: {
              [Op.eq]: acronym.toUpperCase(),
            },
          },
          {
            acronym: {
              [Op.like]: `${capitalizeFirstLetter(acronym)}%`,
            },
          },
          {
            acronym: {
              [Op.like]: `${acronym.toUpperCase()}%`,
            },
          },
        ],
      },
    })
      .then((results) => {
        res.json(results);
      })
      .catch((err) => {
        const errorMessage = handleSequelizeError(err);
        res.status(403).send(errorMessage);
      });
  });

  // GET --> /random/:count?
  app.get("/random/:count?", (req, res) => {
    const { count } = req.params;

    Acronym.findAll({
      limit: count,
      order: sequelize.random(),
    }).then((acronyms) => {
      res.json(acronyms);
    });
  });

  // POST --> /acronym
  app.post("/acronym", (req, res) => {
    const { acronym, definition } = req.body;

    /* 
      https://en.wikipedia.org/wiki/Acronym#Case 
      Apparently there are many conventions regarding the casing, 
      so we're not enforcing or transforming anything here.
    */

    Acronym.create({
      acronym: acronym,
      definition: definition,
    })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        const errorMessage = handleSequelizeError(err);
        res.status(403).send(errorMessage);
      });
  });

  // PUT --> /acronym/:acronym
  app.put("/acronym/:acronym", (req, res, next) => {
    const { acronym, definition } = req.body;
    if (!acronym) {
      res
        .status(403)
        .send("You must supply a valid (existing) acronym to update");
      next();
    } else if (!definition || definition.length < 1) {
      res.status(403).send("Definition must be at least two charcters long");
      next();
    }

    Acronym.update(
      { definition: capitalizeFirstLetter(definition) },
      {
        where: {
          acronym: {
            [Op.eq]: acronym.toUpperCase() || capitalizeFirstLetter(acronym),
          },
        },
      }
    )
      .then((affectedRows) => {
        res.status(200).send(`Successfully updated ${affectedRows}.`);
      })
      .catch((err) => {
        const errorMessage = handleSequelizeError(err);
        res.status(403).send(errorMessage);
      });
  });

  // DELETE --> /acronym/:acronym
  app.delete("/acronym/:acronym", (req, res) => {
    const { acronym } = req.body;

    if (!acronym) {
      res
        .status(403)
        .send("You must supply a valid (existing) acronym to delete");
      next();
    }

    Acronym.destroy({
      where: { acronym: { [Op.eq]: acronym.toUpperCase() || "" } },
    })
      .then((affectedRows) => {
        res.status(200).send(`Successfully deleted ${affectedRows}.`);
      })
      .catch((err) => {
        const errorMessage = handleSequelizeError(err);
        res.status(403).send(errorMessage);
      });
  });

  // ALL other routes return 404 by default
  app.get("*", (req, res) => {
    res.sendStatus(404);
  });
};

export default routes;
