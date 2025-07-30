const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./profiles.sqlite"
});

module.exports = sequelize;
