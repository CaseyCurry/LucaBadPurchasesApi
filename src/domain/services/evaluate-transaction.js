import { Purchase } from "../aggregates/purchase";
import { purchaseRepository } from "../../infrastructure/aws/dynamoDb/purchase-repository";
import { cachedCategoriesApi as categoriesApi } from "../../infrastructure/apis/cached-categories-api";

// TODO: unit test
const evaluateTransaction = async transaction => {
  const purchase = new Purchase({
    id: transaction.id,
    tenantId: transaction.tenantId
  });
  const amount = transaction.isDeposit
    ? transaction.amount * -1
    : transaction.amount;
  const categorization = await findCategorization(transaction);
  purchase.evaluate(amount, categorization);
  if (purchase.isFlagged) {
    await purchaseRepository.create(purchase);
  }
};

export { evaluateTransaction };

const findCategorization = async transaction => {
  const categories = await categoriesApi.get(transaction.tenantId);
  let found;
  categories.find(category => {
    return category.subcategories.find(subcategory => {
      if (subcategory.id === transaction.categorization) {
        found = {
          category: category.name,
          subcategory: subcategory.name,
          id: subcategory.id
        };
        return true;
      }
      return false;
    });
  });
  return found;
};
