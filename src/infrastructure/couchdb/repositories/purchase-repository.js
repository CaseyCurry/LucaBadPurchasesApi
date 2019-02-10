// TODO: unit test
import { Purchase } from "../../../domain/aggregates/purchase";

const extendPurchase = purchase => {
  return Object.assign({}, purchase, {
    _id: purchase.id
  });
};

const PurchaseRepository = datastore => {
  return {
    create: purchase => {
      const extendedPurchase = extendPurchase(purchase);
      return datastore.http(datastore.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extendedPurchase)
      });
    },
    update: purchase => {
      return datastore.http(`${datastore.url}${purchase.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchase)
      });
    },
    getById: (tenantId, id) => {
      let url = `${
        datastore.url
      }_design/doc/_view/purchases-by-tenant?include_docs=true`;
      return datastore
        .http(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keys: [[tenantId, id]]
          })
        })
        .then(response => response.json())
        .then(body =>
          body.rows.length ? new Purchase(body.rows[0].doc) : null
        );
    },
    getFlagged: tenantId => {
      let url = `${
        datastore.url
      }_design/doc/_view/flagged-by-tenant?include_docs=true&key="${tenantId}"`;
      return datastore
        .http(url)
        .then(response => response.json())
        .then(body => {
          return body.rows.map(row => new Purchase(row.doc));
        });
    }
  };
};

export { PurchaseRepository };
