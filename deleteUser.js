const AWS = require("aws-sdk");

const api = {};

const TABLE_NAME = process.env.TABLE_NAME;

api.handler = async (event) => {
    let response = {};
    
    try {
        response.body = JSON.stringify(await api.handleDeleteUserById(event.pathParameters.id));
        response.statusCode = 200;
    } catch (e) {
        response.body = JSON.stringify(e);
        response.statusCode = 500;
    }
    
    return response;
}

api.handleDeleteUserById = async (userId) => {
    return new Promise((resolve, reject) => {
        const client = new AWS.DynamoDB.DocumentClient();
        
        const params = {
            TableName : TABLE_NAME,
            Key: {
                user_id: userId
            }
        };
        
        client.delete(params, (err, data) => {
            if (err) reject(err);
            else resolve(data)
        });
    })
    
}

module.exports = api;
