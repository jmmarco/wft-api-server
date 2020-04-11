import { renderAcronyms, paginatedResults, randomAcronyms } from "./utils";
import { Acronym } from "./index";
import { Op } from "sequelize";

const routes = (app) => {
  // All acronyms
  app.get("/acronyms/", (req, res) => {
    Acronym.findAll().then((acronyms) => {
      res.json(acronyms);
    });
  });

  //  Search with offset and limit
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
          tip: `Enter an offset aka 'from' value between 0 and ${results.count - 1}.`,
        });
      } else {
        res.json({...results, next: "true"});
      }
    });
  });

  // Single acronym
  app.get("/acronym/:acronym", (req, res) => {
    const { acronym } = req.params;

    const acronymFound = masterList.find(
      (item) => item.acronym === acronym.toUpperCase()
    );

    let response = null;

    if (acronymFound) {
      response = `acronym entered is ${JSON.stringify(acronymFound)}`;
    } else {
      response = `Nothing found for entry ${req.params.acronym}`;
    }

    res.status(200).json(acronymFound);
  });

  // Random amount of acronyms
  app.get("/random/:count?", (req, res) => {
    const { count } = req.params;

    const result = randomAcronyms(masterList, count);

    res.status(200).json(result);
  });

  // Non matching routes return 404 by default
  app.get("*", (req, res) => {
    res.sendStatus(404);
  });
};

export default routes;
