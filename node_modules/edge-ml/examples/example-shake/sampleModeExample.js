/**
 * Following code is generated on the deployment page. The dataset used for training this model is in this directory, so you can train it yourselves
 */

// this is changed so that the example works in the source directory
// const { Predictor } = require('edge-ml')
const { Predictor } = require('../../dist')
const { score } = require('./shakesample_javascript')

const p = new Predictor(
    (input) => score(input),
    ['AccelerometerX', 'AccelerometerY', 'AccelerometerZ', 'GyroscopeX', 'GyroscopeY', 'GyroscopeZ'], // sensors
    100, // window size
    ['shake', 'STILL'], // labels
    {'scale': [456.89999999999986, 1.7000000000000002, 4.568999999999999, 1.0, 16.37991667923493, 272.6723773333334, 20.55429975152452, 43.50000000000001, 43.50000000000001, 37.7, 553.2333333333333, 4.800000000000001, 5.532333333333334, 1.0, 8.87448778931522, 80.51507597222225, 5.233021007637985, 14.399999999999999, 23.9, 29.300000000000004, 458.1333333333331, 1.1416666666666693, 4.58133333333333, 1.0, 17.97626482222193, 331.8784097777778, 10.897358557974057, 61.400000000000006, 61.400000000000006, 36.7, 27.92177737340528, 0.02923426497090502, 0.27921777373405277, 1.0, 5.674080882891607, 32.662245725674715, 6.131156197061794, 12.037535851004892, 15.02379420116719, 15.063936773963059, 31.333023396428203, 0.019634954084936207, 0.31333023396428206, 1.0, 8.905398086799991, 80.0946344892207, 8.90367312352328, 19.853120241435498, 19.853120241435498, 18.327702475192456, 17.675821999572577, 0.013962634015954637, 0.17675821999572577, 1.0, 5.575594915257246, 31.388752739250815, 5.869938977435963, 12.514010736799342, 12.514010736799342, 12.006119924468992], 'center': [156.8, 1.1, 1.568, 100.0, 10.265825965308393, 105.38718275000001, 11.602474951492033, 25.200000000000003, 25.200000000000003, -11.9, 180.99999999999994, 2.2, 1.8099999999999994, 100.0, 4.214677396379888, 17.763505555555554, 4.944580366421402, 13.200000000000001, 14.0, -7.9, 954.2499999999999, 9.2, 9.542499999999999, 100.0, 6.213705056387677, 38.610130527777784, 13.107873693996973, 29.5, 29.5, -12.200000000000001, -0.029670597283903654, -0.0008726646259971647, -0.0002967059728390365, 100.0, 1.607205387675301, 2.5831091581725145, 1.6081365012688127, 3.286454981505323, 11.082840750163992, -3.2951816277652943, 0.29466975537837603, 0.0017453292519943296, 0.0029466975537837605, 100.0, 3.250629986683856, 10.566595310328285, 3.2519927095577077, 6.485643500410929, 9.889035541799872, -9.321803534901715, -0.061959188445798744, 0.006981317007977318, -0.0006195918844579874, 100.0, 3.978628992873262, 15.829488662931706, 4.101449761530525, 10.10196571054318, 10.567968620825665, -5.46637121724624], 'name': 'RobustScaler'}, // scaler
    { // other options
        windowingMode: "sample"
    }
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
            await sleep(10)
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