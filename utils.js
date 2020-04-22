// Map over the incoming JSON structure and return usable objects
export function mapAndTransform(json) {
  console.log("WHAT THE HELL", json)
  return JSON.parse(json).map((acr) => {
    const entry = Object.entries(acr)[0];
    return {
      acronym: entry[0],
      definition: entry[1],
    };
  });
}

// Desconstruct's Sequelize error object and return something useful
export function handleSequelizeError(err) {
  const [ValidationErrorItem] = err.errors;
  const { message } = ValidationErrorItem;
  return message;
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
