const paypalService = require('../paypal')
const paypal = paypalService.paypal


module.exports = {
    disbursePayment: _paypalService
}

function _paypalService(data, id) {

    let paypalDisbursedPayment = new Promise(function (resolve, reject)  {
       var senderBatchId = id 
        
        const leads = data.map(leads => {
            return {
                "recipient_type": "EMAIL",
                "amount": {
                    "value": leads.service.serviceAmount,
                    "currency": "USD"
                },
                "receiver": leads.user.email,
                "note": "Thank you.",
                "sender_item_id": leads._id
            }
        })
        const create_payout_json = {
             "sender_batch_header":
             {
                "sender_batch_id": senderBatchId,
                "email_subject": "You have a payment"
            },

            "items": leads
        };
        const sync_mode = 'false';

        paypal.payout.create(create_payout_json, sync_mode, function (error, payout) {
            if (error) {
                reject(error.response);
            } else {

                resolve(payout)
            }
        });
    })
    
    return paypalDisbursedPayment
}
