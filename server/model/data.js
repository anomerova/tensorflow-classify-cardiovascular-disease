import csv from './cardio_train.csv'
import trainTestSplit from 'train-test-split'

export class Dataset {
  constructor() {
    // Arrays to hold the data.
    this.trainFeatures = []
    this.trainTarget = []
    this.testFeatures = []
    this.testTarget = []
  }

  get numFeatures() {
    if (this.trainFeatures === []) {
      throw new Error("'loadData()' must be called before numFeatures")
    }
    return this.trainFeatures[0].length
  }

  /** Loads training and test data. */
  loadData() {
    const inputs = csv.map((d) => [
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
      d.active,
    ])
    const outputs = csv.map((d) => d.cardio)

    ;[this.trainFeatures, this.testFeatures] = trainTestSplit(inputs, 0.99)
    ;[this.trainTarget, this.testTarget] = trainTestSplit(outputs, 0.99)

    shuffle(this.trainFeatures, this.trainTarget)
    shuffle(this.testFeatures, this.testTarget)
  }
}

export const featureDescriptions = [
  'Возраст',
  'Пол',
  'Рост',
  'Вес',
  'Систолическое давление',
  'Диастолическое давление',
  'Холестерин',
  'Глюкоза',
  'Курение',
  'Алкоголь',
  'Физическая активность',
]

function shuffle(data, target) {
  let counter = data.length
  let temp = 0
  let index = 0
  while (counter > 0) {
    index = (Math.random() * counter) | 0
    counter--
    // data:
    temp = data[counter]
    data[counter] = data[index]
    data[index] = temp
    // target:
    temp = target[counter]
    target[counter] = target[index]
    target[index] = temp
  }
}
