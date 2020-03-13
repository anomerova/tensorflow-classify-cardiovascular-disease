import React from 'react'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import {Dataset} from '../data.js'
import * as normalization from '../normalization'
import {XYPlot, LineSeries} from 'react-vis'

import './Charts.less'

const trainData = new Dataset
const tensors = {}

const NUM_EPOCHS = 200;
const BATCH_SIZE = 40;
const LEARNING_RATE = 0.01;

export function arraysToTensors() {
    tensors.rawTrainFeatures = tf.tensor(trainData.trainFeatures);
    tensors.trainTarget = tf.tensor(trainData.trainTarget);
    tensors.rawTestFeatures = tf.tensor(trainData.testFeatures);
    tensors.testTarget = tf.tensor(trainData.testTarget);
    // Normalize mean and standard deviation of data.
    let {dataMean, dataStd} =
        normalization.determineMeanAndStddev(tensors.rawTrainFeatures);

    tensors.trainFeatures = normalization.normalizeTensor(
        tensors.rawTrainFeatures, dataMean, dataStd);
    tensors.testFeatures =
        normalization.normalizeTensor(tensors.rawTestFeatures, dataMean, dataStd);
}

export default class Charts extends React.Component {

    constructor () {
        super()

        this.state = {
            trainHistory: []
        }
    }

    linearRegressionModel() {
        const model = tf.sequential();
        model.add(tf.layers.dense({inputShape: [trainData.numFeatures], units: 1}));
    
        model.summary();
        return model;
    }

    multiLayerPerceptronRegressionModel1Hidden() {
        const model = tf.sequential();
        model.add(tf.layers.dense({
        inputShape: [trainData.numFeatures],
        units: 50,
        activation: 'sigmoid',
        kernelInitializer: 'leCunNormal'
        }));
        model.add(tf.layers.dense({units: 1}));
    
        model.summary();
        return model;
    }

    multiLayerPerceptronRegressionModel2Hidden() {
        const model = tf.sequential();
        model.add(tf.layers.dense({
        inputShape: [trainData.numFeatures],
        units: 50,
        activation: 'sigmoid',
        kernelInitializer: 'leCunNormal'
        }));
        model.add(tf.layers.dense(
            {units: 50, activation: 'sigmoid', kernelInitializer: 'leCunNormal'}));
        model.add(tf.layers.dense({units: 1}));
    
        model.summary();
        return model;
    }

    async run(model) {
        model.compile(
            {optimizer: tf.train.sgd(LEARNING_RATE), loss: 'meanSquaredError'});

        await model.fit(tensors.trainFeatures, tensors.trainTarget, {
        batchSize: BATCH_SIZE,
        epochs: NUM_EPOCHS,
        validationSplit: 0.2,
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
            console.log(epoch, logs, logs.loss)
            this.setState({trainHistory: this.state.trainHistory.concat(logs)})
            }
        }
        }).then(info => {
            console.log('Final accuracy', info);
          })
    };


    render () {
        const data = [
            {x: 0, y: 8},
            {x: 1, y: 5},
            {x: 2, y: 4},
            {x: 3, y: 9},
            {x: 4, y: 1},
            {x: 5, y: 7},
            {x: 6, y: 6},
            {x: 7, y: 3},
            {x: 8, y: 2},
            {x: 9, y: 0}
          ]
        console.log(this.state.trainHistory)
        return <div>
            <p className='section-head'>Training Progress</p>
            <div className="with-cols">
                <div id="linear">
                    <div className="chart">
                    <XYPlot height={200} width={200}>
                        <LineSeries data={data} />
                    </XYPlot>
                    </div>
                    <div className="status"></div>
                    <button 
                        id="simple-mlr"
                        onClick={async (e) => {
                            const model = this.linearRegressionModel()
                            await this.run(model)
                        }}
                    >
                        Train Linear Regressor
                    </button>
                </div>
                <div id="oneHidden">
                    <div className="chart"></div>
                    <div className="status"></div>
                    <button 
                        id="nn-mlr-1hidden"
                        onClick={async () => {
                            const model = this.multiLayerPerceptronRegressionModel1Hidden();
                            await this.run(model);
                        }}
                    >
                        Train Neural Network Regressor (1 hidden layer)
                    </button>
                </div>
                <div id="twoHidden">
                    <div className="chart"></div>
                    <div className="status"></div>
                    <button 
                        id="nn-mlr-2hidden"
                        onClick={async () => {
                            const model = this.multiLayerPerceptronRegressionModel2Hidden();
                            await this.run(model);
                        }}
                    >
                        Train Neural Network Regressor (2 hidden layers)
                    </button>
                </div>
            </div>
        </div>
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await trainData.loadData();
    arraysToTensors();
  }, false);