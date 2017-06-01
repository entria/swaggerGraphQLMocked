// @flow
import 'babel-polyfill';
import swaggerGraphQL from 'swagger-to-graphql';
import app from './app';
import { swaggerPath } from './config';

let schema = null;
export const getSchema = () => schema;

const graphqlPort = 5000 || process.env.PORT;
(async () => {
  try {
    schema = await swaggerGraphQL(swaggerPath);

  } catch (error) {
    console.log('err: ', error, error.stacktrace);
    process.exit(1);
  }

  await app.listen(graphqlPort);
  console.log(`Server running at http://localhost:${graphqlPort}/graphql`);
})();
