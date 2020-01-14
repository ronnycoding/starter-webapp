import { useState } from 'react'
import * as yup from 'yup'
import useFormal from '@kevinwolf/formal'
import { Auth } from 'aws-amplify'

import { useUser } from 'state/user'
// TODO: implement set token
// import { useAuth } from 'state/auth'

export default function useLogin() {
  const {
    setUser,
  } = useUser()
  // const { setAuth } = useAuth()
  const [ displayError, setDisplayError ] =  useState({ code: '', message: '' })
  const [ redirectToSignUp, setRedirectToSignUp ] = useState(false)
  const [ disableSubmit, setDisableSubmit ] = useState(false)

  function handleLogin(e: any) {
    e.preventDefault()
    formal.submit()
  }

  function handleCleanError() {
    const { code = '' } = displayError
    if (code === 'UserNotFoundException') {
      setRedirectToSignUp(true)
    }
    setDisplayError({ code: '', message: '' })
  }

  const schema = yup.object().shape({
    password: yup
      .string()
      .required('No password provided.')
      .min(8, 'Password is too short - should be 8 chars minimum.')
      .matches(
        /^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]/,
        "Must Contain Minimun 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
      authenticationMethod: yup.object().shape({
        email: yup
          .string()
          .when('phoneNumber', {
              is: '',
              then: yup.string().email().required('An email is required'),
              otherwise: yup.string(),
          }),
        phoneNumber: yup
          .string()
          .when('email', {
              is: '',
              then: yup.string().required('A phone number is required'),
              otherwise: yup.string(),
          }),
      }, [['phoneNumber', 'email']]),
      authentication: yup.string().required('Please choose an authentication method'),
  })

  const initialValues = {
    password: '',
    authenticationMethod: { email: '', phoneNumber: '' },
    authentication: '',
  }

  const formal = useFormal(initialValues, {
    schema,
    onSubmit: async (values) => {
      const formIsValid = await schema.isValid({...values})
      if (formIsValid) {
        setDisableSubmit(true)
        const { authentication, password, authenticationMethod } = values
        const { email, phoneNumber } = authenticationMethod
        const username = authentication === 'email' ? email : `+506${phoneNumber}`

        try {
            const user = await Auth.signIn(username, password)
            const { attributes } = user
            setUser({...attributes})
        } catch (err) {
            const { code, message } = err
            setDisplayError({ code, message })
            // if (err.code === 'UserNotConfirmedException') {
            //     // The error happens if the user didn't finish the confirmation step when signing up
            //     // In this case you need to resend the code and confirm the user
            //     // About how to resend the code and confirm the user, please check the signUp part
            // } else if (err.code === 'PasswordResetRequiredException') {
            //     // The error happens when the password is reset in the Cognito console
            //     // In this case you need to call forgotPassword to reset the password
            //     // Please check the Forgot Password part.
            // } else if (err.code === 'NotAuthorizedException') {
            //     // The error happens when the incorrect password is provided
            // } else if (err.code === 'UserNotFoundException') {
            //     // The error happens when the supplied username/email does not exist in the Cognito user pool
            // } else {
            //     console.log(err);
            // }
        }
      }
    }
  })

  return {
    formal,
    handleLogin,
    displayError,
    handleCleanError,
    redirectToSignUp,
    disableSubmit,
  }
}