const ENV = {
  local: {
    aws: {
      Auth: {
        identityPoolId: '',
        region: '',
        userPoolId: '',
        userPoolWebClientId: '',
      },
      Storage: {
        bucket: '',
      },
    },
    coreApi: {
      uri: '',
    }
  },
  development: {
    aws: {
      Auth: {
        identityPoolId: '',
        region: '',
        userPoolId: '',
        userPoolWebClientId: '',
      },
      Storage: {
        bucket: '',
      },
    },
    coreApi: {
      uri: '',
    }
  },
  staging: {
    aws: {
      Auth: {
        identityPoolId: '',
        region: '',
        userPoolId: '',
        userPoolWebClientId: '',
      },
      Storage: {
        bucket: '',
      },
    },
    coreApi: {
      uri: '',
    }
  },
  production: {
    aws: {
      Auth: {
        identityPoolId: '',
        region: '',
        userPoolId: '',
        userPoolWebClientId: '',
      },
      Storage: {
        bucket: '',
      },
    },
    coreApi: {
      uri: '',
    },
  },
}

function getEnvVars(env = '') {
  if (env === 'production') return ENV.production
  if (env === 'staging') return ENV.staging
  if (env === 'development') return ENV.development
  return ENV.local
}

export default getEnvVars(process.env.REACT_APP_STAGE)