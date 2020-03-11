import React from 'react'
import './Charts.less'
import { linearRegressionModel, run, multiLayerPerceptronRegressionModel1Hidden, multiLayerPerceptronRegressionModel2Hidden } from '../model/trainData'

export default function Charts() {
    return <div>
        <p className='section-head'>Training Progress</p>
        <div className="with-cols">
            <div id="linear">
                <div className="chart"></div>
                <div className="status"></div>
                <button 
                    id="simple-mlr"
                    onClick={async (e) => {
                        const model = linearRegressionModel()
                        await run(model)
                    }}
                >
                    Train Linear Regressor
                </button>
            </div>
            <div id="oneHidden">
                <div className="chart"></div>
                <div className="status"></div>
                <button 
                    id="nn-mlr-1hidden"
                    onClick={async () => {
                        const model = multiLayerPerceptronRegressionModel1Hidden();
                        await run(model);
                    }}
                >
                    Train Neural Network Regressor (1 hidden layer)
                </button>
            </div>
            <div id="twoHidden">
                <div className="chart"></div>
                <div className="status"></div>
                <button 
                    id="nn-mlr-2hidden"
                    onClick={async () => {
                        const model = multiLayerPerceptronRegressionModel2Hidden();
                        await run(model);
                    }}
                >
                    Train Neural Network Regressor (2 hidden layers)
                </button>
            </div>
        </div>
    </div>
}