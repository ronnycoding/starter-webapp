import Amplify from 'aws-amplify'

import envVars from './env'

export default function configureAmplify() {
  const { aws } = envVars
  Amplify.configure(aws)
}