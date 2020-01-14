import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
// @ts-ignore
import ReactCodeInput from 'react-code-input'
import { Link, Redirect } from 'react-router-dom'

// @ts-ignore
import PhoneInput from 'react-phone-input-2'

import SnackBarNotification from 'components/snackbar-notification'
import Copyright from 'components/copyright'
import { useUser } from 'state/user'

import 'react-phone-input-2/lib/style.css'
import './forgotpassword.css'

import useForgetPassword from './forgotPassword.hook'
import useConfirmationCode from './confirmationCode.hook'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function ForgotPasswordScreen() {
  const classes = useStyles()
  // @ts-ignore
  const {
    handleForgetPassword,
    formalForgotPassword,
    displayErrorForgotPassword,
    handleCleanError,
    redirectToLogin,
    displaySuccess,
    disableSubmit,
    enableConfirmationCode,
  } = useForgetPassword()

  const {
    handleConfirmationCode,
    formalConfirmationCode,
    disableConfirmationCodeSubmit,
    displayErrorConfirmationCode,
    displaySuccessConfirmationCode,
    handleSuccessPasswordUpdated,
    redirectToLogin: redirectToLoginConfirmationCode,
  } = useConfirmationCode()

  const {
    user,
  } = useUser()

  function handleOnChangePhoneNumber(value: string, data: any) {
    formalForgotPassword.change("authenticationMethod", { phoneNumber: value.replace(/[^0-9]+/g,'').slice(data.dialCode.length), email: '' })
    formalConfirmationCode.change("authenticationMethod", { phoneNumber: value.replace(/[^0-9]+/g,'').slice(data.dialCode.length), email: '' })
  }

  function handleOnChangeEmail(e: any) {
    formalForgotPassword.change("authenticationMethod", { phoneNumber: '', email: e.target.value})
    formalConfirmationCode.change("authenticationMethod", { phoneNumber: '', email: e.target.value})
  }

  // @ts-ignore
  const phoneNumberError = formalForgotPassword.errors['authenticationMethod.email'] || ''

  if (Object.keys(user).length) return <Redirect to={'/home'} />

  if (redirectToLogin || redirectToLoginConfirmationCode) return <Redirect to={'/login'} />

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {'Recuperar Contraseña'}
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleForgetPassword}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Select
                  value={formalForgotPassword.values.authentication}
                  onChange={e => {
                    formalForgotPassword.change("authentication", e.target.value)
                    formalConfirmationCode.change("authentication", e.target.value)
                  }}
                  displayEmpty
                  fullWidth
                  variant="outlined"
                  disabled={enableConfirmationCode}
                >
                  <MenuItem value="" disabled>
                    {'Choose an authentication method'}
                  </MenuItem>
                  <MenuItem value={'email'}>Email</MenuItem>
                  <MenuItem value={'phoneNumber'}>Phone Number</MenuItem>
                </Select>
                {formalForgotPassword.errors.authentication && <FormHelperText error variant="outlined">{formalForgotPassword.errors.authentication}</FormHelperText>}
              </FormControl>
            </Grid>
            {formalForgotPassword.values.authentication && formalForgotPassword.values.authentication === 'email' && (
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formalForgotPassword.values.authenticationMethod.email}
                  onChange={handleOnChangeEmail}
                  // @ts-ignore
                  error={Boolean(formalForgotPassword.errors['authenticationMethod.email'])}
                  // @ts-ignore
                  helperText={formalForgotPassword.errors['authenticationMethod.email']}
                  disabled={enableConfirmationCode}
                />
              </Grid>
            )}
            {formalForgotPassword.values.authentication && formalForgotPassword.values.authentication === 'phoneNumber' && (
              <Grid item xs={12}>
                <PhoneInput
                  containerStyle={{
                    display: 'flex',
                    flexDirection: 'row'
                  }}
                  inputProps={{
                    name: 'phoneNumber',
                    required: true,
                    autoFocus: false,
                  }}
                  inputClass="MuiInputBase-input MuiOutlinedInput-input"
                  country={'cr'}
                  onlyCountries={['cr']}
                  localization={{es: 'España'}}
                  inputStyle={{
                    height: '1.1875em',
                    width: '100%',
                    // animationName: 'MuiInputBase-keyframes-auto-fill-cancel',
                  }}
                  countryCodeEditable={false}
                  value={formalForgotPassword.values.authenticationMethod && formalForgotPassword.values.authenticationMethod.phoneNumber}
                  onChange={handleOnChangePhoneNumber}
                  disabled={enableConfirmationCode}
                />
                {/* @ts-ignore */}
                {phoneNumberError && <FormHelperText error variant="outlined">{phoneNumberError}</FormHelperText>}
              </Grid>
            )}
            {enableConfirmationCode && (
              <Grid item xs={12}>
                <ReactCodeInput
                  type='number'
                  fields={6}
                  onChange={(valConfirmationCode: any) => formalConfirmationCode.change("confirmationCode", valConfirmationCode)}
                  disabled={disableConfirmationCodeSubmit}
                />
                <FormHelperText variant="outlined">{'Enter your confirmation code'}</FormHelperText>
                {formalConfirmationCode.errors.confirmationCode && <FormHelperText error variant="outlined">{formalConfirmationCode.errors.confirmationCode}</FormHelperText>}
              </Grid>
            )}
            {formalConfirmationCode.values.confirmationCode.length === 6 && (
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="new-password"
                  label="New Password"
                  type="password"
                  id="new-password"
                  autoComplete="new-password"
                  value={formalConfirmationCode.values.password}
                  onChange={(e: any) => formalConfirmationCode.change("password", e.target.value)}
                  disabled={disableConfirmationCodeSubmit}
                />
                {formalConfirmationCode.errors.password && <FormHelperText error variant="outlined">{formalConfirmationCode.errors.password}</FormHelperText>}
              </Grid>
            )}
          </Grid>
          {enableConfirmationCode ? (
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => handleConfirmationCode()}
              disabled={disableConfirmationCodeSubmit}
            >
              {'Confirm Code'}
            </Button>
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={disableSubmit}
            >
              {'Recovery Password'}
            </Button>
          )}
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {displayErrorConfirmationCode.message !== '' && (
        <SnackBarNotification
          variant='error'
          message={displayErrorConfirmationCode.message}
        />
      )}
      {displayErrorForgotPassword.message !== '' && (
        <SnackBarNotification
          variant='error'
          message={displayErrorForgotPassword.message}
          onCloseNotification={handleCleanError}
        />
      )}
      {displaySuccess !== '' && (
        <SnackBarNotification
          variant='success'
          message={displaySuccess}
        />
      )}
      {displaySuccessConfirmationCode !== '' && (
        <SnackBarNotification
          variant='success'
          message={displaySuccessConfirmationCode}
          onCloseNotification={handleSuccessPasswordUpdated}
        />
      )}
      <Copyright />
    </Container>
  )
}