'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('favorite', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userid: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Clients',
                    key: 'id'
                }
            },
            productids: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                defaultValue: [],
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('favorite');
    },

};