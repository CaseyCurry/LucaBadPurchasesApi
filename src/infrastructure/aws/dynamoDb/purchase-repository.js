// TODO: unit test
import { Purchase } from "../../../domain/aggregates/purchase";
import { client } from "./client";

const table = process.env.purchasesTable;

const scrub = purchase => {
  const scrubbedPurchase = { ...purchase };
  /* The isFlaggedIndexed and isBadIndexed property is used in secondary indexes.
     If the purchase is either bad or flagged the indexed property will
     exist and the purchase will be included in the index. DynamoDB doesn't
     support range indexes on booleans, so this is being set to a number. */
  if (scrubbedPurchase.isFlagged) {
    scrubbedPurchase.isFlaggedIndexed = 1;
  }
  if (scrubbedPurchase.isBad) {
    scrubbedPurchase.isBadIndexed = 1;
  }
  return scrubbedPurchase;
};

const purchaseRepository = {
  create: purchase => {
    return client
      .put({
        TableName: table,
        Item: scrub(purchase),
        ReturnValues: "NONE"
      })
      .promise();
  },
  update: purchase => {
    return client
      .put({
        TableName: table,
        Item: scrub(purchase),
        ReturnValues: "NONE"
      })
      .promise();
  },
  getById: (tenantId, id) => {
    return client
      .query({
        TableName: table,
        KeyConditionExpression: "tenantId = :tenantId and id = :id",
        ExpressionAttributeValues: {
          ":tenantId": tenantId,
          ":id": id
        },
        ReturnConsumedCapacity: "NONE"
      })
      .promise()
      .then(data => {
        if (data.Count) {
          const purchase = new Purchase(data.Items[0]);
          return purchase;
        }
      });
  },
  getFlagged: tenantId => {
    return client
      .query({
        TableName: table,
        IndexName: "ByFlagged",
        KeyConditionExpression: "tenantId = :tenantId",
        ExpressionAttributeValues: { ":tenantId": tenantId }
      })
      .promise()
      .then(data => {
        const purchases = data.Items.map(item => new Purchase(item));
        return purchases;
      });
  },
  getBad: tenantId => {
    return client
      .query({
        TableName: table,
        IndexName: "ByBad",
        KeyConditionExpression: "tenantId = :tenantId",
        ExpressionAttributeValues: { ":tenantId": tenantId }
      })
      .promise()
      .then(data => {
        const purchases = data.Items.map(item => new Purchase(item));
        return purchases;
      });
  }
};

export { purchaseRepository };
