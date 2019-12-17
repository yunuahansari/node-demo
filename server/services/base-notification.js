'use strict';

import apn from 'apn';
import FCM from 'fcm-node';
import config from '../config';
import loggers from './logger';

let notification = config.notification;
let ios = notification.ios;
let android = notification.android;
let serverKey = android.fcm.server_key;
let infoLogger = loggers.infoLogger;
let errorLogger = loggers.errorLogger;

export default {
    /**
     * Create driver notification object for ios
     * @param {object} data 
     */
    createDriverIosNotification(data) {
        let note = new apn.Notification();
        note.expiry = Math.floor(Date.now() / 1000) + 3600;
        note.alert = data.title;
        note.payload = data;
        if (data.type === 'RIDE_REQUEST') {
            note.sound = "custom_notif.caf";
        } else {
            note.sound = "default_notif.caf";
        }
        note.topic = "com.six.driver";

        if(data.content_available) {
            note.aps["content-available"] = 1;
        }
        
        return note;
    },

    /**
     * Create customer notification object for ios
     * @param {object} data 
     */
    createCustomerIosNotification(data) {
        let note = new apn.Notification();
        note.expiry = Math.floor(Date.now() / 1000) + 3600;
        note.alert = data.title;
        note.payload = data;
        note.sound = "default_notif.caf";
        note.topic = "com.six.rider";

        if(data.content_available) {
            note.aps["content-available"] = 1;
        }

        return note;
    },

    /**
     * Create notification object for android
     * @param {object} data
     * @param {string} deviceId
     */
    createAndroidNotification(data, deviceId) {
        return {
            to: deviceId,
            data: data
        };
    },

    /**
     * Send notification to ios customer
     * @param {object} data 
     * @param {string} deviceToken 
     */
    sendToIosCustomer(data, deviceToken) {
        let options = {
            token: {
                key: ios.token.key,
                keyId: ios.token.keyId,
                teamId: ios.token.teamId,
            },
            production: true
        };

        let apnProvider = new apn.Provider(options);
        apnProvider.send(this.createCustomerIosNotification(data), deviceToken).then((result) => {
            if (result.failed) {
                errorLogger.error(JSON.stringify(result));
            } else {
                infoLogger.info(`Successfully sent with response: ${JSON.stringify(result)}`);
            }
        });
    },

    /**
     * Send notification to ios driver
     * @param {object} data 
     * @param {string} deviceToken 
     */
    sendToIosDriver(data, deviceToken) {
        let options = {
            token: {
                key: ios.token.key,
                keyId: ios.token.keyId,
                teamId: ios.token.teamId,
            },
            production: true
        };

        let apnProvider = new apn.Provider(options);

        apnProvider.send(this.createDriverIosNotification(data), deviceToken).then((result) => {
            if (result.failed) {
                errorLogger.error(JSON.stringify(result));
            } else {
                infoLogger.info(`Successfully sent with response: ${JSON.stringify(result)}`);
            }
        });
    },

    /**
     * Send notification to android
     * @param {object} data 
     * @param {string} deviceId 
     */
    sendToAndroid(data, deviceId) {
        let fcm = new FCM(serverKey);
        fcm.send(this.createAndroidNotification(data, deviceId), (error, response) => {
            if (error) {
                errorLogger.error(error);
            } else {
                infoLogger.info(`Successfully sent with response: ${JSON.stringify(response)}`);
            }
        });
    },

    /**
     * Send driver notification to mobile
     * @param {object} data
     * @param {string} deviceType 
     * @param {string} deviceId 
     */
    sendDriverNotification(data, deviceType, deviceId) {
        if (deviceType === 'android') {
            this.sendToAndroid(data, deviceId || '');
        }
        if (deviceType === 'ios') {
            this.sendToIosDriver(data, deviceId || '');
        }
    },

    /**
     * Send customer notification to mobile
     * @param {object} data
     * @param {string} deviceType 
     * @param {string} deviceId 
     */
    sendCustomerNotification(data, deviceType, deviceId) {
        if (deviceType === 'android') {
            this.sendToAndroid(data, deviceId || '');
        }
        if (deviceType === 'ios') {
            this.sendToIosCustomer(data, deviceId || '');
        }
    }

}