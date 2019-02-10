import { PurchaseController } from "../controllers/purchase-controller";
import { Repositories } from "./repositories";

const Controllers = (app, domainEvents) => {
  const purchaseController = PurchaseController(
    app,
    domainEvents,
    Repositories.purchase
  );
  return {
    purchase: purchaseController
  };
};

export { Controllers };
