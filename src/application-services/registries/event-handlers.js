import { TransactionCategorizedHandler } from "../event-handlers/transaction-categorized-handler";
import { Repositories } from "./repositories";

const EventHandlers = domainEvents => {
  const transactionCategorizedHandler = TransactionCategorizedHandler(
    domainEvents,
    Repositories.purchase
  );
  return {
    transactionCategorized: transactionCategorizedHandler
  };
};

export { EventHandlers };
