import { purchaseRepository } from "../infrastructure/aws/dynamoDb/purchase-repository";
import { evaluateTransaction } from "../domain/services/evaluate-transaction";
import { cachedCategoriesApi } from "../infrastructure/apis/cached-categories-api";

cachedCategoriesApi.initialize();

// TODO: unit test
export const evaluate = async (event, context) => {
  try {
    const transaction = JSON.parse(event.Records[0].Sns.Message).message
      .transaction;
    const existingPurchase = await purchaseRepository.getById(
      transaction.tenantId,
      transaction.id
    );
    if (existingPurchase) {
      return;
    }
    await evaluateTransaction(transaction);
  } catch (error) {
    console.error(error);
    context.fail(error);
  }
};
