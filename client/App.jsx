import React from 'react'
import {
  CssBaseline,
  Container,
  Typography,
  AppBar,
  Tabs,
  Tab,
  Box,
} from '@material-ui/core'
import VerticalLinearStepper from './Stepper'
import io from 'socket.io-client'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Train from './Train/Train'
import LoginPage from './LoginPage'
import hash from 'object-hash'
import AllUserChart from './AllUserChart'

const socket = io('http://localhost:8001', {
  reconnectionDelay: 300,
  reconnectionDelayMax: 300,
})

function TabPanel(props) {
  const { children, value, index } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
    >
      {value === index && (
        <Box p={3} style={{ width: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}))

export default function App() {
  const classes = useStyles()
  const [value, setValue] = React.useState('one')
  const [login, setLogin] = React.useState('')
  const [predictResult, setPredictResult] = React.useState([])
  const [todayData, setTodayData] = React.useState([])
  const [loginDone, setLoginDone] = React.useState(false)
  const [loginFail, setLoginFail] = React.useState(false)
  const [changePassDone, setChangePassDone] = React.useState(null)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  socket.on('predictResult', (result) => {
    setPredictResult(result)
  })

  socket.on('getTodayData', (result) => {
    setTodayData(result)
  })

  socket.on('login', (result) => {
    setLoginDone(result)
    if (!result) setLoginFail(true)
  })

  socket.on('forgotPass', (result) => {
    setChangePassDone(result)
  })

  const predictCardio = (predictParam) => {
    predictParam.unicId = hash.sha1({ login: login })
    socket.emit('predictSample', predictParam)
  }

  const doLogin = (loginParam) => {
    setLogin(loginParam.login)
    socket.emit('login', loginParam)
  }

  const getTodayData = (date) => {
    socket.emit('getTodayData', date)
  }

  const doChangePass = (changeParam) => {
    socket.emit('forgotPass', changeParam)
  }

  return (
    <React.Fragment>
      <CssBaseline />
      {loginDone ? (
        <Container maxWidth="sm">
          <div className={classes.root}>
            <AppBar position="static">
              <Tabs value={value} onChange={handleChange}>
                <Tab value="one" label="Диагностика" />
                <Tab value="two" label="Общая статистика" />
                <Tab value="three" label="Обучение модели" />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index="one">
              <VerticalLinearStepper
                predictParent={predictCardio}
                predictResult={predictResult}
              />
            </TabPanel>
            <TabPanel value={value} index="two">
              <Typography variant="body1">
                График результатов, полученных за текущую дату
              </Typography>
              <AllUserChart getTodayData={getTodayData} data={todayData} />
            </TabPanel>
            <TabPanel value={value} index="three">
              <Train />
            </TabPanel>
            <Typography variant="body2">
              Приложение распространяется под лицензией MIT
            </Typography>
          </div>
        </Container>
      ) : (
        <LoginPage
          login={doLogin}
          loginFail={loginFail}
          forgotPass={doChangePass}
          changePassDone={changePassDone}
        />
      )}
    </React.Fragment>
  )
}
