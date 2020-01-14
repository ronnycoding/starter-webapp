import React, {
  createContext,
  useReducer,
  useMemo,
  useContext,
  useEffect,
} from 'react'
import { Cache } from 'aws-amplify'
import moment from 'moment'

interface IState {
  token: null
}

interface IContextProps {
  state: IState;
  dispatch: ({type}:{type:string}) => void;
}

const AuthContext = createContext({} as IContextProps)
// @ts-ignore
function authReducer(state: any, action: any) {
  switch (action.type) {
    case 'SET_TOKEN':
        return {
          token: action.payload,
        }
    case 'RESET':
        return {
          token: null,
        }
    default:
        throw new Error(`Unsupported action type: ${action.type}`)
  }
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error(`useAuth must be used within a CountProvider`)
  }
  // @ts-ignore
  const [state, dispatch] = context
  const setAuth = (token: string) => dispatch({ type: 'SET_TOKEN', payload: token })
  const resetAuth = () => dispatch({ type: 'RESET' })
  const { auth = null } = state
  return {
    auth,
    setAuth,
    resetAuth,
  }
}

function AuthProvider(props: any) {
  const localState = Cache.getItem('token')
  const [state, dispatch] = useReducer(authReducer, localState || { token: null })

  useEffect(() => {
    Cache.setItem('token', state, {
      expires: moment().add(5, 'm').valueOf()
    })
  }, [state])

  const auth = useMemo(() => [state, dispatch], [state])
  return <AuthContext.Provider value={auth} {...props} />
}

export {
  AuthProvider,
  useAuth,
}