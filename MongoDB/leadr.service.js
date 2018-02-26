const Lead = require('../models/lead')
const mongodb = require('../mongodb')
const conn = mongodb.connection
const ObjectId = mongodb.ObjectId

module.exports = {
    readAll: readAll,
    readAllExt: readAllExt,
    readById: readById,
    create: create,
    update: update,
    updateNotesInLeads: _updateNotesInLeads,
    updatePaidLeadsStatus: _updatePaidLeadsStatus,
    updateStatus: _updateStatus,
    delete: _delete,
    readMetricsLeadByDate: _readMetricsLeadByDate,
    readByUserId: readByUserId,
    readByIdExt: readByIdExt,
    getByProviderId: _getByProviderId,
    getPaidLeads: _getPaidLeads,
    updateSinglePaidLeadsStatus: _updateSinglePaidLeadsStatus,
    getUserByLeadId: _getUserByLeadId,
    paypalBatch: _paypalBatch,
    updateBatchPayout:_updateBatchPayout
}

// .. Omitted

// .. Omitted

function readByUserId(id, count) {
    return conn.db().collection('leads').aggregate([{
        "$sort": {
            "dateUpdated": -1
        }
    },
    {
        "$limit": Number(count)
    },
    {
        "$lookup": {
            "from": "providerService",
            "localField": "serviceId",
            "foreignField": "_id",
            "as": "providerService"
        }
    },
    {
        "$unwind": "$providerService"
    },
    {
        "$addFields": {
            "providerServiceInfo": {
                "description": "$providerService.description"
            }
        },
    },
    {
        "$project": {
            "providerData": 0,
            "userData": 0,
            "providerService": 0
        }
    }
    ]).toArray()
}

// .. Omitted

function _updatePaidLeadsStatus(doc, batchId) {
    let closedLeads = doc.map(paidLeads => {
        return new ObjectId(paidLeads._id)
    })
    return conn.db().collection("leads").update({ _id: { $in: closedLeads } }, {
        $set: {
            status: "Paid",
            batchId: batchId
        }
    }, { multi: true }).then(result => Promise.resolve())

}

//.. Omitted
// .. Omitted
// ... Omitted

//.... Omitted

function _getByProviderId(id, count) {
    return conn.db().collection('leads').aggregate([{
        "$sort": {
            "dateUpdated": -1
        }
    },
    {
        "$limit": Number(count)
    },
    {
        "$match": { "providerId": new ObjectId(id) }
    },
    {
        "$lookup": {
            "from": "providerService",
            "localField": "providerId",
            "foreignField": "providerId",
            "as": "providerService"
        }
    },
    {
        "$unwind": "$providerService"
    },
    {
        "$addFields": {
            "providerServiceInfo": {
                "description": "$providerService.description"
            }
        },
    },
    {
        "$project": {
            "providerData": 0,
            "userData": 0,
            "providerService": 0
        }
    }
    ]).toArray()
}

function readAllExt(leadStatus) {
    return conn.db().collection('leads').aggregate([{
        "$match": { "status": leadStatus }
    },
    {
        "$lookup": {
            "from": "provider",
            "localField": "providerId",
            "foreignField": "_id",
            "as": "providerName"
        }
    },
    {
        "$lookup": {
            "from": "providerService",
            "localField": "serviceId",
            "foreignField": "_id",
            "as": "serviceName"
        }
    },
    {
        "$lookup": {
            "from": "leadr_user",
            "localField": "userId",
            "foreignField": "_id",
            "as": "userInfo"
        }
    },
    {
        "$unwind": "$providerName"
    },
    {
        "$unwind": "$serviceName"
    },
    {
        "$unwind": "$userInfo"
    },
    {
        "$addFields": {
            "provider": {
                "providerName": "$providerName.providerName"
            },
            "service": {
                "serviceDescription": "$serviceName.description",
                "serviceAmount": "$serviceName.paymentAmount",
                "serviceType": "$serviceName.paymentType"
            },
            "user": {
                "firstName": "$userInfo.firstName",
                "lastName": "$userInfo.lastName",
                "email": "$userInfo.email"
            }
        }
    },
    {
        "$project": {
            "providerName": 0,
            "serviceName": 0,
            "notes": 0,
            "status": 0,
            "description": 0,
            "providerId": 0,
            "serviceId": 0,
            "userId": 0,
            "userInfo": 0,
            "contact": 0,
            "company.city": 0,
            "company.state": 0,
            "providerData": 0,
            "userData": 0,
            "fileAttachment": 0
        }
    }
    ]).toArray()
}

//... Omitted

//... Omitted

/// Omitted

// Omitted

// .. Omitted









