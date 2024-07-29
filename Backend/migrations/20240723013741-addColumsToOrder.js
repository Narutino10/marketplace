'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Order', 'product_ids', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Order', 'product_ids');
  },
};
