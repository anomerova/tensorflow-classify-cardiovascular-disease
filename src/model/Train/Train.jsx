import React from 'react'
import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis';
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

    componentWillMount() {
        tfvis.visor().open()
    }

    componentWillUnmount() {
        tfvis.visor().close()
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
        model.compile({optimizer: tf.train.sgd(LEARNING_RATE), loss: 'meanSquaredError'});
        const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
        const container = {
            name: stateDataName, styles: { width: '1200px' }

        };
        const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);
        await model.fit(tensors.trainFeatures, tensors.trainTarget, {
            batchSize: BATCH_SIZE,
            epochs: NUM_EPOCHS,
            validationSplit: 0.2,
            callbacks: fitCallbacks
        }).then(info => {
            console.log('Final accuracy', info)
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
                        onClick={async (e) => {await this.run(this.linearRegressionModel(), 'linearTrainHistory')}}
                    >
                        Train Linear Regressor
                    </button>
                </div>
                <div id="oneHidden">
                    <div className="status"></div>
                    <button 
                        id="nn-mlr-1hidden"
                        onClick={async () => {await this.run(this.multiLayerPerceptronRegressionModel1Hidden(), 'oneHiddenTrainHistory')}}
                    >
                        Train Neural Network Regressor (1 hidden layer)
                    </button>
                </div>
                <div id="twoHidden">
                    <div className="status"></div>
                    <button 
                        id="nn-mlr-2hidden"
                        onClick={async () => {await this.run(this.multiLayerPerceptronRegressionModel2Hidden(), 'twoHiddenTrainHistory')}}
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