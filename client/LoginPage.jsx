import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import PropTypes from 'prop-types'
import hash from 'object-hash'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  button: {
    margin: theme.spacing(3, 2, 2),
  },
}))

const LoginPage = (props) => {
  const classes = useStyles()
  const [login, setLogin] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isForgotPassword, setIsForgotPassword] = React.useState(false)

  const doLogin = (event) => {
    props.login({ login: login, password: hash.sha1({ password: password }) })
    event.preventDefault()
  }

  const changeForgotPassword = (event) => {
    props.forgotPass([login, password])
    event.preventDefault()
  }

  let labelForgotPass = ''
  if (props.changePassDone !== null) {
    labelForgotPass = !props.changePassDone ? (
      <Typography variant="body2" color="secondary">
        Пользователя с таким логином не существует
      </Typography>
    ) : (
      <Typography variant="body2" color="secondary">
        Пароль успешно изменен
      </Typography>
    )
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Система оценки рисков
        </Typography>
        {!isForgotPassword ? (
          <form
            className={classes.form}
            validate="true"
            onSubmit={() => {
              doLogin(event)
            }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="login"
              label="Логин"
              name="login"
              autoComplete="login"
              value={login}
              onChange={() => {
                setLogin(event.target.value)
              }}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              value={password}
              onChange={() => {
                setPassword(event.target.value)
              }}
              autoComplete="current-password"
            />
            {props.loginFail ? (
              <Typography variant="body2" color="secondary">
                Введен неверный логин и/или пароль
              </Typography>
            ) : (
              ''
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Войти в систему
            </Button>
            <Grid container>
              <Grid item xs>
                <Button
                  type="button"
                  fullWidth
                  color="primary"
                  size="small"
                  className={classes.submit}
                  onClick={() => {
                    setLogin('')
                    setPassword('')
                    setIsForgotPassword(true)
                  }}
                >
                  Забыли пароль?
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <form
            className={classes.form}
            validate="true"
            onSubmit={() => {
              changeForgotPassword(event)
            }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="login"
              label="Логин"
              name="login"
              autoComplete="login"
              value={login}
              onChange={() => {
                setLogin(event.target.value)
              }}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              value={password}
              onChange={() => {
                setPassword(event.target.value)
              }}
              autoComplete="current-password"
            />
            {labelForgotPass}
            <Button
              type="button"
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                setLogin('')
                setPassword('')
                setIsForgotPassword(false)
              }}
            >
              Назад
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Изменить пароль
            </Button>
          </form>
        )}
      </div>
    </Container>
  )
}

LoginPage.propTypes = {
  login: PropTypes.func.isRequired,
  forgotPass: PropTypes.func.isRequired,
  loginFail: PropTypes.bool,
  changePassDone: PropTypes.bool,
}

export default LoginPage
