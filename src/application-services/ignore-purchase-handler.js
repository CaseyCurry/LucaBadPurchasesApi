import jwt from "jsonwebtoken";
import { purchaseRepository } from "../infrastructure/aws/dynamoDb/purchase-repository";

// TODO: unit test
export const ignore = async (event, context) => {
  // TODO: move error handling to middleware?
  try {
    // TODO: move verification to separate Lambda in Users and set the user on the event
    const token = event.headers.Authorization;
    if (!token) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      };
    }
    let user;
    try {
      user = jwt.verify(token.replace("Bearer ", ""), process.env.jwtSecret);
    } catch (error) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      };
    }
    const purchase = await purchaseRepository.getById(
      user.tenant,
      event.pathParameters.id
    );
    if (!purchase) {
      return {
        statusCode: 204,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      };
    }
    purchase.ignore();
    await purchaseRepository.update(purchase);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    };
  } catch (error) {
    console.error(error);
    context.fail(error);
  }
};
