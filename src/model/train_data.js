import * as tf from '@tensorflow/tfjs'
import trainTestSplit from 'train-test-split'
import Papa from 'papaparse'
import * as fs from 'browserfs'

export function train_model(){
    const csvFile = fs.createReadStream('cardio_train.csv')
    const count = 0; // cache the running count
    const parseDataSet = Papa.parse(csvFile, {
        complete: function(results, file) {
            console.log('parsing complete read', count, 'records.');
        }
    })
    
    // const [trainSplit, testSplit] = trainTestSplit(dataSet, 0.7, 1234)
    console.log(parseDataSet)
    
    // const model = tf.sequential();
    // model.add(tf.layers.dense({inputShape: [784], units: 32, activation: 'relu'}));
    // model.add(tf.layers.dense({units: 10, activation: 'softmax'}));
}
