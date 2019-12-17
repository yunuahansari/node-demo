'use strict';

import models from '../models';

let User = models.user;
let UserToken = models.user_token;

export default {
    /**
     * Get user device details
     * 
     * @param {string} userID 
     * @param {string} userType 
     * 
     */
    getUserDevice(userId, userType) {
        return UserToken.findOne({
            where: { user_id: userId },
            attributes: { exclude: ['access_token'] },
            include: [{ model: User, where: { user_type: userType }, attributes: { exclude: ['password', 'verify_token'] } }]
        });
    },

    /**
     * Get user's token list
     * 
     * @param {Array} userIds   
     * 
     */
    getUserTokenFromUsers(userIds) {
        return UserToken.findAll({
            where: { user_id: { $in: userIds } },
            attributes: { exclude: ['access_token'] }
        });
    },

}