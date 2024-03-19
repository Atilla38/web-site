/**
 * Following code is generated on the deployment page. The dataset used for training this model is in this directory, so you can train it yourselves
 */

// this is changed so that the example works in the source directory
// const { Predictor } = require('edge-ml')
const { Predictor } = require('../../dist')
const { score } = require('./shaketime_javascript')

const p = new Predictor(
    (input) => score(input),
    ['AccelerometerX', 'AccelerometerY', 'AccelerometerZ', 'GyroscopeX', 'GyroscopeY', 'GyroscopeZ'], // sensors
    500, // window size
    ['shake', 'STILL'], // labels
    {'scale': [45.0, 1.9083333333333334, 1.9108988095238097, 10.0, 12.479071124449142, 158.4191619674537, 14.832371271743833, 25.45, 29.450000000000003, 21.650000000000002, 95.17500000000001, 4.75, 4.716242456896552, 10.0, 6.266070406542173, 40.2166696332812, 4.687803975813474, 8.1, 14.500000000000004, 14.8, 116.15000000000003, 1.6833333333333336, 2.314532535252642, 10.0, 9.066031320640922, 84.91938807552084, 6.728677403819498, 19.25, 20.049999999999997, 19.200000000000003, 6.520986417763814, 0.8278678418626436, 0.32175174202641854, 10.0, 2.955088630912951, 9.04087565494476, 3.729831851071332, 5.867360612891938, 9.54316946169633, 5.605997557405786, 10.687523674587275, 0.16740616408712275, 0.9046487458084663, 10.0, 5.111670132108733, 26.428117822763497, 5.756414295256268, 6.431538293599105, 10.275625971116616, 10.294824592888553, 3.449206934253794, 0.14486232791552936, 0.276441604508945, 10.0, 4.461634412260028, 20.146820144604803, 5.109511908936298, 7.66723140401109, 8.62716249260797, 8.214392124511312], 'center': [16.599999999999998, 0.9, 0.7839285714285718, 23.0, 0.46096517101500073, 0.21248888888888887, 1.6032916083736863, 1.8, 2.0, -0.5, 46.5, 2.525, 2.4750000000000005, 23.0, 0.22347971231899738, 0.04994318181818183, 4.817058651714141, 4.9, 5.0, -0.2, 225.54999999999998, 9.15, 9.122727272727275, 23.0, 0.37976918343981236, 0.14422463269054184, 9.352654321482373, 9.9, 9.9, 7.800000000000001, 0.13264502315156906, 0.006981317007977318, 0.00523598775598299, 23.0, 0.10240776319136743, 0.010487349961859191, 0.13941027939867479, 0.23387411976724015, 0.24085543677521748, -0.2111848394913139, -0.17191493132144145, -0.0008726646259971651, -0.008186425301021021, 23.0, 0.14432775868499545, 0.02083050192703428, 0.21086329545574553, 0.20158552860534507, 0.41538836197465046, -0.23387411976724015, 0.018325957145940465, 0.004363323129985823, 0.0010181087303300258, 23.0, 0.10605213687997944, 0.011247055736809897, 0.12169484733274609, 0.2059488517353309, 0.29146998508305305, -0.21467549799530253], 'name': 'RobustScaler'}, // scaler
    { // other options
        windowingMode: "time"
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