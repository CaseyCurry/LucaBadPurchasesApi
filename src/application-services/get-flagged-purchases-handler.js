import jwt from "jsonwebtoken";
import { purchaseRepository } from "../infrastructure/aws/dynamoDb/purchase-repository";

// TODO: unit test
export const get = async (event, context) => {
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
    const purchases = await purchaseRepository.getFlagged(user.tenant);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(purchases)
    };
  } catch (error) {
    console.error(error);
    context.fail(error);
  }
};
