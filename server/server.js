require('@tensorflow/tfjs-node')
const Datastore = require('nedb')
const tf = require('@tensorflow/tfjs')
const http = require('http')
const socketio = require('socket.io')
const PORT = 8001

async function run() {
  const port = PORT
  const server = http.createServer()
  const io = socketio(server)
  const model = await tf
    .loadLayersModel('file://server/model/my-model.json')
    .catch((error) => {
      console.log('caught', error.message)
    })
  const loginDatabase = new Datastore({
    filename: 'server/datafile/loginDatafile',
    autoload: true,
  })
  const userDatabase = new Datastore({
    filename: 'server/datafile/userDatafile',
    autoload: true,
  })

  server.listen(port, () => {
    console.log(`Running socket on port: ${port}`)
  })

  io.on('connection', (socket) => {
    socket.on('predictSample', async (predictParam) => {
      console.log('received predict request')
      const predictData = [
        predictParam.age,
        predictParam.gender,
        predictParam.height,
        predictParam.weight,
        predictParam.ap_hi,
        predictParam.ap_lo,
        predictParam.cholesterol,
        predictParam.gluc,
        predictParam.smoke,
        predictParam.alco,
        predictParam.active,
      ]
      const predictResult = model
        .predict(tf.tensor(predictData, [1, predictData.length]))
        .arraySync()[0][0]
      predictParam.result = predictResult
      userDatabase.insert(predictParam, function (err) {
        if (!err) {
          userDatabase.find(
            { personnelNumber: predictParam.personnelNumber },
            function (err, findResult) {
              if (!err) {
                io.emit('predictResult', findResult)
              }
            }
          )
        } else {
          console.log(err)
        }
      })
    })
    socket.on('login', async (loginParam) => {
      console.log('received login request')
      loginDatabase.find(
        { login: loginParam.login, password: loginParam.password },
        (err, docs) => {
          if (!err && docs.length > 0) {
            io.emit('login', true)
          } else {
            io.emit('login', false)
          }
        }
      )
      console.log(loginParam)
    })
    socket.on('forgotPass', async (changePassParam) => {
      console.log('received changePass request')
      loginDatabase.find({ email: changePassParam[0] }, (err, docs) => {
        if (!err && docs.length > 0) {
          loginDatabase.update(
            { email: changePassParam[0] },
            { $set: { password: changePassParam[1] } },
            {},
            function (err) {
              if (!err) {
                io.emit('forgotPass', true)
              } else {
                io.emit('forgotPass', false)
              }
            }
          )
        } else {
          io.emit('forgotPass', false)
        }
      })
    })
    socket.on('getTodayData', async (date) => {
      console.log('received getTodayData request')
      userDatabase.find({ createdDate: date }, (err, docs) => {
        if (!err && docs.length > 0) {
          io.emit('getTodayData', docs)
        }
      })
    })
  })
}

run()
