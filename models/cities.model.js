module.exports = (sequelize, Sequelize) => {
  return sequelize.define("cities", {
    name: {
      type: Sequelize.STRING,
      unique: true
    },
    latitude: {
      type: Sequelize.STRING
    },
    longitude: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  });
};