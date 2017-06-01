// @flow

import 'isomorphic-fetch';
import Koa from 'koa';
import convert from 'koa-convert';
import cors from 'koa-cors';
import graphqlHttp from 'koa-graphql';
import logger from 'koa-logger';
import Router from 'koa-router';
import { print } from 'graphql/language';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

import { getSchema } from './index';

const app = new Koa();
const router = new Router();

const graphqlSettingsPerReq = async () => {
  const schema = getSchema();

  if (process.env.SWAGGER_MOCKED !== 'false') {
    addMockFunctionsToSchema({ schema });
  }

  return {
    graphiql: true,
    schema,
    context: {
      GQLProxyBaseUrl: process.env.SWAGGER_BASE_URI,
    },
    extensions: ({ document, variables, operationName, result }) => {
      console.log(print(document));
      console.log(variables);
      console.log(result);
    },
    formatError: (error) => {
      console.log(error.message);
      console.log(error.locations);
      console.log(error.stack);

      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
      };
    },
  };
};

const graphqlServer = convert(graphqlHttp(graphqlSettingsPerReq));
router.all('/graphql', graphqlServer);

app.use(logger());
app.use(convert(cors()));
app.use(router.routes()).use(router.allowedMethods());

export default app;
