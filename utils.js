module.exports = {
  mapAndTransform: function (arr) {
    return arr.map((acr) => {
      const entry = Object.entries(acr)[0];
      return {
        acronym: entry[0],
        translation: entry[1],
      };
    });
  }
};