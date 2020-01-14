import { useState } from 'react'
import * as yup from 'yup'
import useFormal from '@kevinwolf/formal'
import { Auth } from 'aws-amplify'

export default function useForgetPassword() {
  const [ displayErrorForgotPassword, setDisplayErrorForgotPassword ] =  useState({ code: '', message: '' })
  const [ redirectToLogin, setRedirectToLogin ] = useState(false)
  const [ disableSubmit, setDisableSubmit ] = useState(false)
  const [ displaySuccess, setDisplaySuccess ] = useState('')
  const [ enableConfirmationCode, setEnableConfirmationCode ] = useState(false)

  function handleForgetPassword(e: any) {
    e.preventDefault()
    formalForgotPassword.submit()
  }

  function handleCleanError() {
    const { code = '' } = displayErrorForgotPassword
    if (code === 'UserNotFoundException') {
      setRedirectToLogin(true)
    }
    setDisplayErrorForgotPassword({ code: '', message: '' })
  }

  const schema = yup.object().shape({
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
    authenticationMethod: { email: '', phoneNumber: '' },
    authentication: '',
  }

  const formalForgotPassword = useFormal(initialValues, {
    schema,
    onSubmit: async (values) => {
      const formIsValid = await schema.isValid({...values})
      if (formIsValid) {
        setDisableSubmit(true)
        const { authentication, authenticationMethod } = values
        const { email, phoneNumber } = authenticationMethod
        const username = authentication === 'email' ? email : `+506${phoneNumber}`

        try {
            const recoveryPass = await Auth.forgotPassword(username)
            setEnableConfirmationCode(true)
            setDisplaySuccess(`${Object.values(recoveryPass.CodeDeliveryDetails || {}).join(' ')}`)
        } catch (err) {
            const { code, message } = err
            setDisplayErrorForgotPassword({ code, message })
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
    formalForgotPassword,
    handleForgetPassword,
    displayErrorForgotPassword,
    handleCleanError,
    redirectToLogin,
    disableSubmit,
    displaySuccess,
    enableConfirmationCode,
  }
}