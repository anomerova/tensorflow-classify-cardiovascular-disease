import React from 'react'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import { Dataset, featureDescriptions } from '../../server/model/data.js'
import * as normalization from '../../server/model/normalization'
import { Table } from 'antd'

import './Train.less'

const trainData = new Dataset()
const tensors = {}

const NUM_EPOCHS = 100
const BATCH_SIZE = 200
const LEARNING_RATE = 0.01

export function arraysToTensors() {
  tensors.rawTrainFeatures = tf.tensor(trainData.trainFeatures)
  tensors.trainTarget = tf.tensor(trainData.trainTarget)
  tensors.rawTestFeatures = tf.tensor(trainData.testFeatures)
  tensors.testTarget = tf.tensor(trainData.testTarget)
  // Normalize mean and standard deviation of data.
  let { dataMean, dataStd } = normalization.determineMeanAndStddev(
    tensors.rawTrainFeatures
  )

  tensors.trainFeatures = normalization.normalizeTensor(
    tensors.rawTrainFeatures,
    dataMean,
    dataStd
  )
  tensors.testFeatures = normalization.normalizeTensor(
    tensors.rawTestFeatures,
    dataMean,
    dataStd
  )
}

export default class Train extends React.Component {
  constructor() {
    super()

    this.state = {
      linearTrainHistory: [],
      linearTrainLoss: {},
      oneHiddenTrainHistory: [],
      oneHiddenTrainLoss: {},
      twoHiddenTrainHistory: [],
      twoHiddenTrainLoss: {},
    }

    this.linearTrainRef = React.createRef()
    this.oneHiddenTrainRef = React.createRef()
    this.twoHiddenTrainRef = React.createRef()
  }

  linearRegressionModel() {
    const model = tf.sequential()
    model.add(
      tf.layers.dense({ inputShape: [trainData.numFeatures], units: 1 })
    )
    model.summary()
    return model
  }

  multiLayerPerceptronRegressionModel1Hidden() {
    const model = tf.sequential()
    model.add(
      tf.layers.dense({
        inputShape: [trainData.numFeatures],
        units: 1,
        activation: 'sigmoid',
        kernelInitializer: 'leCunNormal',
      })
    )
    model.add(tf.layers.dense({ units: 1 }))

    model.summary()
    return model
  }

  multiLayerPerceptronRegressionModel2Hidden() {
    const model = tf.sequential()
    model.add(
      tf.layers.dense({
        inputShape: [trainData.numFeatures],
        units: 1,
        activation: 'sigmoid',
        kernelInitializer: 'leCunNormal',
      })
    )
    model.add(
      tf.layers.dense({
        units: 50,
        activation: 'sigmoid',
        kernelInitializer: 'leCunNormal',
      })
    )
    model.add(tf.layers.dense({ units: 1 }))

    model.summary()
    return model
  }

  describeKernelElements(kernel) {
    console.log(kernel.length, trainData.numFeatures)
    tf.util.assert(
      kernel.length === trainData.numFeatures,
      `kernel must be a array of length 12, got ${kernel.length}`
    )
    const outList = []
    for (let idx = 0; idx < kernel.length; idx++) {
      outList.push({
        description: featureDescriptions[idx],
        value: kernel[idx],
      })
    }
    return outList
  }

  async run(model, stateDataName, ref, stateLossName) {
    model.compile({
      optimizer: tf.train.sgd(LEARNING_RATE),
      loss: 'meanSquaredError',
    })
    const trainLogs = []
    await model.fit(tensors.trainFeatures, tensors.trainTarget, {
      batchSize: BATCH_SIZE,
      epochs: NUM_EPOCHS,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          trainLogs.push(logs)
          tfvis.show.history(this[ref].current, trainLogs, ['loss', 'val_loss'])
          model.layers[0]
            .getWeights()[0]
            .data()
            .then((kernelAsArr) => {
              const weightsList = this.describeKernelElements(kernelAsArr)
              const weightArray = weightsList.sort((a, b) => b.value - a.value)
              this.setState({ [stateDataName]: weightArray })
            })
        },
      },
    })

    const result = model.evaluate(tensors.testFeatures, tensors.testTarget, {
      batchSize: BATCH_SIZE,
    })
    const testLoss = result.dataSync()[0]

    const trainLoss = trainLogs[trainLogs.length - 1].loss
    const valLoss = trainLogs[trainLogs.length - 1].val_loss

    this.setState({
      [stateLossName]: {
        trainLoss: trainLoss.toFixed(4),
        valLoss: valLoss.toFixed(4),
        testLoss: testLoss.toFixed(4),
      },
    })
  }

  getDataForChart(data) {
    return data.map((item) => {
      return { x: item.val_loss, y: item.loss }
    })
  }
  render() {
    const columns = [
      {
        title: 'Признак',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Вес',
        dataIndex: 'value',
        key: 'value',
      },
    ]
    return (
      <div className="section">
        <p className="section-head">Прогресс обучения</p>
        <div className="withCols">
          <div id="linear">
            {Object.entries(this.state.linearTrainLoss).length !== 0 ? (
              <div>
                Финальная ощибка обучающего набора:{' '}
                {this.state.linearTrainLoss.trainLoss} <br />
                Финальная ошибка тестового набора:{' '}
                {this.state.linearTrainLoss.valLoss} <br />
                Ошибка тестового набора: {
                  this.state.linearTrainLoss.testLoss
                }{' '}
                <br />
                Размер датасета: {trainData.trainFeatures.length}
              </div>
            ) : null}
            <button
              id="simple-mlr"
              onClick={async () => {
                await this.run(
                  this.linearRegressionModel(),
                  'linearTrainHistory',
                  'linearTrainRef',
                  'linearTrainLoss'
                )
              }}
            >
              Обучение нейросети с линейной регрессией
            </button>
            <div ref={this.linearTrainRef} />
            {this.state.linearTrainHistory.length !== 0 ? (
              <div>
                <Table
                  dataSource={this.state.linearTrainHistory}
                  columns={columns}
                  size="small"
                  bordered={true}
                  rowKey={(record) => record.description}
                  pagination={{
                    defaultCurrent: 1,
                    defaultPageSize: 5,
                  }}
                />
              </div>
            ) : null}
          </div>
          <div id="oneHidden">
            {Object.entries(this.state.oneHiddenTrainLoss).length !== 0 ? (
              <div>
                Финальная ощибка обучающего набора:{' '}
                {this.state.oneHiddenTrainLoss.trainLoss} <br />
                Финальная ошибка тестового набора:{' '}
                {this.state.oneHiddenTrainLoss.valLoss} <br />
                Ошибка тестового набора:{' '}
                {this.state.oneHiddenTrainLoss.testLoss} <br />
                Размер датасета: {trainData.trainFeatures.length}
              </div>
            ) : null}
            <button
              id="nn-mlr-1hidden"
              onClick={async () => {
                await this.run(
                  this.multiLayerPerceptronRegressionModel1Hidden(),
                  'oneHiddenTrainHistory',
                  'oneHiddenTrainRef',
                  'oneHiddenTrainLoss'
                )
              }}
            >
              Обучение нейросети с линейной регрессией (1 скрытый слой)
            </button>
            <div ref={this.oneHiddenTrainRef} />
            {this.state.oneHiddenTrainHistory.length !== 0 ? (
              <div>
                <Table
                  dataSource={this.state.oneHiddenTrainHistory}
                  columns={columns}
                  size="small"
                  bordered={true}
                  rowKey={(record) => record.description}
                  pagination={{
                    defaultCurrent: 1,
                    defaultPageSize: 5,
                  }}
                />
              </div>
            ) : null}
          </div>
          <div id="twoHidden">
            {Object.entries(this.state.twoHiddenTrainLoss).length !== 0 ? (
              <div>
                Финальная ощибка обучающего набора:{' '}
                {this.state.twoHiddenTrainLoss.trainLoss} <br />
                Финальная ошибка тестового набора:{' '}
                {this.state.twoHiddenTrainLoss.valLoss} <br />
                Ошибка тестового набора:{' '}
                {this.state.twoHiddenTrainLoss.testLoss} <br />
                Размер датасета: {trainData.trainFeatures.length}
              </div>
            ) : null}
            <button
              id="nn-mlr-2hidden"
              onClick={async () => {
                await this.run(
                  this.multiLayerPerceptronRegressionModel2Hidden(),
                  'twoHiddenTrainHistory',
                  'twoHiddenTrainRef',
                  'twoHiddenTrainLoss'
                )
              }}
            >
              Обучение нейросети с линейной регрессией (2 скрытых слоя)
            </button>
            <div ref={this.twoHiddenTrainRef} />
            {this.state.twoHiddenTrainHistory.length !== 0 ? (
              <div>
                <Table
                  dataSource={this.state.twoHiddenTrainHistory}
                  columns={columns}
                  size="small"
                  bordered={true}
                  rowKey={(record) => record.description}
                  pagination={{
                    defaultCurrent: 1,
                    defaultPageSize: 5,
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}

document.addEventListener(
  'DOMContentLoaded',
  async () => {
    await trainData.loadData()
    arraysToTensors()
  },
  false
)
