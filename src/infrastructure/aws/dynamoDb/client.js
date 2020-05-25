const AWS = require("aws-sdk");

const options = process.env.IS_OFFLINE
  ? {
    region: "localhost",
    endpoint: "http://localhost:9000",
    accessKeyId: "DEFAULT_ACCESS_KEY",
    secretAccessKey: "DEFAULT_SECRET"
  }
  : {};
const client = new AWS.DynamoDB.DocumentClient(options);

export { client };
