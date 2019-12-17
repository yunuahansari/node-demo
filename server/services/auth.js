'use strict';

import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import models from '../models';


let User = models.user;
let UserToken = models.user_token;


let signupLocalStrategy = new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,
}, (req, username, password, done) => {
    console.log(username);
//    User.findOne({
//        where: { email: username }
//    }).then(data => {
//        let user = data ? data.get() : null;
//        if (user) {
//            let error = new Error('Email already exists');
//            error.name = 'EMAIL_EXISTS';
//            return done(error, false);
//        } else {
//            bcrypt.hash(password, 10).then(hash => {
//                let userData = {
//                    first_name: req.body.first_name || '',
//                    last_name: req.body.last_name || '',
//                    email: username,
//                    password: hash,
//                    phone_number: req.body.phone_number || '',
//                    mobile_number: req.body.mobile_number || '',
//                    gender: req.body.gender || '',
//                    address_line1: req.body.address_line1 || '',
//                    address_line2: req.body.address_line2 || '',
//                    state: req.body.state || '',
//                    city: req.body.city || '',
//                    zip_code: req.body.zip_code || ''
//                }
//                User.create(userData).then(newUser => {
//                    let user = Object.assign({}, newUser.get());
//                    delete user.password;
//                    return done(null, user || false);
//                }).catch(error => {
//                    return done(error, false);
//                });
//            }).catch(error => {
//                return done(error, false);
//            });
//        }
//    }).catch(error => {
//        return done(error, false);
//    });

    //return done(null, {});
});

let loginLocalStrategy = new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,
}, (req, username, password, done) => {
    
    let response = {};
    let bodyData = req.body;
    let requestFrom = bodyData.source || '';
    let deviceId = bodyData.device_id;
    let deviceType = bodyData.device_type;
    let userType = (requestFrom === 'mobile') ? [] : [{ user_type: 'admin' }];
     console.log(username);
    User.findOne({
        where: {
            email: username,
           // $or: userType,
//            status: 'active'
        },
        include: [{
            model: UserToken
        }]
    }).then(data => {
        console.log(data);
        let user = data ? data.get() : null;
        if (user) {
            bcrypt.compare(password, user.password).then(res => {
                if (res) {
                    delete user.password;
                    response = Object.assign({}, user);
                    response.extraData = { device_id: deviceId, device_type: deviceType };                   
                        return done(null, response);                   
                } else {
                    let error = new Error('Invalid email or password');
                    return done(error, false);
                }
            }).catch(error => {
                console.log(error);
                return done(error, false);
            });
        } else {
            let error = new Error('Invalid email or password');
            return done(error, false);
        }
    }).catch(error => {
        return done(error, false);
    });

});


passport.use('signup', signupLocalStrategy);
passport.use('login', loginLocalStrategy);

passport.serializeUser((user, done) => {
    let createAccessToken = () => {
        let token = User.generateToken();
        UserToken.findOne({ where: { access_token: token }, attributes: ['access_token', 'user_id'] }).then(data => {
            let existingUser = data ? data.get() : null;
            if (existingUser) {
                createAccessToken();
            } else {
                if (user.user_token) {
                    UserToken.update({
                        access_token: token,
                        device_id: user.extraData.device_id,
                        device_type: user.extraData.device_type,
                    }, { where: { user_id: user.id } }).then(afftectedRows => {
                        delete user.extraData;
                        user.user_token.access_token = token;
                        return done(null, token);
                    }).catch(error => {
                        delete user.extraData;
                        return done(error, false);
                    });
                } else {
                    let tokenData = {
                        access_token: token,
                        device_id: user.extraData.device_id,
                        device_type: user.extraData.device_type,
                        user_id: user.id
                    };
                    UserToken.create(tokenData).then(userToken => {
                        user.user_token = userToken;
                        delete user.extraData;
                        user.user_token.access_token = token;
                        return done(null, token);
                    }).catch(error => {
                        delete user.extraData;
                        return done(error, false);
                    });
                }
            }
        }).catch(error => {
            return done(error, false);
        });;
    };

    if (user && user.id) {
        createAccessToken();
    }
});

passport.deserializeUser((token, done) => {
    UserToken.findOne({ where: { access_token: token } }).then(data => {
        let user = data ? data.get() : null;
        return done(error, user);
    }).then(error => {
        return done(error, false);
    });;
});