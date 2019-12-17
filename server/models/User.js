'use strict';

import fs from 'fs';
import path from 'path';
import config from '../config'

let User = (sequelize, DataTypes) => {
    let User = sequelize.define('user', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
//        verify_token: {
//            type: DataTypes.STRING
//        },
        user_type: {
            type: DataTypes.ENUM('admin','client','employee'),
            defaultValue: 'admin'
        },
        status: {
            type: DataTypes.ENUM('active', 'pending', 'inactive', 'deleted'),
            defaultValue: 'active'
        },
//        can_user_login: {
//            type: DataTypes.BOOLEAN,
//            defaultValue: true
//        }
    }, {
        underscored: true,
        classMethods: {
            associate: models => {
                User.hasOne(models.user_token);
            },
            generateToken: () => {
                let chars, token;
                chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
                    token = new Date().getTime() + '_';
                for (let x = 0; x < 16; x++) {
                    let i = Math.floor(Math.random() * 62);
                    token += chars.charAt(i);
                }
                return token;
            },
            generateTempToken: () => {
                let chars, temp = '';
                chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
                for (let x = 0; x < 16; x++) {
                    let i = Math.floor(Math.random() * 62);
                    temp += chars.charAt(i);
                }
                return temp;
            },
            generatePassword: () => {
                let chars, temp = '';
                chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
                for (let x = 0; x < 8; x++) {
                    let i = Math.floor(Math.random() * 62);
                    temp += chars.charAt(i);
                }
                return temp;
            },
            generateReferralCode: () => {
                 
                let chars, temp = '';
                chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
                for (let x = 0; x < 6; x++) {  
                    let i = Math.floor(Math.random() * 62);
                    temp += chars.charAt(i);
                }
                temp = temp.toUpperCase();
                return temp;

            }
        }
    }, {
        freezeTableName: false
      });

    return User;
};

export default User;