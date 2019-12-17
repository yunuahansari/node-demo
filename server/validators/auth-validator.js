import utils from '../utils';

let validator = utils.validator;


/**
 * Validate create user request
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
function validateUser(req, res, next) {
    let bodyData = req.body;
    let errors = [];
    let rules = {
        first_name: [
            { type: 'required', message: 'First name is required.' },
            { type: 'length', options: { min: 2, max: 50 }, message: 'First name length must be between 2 to 50.' }
        ],
        last_name: [
            { type: 'required', message: 'Last name is required.' },
            { type: 'length', options: { min: 2, max: 50 }, message: 'Last name length must be between 2 to 50.' }
        ],
        email: [
            { type: 'required', message: 'Email is required.' },
            { type: 'email', message: 'Email should be valid format.' }
        ],
        //            password: [
        //                { type: 'required', message: 'Password is required.' },
        //                { type: 'length', options: { min: 8, max: 14 }, message: 'Password length must be between 8 to 14.' }
        //            ],
    };
    errors = validator.validateModel(bodyData, rules);
    if (errors.length) {
        res.status(400).json({ success: false, data: null, error: errors, message: 'Invalid request' });
    } else {
        next();
    }
}

/**
 * Validate reset password request
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
function validateResetPassword(req, res, next) {
    let bodyData = req.body;
    let errors = [];
    let rules = {
        token: [
            { type: 'required', message: 'Token is required.' }
        ],
        password: [
            { type: 'required', message: 'Password is required.' },
            { type: 'length', options: { min: 7, max: 14 }, message: 'Password length must be between 8 to 14.' }
        ],
    };
    errors = validator.validateModel(bodyData, rules);
    if (errors.length) {
        res.status(400).json({ success: false, data: null, error: errors, message: 'Invalid request' });
    } else {
        next();
    }
}

/**
 * Validate change password request
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
function validateChangePassword(req, res, next) {
    let bodyData = req.body;
    let errors = [];
    let rules = {
        current_password: [
            { type: 'required', message: 'Current password is required.' },
            { type: 'length', options: { min: 7, max: 14 }, message: 'Current password length must be between 7 to 14.' }
        ],
        new_password: [
            { type: 'required', message: 'New password is required.' },
            { type: 'length', options: { min: 7, max: 14 }, message: 'New password length must be between 7 to 14.' }
        ],
    };
    errors = validator.validateModel(bodyData, rules);
    if (errors.length) {
        res.status(400).json({ success: false, data: null, error: errors, message: 'Invalid request' });
    } else {
        next();
    }
}

/**
 * Validate user login request
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
function validateUserLogin(req, res, next) {
    let bodyData = req.body;
    let errors = [];
    let rules = {
        email: [
            { type: 'required', message: 'Email is required.' },
            { type: 'email', message: 'Email should be valid format.' }
        ],
        password: [
            { type: 'required', message: 'Password is required.' },
        ],

    };
    errors = validator.validateModel(bodyData, rules);
    if (errors.length) {
        res.status(400).json({ success: false, data: null, error: errors, message: 'Invalid email or password' });
    } else {
        next();
    }
}

export { validateUser, validateResetPassword, validateUserLogin, validateChangePassword };;