const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Profile = sequelize.define("Profile", {
  name: DataTypes.STRING,
  url: DataTypes.STRING,
  about: DataTypes.TEXT,
  bio: DataTypes.TEXT,
  location: DataTypes.STRING,
  followerCount: DataTypes.STRING,
  connectionCount: DataTypes.STRING,
  bioLine: DataTypes.STRING
});

module.exports = Profile;
