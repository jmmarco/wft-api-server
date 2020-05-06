# REST API for the World Texting Foundation, also known as WTF.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites
Your system needs a fairly recent version of [Node](https://nodejs.org/en/). 

### Installing
If that's all good, then install all necessary dependencies inside the target folder using:
```
npm install
```
Then run the development server:
```
npm run dev
```

## Available enpoints
- **`GET /acronym?from=50&limit=10&search=:search`**
- **`GET /acronym/:acronym`**
- **`GET /random/:count?`**
- **`POST /acronym`**
- **`PUT /acronym/:acronym`**
- **`DELETE /acronym/:acronym:`**

**Important**: Each request needs to have an Authorization header to identify yourself. For example:
- Using [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API):
```
fetch(url, { headers: { 'Authorization': 'whatever-you-want' }})
```

## Built with
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Sqlite](https://sqlite.org/) (development enviroment)
- [Babel](https://babeljs.io/)
- [PostgresSQL](https://www.postgresql.org/) (production enviroment)

## Author
 - Juan Marco

## License
See [LICENSE.md](LICENSE.md)

## Bugs
PR's welcome! Open a PR and we'll take it from there.


