const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgres');

const Section = sequelize.define('Section', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Section',
    timestamps: false,
});



module.exports = Section;
