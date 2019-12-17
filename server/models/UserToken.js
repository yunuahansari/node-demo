'use strict';

let UserToken = (sequelize, DataTypes) => {
    let UserToken = sequelize.define('user_token', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        access_token: {
            type: DataTypes.STRING(255)
        },
        device_id: {
            type: DataTypes.STRING(255)
        },
        device_type: {
            type: DataTypes.ENUM('web', 'android', 'ios')
        }
    }, {
        underscored: true,
        classMethods: {
            associate: models => {
                UserToken.belongsTo(models.user);
            },
        }
    });

    return UserToken;
};

export default UserToken;