const mongoose = require("mongoose");
const app = require("./app");

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  API_VERSION,
  IP_SERVER,
  PORT
} = require("./constants");



try {
  mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/`);

  app.listen(PORT, () => {
    console.log("############################################################");
    console.log(`######### API REST - http://${IP_SERVER}:${PORT}/api/${API_VERSION} ##########`);
    console.log("############################################################");
    console.log("\n");
  });
} catch (error) {
  throw error;
}
