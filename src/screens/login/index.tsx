import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
// import * as MaterialLink from '@material-ui/core/Link'
import { Link, Redirect } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'

import SnackBarNotification from 'components/snackbar-notification'
import Copyright from 'components/copyright'
import { useUser } from 'state/user'

// @ts-ignore
import PhoneInput from 'react-phone-input-2'

import useLogin from './login.hook'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function SignInSide() {
  const classes = useStyles()
  const {
    formal,
    handleLogin,
    displayError,
    handleCleanError,
    redirectToSignUp,
    disableSubmit,
  } = useLogin()

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

  if (Object.keys(user).length > 0) return <Redirect to={'/home'} />

  if (redirectToSignUp) return <Redirect to={'/signUp'} />

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleLogin}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Select
                    value={formal.values.authentication}
                    onChange={e => formal.change("authentication", e.target.value)}
                    displayEmpty
                    fullWidth
                    variant="outlined"
                    // disabled={useConfirmationCode}
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
                    // disabled={useConfirmationCode}
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
                    // disabled={useConfirmationCode}
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
                  // disabled={useConfirmationCode}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={disableSubmit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/forgot-password">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/signup">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            {displayError.message !== '' && (
              <SnackBarNotification
                variant='error'
                message={displayError.message}
                onCloseNotification={handleCleanError}
              />
            )}
            <Copyright />
          </form>
        </div>
      </Grid>
    </Grid>
  )
}