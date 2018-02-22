
/// EXAMPLE MONGODB QUERIES AND SEVICES


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

function _login(model) {
    return conn.db().collection('leadr_user').find({ email: { $eq: model.email } })
        .map(user => {
            return user
        })
        .next()
}

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
//////// Information Omitted for Security
//////// Information Omitted for Security
//////// Information Omitted for Security
//////// Information Omitted for Security
//////// Information Omitted for Security
//////// Information Omitted for Security
//////// Information Omitted for Security
//////// Information Omitted for Security
//////// Information Omitted for Security
    ]).toArray()
}


