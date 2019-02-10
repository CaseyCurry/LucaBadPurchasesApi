import fetch from "node-fetch";
import { PurchaseStore } from "../../infrastructure/couchdb/stores/purchase-store";

const purchaseStore = PurchaseStore(fetch, process.env.DATABASE_URL);

const Datastores = {
  purchase: purchaseStore
};

export { Datastores };
