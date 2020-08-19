import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
} from '@material-ui/core'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import moment from 'moment'
import PropTypes from 'prop-types'
import PredictChart from './PredictChart'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  field: {
    width: '100%',
    marginBottom: 10,
  },
  text: {
    marginBottom: 10,
  },
}))

export default function VerticalLinearStepper(props) {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(3)
  const [gender, setGender] = React.useState(1)
  const [personnelNumber, setPersonnelNumber] = React.useState(null)
  const [birthDate, setBirthDate] = React.useState(moment(new Date()))
  const [height, setHeight] = React.useState(null)
  const [weight, setWeight] = React.useState(null)
  const [apHi, setApHi] = React.useState(null)
  const [apLo, setApLo] = React.useState(null)
  const [cholesterol, setCholesterol] = React.useState(1)
  const [gluc, setGluc] = React.useState(1)
  const [alco, setAlco] = React.useState(false)
  const [smoke, setSmoke] = React.useState(false)
  const [active, setActive] = React.useState(false)

  const stepLength = 4

  const handleNext = (event) => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    event.preventDefault()
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
    setPersonnelNumber(null)
    setBirthDate(moment(new Date()))
    setHeight(null)
    setWeight(null)
    setApHi(null)
    setApLo(null)
    setCholesterol(1)
    setGluc(1)
    setAlco(false)
    setSmoke(false)
    setActive(false)
  }

  const predict = (event) => {
    const predictParam = {
      personnelNumber,
      createdDate: moment(new Date()).format('DD.MM.YYYY'),
      gender: parseInt(gender, 10),
      age: moment(new Date()).diff(birthDate, 'days'),
      height: parseInt(height, 10),
      weight: parseInt(weight, 10),
      ap_hi: parseInt(apHi, 10),
      ap_lo: parseInt(apLo, 10),
      cholesterol: parseInt(cholesterol, 10),
      gluc: parseInt(gluc, 10),
      alco,
      smoke,
      active: !active,
    }
    props.predictParent(predictParam)
    event.preventDefault()
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key="0">
          <StepLabel>Идентификация сотрудника</StepLabel>
          <StepContent>
            <form validate="true" onSubmit={() => handleNext(event)}>
              <Box>
                <Typography className={classes.text}>
                  Заполните табельный номер сотрудника
                </Typography>
                <TextField
                  required
                  className={classes.field}
                  label="Табельный номер"
                  defaultValue={personnelNumber}
                  variant="outlined"
                  onChange={() => setPersonnelNumber(event.target.value)}
                />
              </Box>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Назад
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.button}
                  >
                    Продолжить
                  </Button>
                </div>
              </div>
            </form>
          </StepContent>
        </Step>
        <Step key="1">
          <StepLabel>Начало диагностики</StepLabel>
          <StepContent>
            <form validate="true" onSubmit={() => handleNext(event)}>
              <Box>
                <Typography className={classes.text}>
                  Заполните информацию о сотруднике
                </Typography>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    label="Дата рождения"
                    format="DD/MM/yyyy"
                    value={birthDate}
                    onChange={(date) => setBirthDate(date)}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    inputVariant="outlined"
                    className={classes.field}
                  />
                </MuiPickersUtilsProvider>
                <TextField
                  required
                  className={classes.field}
                  label="Рост"
                  defaultValue={height}
                  variant="outlined"
                  onChange={(event) => setHeight(event.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">см.</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  required
                  className={classes.field}
                  label="Вес"
                  defaultValue={weight}
                  variant="outlined"
                  onChange={(event) => setWeight(event.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">кг.</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  className={classes.field}
                  select
                  label="Пол"
                  onChange={(event) => setGender(event.target.value)}
                  value={gender}
                  variant="outlined"
                >
                  <MenuItem key="male" value="2">
                    Мужской
                  </MenuItem>
                  <MenuItem key="female" value="1">
                    Женский
                  </MenuItem>
                </TextField>
              </Box>
              <div className={classes.actionsContainer}>
                <div>
                  <Button onClick={handleBack} className={classes.button}>
                    Назад
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.button}
                  >
                    Продолжить
                  </Button>
                </div>
              </div>
            </form>
          </StepContent>
        </Step>
        <Step key="2">
          <StepLabel>Продолжение диагностики</StepLabel>
          <StepContent>
            <form validate="true" onSubmit={() => handleNext(event)}>
              <Box>
                <Typography className={classes.text}>
                  Заполните информацию об анализах сотрудника
                </Typography>
                <TextField
                  required
                  className={classes.field}
                  label="Систолическое кровяное давление"
                  defaultValue={apHi}
                  variant="outlined"
                  onChange={(event) => setApHi(event.target.value)}
                />
                <TextField
                  required
                  className={classes.field}
                  label="Диастолическое кровяное давление"
                  defaultValue={apLo}
                  variant="outlined"
                  onChange={(event) => setApLo(event.target.value)}
                />
                <TextField
                  className={classes.field}
                  select
                  label="Холестерин"
                  onChange={(event) => setCholesterol(event.target.value)}
                  value={cholesterol}
                  variant="outlined"
                  helperText={`Нормальный – 5 и менее ммоль/л.
                            Выше нормы – 5-6 ммоль/л.
                            Значительно выше нормы – 7,8 ммоль/л.`}
                >
                  <MenuItem key="male" value="1">
                    Нормально
                  </MenuItem>
                  <MenuItem key="female" value="2">
                    Выше нормы
                  </MenuItem>
                  <MenuItem key="male" value="3">
                    Значительно выше нормы
                  </MenuItem>
                </TextField>
                <TextField
                  className={classes.field}
                  select
                  label="Глюкоза"
                  onChange={(event) => setGluc(event.target.value)}
                  value={gluc}
                  variant="outlined"
                  helperText={`Нормальный— от 3,3 до 5,5 ммоль/л.
                            Выше нормы – 5,6-6,6 ммоль/л.
                            Значительно выше нормы – 6,7 ммоль/л и выше.`}
                >
                  <MenuItem key="male" value="1">
                    Нормально
                  </MenuItem>
                  <MenuItem key="female" value="2">
                    Выше нормы
                  </MenuItem>
                  <MenuItem key="male" value="3">
                    Значительно выше нормы
                  </MenuItem>
                </TextField>
              </Box>
              <div className={classes.actionsContainer}>
                <div>
                  <Button onClick={handleBack} className={classes.button}>
                    Назад
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.button}
                  >
                    Продолжить
                  </Button>
                </div>
              </div>
            </form>
          </StepContent>
        </Step>
        <Step key="3">
          <StepLabel>Окончание диагностики</StepLabel>
          <StepContent>
            <form validate="true" onSubmit={() => predict(event)}>
              <Box>
                <Typography className={classes.text}>
                  Заполните информацию о вредных привычках сотрудника
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={smoke}
                      onChange={(event) => setSmoke(event.target.checked)}
                      name="Курение"
                      color="primary"
                    />
                  }
                  label="Курение"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={alco}
                      onChange={(event) => setAlco(event.target.checked)}
                      name="Употребление алкоголя"
                      color="primary"
                    />
                  }
                  label="Употребление алкоголя"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={active}
                      onChange={(event) => setActive(event.target.checked)}
                      name="Отсутствие физической активности"
                      color="primary"
                    />
                  }
                  label="Отсутствие физической активности"
                />
              </Box>
              <div className={classes.actionsContainer}>
                <div>
                  <Button onClick={handleBack} className={classes.button}>
                    Назад
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.button}
                  >
                    Отправить данные на диагностику
                  </Button>
                </div>
              </div>
            </form>
          </StepContent>
        </Step>
      </Stepper>
      {activeStep === stepLength - 1 && (
        <Paper square elevation={0} className={classes.resetContainer}>
          {true > 0 ? (
            <Box style={{ width: '100%' }}>
              <PredictChart
                data={props.predictResult.map((predictData) => {
                  return {
                    name: predictData.createdDate,
                    data: predictData.result,
                  }
                })}
              />
              <Typography>Готово.</Typography>
            </Box>
          ) : (
            <Box>
              <Typography>Пожалуйста, дождитесь результата.</Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleReset}
          >
            Начать заполнение заново
          </Button>
        </Paper>
      )}
    </div>
  )
}

VerticalLinearStepper.propTypes = {
  predictParent: PropTypes.func,
  predictResult: PropTypes.array,
}
