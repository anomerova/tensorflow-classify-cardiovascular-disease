import * as tf from '@tensorflow/tfjs'
// import trainTestSplit from 'train-test-split'
import papa from 'papaparse'

export function train_model(){
    async function getData() {
        const response = await fetch('cardio_train.csv')
        const reader = response.body.getReader()
        const result = await reader.read() // raw array
        const decoder = new TextDecoder('utf-8')
        const csv = decoder.decode(result.value) // the csv text
        const results = papa.parse(csv,  {
            header: true,
            dynamicTyping: true,
            step: function(row) {
                console.log("Row:", row.data);
            },
            complete: function() {
                console.log("All done!");
            }
        })
        console.log(results.data)
    }

    getData()

    // const [trainSplit, testSplit] = trainTestSplit(dataSet, 0.7, 1234)
    // console.log('parseMe', parseMe)

    // const model = tf.sequential();
    // model.add(tf.layers.dense({inputShape: [784], units: 32, activation: 'relu'}));
    // model.add(tf.layers.dense({units: 10, activation: 'softmax'}));
}
