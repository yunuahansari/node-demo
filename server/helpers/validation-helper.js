'use strict';
import validator from 'validator';

export default {
    /**
     * Validate model
     * @param {object} model 
     * @param {object} rules 
     * @param {array} errors 
     */
    validateModel(model, rules) {
        let errors = [];
        for (let field in rules) {
            let data = rules[field];
            let isNext = true;
            let ruleTypes = [];
            let messages = {};
            let value = model[field] || '';
            data.forEach(data => {
                ruleTypes.push(data.type);
                messages[data.type] = data;
            });

            if (ruleTypes.indexOf('required') !== -1) {
                if (this.isEmpty(value)) {
                    isNext = false;
                    errors.push({ field, message: messages['required'].message });
                }
            }
            if (ruleTypes.indexOf('email') !== -1 && isNext) {
                if (value && !this.isValidEmail(value)) {
                    isNext = false;
                    errors.push({ field, message: messages['email'].message });
                }
            }
            if (ruleTypes.indexOf('integer') !== -1 && isNext) {
                if (value && !this.isValidInt(value)) {
                    isNext = false;
                    errors.push({ field, message: messages['integer'].message });
                }
            }
            if (ruleTypes.indexOf('length') !== -1 && isNext) {
                if (value && !this.isValidLength(value, messages['length'].options.min, messages['length'].options.max)) {
                    isNext = false;
                    errors.push({ field, message: messages['length'].message });
                }
            }
            if (ruleTypes.indexOf('date') !== -1 && isNext) {
                if (value && !this.isValidDate(value)) {
                    isNext = false;
                    errors.push({ field, message: messages['date'].message });
                }
            }
            if (ruleTypes.indexOf('range') !== -1 && isNext) {
                if (value && !this.isValidRange(value, messages['range'].options.min, messages['range'].options.max)) {
                    isNext = false;
                    errors.push({ field, message: messages['range'].message });
                }
            }
            if (ruleTypes.indexOf('greater') !== -1 && isNext) {
                if (value && !this.isGreater(value, messages['greater'].options.val)) {
                    isNext = false;
                    errors.push({ field, message: messages['greater'].message });
                }
            }
            if (ruleTypes.indexOf('less') !== -1 && isNext) {
                if (value && !this.isGreater(value, messages['less'].options.val)) {
                    isNext = false;
                    errors.push({ field, message: messages['less'].message });
                }
            }
            if (ruleTypes.indexOf('time') !== -1 && isNext) {
                if (value && !this.isValidTime(value)) {
                    isNext = false;
                    errors.push({ field, message: messages['time'].message });
                }
            }
            if (ruleTypes.indexOf('array') !== -1 && isNext) {
                if (value && !this.isArray(value)) {
                    isNext = false;
                    errors.push({ field, message: messages['array'].message });
                }
            }
        }
        return errors;
    },

    /**
     * Check field name is array
     * 
     * @param {object} data    
     */
    isArray(data) {
        if (Array.isArray(data)) {
            return true;
        }
        return false;
    },

    /**
     * Check field is not empty
     * 
     * @param {object} data      
     */
    isEmpty(data) {
        if (validator.isEmpty(data)) {
            return true;
        }
        return false;
    },

    /**
     * Check field is valid email
     * 
     * @param {object} data     
     */
    isValidEmail(data) {
        if (validator.isEmail(data)) {
            return true;
        }
        return false;
    },

    /**
     * Check field length is valid
     * 
     * @param {object} data     
     */
    isValidLength(data, min, max) {
        if (validator.isLength(data, { min, max })) {
            return true;
        }
        return false;
    },
    /**
     * Check field value is valid
     * 
     * @param {object} data     
     */
    isValidRange(data, min, max) {
        if (validator.isInt(data, { min, max })) {
            return true;
        }
        return false;
    },

    /**
     * Check field is integer
     * 
     * @param {object} data    
     */
    isValidInt(data, min, max) {
        if (validator.isInt(data)) {
            return true;
        }
        return false;
    },
    /**
     * Check field is greater
     * 
     * @param {object} data    
     */
    isGreater(data, val) {
        if (validator.isInt(data, { gt: val })) {
            return true;
        }
        return false;
    },
    /**
     * Check field is greater
     * 
     * @param {object} data    
     */
    isLess(data, val) {
        if (validator.isInt(data, { lt: val })) {
            return true;
        }
        return false;
    },
    /**
     * Check field is date
     * 
     * @param {object} data    
     */
    isValidDate(data) {
        if (validator.toDate(data)) {
            return true;
        }
        return false;
    },

    /**
     * Check field is time
     * 
     * @param {object} data    
     */
    isValidTime(data) {
        if (this.checkPattern(data, /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/)) {
            return true;
        }
        return false;
    },

    /**
     * Check field pattern
     * 
     * @param {object} data    
     */
    checkPattern(data, pattern) {
        if (validator.matches(data, pattern)) {
            return true;
        }
        return false;
    },

}