import * as tf from '@tensorflow/tfjs'
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

  export function describeKernelElements(kernel) {
    tf.util.assert(
        kernel.length == 12,
        `kernel must be a array of length 12, got ${kernel.length}`);
    const outList = [];
    for (let idx = 0; idx < kernel.length; idx++) {
      outList.push({description: featureDescriptions[idx], value: kernel[idx]});
    }
    return outList;
  }

  export async function run(model) {

    model.compile(
        {optimizer: tf.train.sgd(LEARNING_RATE), loss: 'meanSquaredError'});
  
    await model.fit(tensors.trainFeatures, tensors.trainTarget, {
      batchSize: BATCH_SIZE,
      epochs: NUM_EPOCHS,
      validationSplit: 0.2
    }).then(info => {
      console.log('Final accuracy', info);
    });
  };

  document.addEventListener('DOMContentLoaded', async () => {
    await trainData.loadData();
    UI.updateStatus('Data loaded, converting to tensors');
    arraysToTensors();
    UI.updateStatus(
        'Data is now available as tensors.\n' +
        'Click a train button to begin.');
    UI.updateBaselineStatus('Estimating baseline loss');
  }, false);