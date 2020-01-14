import * as yup from 'yup'
import { useState, useEffect } from 'react'
import useFormal from '@kevinwolf/formal'
import { Auth } from 'aws-amplify'
import { useMutation } from '@apollo/react-hooks'

import { useAuth } from 'state/auth'

import {
  CREATE_USER_BY_EMAIL,
  CREATE_USER_BY_PHONE_NUMBER,
} from './singup.graphql'

interface SingUpByEmailProps {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface SingUpByPhoneNumberProps {
  firstName: string
  lastName: string
  phoneNumber: string
  password: string
}

export default function useSignUp() {
  const { setAuth } = useAuth()
  const [ useConfirmationCode, setUseConfirmationCode ] = useState(false)
  const [ confirmationCode, setConfirmationCode ] = useState('')
  const [ displayError, setDisplayError ] =  useState({ code: '', message: '' })
  const [ displaySuccess, setDisplaySuccess ] = useState(false)
  const [ redirectToLogin, setRedirectToLogin ] = useState(false)

  //SignUp state
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ phoneNumber, setPhoneNumber ] = useState('')
  const [ password, setPassword ] = useState('')

  const [signUpByEmail, { error: signUpByEmailError, data: signUpByEmailData }] = useMutation<
    SingUpByEmailProps,
    SingUpByEmailProps
  >(CREATE_USER_BY_EMAIL, {
    variables: {
      firstName,
      lastName,
      email,
      password
    }
  })

  const [signUpByPhoneNumber, { error: signUpByPhoneNumberError, data: signUpByPhoneNumberData }] = useMutation<
    SingUpByPhoneNumberProps,
    SingUpByPhoneNumberProps
  >(CREATE_USER_BY_PHONE_NUMBER, {
    variables: {
      firstName,
      lastName,
      phoneNumber,
      password
    }
  })

  const schema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
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
    firstName: '',
    lastName: '',
    password: '',
    authenticationMethod: { email: '', phoneNumber: '' },
    authentication: '',
  }

  const formal = useFormal(initialValues, {
    schema,
    onSubmit: async (values) => {
      const { firstName, lastName, authentication, password, authenticationMethod } = values
      const { email, phoneNumber } = authenticationMethod
      const isAuthenticatedByEmail = authentication === 'email'
      const username = isAuthenticatedByEmail ? email : `+506${phoneNumber}`

      try {
        await Auth.signUp({
          username,
          password,
          attributes: {
            name: firstName,
            family_name: lastName,
          }
        })

        setFirstName(firstName)
        setLastName(lastName)

        if (isAuthenticatedByEmail) {
          setEmail(email)
          setPassword(password)
          signUpByEmail()
        } else {
          setPhoneNumber(phoneNumber)
          setPassword(password)
          signUpByPhoneNumber()
        }

        setUseConfirmationCode(true)
      } catch (err) {
        const { code, message } = err
        console.log(err)
        setDisplayError({ code, message })
        formal.reset()
      }
    }
  })

  // await Auth.resendSignUp(username).then(() => {
  //   console.log('code resent successfully')
  //   setUseConfirmationCode(true)
  // })

  function handleCleanError() {
    const { code = '' } = displayError
    if (code === 'UsernameExistsException') {
      setRedirectToLogin(true)
    }
    setDisplayError({ code: '', message: '' })
  }

  function handleSetErrorConfirmationCode(code: string, message: string) {
    setConfirmationCode('')
    setDisplayError({ code, message })
  }

  function handleSignUp(e: any) {
    e.preventDefault()
    formal.submit()
  }

  function handleConfirmationCode() {
    setDisplaySuccess(true)
  }

  function handleAccountCreatedSuccessfully() {
    setRedirectToLogin(true)
  }

  useEffect(() => {
    if (confirmationCode.length === 6) {
      const { authentication, authenticationMethod } = formal.values
      const { email, phoneNumber } = authenticationMethod
      const username = authentication === 'email' ? email : `+506${phoneNumber}`
      Auth.confirmSignUp(username, confirmationCode, {
        // Optional. Force user confirmation irrespective of existing alias. By default set to True.
        forceAliasCreation: true    
      }).then(handleConfirmationCode)
      .catch(({ code, message }) => handleSetErrorConfirmationCode(code, message))
    }
  }, [confirmationCode, formal.values])

  useEffect(() => {
    console.log({
      signUpByEmailError,
      signUpByPhoneNumberError
    })
  }, [signUpByEmailError, signUpByPhoneNumberError])

  useEffect(() => {
    if (signUpByEmailData) {
      // @ts-ignore
      const { token } = signUpByEmailData
      setAuth(token)
    }
  }, [signUpByEmailData])

  useEffect(() => {
    if (signUpByPhoneNumberData) {
      // @ts-ignore
      const { token } = signUpByPhoneNumberData
      setAuth(token)
    }
  }, [signUpByPhoneNumberData])

  return {
    handleSignUp,
    handleAccountCreatedSuccessfully,
    useConfirmationCode,
    setConfirmationCode,
    formal,
    displayError,
    handleCleanError,
    displaySuccess,
    redirectToLogin,
  }
}