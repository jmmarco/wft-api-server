import { renderAcronyms, paginatedResults, randomAcronyms } from './utils'

const routes = (app, masterList) => {

  // All acronyms
  app.get("/acronyms/", (req, res) => {
    const buffer = renderAcronyms(masterList);
    res.send(buffer);
  });


  // Complex search /acronym?from=50&limit=10&search=:search
  app.get("/acronym?", (req, res, next) => {
    const { from, limit, search } = req.query;

    console.log('next', JSON.stringify(next))

    if (parseInt(from) < 0 || parseInt(from) == 0) {
      return res.json({ error: "invalid " });
    }

    const results = paginatedResults(masterList, from, limit, search);

    res.status(200).json(results);
    // .send(req.query)
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
