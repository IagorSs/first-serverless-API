const AWS = require("aws-sdk");

const api = {};

const TABLE_NAME = process.env.TABLE_NAME;

api.handler = async (event) => {
    let response = {};
    
    console.log(event);
    
    try {
        response.body = JSON.stringify(await api.handleCreateUser(JSON.parse(event.body)));
        response.statusCode = 200;
    } catch (e) {
        response.body = JSON.stringify(e);
        response.statusCode = 500;
    }
    
    return response;
}

api.handleCreateUser = async (userObject) => {
    return new Promise((resolve, reject) => {
        const client = new AWS.DynamoDB.DocumentClient();
        
        const params = {
            TableName: TABLE_NAME,
            Item: userObject
        }
        
        client.put(params, (err, data) => {
            if (err) reject(err);
            else resolve(data)
        });
    })
    
}

module.exports = api;
