/**
 * Following code is generated on the deployment page. The dataset used for training this model is in this directory, so you can train it yourselves
 */

// this is changed so that the example works in the source directory
// const { Predictor } = require('edge-ml')
const { Predictor } = require('../..')
const { score } = require('./model_javascript')

const p = new Predictor(
    (input) => score(input),
    ['AccelerometerX', 'AccelerometerY', 'AccelerometerZ'],
    50,
    ['Still', 'Shake'],
    {'scale': [79.25000000000001, 1.0, 1.5849999999999997, 1.0, 12.137992715350133, 233.5518440000001, 12.062295477964101, 23.600000000000005, 22.750000000000004, 34.60000000000001, 28.200000000000006, 1.0, 0.5640000000000001, 1.0, 4.851983387175274, 38.78205, 4.859832967726578, 11.0, 12.100000000000001, 12.200000000000003, 70.30000000000001, 0.025000000000000355, 1.4059999999999988, 1.0, 3.715476614703034, 23.929080000000006, 2.565530194566513, 13.850000000000001, 13.850000000000001, 10.100000000000001], 'center': [116.30000000000001, 0.0, 2.326, 50.0, 15.40061349427353, 237.17889599999998, 15.550241155686301, 32.9, 34.5, -34.5, 5.299999999999983, 0.0, 0.10599999999999966, 50.0, 4.708919621314427, 22.173924000000007, 4.756910762248962, 14.200000000000001, 14.200000000000001, -9.700000000000001, 548.0, 9.8, 10.96, 50.0, 3.5930132201259712, 12.909744, 11.87272504524551, 21.3, 21.3, 3.8000000000000003], 'name': 'RobustScaler'}
)

/**
 * We are feeding data from a csv file (test.csv), irrelevant part from the generated code is commented out
 */

// setInterval(() => {
//     p.addDatapoint('AccelerometerX', getAccelerometerX())
//     p.addDatapoint('AccelerometerY', getAccelerometerY())
//     p.addDatapoint('AccelerometerZ', getAccelerometerZ())

//     p.predict()
//         .then(x => x)
//         .catch(e => console.log(e.message))
// }, 250)

/************************************************************************************************************************************
 * Following part feeds the test.csv file into the predictor and logs the results
 */

const fs = require('fs')

const test = csvToArray(fs.readFileSync('./test.csv', { encoding:'utf8' }))

async function runner() {
    for (const { time: ti, ...valObjs } of test) {
        const time = parseInt(ti);
        for (const [key, valStr] of Object.entries(valObjs)) {
            p.addDatapoint(key, parseInt(valStr), time)
        }
    
        try {
            const x = await p.predict()
            console.log((new Date(time).toISOString()), x)
            await sleep(20)
        } catch(e) {
            console.log(e)
        }
    }
}
runner();

function csvToArray(str, delimiter = ",") {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });
    return arr;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}