'use strict';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import passportService from '../services/auth';
import models from '../models';
import Email from '../services/email';

let User = models.user;
let UserToken = models.user_token;
//let Customer = models.customer;
//let Driver = models.driver;


/**
 * Object for handle all auth request api
 */
let authController = {
    /**
     * Handle login api request
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     * 
     */
    login(req, res, next) {
        passport.authenticate('login', (error, user, info) => {
//             console.log(error);
            if (error) {
                error.status = 400;
                next(error);
            } else {
                req.logIn(user, error => {
                    if (error) {
                        error.status = 400;
                        next(error);
                    } else {
                        res.json({ success: true, data: user, message: '' });
                    }
                });
            }
        })(req, res, next);
    },

    /**
     * Handle signup api request
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    signup(req, res, next) {
        passport.authenticate('signup', (error, user, info) => {
            if (error) {
                error.status = 400;
                if (error.name === 'EMAIL_EXISTS') {
                    res.status(400).json({ success: false, error: [{ field: 'email', message: 'Email already exists.' }], message: 'Invalid request' });
                } else {
                    next(error);
                }
            } else {
                if (user) {
                    res.status(200).json({ success: true, data: user, message: 'User created successfully' });
                } else {
                    res.status(400).json({ success: true, data: user, message: 'User not created' });
                }
            }
        })(req, res, next);
    },

    /**
     * Handle logout api request
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     * 
     */
    logout(req, res, next) {
        console.log(req.body);
//        UserToken.find({ where: { access_token: req.user.access_token } }).then(tokenObject => {
//            if (tokenObject) {
//                UserToken.destroy({
//                    where: { id: tokenObject.id }
//                }).then(data => {
//                    res.status(200).json({ success: true, message: 'User has been logout successfully' });
//                }).catch(error => {
//                    next(error);
//                });
//            } else {
//                let error = new Error('Bad request');
//                error.status = 400;
//                next(error);
//            }
//        }).catch(error => {
//            next(error);
//        });
    },

    /**
     * Handle change password api request
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     * 
     */
    changePassword(req, res, next) {
        User.find({
            where: { id: req.user.id }
        }).then(data => {
            let user = data ? data.get() : null;
            let bodyData = {
                current_password: req.body.current_password || '',
                new_password: req.body.new_password || ''
            }
            if (user) {
                bcrypt.compare(bodyData.current_password, user.password).then(result => {
                    if (result) {
                        bcrypt.hash(bodyData.new_password, 10).then(hash => {
                            let userData = {
                                password: hash
                            }
                            data.updateAttributes(userData).then(data => {
                                res.status(200).json({ success: true, message: 'Password has been changed successfully' });
                            }).catch(error => {
                                return next(error);
                            });
                        }).catch(error => {
                            return next(error);
                        });
                    } else {
                        let error = new Error("Current password doesn't match");
                        error.status = 400;
                        return next(error);
                    }
                }).catch(error => {
                    return next(error);
                });
            } else {
                let error = new Error('User is not authenticated');
                error.status = 401;
                return next(error);
            }
        }).catch(error => {
            return next(error);
        });
    },

    /**
     * Handle forgot password api request
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    forgotPassword(req, res, next) {
        let email = req.body.email || false;
        let token = User.generateTempToken();
        if (email) {
            User.find({ where: { email: email } }).then(user => {
                if (user) {
                    user.updateAttributes({ verify_token: token }).then(data => {
                        let options = {
                            to: user.email,
                            firstName: user.first_name,
                            token
                        };
                        Email.forgotPassword(options).then(result => {
                            console.log(result);
                            res.status(200).json({ success: true, message: 'Reset password link has been sent on your email.' });
                        }).catch(error => {
                            next(error);
                        });;

                    }).catch(error => {
                        next(error);
                    });
                } else {
                    let error = new Error("Email doesn't exist.");
                    error.status = 400;
                    next(error);
                }
            }).catch(error => {
                next(error);
            });
        } else {
            let error = new Error('Bad request');
            error.status = 400;
            next(error);
        }
    },

    /**
     * Handle reset password api request
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    resetPassword(req, res, next) {
        let password = req.body.password || false;
        let token = req.body.token || false;
        if (token && password) {
            User.find({ where: { verify_token: token } }).then(user => {
                if (user) {
                    bcrypt.hash(password, 10).then(hash => {
                        let userData = {
                            password: hash,
                            verify_token: ''
                        }
                        user.updateAttributes(userData).then(data => {
                            res.status(200).json({ success: true, message: 'Password has been reset successfully' });
                        }).catch(error => {
                            return next(error);
                        });
                    }).catch(error => {
                        return next(error);
                    });

                } else {
                    let error = new Error("Token doesn't exist.");
                    error.status = 400;
                    next(error);
                }
            }).catch(error => {
                next(error);
            });
        } else {
            let error = new Error('Bad request');
            error.status = 400;
            next(error);
        }
    },

    /**
     * Check Email exists on driver update
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    checkEmailExistsDriverUpdate(req, res, next) {
        let email = req.body.email;
        Driver.find({ where: { email, id: { $ne: req.user.id } } }).then(driver => {
            if (driver) {
                res.status(400).json({ success: false, data: null, error: [{ 'field': 'email', message: 'Email already exists.' }], message: 'Invalid request' });
            } else {
                return next();
            }
        }).catch(error => {
            next(error);
        });
    },

    /**
     * Check phone number exists on driver add
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    checkPhoneNumberExistsDriver(req, res, next) {
        let body = req.body;
        let phone_number_country = body.phone_number_country;
        let phone_number_country_code = body.phone_number_country_code;
        let phone_number = body.phone_number;
        let where = { phone_number_country, phone_number_country_code, phone_number };
        where.status = {$ne: "deleted"};
        // Condtion for edit driver
        if(req.params.id){
           where.id = {$ne: req.params.id};
        }

        Driver.find({ where }).then(driver => { 
            if (driver) {
                res.status(400).json({ success: false, data: null, error: [{ 'field': 'phone_number', message: 'Phone number already exists.' }], message: 'Invalid request' });
            } else {
                return next();
            }
        }).catch(error => {
            next(error);
        });
    },


    /**
     * Check phone number exists on driver add
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    checkPhoneNumberExistsCustomer(req, res, next) {
        let body = req.body;
        let phone_number_country = body.phone_number_country;
        let phone_number_country_code = body.phone_number_country_code;
        let phone_number = body.phone_number;
        let where = { phone_number_country, phone_number_country_code, phone_number };
        where.status = {$ne: "deleted"};
        // Condtion for edit driver
        if(req.params.id){
           where.id = {$ne: req.params.id};
        }

        Customer.find({ where }).then(driver => { 
            if (driver) {
                res.status(400).json({ success: false, data: null, error: [{ 'field': 'phone_number', message: 'Phone number already exists.' }], message: 'Invalid request' });
            } else {
                return next();
            }
        }).catch(error => {
            next(error);
        });
    },

    /**
     * Check phone number exists on driver add
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    checkEmailExistsDriver(req, res, next) {
        let body = req.body;
        let email = body.email.toLowerCase();
        let where = { email: email , status: {$ne: 'deleted'}};

         // Condtion for edit driver
        if(req.params.id){
           where.id = {$ne: req.params.id};
        }
        Driver.find({ where }).then(driver => { 
            if (driver) {
                res.status(400).json({ success: false, data: null, error: [{ 'field': 'email', message: 'Email already exists.' }], message: 'Invalid request' });
            } else {
                return next();
            }
        }).catch(error => {
            next(error);
        });
    },


     /**
     * Check phone number exists on driver add
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    checkEmailExistsCustomer(req, res, next) {
        let body = req.body;
        let email = body.email.toLowerCase();
        let where = { email: email , status: {$ne: 'deleted'}};

         // Condtion for edit driver
        if(req.params.id){
           where.id = {$ne: req.params.id};
        }
        Customer.find({ where }).then(driver => { 
            if (driver) {
                res.status(400).json({ success: false, data: null, error: [{ 'field': 'email', message: 'Email already exists.' }], message: 'Invalid request' });
            } else {
                return next();
            }
        }).catch(error => {
            next(error);
        });
    },
 
    /*
     * Check referal code
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    checkReferralCode(req, res, next) {
        let body = req.body;
        let where = {referral_code: body.referred_by};
        if(body.referred_by){ 
        
        Driver.find({ 
            where: where
        }).then(driver => { 
            if (!driver) {

                 Customer.find({ 
                        where: where
                    }).then(customer => { 
                        if (!customer) {
                           res.status(400).json({ success: false, data: null, error: [{ 'field': 'referred_by', message: 'Invalid referral code.' }], message: 'Invalid request' });
                        }else{ 
                            if(customer){
                                req.referral = { referred_by_type: 'customer'};
                            }
                            return next();  
                        }
                    })    
            } else { 
                if(driver){ 
                   req.referral = { referred_by_type: 'driver'};
                } 
                return next();
            }
        }).catch(error => {
            next(error);
        });

      }else{ 
          next();
      }
    },


    /**
     * Check Email exists on customer update
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    checkEmailExistsCustomerUpdate(req, res, next) {
        let email = req.body.email;
        Customer.find({ where: { email, id: { $ne: req.user.id } } }).then(customer => {
            if (customer) {
                res.status(400).json({ success: false, data: null, error: [{ 'field': 'email', message: 'Email already exists.' }], message: 'Invalid request' });
            } else {
                return next();
            }
        }).catch(error => {
            next(error);
        });
    },

    /**
     * Check admin authentication
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    checkAdminAuthenticated(req, res, next) {
        let token = getToken(req);
        let response = {};
        if (token) {

            UserToken.findOne({ where: { access_token: token }, include: [{ model: User, where: { status: 'active' } }] }).then(userToken => {

                if (!userToken) {
                    let error = new Error('Invalid access token');
                    error.status = 401;
                    next(error);
                } else {
                    let user = userToken.get().user;
                    user.access_token = token;
                    req.user = user;
                    return next(null, user, { scope: 'all' });
                }
            }).catch(error => {
                next(error);
            });
        } else {
            let error = new Error('User is not authenticated.');
            error.status = 401;
            next(error);
        }
    },

    /**
     * Check driver authentication
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    checkDriverAuthenticated(req, res, next) {
        let token = getToken(req);
        let response = {};
        if (token) {
            Driver.findOne({ where: { access_token: token } }).then(driver => {
                if (!driver) {
                    let error = new Error('Invalid access token');
                    error.status = 401;
                    next(error);
                } else {
                    if (driver.status === 'inactive') {
                        Driver.update({ access_token: null, device_id: null, device_type: null }, { where: { id: driver.id } }).then((affectedCount, affectedRows) => {

                        }).catch(error => {
                            return next(error);
                        });
                        let error = new Error('Your account has been deactivated. Please contact to support for any query.');
                        error.status = 403;
                        next(error);
                    } else {
                        req.user = driver;
                        return next(null, driver, { scope: 'all' });
                    }
                }
            }).catch(error => {
                next(error);
            });
        } else {
            let error = new Error('Driver is not authenticated.');
            error.status = 401;
            next(error);
        }
    },

    /**
     * Check customer authentication
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    checkCustomerAuthenticated(req, res, next) {
        let token = getToken(req);
        let response = {};
        if (token) {
            Customer.findOne({ where: { access_token: token } }).then(customer => {
                if (!customer) {
                    let error = new Error('Invalid access token');
                    error.status = 401;
                    next(error);
                } else {
                    if (customer.status === 'inactive') {
                        Customer.update({ access_token: null, device_id: null, device_type: null }, { where: { id: customer.id } }).then((affectedCount, affectedRows) => {

                        }).catch(error => {
                            return next(error);
                        });
                        let error = new Error('Your account has been deactivated. Please contact to support for any query.');
                        error.status = 403;
                        next(error);
                    } else {
                        req.user = customer;
                        return next(null, customer, { scope: 'all' });
                    }
                }
            }).catch(error => {
                next(error);
            });
        } else {
            let error = new Error('Customer is not authenticated.');
            error.status = 401;
            next(error);
        }
    },

    /**
     * Check butler authentication
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    checkButlerAuthenticated(req, res, next) {
       let headers=req.headers;
        let auth = (headers["Authorization"] || headers["authorization"]) ? headers["authorization"] : false;
       if(auth){
        let tmp = auth.split(' ');   
        let buffer = new Buffer(tmp[1], 'base64');
        let plain_auth = buffer.toString();        
        let credentials = plain_auth.split(':'); 
        let username = credentials[0];
        let password = credentials[1];        
        if((username == 'taxiappuk') && (password == 'df$-p@y0o%fc')) {
            next();}
                        else {
                            let error = new Error('Unauthorised.');
                            error.status = 401;
                            next(error);       
                        }
       } else {
        let error = new Error('Unauthorised.');
        error.status = 401;
        next(error); 
       }
        
    },

     /**
     * Check webdesk authentication
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next  
     * 
     */
    checkWebdeskAuthenticated(req, res, next) {
        let token = getToken(req);
        let response = {};
        if (token) {
            Customer.findOne({ where: { access_token: token, customer_type:'webdesk' } }).then(customer => {
                if (!customer) {
                    let error = new Error('Invalid access token');
                    error.status = 401;
                    next(error);
                } else {
                    if (customer.status === 'inactive') {
                        Customer.update({ access_token: null, device_id: null, device_type: null }, { where: { id: customer.id } }).then((affectedCount, affectedRows) => {

                        }).catch(error => {
                            return next(error);
                        });
                        let error = new Error('Your account has been deactivated. Please contact to support for any query.');
                        error.status = 403;
                        next(error);
                    } else {
                        req.user = customer;
                        return next(null, customer, { scope: 'all' });
                    }
                }
            }).catch(error => {
                next(error);
            });
        } else {
            let error = new Error('User is not authenticated.');
            error.status = 401;
            next(error);
        }
    },


}

let getToken = (req) => {
    let token;    
    if (req.headers && (req.headers.access_token||req.headers["access-token"])) {
        token = req.headers.access_token?req.headers.access_token:req.headers["access-token"];
    }

    if (req.body && req.body.access_token) {
        token = req.body.access_token;
    }

    if (req.query && req.query.access_token) {
        token = req.query.access_token;
    }

    if (req.query && req.params.access_token) {
        token = req.params.access_token;
    }
    return token;
}

export default authController;