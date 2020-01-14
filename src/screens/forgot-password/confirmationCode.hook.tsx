import { useState } from 'react'
import * as yup from 'yup'
import useFormal from '@kevinwolf/formal'
import { Auth } from 'aws-amplify'

export default function useConfirmationCode() {
  const [ displayErrorConfirmationCode, setDisplayErrorConfirmationCode ] =  useState({ code: '', message: '' })
  const [ redirectToLogin, setRedirectToLogin ] = useState(false)
  const [ disableConfirmationCodeSubmit, setDisableConfirmationCodeSubmit ] = useState(false)
  const [ displaySuccessConfirmationCode, setDisplaySuccessConfirmationCode ] = useState('')

  function handleCleanError() {
    const { code = '' } = displayErrorConfirmationCode
    if (code === 'UserNotFoundException') {
      setRedirectToLogin(true)
    }
    setDisplayErrorConfirmationCode({ code: '', message: '' })
  }

  function handleSetErrorConfirmationCode(code: string, message: string) {
    setDisplayErrorConfirmationCode({ code, message })
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
    confirmationCode: yup
      .string()
      .required('No confirmation code provided.')
      .min(6, 'Confirmation Code is too short - should be 6 chars minimum.'),
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
    confirmationCode: '',
    authenticationMethod: { email: '', phoneNumber: '' },
    authentication: '',
  }

  async function handleConfirmationCodeSubmit(values: any) {
    const { authentication, authenticationMethod, confirmationCode, password } = values
    const { email, phoneNumber } = authenticationMethod
    const username = authentication === 'email' ? email : `+506${phoneNumber}`
    const formIsValid = await schema.isValid({...values})
    if (formIsValid) {
      setDisableConfirmationCodeSubmit(true)
      console.log({username, confirmationCode, password})
      Auth.forgotPasswordSubmit(username, confirmationCode, password)
        .then(() => setDisplaySuccessConfirmationCode('Password Updated!'))
        .catch(({code, message}) => handleSetErrorConfirmationCode(code, message))
    }
  }

  const formalConfirmationCode = useFormal(initialValues, {
    schema,
    onSubmit: handleConfirmationCodeSubmit,
  })

  function handleConfirmationCode() {
    formalConfirmationCode.submit()
  }

  function handleSuccessPasswordUpdated() {
    setRedirectToLogin(true)
  }

  return {
    formalConfirmationCode,
    handleConfirmationCode,
    displayErrorConfirmationCode,
    handleCleanError,
    redirectToLogin,
    disableConfirmationCodeSubmit,
    displaySuccessConfirmationCode,
    handleSuccessPasswordUpdated,
  }
}