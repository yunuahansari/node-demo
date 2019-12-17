import utils from '../utils';

let validator = utils.validator;


/**
 * Validate customer address
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
function validateCustomerAddress(req, res, next) {
    let bodyData = req.body;
    let errors = [];
    let rules = {
        name: [
            { type: 'required', message: 'Name is required.' },
            { type: 'length', options: { min: 2, max: 50 }, message: 'Name length must be between 2 to 50.' }
        ],
        address: [
            { type: 'required', message: 'Address is required.' },
            { type: 'length', options: { min: 3, max: 200 }, message: 'Address length must be between 3 to 200.' }
        ],
        latitude: [
            { type: 'required', message: 'Latitude is required.' }
        ],
        longitude: [
            { type: 'required', message: 'Longitude is required.' }
        ]
    };
    errors = validator.validateModel(bodyData, rules);
    if (errors.length) {
        res.status(400).json({ success: false, data: null, error: errors, message: 'Invalid request' });
    } else {
        next();
    }
}


export { validateCustomerAddress };