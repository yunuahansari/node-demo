'use strict';

import Notification from './base-notification';

export default {
    /**
     * Send ride request to driver
     * @param {Object} data 
     */
    notifyRideRequestToDriver(driver, ride) {
        let deviceType = driver && driver.device_type;
        let payload = {
            type: 'RIDE_REQUEST',
            title: `New Journey Request.`,
            driver_id: driver.id,
            ride
        };
        Notification.sendDriverNotification(payload, deviceType, driver.device_id || '');
    },

    /**
     * Send cancel ride notification to driver
     * @param {Object} data 
     */
    notifyCancelRideToDriver(ride) {
        let deviceType = ride.driver && ride.driver.device_type;
        let deviceId = ride.driver && ride.driver.device_id;
        let payload = {
            type: 'RIDE_CANCEL_DRIVER',
            title: `Sorry, your rider has cancelled the job.`,
            content_available: 1,
            ride
        };
        Notification.sendDriverNotification(payload, deviceType, deviceId || '');
    },

    /**
     * Send cancel ride notification to customer
     * @param {Object} data 
     */
    notifyCancelRideToCustomer(ride) {
        let deviceType = ride.customer && ride.customer.device_type;
        let deviceId = ride.customer && ride.customer.device_id;
        let payload = {
            type: 'RIDE_CANCEL_CUSTOMER',
            title: `Unfortunately, due to unforeseen circumstances your ride has been cancelled. Please book another ride.`,
            content_available: 1,
            ride
        };
        Notification.sendCustomerNotification(payload, deviceType, deviceId || '');
    },

    /**
     * Send ride started notification to customer
     * @param {Object} data 
     */
    notifyStartRideToCustomer(ride) {
        let deviceType = ride.customer && ride.customer.device_type;
        let deviceId = ride.customer && ride.customer.device_id;
        let payload = {
            type: 'RIDE_STARTED',
            title: `Journey has been started.`,
            content_available: 1,
            ride
        };
        Notification.sendCustomerNotification(payload, deviceType, deviceId || '');
    },

    /**
     * Send  ride completed notification to customer
     * @param {Object} data 
     */
    notifyCompleteRideToCustomer(ride) {
        let deviceType = ride.customer && ride.customer.device_type;
        let deviceId = ride.customer && ride.customer.device_id;
        let payload = {
            type: 'RIDE_COMPLETED',
            title: `Journey has been completed.`,
            content_available: 1,
            ride
        };
        Notification.sendCustomerNotification(payload, deviceType, deviceId || '');
    },

    /**
     * Send driver arrived notification to customer
     * @param {Object} data 
     */
    notifyDriverArrivedToCustomer(ride) {
        let deviceType = ride.customer && ride.customer.device_type;
        let deviceId = ride.customer && ride.customer.device_id;
        let payload = {
            type: 'DRIVER_ARRIVED',
            title: `Driver has just arrived.`,
            content_available: 1,
            ride
        };
        Notification.sendCustomerNotification(payload, deviceType, deviceId || '');
    },

    /**
     * Send broadcast message to driver
     * @param {Object} data 
     */
    broadcastToDriver(data) {
        data.drivers.forEach((driver, index) => {
            let deviceType = driver.device_type;
            let deviceId = driver.device_id;
            let payload = {
                type: 'BROADCAST_MESSAGE',
                title: `SIX App Message`,
                message: { message: data.message, category: data.category }
            };
            Notification.sendDriverNotification(payload, deviceType, deviceId || '');
        });
    },

    /**
     * Send broadcast message to customer
     * @param {Object} data 
     */
    broadcastToCustomer(data) {
        data.customers.forEach((customer, index) => {
            let deviceType = customer.device_type;
            let deviceId = customer.device_id;
            let payload = {
                type: 'BROADCAST_MESSAGE',
                title: `SIX App Message`,
                message: { message: data.message, category: data.category }
            };
            Notification.sendCustomerNotification(payload, deviceType, deviceId || '');
        });
    },

    /**
     * Send 50 min booking reminder to driver
     * @param {Object} data 
     */
    notifyPrebookReminderToDriver(ride) {
        let deviceType = ride.driver && ride.driver.device_type;
        let deviceId = ride.driver && ride.driver.device_id;
        let payload = {
            type: 'RIDE_REMINDER_DRIVER',
            title: `You have a pre-booked ride in approx 50 minutes. Please arrive at pick-up point 10 minutes early or the request will be suspended without prior warning.`,
            ride
        };
        Notification.sendDriverNotification(payload, deviceType, deviceId || '');
    },

    /**
     * Send notification to customer if pre book ride is passed
     * @param {Object} data 
     */
    notifyPassedRideToCustomer(ride) {
        let deviceType = ride.customer && ride.customer.device_type;
        let deviceId = ride.customer && ride.customer.device_id;
        let payload = {
            type: 'RIDE_PASSED',
            title: `We are sorry, due to unforeseen circumstances your ride has been cancelled. We are sorry that we have been unable to cover your pre booked ride. We are working hard to get more drivers and improve our coverage. Hope you will give us another try.`,
            ride
        };
        Notification.sendCustomerNotification(payload, deviceType, deviceId || '');
    },

    /**
     * Send notification to customer if payment is declined
     * @param {Object} data 
     */
    notifyPaymentDeclinedToCustomer(ride) {
        let deviceType = ride.customer && ride.customer.device_type;
        let deviceId = ride.customer && ride.customer.device_id;
        let payload = {
            type: 'PAYMENT_DECLINED_CUSTOMER',
            title: `Your payment has been declined.`,
            ride
        };
        Notification.sendCustomerNotification(payload, deviceType, deviceId || '');
    },

    /**
     * Send notification to customer if payment is success
     * @param {Object} data 
     */
    notifyPaymentSuccessToCustomer(ride, ride_amount) {
        let deviceType = ride.customer && ride.customer.device_type;
        let deviceId = ride.customer && ride.customer.device_id;
        let payload = {
            type: 'PAYMENT_SUCESS_CUSTOMER',
            title: `Thank you Your payment of: $${ride_amount} has been accepted, and will be debited from your registered default card.`,
            ride
        };
        Notification.sendCustomerNotification(payload, deviceType, deviceId || '');
    },

    /**
     * Send notification to customer if pre book ride is timeout 
     * @param {Object} data 
     */
    notifyPreRideTimeoutToCustomer(ride) {
        let deviceType = ride.customer && ride.customer.device_type;
        let deviceId = ride.customer && ride.customer.device_id;
        let payload = {
            type: 'PRE_RIDE_TIMEOUT',
            title: `Unfortunately, due to unusually high demand, we are sorry that we have been unable to find an alternative driver. We are working hard to improve our coverage and hope you will give us another try.`,
            ride
        };
        if (deviceId && deviceType) {
            Notification.sendCustomerNotification(payload, deviceType, deviceId || '');    
        }        
    },

    /**
     * Send notification to customer on Reallocation of pre-book ride 
     * @param {Object} data 
     */
    notifyPreRideReallocationToCustomer(ride) {
        let deviceType = ride.customer && ride.customer.device_type;
        let deviceId = ride.customer && ride.customer.device_id;
        let payload = {
            type: 'PRE_RIDE_REALLOCATION',
            title: `We’re sorry, due to unforeseen circumstances your ride has been cancelled. SIX App has resubmitted your request and is locating the next available driver. You will receive notification of your booking shortly.`,
            ride
        };
        Notification.sendCustomerNotification(payload, deviceType, deviceId || '');
    },

    /**
     * Send notification to customer on Reallocation of pre-book ride to now
     * @param {Object} data 
     */
    notifyPreRideToNowReallocationToCustomer(ride) {
        let deviceType = ride.customer && ride.customer.device_type;
        let deviceId = ride.customer && ride.customer.device_id;
        let payload = {
            type: 'PRE_RIDE_NOW_REALLOCATION',
            title: `We’re  sorry, due to unforeseen circumstances your ride has been cancelled. SIX App has resubmitted your request and is locating the next available driver. You will receive notification of your booking shortly.`,
            ride
        };
        Notification.sendCustomerNotification(payload, deviceType, deviceId || '');
    },

    /**
     * Send notificatio to driver if licence expired next 30 days
     * @param {Object} data 
     */
    notifyLicenceExpiredToDriver(driver) {
        let deviceType = driver && driver.device_type;
        let deviceId = driver && driver.device_id;
        let payload = {
            type: 'LICENCE_EXPIRED_DRIVER',
            title: `Your PDVL/TDVL is expiring soon. Please remember to upload a copy, failure to do so will result in your App being suspended.`,
            driver
        };
        Notification.sendDriverNotification(payload, deviceType, deviceId || '');
    },

     /**
     * Send notification to customer on driver accepted the pre book ride 
     * @param {Object} data 
     */
    notifyPreBookRideToCustomer(ride) {
        let deviceType = ride.customer && ride.customer.device_type;
        let deviceId = ride.customer && ride.customer.device_id;
        let payload = {
            type: 'PRE_RIDE_DRIVER_ACCEPTED',
            title: `Your journey has been allocated.`,
            ride
        };
        Notification.sendCustomerNotification(payload, deviceType, deviceId || '');
    },


    /**
     * Send notification to customer when toll added by driver
     * @param {Object} data 
     */
    notifyTollAddedToCustomer(ride) {
        let deviceType = ride.customer && ride.customer.device_type;
        let deviceId = ride.customer && ride.customer.device_id;
        let payload = {
            type: 'TOLL_ADDED',
            title: `A toll has been added by driver.`,
            content_available: 1,
            ride
        };
        
        Notification.sendCustomerNotification(payload, deviceType, deviceId || '');
    },

    /**
     * Generic function which check notification type and call the respective function accordingly to send notification
     * @param {Object} data 
     */
    sendRideNotification(notificationType, ride, driver, customer) {

        if(driver) {
            let driverNotificationObj = {
                id : driver.id,
                first_name : driver.first_name,
                last_name : driver.last_name,
                photo : driver.photo,
                phone_number : driver.phone_number,
                phone_number_country_code : driver.phone_number_country_code,
                car_registration_number : driver.car_registration_number,
                latitude : driver.latitude,
                longitude : driver.longitude,
                device_id : driver.device_id,
                device_type : driver.device_type
            };    
        }

        let rideNotificationObj = {
            id : ride.id,
            pick_up_address : ride.pick_up_address,
            pick_up_latitude : ride.pick_up_latitude,
            pick_up_longitude : ride.pick_up_longitude,
            drop_off_address : ride.drop_off_address,
            drop_off_latitude : ride.drop_off_latitude,
            drop_off_longitude : ride.drop_off_longitude,
            is_pre_booking : ride.is_pre_booking,
            category_id : ride.category_id,
            car_category : ride.car_category,
            car_category_icon : ride.car_category_icon,
            booking_date : ride.booking_date,
            status : ride.status,
            payment_type : ride.payment_type,
            ride_amount : ride.ride_amount,
            start_date : ride.start_date,
            end_date : ride.end_date,
            base_fare : ride.base_fare,
            ride_km : ride.ride_km,
            minimum_fare : ride.minimum_fare,
            per_km : ride.per_km,
            minimum_fare_km : ride.minimum_fare_km,
            toll_total : ride.toll_total,
            admin_fee : ride.admin_fee_value,
            promo_discount : ride.promo_discount,
            customer : {
                id : ride.customer.id,
                first_name : ride.customer.first_name,
                last_name : ride.customer.last_name,
                photo : ride.customer.photo,
                phone_number : ride.customer.phone_number,
                phone_number_country_code : ride.customer.phone_number_country_code,
                device_id : ride.customer.device_id,
                device_type : ride.customer.device_type
            }

        };

        if(notificationType !== 'notifyPreBookRideToCustomer') {
           
            rideNotificationObj.driver = {
                id : ride.driver.id,
                first_name : ride.driver.first_name,
                last_name : ride.driver.last_name,
                photo : ride.driver.photo,
                phone_number : ride.driver.phone_number,
                phone_number_country_code : ride.driver.phone_number_country_code,
                car_registration_number : ride.driver.car_registration_number,
                latitude : ride.driver.latitude,
                longitude : ride.driver.longitude,
                make : ride.driver.brand_id,
                model : ride.driver.model_id,
                device_id : ride.driver.device_id,
                device_type : ride.driver.device_type
            };     
        }
        else {

        }

        console.log("updated ride object \n\n",rideNotificationObj);

        switch(notificationType) {
            case 'notifyRideRequestToDriver' : {
                this.notifyRideRequestToDriver(driverNotificationObj, rideNotificationObj);
                break;
            }
            case 'notifyCancelRideToCustomer' : {
                this.notifyCancelRideToCustomer(rideNotificationObj);
                break;
            }
            case 'notifyCancelRideToDriver' : {
                this.notifyCancelRideToDriver(rideNotificationObj);
                break;
            }
            case 'notifyStartRideToCustomer' : {
                this.notifyStartRideToCustomer(rideNotificationObj);
                break;
            }
            case 'notifyCompleteRideToCustomer' : {
                this.notifyCompleteRideToCustomer(rideNotificationObj);
                break;
            }
            case 'notifyPaymentSuccessToCustomer' : {
                this.notifyPaymentSuccessToCustomer(rideNotificationObj, ride.ride_amount);
                break;
            }
            case 'notifyPaymentDeclinedToCustomer' : {
                this.notifyPaymentDeclinedToCustomer(rideNotificationObj);
                break;
            }
            case 'notifyDriverArrivedToCustomer' : {
                this.notifyDriverArrivedToCustomer(rideNotificationObj);
                break;
            }
            case 'notifyPreBookRideToCustomer' : {
                this.notifyPreBookRideToCustomer(rideNotificationObj);
                break;
            }
            case 'notifyPrebookReminderToDriver' : {
                this.notifyPrebookReminderToDriver(rideNotificationObj);
                break;
            }
            case 'notifyPassedRideToCustomer' : {
                this.notifyPassedRideToCustomer(rideNotificationObj);
                break;
            }
            case 'notifyPreRideTimeoutToCustomer' : {
                this.notifyPreRideTimeoutToCustomer(rideNotificationObj);
                break;
            }
            case 'notifyPreRideReallocationToCustomer' : {
                this.notifyPreRideReallocationToCustomer(rideNotificationObj);
                break;
            }
            case 'notifyPreRideToNowReallocationToCustomer' : {
                this.notifyPreRideToNowReallocationToCustomer(rideNotificationObj);
                break;
            }
            case 'notifyTollAddedToCustomer' : {
                this.notifyTollAddedToCustomer(rideNotificationObj);
                break;   
            }
            case 'default' : { 
                console.log("Invalid choice"); 
                break };
        }
    }
}