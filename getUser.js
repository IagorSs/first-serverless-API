const AWS = require("aws-sdk");

const api = {};

const TABLE_NAME = process.env.TABLE_NAME;

api.handler = async (event) => {
    let response = {};
    
    try {
        if (event.pathParameters)
            response.body = JSON.stringify(await api.handleGetUserById(event.pathParameters.id));
        else
            response.body = JSON.stringify(await api.handleGetUsers());
        
        response.statusCode = 200;
    } catch (e) {
        response.body = JSON.stringify(e);
        response.statusCode = 500;
    }
    
    return response;
}

api.handleGetUsers = async () => {
    return new Promise((resolve, reject) => {
        const client = new AWS.DynamoDB.DocumentClient();
        
        const params = {
            TableName : TABLE_NAME,
        };
        
        client.scan(params, (err, data) => {
            if (err) reject(err);
            else resolve(data)
        });
    })
    
}

api.handleGetUserById = async (userId) => {
    return new Promise((resolve, reject) => {
        const client = new AWS.DynamoDB.DocumentClient();
        
        const params = {
            TableName : TABLE_NAME,
            Key: {
                user_id: userId,
            }
        };
        
        client.get(params, (err, data) => {
            if (err) reject(err);
            else resolve(data)
        });
    })
}

module.exports = api;
