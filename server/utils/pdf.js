'use strict';
import pdf from "html-pdf";
import path from "path";
import fs from 'fs';

import config from '../config';

export default {
    /**
     * Generate templates
     * @param {object} model 
     * @param {object} rules 
     * @param {array} errors 
     */
    generatePDF(req, callback) {  
        let html = req.html;
        let current_time = Date.now();
        let fileName = (req.file_name) ? (req.file_name+'-'+current_time+'.pdf') : (current_time+'.pdf');
        let upload_folder_path = path.join(__dirname, `../uploads/pdf/`);
        let filePath = upload_folder_path+fileName; 
        //let options = { format: 'A4', orientation: 'portrait',type: "pdf" };
        let options = {};
       
        pdf.create(html, options).toFile(filePath, function(err, response) {
          if(err){
              callback(err);
          }else {
              let filePath = config.app.baseUrl+'assets/pdf/'+fileName;
              callback(null, {filepath: filePath}); 
          }
          
        });       
    },
 
}