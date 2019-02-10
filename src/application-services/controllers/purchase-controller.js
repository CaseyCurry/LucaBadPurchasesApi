// TODO: unit test
import asyncHandler from "express-async-handler";

const PurchaseController = (app, domainEvents, purchaseRepository) => {
  return {
    register: () => {
      app.post(
        "/api/purchases/flagged",
        asyncHandler(async (request, response, next) => {
          const existingTransaction = await purchaseRepository.getById(
            request.user.tenant,
            request.body.id
          );
          if (existingTransaction._rev !== request.body._rev) {
            response.status(409).end();
            return;
          }
          existingTransaction.flag();
          await purchaseRepository.update(existingTransaction);
          response.status(201).end();
        })
      );
      app.get(
        "/api/purchases/flagged",
        asyncHandler(async (request, response, next) => {
          const purchases = await purchaseRepository.getFlagged(
            request.user.tenant
          );
          response.status(200).send(purchases);
        })
      );
      app.post(
        "/api/purchases/confirmed-bad",
        asyncHandler(async (request, response, next) => {
          const existingTransaction = await purchaseRepository.getById(
            request.user.tenant,
            request.body.id
          );
          if (existingTransaction._rev !== request.body._rev) {
            response.status(409).end();
            return;
          }
          existingTransaction.confirmBad();
          await purchaseRepository.update(existingTransaction);
          response.status(201).end();
        })
      );
      app.post(
        "/api/purchases/ignored",
        asyncHandler(async (request, response, next) => {
          const existingTransaction = await purchaseRepository.getById(
            request.user.tenant,
            request.body.id
          );
          if (existingTransaction._rev !== request.body._rev) {
            response.status(409).end();
            return;
          }
          existingTransaction.ignore();
          await purchaseRepository.update(existingTransaction);
          response.status(201).end();
        })
      );
    }
  };
};

export { PurchaseController };
