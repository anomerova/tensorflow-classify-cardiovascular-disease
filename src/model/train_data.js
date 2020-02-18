import * as tf from '@tensorflow/tfjs'
import trainTestSplit from 'train-test-split'
import csv from './cardio_train.csv'

export function getData() {
  const [trainSplit, testSplit] = trainTestSplit(csv, 0.7, 1234)
  const values = trainSplit.map(d => ({
    x: [
      d.id,
      d.age,
      d.gender,
      d.height,
      d.weight,
      d.ap_hi,
      d.ap_lo,
      d.cholesterol,
      d.gluc,
      d.smoke,
      d.alco,
      d.active
    ],
    y: d.cardio,
  }))

  console.log(values)
}

/*async function getDataAwait() {
    const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');  
    const carsData = await carsDataReq.json();  
    const cleaned = carsData.map(car => ({
    mpg: car.Miles_per_Gallon,
    horsepower: car.Horsepower,
    }))
    .filter(car => (car.mpg != null && car.horsepower != null));
    
    return cleaned;
}*/
  
export async function run() {
    // Create the model
    const model = createModel()
    // const data = await getData();
    const [trainSplit, testSplit] = trainTestSplit(csv, 0.7, 1234)
    // console.log(trainSplit, testSplit)

    // Convert the data to a form we can use for training.
    const tensorData = convertToTensor(trainSplit)
    const {inputs, outputs} = tensorData

    // Train the model  
    await trainModel(model, inputs, outputs)
    console.log('Done Training');

    // testModel(model, data, tensorData);
}
  
  document.addEventListener('DOMContentLoaded', run);
  
  function createModel() {
    // Create a sequential model
    const model = tf.sequential(); 
    
    // Add a single hidden layer
    model.add(tf.layers.dense({units: 11, inputShape: [11, 49000], useBias: true}));

    //https://stackoverflow.com/questions/52796751/error-when-checking-input-expected-dense-dense5-input-to-have-4-dimensions-b
    model.add(tf.layers.flatten())
    // Add an output layer
    model.add(tf.layers.dense({units: 1, useBias: true}));
  
    return model;
  }
 
  function convertToTensor(data) {

    return tf.tidy(() => {
      // Shuffle the data    
      tf.util.shuffle(data);
  
      // Convert data to Tensor
      const inputsAge = data.map(d => d.age),
        inputsGender = data.map(d => d.gender),
        inputsHeight = data.map(d => d.height),
        inputsWeight = data.map(d => d.weight),
        inputsApHi = data.map(d => d.ap_hie),
        inputsApLo = data.map(d => d.ap_lo),
        inputsCholesterol = data.map(d => d.cholesterol),
        inputsGluc = data.map(d => d.gluc),
        inputsSmoke = data.map(d => d.smoke),
        inputsAlco = data.map(d => d.alco),
        inputsActive = data.map(d => d.active),
        outputsCardio = data.map(d => d.cardio);
  
      const inputsAgeTensor = tf.tensor2d(inputsAge, [inputsAge.length, 1]);
      const inputsGenderTensor = tf.tensor2d(inputsGender, [inputsGender.length, 1]);
      const inputsHeightTensor = tf.tensor2d(inputsHeight, [inputsHeight.length, 1]);
      const inputsWeightTensor = tf.tensor2d(inputsWeight, [inputsWeight.length, 1]);
      const inputsApHiTensor = tf.tensor2d(inputsApHi, [inputsApHi.length, 1]);
      const inputsApLoTensor = tf.tensor2d(inputsApLo, [inputsApLo.length, 1]);
      const inputsCholesterolTensor = tf.tensor2d(inputsCholesterol, [inputsCholesterol.length, 1]);
      const inputsGlucTensor = tf.tensor2d(inputsGluc, [inputsGluc.length, 1]);
      const inputsSmokeTensor = tf.tensor2d(inputsSmoke, [inputsSmoke.length, 1]);
      const inputsAlcoTensor = tf.tensor2d(inputsAlco, [inputsAlco.length, 1]);
      const inputsActiveTensor = tf.tensor2d(inputsActive, [inputsActive.length, 1]);
      const outputsCardioTensor = tf.tensor2d(outputsCardio, [outputsCardio.length, 1]);
  
      //Normalize the data to the range 0 - 1 using min-max scaling 
    
      const inputs = [
        inputsAgeTensor.sub(inputsAgeTensor.min()).div(inputsAgeTensor.max().sub(inputsAgeTensor.min())),
        inputsGenderTensor.sub(inputsGenderTensor.min()).div(inputsGenderTensor.max().sub(inputsGenderTensor.min())),
        inputsHeightTensor.sub(inputsHeightTensor.min()).div(inputsHeightTensor.max().sub(inputsHeightTensor.min())),
        inputsWeightTensor.sub(inputsWeightTensor.min()).div(inputsWeightTensor.max().sub(inputsWeightTensor.min())),
        inputsApHiTensor.sub(inputsApHiTensor.min()).div(inputsApHiTensor.max().sub(inputsApHiTensor.min())),
        inputsApLoTensor.sub(inputsApLoTensor.min()).div(inputsApLoTensor.max().sub(inputsApLoTensor.min())),
        inputsCholesterolTensor.sub(inputsCholesterolTensor.min()).div(inputsCholesterolTensor.max().sub(inputsCholesterolTensor.min())),
        inputsGlucTensor.sub(inputsGlucTensor.min()).div(inputsGlucTensor.max().sub(inputsGlucTensor.min())),
        inputsSmokeTensor.sub(inputsSmokeTensor.min()).div(inputsSmokeTensor.max().sub(inputsSmokeTensor.min())),
        inputsAlcoTensor.sub(inputsAlcoTensor.min()).div(inputsAlcoTensor.max().sub(inputsAlcoTensor.min())),
        inputsActiveTensor.sub(inputsActiveTensor.min()).div(inputsActiveTensor.max().sub(inputsActiveTensor.min())),
      ]

      const outputs = outputsCardioTensor.sub(outputsCardioTensor.min()).div(outputsCardioTensor.max().sub(outputsCardioTensor.min()));

      console.log(inputs)
      return {
        inputs: inputs,
        labels: outputs
      }
    });  
  }
  
  async function trainModel(model, inputs, outputs) {
    // Prepare the model for training.  
    model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse'],
    });
    
    const batchSize = 32
    const epochs = 50
    
    return await model.fit(tf.stack(inputs, outputs, {
      batchSize,
      epochs,
      shuffle: true
    }))
  }

  /*
  function testModel(model, inputData, normalizationData) {
    const {inputMax, inputMin, labelMin, labelMax} = normalizationData;  
    
    // Generate predictions for a uniform range of numbers between 0 and 1;
    // We un-normalize the data by doing the inverse of the min-max scaling 
    // that we did earlier.
    const [xs, preds] = tf.tidy(() => {
      
      const xs = tf.linspace(0, 1, 100);      
      const preds = model.predict(xs.reshape([100, 1]));      
      
      const unNormXs = xs
        .mul(inputMax.sub(inputMin))
        .add(inputMin);
      
      const unNormPreds = preds
        .mul(labelMax.sub(labelMin))
        .add(labelMin);
      
      // Un-normalize the data
      return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });
    
   
    const predictedPoints = Array.from(xs).map((val, i) => {
      return {x: val, y: preds[i]}
    });
    
    const originalPoints = inputData.map(d => ({
      x: d.horsepower, y: d.mpg,
    }));
    
    
    tfvis.render.scatterplot(
      {name: 'Model Predictions vs Original Data'}, 
      {values: [originalPoints, predictedPoints], series: ['original', 'predicted']}, 
      {
        xLabel: 'Horsepower',
        yLabel: 'MPG',
        height: 300
      }
    );
  } */