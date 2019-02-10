import { Datastores } from "./datastores";
import { PurchaseRepository } from "../../infrastructure/couchdb/repositories/purchase-repository";

const purchaseRepository = PurchaseRepository(Datastores.purchase);

const Repositories = {
  purchase: purchaseRepository
};

export { Repositories };
