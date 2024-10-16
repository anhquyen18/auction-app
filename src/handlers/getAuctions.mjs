import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware.mjs";
import createError from "http-errors";
import validatorMiddleware from "@middy/validator";
import getAuctionsSchema from "../lib/schemas/getAuctionsSchema.mjs";
import { transpileSchema } from "@middy/validator/transpile";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  const { status } = event.queryStringParameters;
  let auctions;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeValues: {
      ":status": status,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  try {
    const result = await dynamodb.query(params).promise();

    auctions = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(getAuctions).use(
  validatorMiddleware({
    eventSchema: transpileSchema(getAuctionsSchema),
    useDefaults: true,
  }),
);
