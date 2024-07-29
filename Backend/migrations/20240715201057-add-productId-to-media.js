'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    'use strict';

    module.exports = {
      up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Media', 'productId', {
          type: Sequelize.INTEGER,
          references: {
            model: 'Product',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: false
        });
      },

      down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Media', 'productId');
      }
    };

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
