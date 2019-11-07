import "@babel/register";
import "@babel/polyfill/noConflict";

const server = require("../src/server").default;

module.exports = async () => {
  // Do something to start the app up
  global.httpServer = await server.start({ port: process.env.PORT || 4001 });
};
