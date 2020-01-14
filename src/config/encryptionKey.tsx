const ENV = {
  development: 'devEncryptionKey',
  staging: 'stageEncryptionKey',
  production: 'prodEncryptionKey',
  local: 'localEncryptionKey'
}

function getEnvVars(env = '') {
  if (env === 'production') return ENV.production
  if (env === 'staging') return ENV.staging
  if (env === 'development') return ENV.development
  return ENV.local
}

export default getEnvVars(process.env.REACT_APP_STAGE)