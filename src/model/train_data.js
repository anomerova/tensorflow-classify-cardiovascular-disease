import * as tf from '@tensorflow/tfjs'
// import trainTestSplit from 'train-test-split'
import papa from 'papaparse'
import csv from './cardio_train.csv'

export function train_model(){
        /*const results = papa.parse(csv,  {
            header: true,
            dynamicTyping: true,
            complete: function() {
                console.log("All done!");
            }
        })*/
        console.log(csv)

    // const [trainSplit, testSplit] = trainTestSplit(dataSet, 0.7, 1234)
    // console.log('parseMe', parseMe)

    // const model = tf.sequential();
    // model.add(tf.layers.dense({inputShape: [784], units: 32, activation: 'relu'}));
    // model.add(tf.layers.dense({units: 10, activation: 'softmax'}));
}
