import ApolloClient from 'apollo-boost'

import envVars from './env'

const { coreApi } = envVars

export default new ApolloClient({
  ...coreApi,
})