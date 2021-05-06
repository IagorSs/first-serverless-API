const AWS = require("aws-sdk");

const api = {};

const TABLE_NAME = process.env.TABLE_NAME;

api.handler = async (event) => {
    let response = {};
    
    try {
        response.body = JSON.stringify(await api.handleUpdateUserById(event.pathParameters.id, JSON.parse(event.body)));
        response.statusCode = 200;
    } catch (e) {
        response.body = JSON.stringify(e);
        response.statusCode = 500;
    }
    
    return response;
}

api.handleUpdateUserById = async (userId, userObject) => {
    return new Promise((resolve, reject) => {
        const client = new AWS.DynamoDB.DocumentClient();
        
        let UpdateExpression='set';
        let ExpressionAttributeNames={};
        let ExpressionAttributeValues = {};
        
        for (const property in userObject) {
            UpdateExpression += ` #${property} = :${property} ,`;
            ExpressionAttributeNames['#'+property] = property ;
            ExpressionAttributeValues[':'+property]=userObject[property];
        }
        
        UpdateExpression = UpdateExpression.slice(0, -1);
        
        const params = {
            TableName : TABLE_NAME,
            Key: {
                user_id: userId,
            },
            UpdateExpression,
            ExpressionAttributeValues,
            ExpressionAttributeNames
        };
        
        client.update(params, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    })
}

module.exports = api;
