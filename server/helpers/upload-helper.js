'use strict';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
/**
 * upload files
 * @param {object} options 
 */

let getStorage = function(options) {
    return multer.diskStorage({
        destination: function(req, file, next) {
            if (file) {
                next(null, getDestination(file.fieldname, options.destination))
            }
        },
        filename: function(req, file, next) {
            if (file) {
                var name = file.originalname.replace(/\W+/g, '-').replace(/\s+/g, '').toLowerCase() + Date.now();;
                next(null, name + path.extname(file.originalname));
            }
        }
    })
};

let getDestination = function(fieldname, defaultDestination) {
    let dirPath;
    switch (fieldname) {
        case `primary_parent_photo`:
            dirPath = path.join(__dirname, `../uploads/user`);
            break;
        case `secondary_parent_photo`:
            dirPath = path.join(__dirname, `../uploads/parent`);
            break;
        case `document_file`:
            dirPath = path.join(__dirname, `../uploads/document`);
            break;
        default:
            dirPath = defaultDestination;
    }

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    return dirPath;
};

let uploadHelper = function(options) {
    return multer({ storage: getStorage(options) });
};

export default uploadHelper;