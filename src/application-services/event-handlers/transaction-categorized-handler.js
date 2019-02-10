// TODO: unit test
import { Purchase } from "../../domain/aggregates/purchase";

const TransactionCategorizedHandler = (domainEvents, purchaseRepository) => {
  const handler = async event => {
    const transaction = event.message.transaction;
    const existingPurchase = await purchaseRepository.getById(
      transaction.tenantId,
      transaction.id
    );
    if (existingPurchase) {
      console.debug(`skipping existing purchase ${existingPurchase.id}`);
      return;
    }
    const purchase = new Purchase({
      id: transaction.id,
      tenantId: transaction.tenantId
    });
    const amount = transaction.isDeposit
      ? -1 * transaction.amount
      : transaction.amount;
    purchase.evaluate(amount, transaction.categorization);
    if (purchase.isFlagged) {
      console.debug(`flagging purchase ${purchase.id}`);
      await purchaseRepository.create(purchase);
    } else {
      console.debug(`skipping unflagged purchase ${purchase.id}`);
    }
  };

  return {
    register: async () => {
      domainEvents.listenAndHandleOnce(
        "checking-account.transaction-categorized",
        handler
      );
    }
  };
};

export { TransactionCategorizedHandler };
