module.exports = (sequelize, Sequelize) => {
  return sequelize.define("temperatures", {
    city_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'cities',
        key: 'id'
      },
    },
    max: {
      type: Sequelize.INTEGER
    },
    min: {
      type: Sequelize.INTEGER
    },
    timestamp: {
      type: Sequelize.STRING,
      defaultValue: Math.floor(Date.now() / 1000)
    },
    measurement: {
      type: Sequelize.STRING,
      defaultValue: "Celsius"
    }
  });
};