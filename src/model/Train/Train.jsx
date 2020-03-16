import React from 'react'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis';
import {Dataset, featureDescriptions} from '../data.js'
import * as normalization from '../normalization'
import { Table } from 'antd'

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

        this.linearTrainRef = React.createRef()
        this.oneHiddenTrainRef = React.createRef()
        this.twoHiddenTrainRef = React.createRef()
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

    describeKernelElements(kernel) {
        tf.util.assert(
            kernel.length == [trainData.numFeatures],
            `kernel must be a array of length 12, got ${kernel.length}`);
        const outList = [];
        for (let idx = 0; idx < kernel.length; idx++) {
          outList.push({description: featureDescriptions[idx], value: kernel[idx]});
        }
        return outList;
      }

    async run(model, stateDataName, ref) {
        model.compile({optimizer: tf.train.sgd(LEARNING_RATE), loss: 'meanSquaredError'});
        const trainLogs = []
        await model.fit(tensors.trainFeatures, tensors.trainTarget, {
            batchSize: BATCH_SIZE,
            epochs: NUM_EPOCHS,
            validationSplit: 0.2,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    trainLogs.push(logs);
                    tfvis.show.history(this[ref].current, trainLogs, ['loss', 'val_loss'])

                    model.layers[0].getWeights()[0].data().then(kernelAsArr => {
                        const weightsList = this.describeKernelElements(kernelAsArr)
                        const weightArray = weightsList.sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
                        this.setState({[stateDataName]: weightArray})
                      });
                }
            }
        })
    };

    getDataForChart(data) {
        return data.map(item => {return {x: item.val_loss, y: item.loss}})
    }


    render () {
        return <div className='section'>
            <p className='section-head'>Training Progress</p>
            <div className="withCols">
                <div id="linear">
                    <div className="status"></div>
                    <button 
                        id="simple-mlr"
                        onClick={async (e) => {
                            await this.run(
                                this.linearRegressionModel(),
                                'linearTrainHistory',
                                'linearTrainRef'
                            )
                        }}
                    >
                        Train Linear Regressor
                    </button>
                    <div ref={this.linearTrainRef} />
                    <div>
                    <Table dataSource={this.state.linearTrainHistory} />;
                    </div>
                </div>
                <div id="oneHidden">
                    <div className="status"></div>
                    <button 
                        id="nn-mlr-1hidden"
                        onClick={async () => {
                            await this.run(
                                this.multiLayerPerceptronRegressionModel1Hidden(),
                                'oneHiddenTrainHistory',
                                'oneHiddenTrainRef'
                            )
                        }}
                    >
                        Train Neural Network Regressor (1 hidden layer)
                    </button>
                    <div ref={this.oneHiddenTrainRef} />
                </div>
                <div id="twoHidden">
                    <div className="status"></div>
                    <button 
                        id="nn-mlr-2hidden"
                        onClick={async () => {
                            await this.run(
                                this.multiLayerPerceptronRegressionModel2Hidden(),
                                'twoHiddenTrainHistory',
                                'twoHiddenTrainRef'
                            )
                        }}
                    >
                        Train Neural Network Regressor (2 hidden layers)
                    </button>
                    <div ref={this.twoHiddenTrainRef} />
                </div>
            </div>
        </div>
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await trainData.loadData();
    arraysToTensors();
  }, false);