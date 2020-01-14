import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
// import Input from '@material-ui/core/Input'
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

// import 'react-phone-input-2/lib/material.css'
import 'react-phone-input-2/lib/style.css'
import './signup.css'

import useSignUp from './signup.hook'

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

export default function SignUp() {
  const classes = useStyles()
  const {
    handleSignUp,
    formal,
    useConfirmationCode,
    setConfirmationCode,
    displayError,
    handleCleanError,
    displaySuccess,
    handleAccountCreatedSuccessfully,
    redirectToLogin,
  } = useSignUp()

  const {
    user,
  } = useUser()

  function handleOnChangePhoneNumber(value: string, data: any) {
    formal.change("authenticationMethod", { phoneNumber: value.replace(/[^0-9]+/g,'').slice(data.dialCode.length), email: '' })
  }

  function handleOnChangeEmail(e: any) {
    formal.change("authenticationMethod", { phoneNumber: '', email: e.target.value})
  }

  // @ts-ignore
  const phoneNumberError = formal.errors['authenticationMethod.email'] || ''

  if (Object.keys(user).length) return <Redirect to={'/home'} />

  if (redirectToLogin) return <Redirect to={'/login'} />

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {'Registrate'}
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSignUp}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={formal.values.firstName}
                onChange={e => formal.change("firstName", e.target.value)}
                error={Boolean(formal.errors.firstName)}
                helperText={formal.errors.firstName && formal.errors.firstName}
                disabled={useConfirmationCode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={formal.values.lastName}
                onChange={e => formal.change("lastName", e.target.value)}
                error={Boolean(formal.errors.lastName)}
                helperText={formal.errors.lastName && formal.errors.lastName}
                disabled={useConfirmationCode}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Select
                  value={formal.values.authentication}
                  onChange={e => formal.change("authentication", e.target.value)}
                  displayEmpty
                  fullWidth
                  variant="outlined"
                  disabled={useConfirmationCode}
                >
                  <MenuItem value="" disabled>
                    {'Choose an authentication method'}
                  </MenuItem>
                  <MenuItem value={'email'}>Email</MenuItem>
                  <MenuItem value={'phoneNumber'}>Phone Number</MenuItem>
                </Select>
                {formal.errors.authentication && <FormHelperText error variant="outlined">{formal.errors.authentication}</FormHelperText>}
              </FormControl>
            </Grid>
            {formal.values.authentication && formal.values.authentication === 'email' && (
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formal.values.authenticationMethod.email}
                  onChange={handleOnChangeEmail}
                  // @ts-ignore
                  error={Boolean(formal.errors['authenticationMethod.email'])}
                  // @ts-ignore
                  helperText={formal.errors['authenticationMethod.email']}
                  disabled={useConfirmationCode}
                />
              </Grid>
            )}
            {formal.values.authentication && formal.values.authentication === 'phoneNumber' && (
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
                  value={formal.values.authenticationMethod && formal.values.authenticationMethod.phoneNumber}
                  onChange={handleOnChangePhoneNumber}
                  disabled={useConfirmationCode}
                />
                {/* @ts-ignore */}
                {phoneNumberError && <FormHelperText error variant="outlined">{phoneNumberError}</FormHelperText>}
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={e => formal.change("password", e.target.value)}
                error={Boolean(formal.errors.password)}
                helperText={formal.errors.password && formal.errors.password}
                disabled={useConfirmationCode}
              />
            </Grid>
            {useConfirmationCode && (
              <Grid item xs={12}>
                <ReactCodeInput type='number' fields={6} onChange={setConfirmationCode} />
                <FormHelperText variant="outlined">{'Enter your confirmation code'}</FormHelperText>
              </Grid>
            )}
          </Grid>
          {!useConfirmationCode && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={useConfirmationCode}
            >
              Sign Up
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
      {displayError.message !== '' && (
        <SnackBarNotification
          variant='error'
          message={displayError.message}
          onCloseNotification={handleCleanError}
        />
      )}
      {displaySuccess && (
        <SnackBarNotification
          variant='success'
          message={'Account Created Successfully'}
          onCloseNotification={handleAccountCreatedSuccessfully}
        />
      )}
      <Copyright />
    </Container>
  )
}