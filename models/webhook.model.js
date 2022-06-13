module.exports = (sequelize, Sequelize) => {
  return sequelize.define("webhooks", {
    city_id: {
      type: Sequelize.INTEGER,
      references: {
        model: 'cities',
        key: 'id'
      },
    },
    callback_url: {
      type: Sequelize.STRING
    },
  });
};