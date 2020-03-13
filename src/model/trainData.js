import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'
import {Dataset} from './data.js'
import * as normalization from './normalization';
import * as UI from '../ui.js'

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
  };

  export function linearRegressionModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({inputShape: [trainData.numFeatures], units: 1}));
  
    model.summary();
    return model;
  };

  export function multiLayerPerceptronRegressionModel1Hidden() {
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
  };

  export function multiLayerPerceptronRegressionModel2Hidden() {
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
  };

  export async function run(model) {

    model.compile(
        {optimizer: tf.train.sgd(LEARNING_RATE), loss: 'meanSquaredError'});
    let trainLogs = [];

    await model.fit(tensors.trainFeatures, tensors.trainTarget, {
      batchSize: BATCH_SIZE,
      epochs: NUM_EPOCHS,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: async (logs) => {
          trainLogs.push(logs);
          tfvis.show.history(trainLogs, ['loss', 'val_loss'])
        }
      }
    })
  };

  document.addEventListener('DOMContentLoaded', async () => {
    await trainData.loadData();
    arraysToTensors();
  }, false);