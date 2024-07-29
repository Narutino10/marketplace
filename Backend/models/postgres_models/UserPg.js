const { DataTypes, Op } = require('sequelize');
const sequelize = require('../../config/postgres');
const bcrypt = require('bcryptjs');
const Product = require('./ProductPg');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
    },
    reset_token: {
        type: DataTypes.STRING,
    },
    reset_token_expiry: {
        type: DataTypes.DATE,
    },
    password_last_changed: {
        type: DataTypes.DATE,
    },
    account_created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    confirmation_token: {
        type: DataTypes.STRING,
    },
    confirmation_token_expiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'Clients',
    timestamps: false,
});

User.belongsToMany(Product, { through: 'Client_Product', foreignKey: 'userId' });

User.getUsers = async () => {
    const users = await User.findAll();
    return users;
};

User.getUser = async (email, password) => {
    return User.findOne({
        where: {
            email: email,
            password: password,
        },
    });
};

User.getUserById = async (id) => {
    return User.findByPk(id);
};

User.createUser = async ({ firstname, lastname, email, password, role }) => {
    try {
        const newUser = await User.create({
            firstname,
            lastname,
            email,
            password,
            role,
            confirmed: false,
        });

        return newUser;
    } catch (error) {
        throw error;
    }
};

User.updateUser = async (id, updates) => {
    const { firstname, lastname, email, role } = updates;

    return User.update({
        firstname,
        lastname,
        email,
        role,
    }, {
        where: {
            id: id,
        },
    });
};

User.deleteUser = async (id) => {
    return User.destroy({
        where: {
            id: id,
        },
    });
};

User.getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({
            where: {
                email: email,
            },
        });
        return user;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        throw error;
    }
};

User.updateUserByEmail = async (email, updates) => {
    const { reset_token, reset_token_expiry } = updates;

    return User.update({
        reset_token,
        reset_token_expiry,
    }, {
        where: {
            email: email,
        },
    });
};

User.updateUserByToken = async (token, updates) => {
    const updateFields = {};
    if (updates.password !== undefined) updateFields.password = updates.password;
    if (updates.reset_token !== undefined) updateFields.reset_token = updates.reset_token;
    if (updates.reset_token_expiry !== undefined) {
        const resetTokenExpiryDate = new Date(updates.reset_token_expiry);
        if (!isNaN(resetTokenExpiryDate.getTime())) {
            updateFields.reset_token_expiry = resetTokenExpiryDate;
        } else {
            throw new Error('Invalid reset_token_expiry date');
        }
    }

    return User.update(updateFields, {
        where: {
            [Op.or]: [
                { confirmation_token: token },
                { reset_token: token },
            ],
        },
    });
};

module.exports = User;
