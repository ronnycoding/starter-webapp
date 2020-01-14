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
  user: {}
}

interface IContextProps {
  state: IState;
  dispatch: ({type}:{type:string}) => void;
}

const UserContext = createContext({} as IContextProps)

function userReducer(state: any, action: any) {
  switch (action.type) {
    case 'SET_USER':
        return {
          user: {
            ...action.payload,
          },
        }
    case 'UPDATE_USER':
        return {
          user: {
            ...state.user,
            ...action.payload,
          },
        }
    case 'RESET':
        return {
          user: {},
        }
    default:
        throw new Error(`Unsupported action type: ${action.type}`)
  }
}

function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error(`useUser must be used within a CountProvider`)
  }
  // @ts-ignore
  const [state, dispatch] = context
  const setUser = (user: object) => dispatch({ type: 'SET_USER', payload: {...user} })
  const resetUser = () => dispatch({ type: 'RESET' })
  const { user = {} } = state
  return {
    user,
    setUser,
    resetUser,
  }
}

function UserProvider(props: any) {
  const localState = Cache.getItem('user')
  const [state, dispatch] = useReducer(userReducer, localState || { user: {} })

  useEffect(() => {
    Cache.setItem('user', state, {
      expires: moment().add(5, 'm').valueOf()
    })
  }, [state])

  const user = useMemo(() => [state, dispatch], [state])
  return <UserContext.Provider value={user} {...props} />
}

export {
  UserProvider,
  useUser,
}