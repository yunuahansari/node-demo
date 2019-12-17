'use strict';

import emailer from './base-emailer';
import utils from '../utils';
import config from '../config';

export default {
    /**
     * Send email on forgot password
     * @param {Object} data 
     */
    forgotPassword(data) {
        let message = `Hi Admin, <br/>
     Sorry to hear you’re having trouble logging into Taxi. This is your reset password token:${
       data.token
     }
     We can help you get right back into your account. 
     <a href="http://six-taxi-web.codiant.com/#/reset-password/${data.token}">Click here</a> to reset your password.`;
        let options = {
          to: data.to,
          subject: "Reset password",
          message
        };
        return emailer.sendEmail(options);
    },
     
    
    /**
     * Send email on ride complete
     * @param {Object} ride
     * @param {Number} ride_amount
     */
    completeRide(ride,ride_amount) {               
        let pickUpAddress = ride.pick_up_address;
        let dropOffAddress = ride.drop_off_address;
        let amount = ride_amount;
        let paymentType = ride.payment_type=='credit_card'?'Credit Card':'Cash';
        let customerName = ride.customer.name;
        let driverName = ride.driver.name;
        let bookingDate = ride.booking_date;
        let plateNumber = ride.driver.car_registration_number;
        let issueDate = new Date();        
        let duration = utils.utlis.dateDifference(ride.start_date,issueDate);
        let imageUrl="http://taxiapp.uk.com/assets/email-template";
        

        let message = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                <title>Taxiapp UK</title>
                <style type="text/css">
                        table       {mso-table-lspace:0pt;mso-table-rspace:0pt;}
                        td,th       {border-collapse:collapse;}
                        td a img      {text-decoration:none;border:none;}
                        body{margin:0;padding:0px;  }
                </style>
            </head>
            <body>        
                <table  width="800" cellpadding="0" style="border-collapse: collapse; background-color:#F9F9F9;table-layout:fixed;margin:0 auto;font-family: Tahoma,Geneva,sans-serif;">
                    <tbody>
                        <tr>
                            <td colspan="2" >
                               <table style="margin:0px;padding:0px;width:100%;">
                                    <tr>
                                        <td background="${imageUrl}/logo-bg.png" style="width:100% ; background-repeat:no-repeat;height:295px; z-index: 99999999999;">
                                            <div style="text-align:right;float:right;margin-right:40px;margin-top:180px; ">
                                                <p style="font-weight:600;font-size:18px;color:#58595A;">Receipt / Tax invoice</p>
                                                <p style="font-size:15px;color:#58595A;">Issued on: ${issueDate}</p>
                                                <p style="font-size:15px;color:#58595A;">trip billed on: ${issueDate}</p>
                                            </div>
                                        </td>
                                    </tr>
                               </table>
                            </td>   
                        </tr>                
                        <tr>
                            <td colspan="2" style="padding:30px 20px 10px;"> 
                                <table width="100%" cellspacing="0" style="background-color:#fff;border:1px solid #EEEEEE;">
                                    <tbody>
                                        <tr>
                                            <td style="padding:10px 20px;height:60px;vertical-align:middle;font-weight:600;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;">Pickup Location</p>
                                            </td>
                                            <td style="text-align: right;padding:10px 20px;height:60px;vertical-align:middle;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;">${pickUpAddress}</p>
                                            </td>
                                        </tr>
        
                                        <tr>
                                            <td style="padding:10px 20px;height:60px;vertical-align:middle;font-weight:600;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;">Dropoff Location</p>
                                            </td>
                                            <td style="text-align: right;padding:10px 20px;height:60px;vertical-align:middle;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;">${dropOffAddress || '-'}</p>
                                            </td>
                                        </tr>
        
                                        <tr>
                                            <td style="padding:10px 20px;height:60px;vertical-align:middle;font-weight:600;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;"> Trip Requested on</p>
                                            </td>
                                            <td style="text-align: right;padding:10px 20px;height:60px;vertical-align:middle;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;">${bookingDate}</p>
                                            </td>
                                        </tr >
        
                                        <tr>
                                            <td style="padding:10px 20px;height:60px;vertical-align:middle;font-weight:600;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;">Driver</p> 
                                            </td>
                                            <td style="text-align: right;padding:10px 20px;height:60px;vertical-align:middle;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;">${driverName}</p>
                                            </td>
                                        </tr>
        
                                        <tr>
                                            <td style="padding:10px 20px;height:60px;vertical-align:middle;font-weight:600;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;"> Vehicle Info</p>
                                            </td>
                                            <td style="text-align: right;padding:10px 20px;height:60px;vertical-align:middle;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;">${plateNumber}</p>
                                            </td>
                                        </tr>        
                                       
        
                                        <tr style="border-bottom:1px solid #ccc;">
                                            <td style="padding:10px 20px;height:60px;vertical-align:middle;font-weight:600;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;">Duration</p>
                                            </td>
                                            <td style="text-align: right;padding:10px 20px;height:60px;vertical-align:middle;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;">${duration}</p>
                                            </td>
                                        </tr>
        
                                        <tr>
                                            <td style="padding:10px 20px;height:60px;vertical-align:middle;font-weight:600;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;">Billed to</p>
                                            </td>
                                            <td style="text-align: right;padding:10px 20px;height:60px;vertical-align:middle;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;">${customerName}</p>
                                            </td>
                                        </tr>
        
                                        <tr>
                                            <td style="padding:10px 20px;height:60px;vertical-align:middle;font-weight:600;border-bottom:1px solid #EEEEEE;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;">Total</p>
                                            </td>
                                            <td style="text-align: right;padding:10px 20px;height:60px;vertical-align:middle;border-bottom:1px solid #EEEEEE;color:#F69304;font-size:16px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;">$${amount} Paid with ${paymentType}</p>
                                            </td>
                                        </tr>
        
                                        <tr>
                                            <td style="padding:10px 20px;height:60px;vertical-align:middle;font-weight:600;border-bottom:1px solid #EEEEEE;font-size:20px;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;">Contact us :  </p>
                                            </td>
                                            <td style="text-align: right;padding:10px 20px;height:60px;vertical-align:middle;border-bottom:1px solid #EEEEEE;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;">
                                                    <a href="mailto:support@taxiapp.freshdesk.com" style="color:#3082D4;text-decoration:none;display:block;font-size:18px;">support@taxiapp.freshdesk.com</a></td>
                                            </p>
                                        </tr>
        
                                        <tr>
                                            <td style="padding:10px 20px;height:60px;vertical-align:middle;font-weight:600;border-bottom:1px solid #EEEEEE;font-size:20px;width:36%;">
                                                <p style="margin:0;font-family: Tahoma,Geneva,sans-serif;color:#58595A;white-space:nowrap;line-height: 60px;">Share app with friends </p>
                                            </td>
                                            <td style="text-align: right;padding:10px 20px;height:60px;vertical-align:middle;border-bottom:1px solid #EEEEEE;">
                                                <a href="https://www.facebook.com/Taxiapp.uk/" style="text-decoration:none;display:inline-block;"><img src="${imageUrl}/facebook-icon.png" alt="icon" style="width:40px;" /></a>
                                                &nbsp;&nbsp;
                                                <a href="https://www.instagram.com/taxiappuk/" style="text-decoration:none;display:inline-block;"><img src="${imageUrl}/instagram.png" alt="icon" style="width:40px;" /></a>
                                                &nbsp;&nbsp;
                                                <a href="https://twitter.com/TaxiappLdn" style="text-decoration:none;display:inline-block;"><img src="${imageUrl}/twitter-icon.png" alt="icon" style="width:40px;" /></a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
        
                            </td>
        
                        </tr>
        
                        <tr>
                            <td colspan="2">
                                <img src="${imageUrl}/bottom-bg.png" alt="bg-image" style="max-width:100%;" />
                            </td>
                        </tr>
        
                    </tbody>
                </table>
        
            </body>
        </html>`;
        let email = (ride.customer && ride.customer.email) ? ride.customer.email : false;
       
        if(email){
            let options = {
                to: email,
                subject: 'Taxiapp Invoice',
                message
            }
            return emailer.sendEmail(options);
        }
       
    },

};