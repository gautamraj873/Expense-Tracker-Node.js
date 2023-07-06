const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Download = sequelize.define("download", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fileUrl: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Download;