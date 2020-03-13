import React from 'react'
import * as tf from '@tensorflow/tfjs'
import {Dataset} from '../data.js'
import * as normalization from '../normalization'
import Chart from './Chart.jsx'

import './Train.less'

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

export default class Train extends React.Component {

    constructor () {
        super()

        this.state = {
            linearTrainHistory: [],
            oneHiddenTrainHistory: [],
            twoHiddenTrainHistory: []
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

    async run(model, stateDataName) {
        console.log(stateDataName)
        model.compile(
            {optimizer: tf.train.sgd(LEARNING_RATE), loss: 'meanSquaredError'});

        await model.fit(tensors.trainFeatures, tensors.trainTarget, {
        batchSize: BATCH_SIZE,
        epochs: NUM_EPOCHS,
        validationSplit: 0.2,
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
            //console.log(epoch, logs, logs.loss)
            this.setState({[stateDataName]: this.state[stateDataName].concat(logs)})
            }
        }
        }).then(info => {
            console.log('Final accuracy', info);
          })
    };

    getDataForChart(data) {
        return data.map(item => {return {x: item.val_loss, y: item.loss}})
    }


    render () {
        return <div>
            <p className='section-head'>Training Progress</p>
            <div className="withCols">
                <div id="linear">
                    <div className="status"></div>
                    <button 
                        id="simple-mlr"
                        onClick={async (e) => {await this.run(this.linearRegressionModel(), 'linearTrainHistory')}}
                    >
                        Train Linear Regressor
                    </button>
                    <div className="chart">
                        <Chart data={this.getDataForChart(this.state.linearTrainHistory)}/>
                    </div>
                </div>
                <div id="oneHidden">
                    <div className="status"></div>
                    <button 
                        id="nn-mlr-1hidden"
                        onClick={async () => {await this.run(this.multiLayerPerceptronRegressionModel1Hidden(), 'oneHiddenTrainHistory')}}
                    >
                        Train Neural Network Regressor (1 hidden layer)
                    </button>
                    <div className="chart">
                        <Chart data={this.getDataForChart(this.state.oneHiddenTrainHistory)}/>
                    </div>
                </div>
                <div id="twoHidden">
                    <div className="status"></div>
                    <button 
                        id="nn-mlr-2hidden"
                        onClick={async () => {await this.run(this.multiLayerPerceptronRegressionModel2Hidden(), 'twoHiddenTrainHistory')}}
                    >
                        Train Neural Network Regressor (2 hidden layers)
                    </button>
                    <div className="chart">
                        <Chart data={this.getDataForChart(this.state.twoHiddenTrainHistory)}/>
                    </div>
                </div>
            </div>
        </div>
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await trainData.loadData();
    arraysToTensors();
  }, false);