import middy from "@middy/core";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";

export default (handler) => middy(handler).use([httpEventNormalizer(), httpErrorHandler(), jsonBodyParser()]);
