'use strict';

import models from '../models';

let User = models.user;
let Admin = models.admin;
let Setting = models.setting;

export default {
    /**
     * Insert Default record
     * 
     * @param {string} userID 
     * @param {string} userType 
     * 
     */
    insertDefaultRecord() {  
        User.findOne({
            where: { user_type: 'super_admin'}
        })
        .then(user=>{ 
            if(!user){
                User.create({
                  email: 'admin@domain.com',
                  password: '$2a$10$7067DZl/b80oyONVu9PtQe3dg5hhBbQzwtAqQJM7wJaFzR/xjV1b6',
                  user_type: 'super_admin'           
                }).then(userObj=>{
                    if(userObj){
                        // Admin.create({
                        //   name: 'super_admin',
                        //   user_id: userObj.id           
                        // })
                    }
                });
            }
        })

        // Create Default Settings
        // Setting.count()
        // .then(setting=>{
        //     if(!setting){

        //     }
        //  })
            
    },

}