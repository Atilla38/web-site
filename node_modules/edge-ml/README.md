# EdgeML-Node

Node library for <https://github.com/edge-ml>. Can be used to upload datasets as whole or incrementally or to do interference on models

[![Node.js Package](https://github.com/edge-ml/node/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/edge-ml/node/actions/workflows/npm-publish.yml)

## Installation

### Install from npm (Node.js)

```bash
npm i edge-ml
```

The functions need to be included with the following code:

```js
const datasetCollector = require("edge-ml").datasetCollector;
const Predictor = require("edge-ml").Predictor;
```

### Use from CDN

```html
<script src="https://unpkg.com/edge-ml/dist/bundle.js"></script>
<script>
  sendDataset = edgeML.sendDataset
  datasetCollector = edgeML.datasetCollector
  Predictor = edgeML.Predictor
</script>
```

The functions `sendDataset`, `datasetCollector` and `Predictor` are then accessible as global functions.


### Upload datasets in increments

#### Use custom timestamps

```js
// Generate collector function
try {
  var collector = await datasetCollector(
    "backendUrl", // Backend-URL
    "deviceApiKey", // API-Key
    "datasetName", // Name for the dataset
    false, // False to provide own timestamps
    ["accX", "accY", "accZ"], // Name of the time-series to create in the dataset

    // These two parameters can be omitted
    { key: "value" }, // Metadata: {} to omit
    "labeling_label" // Labeling and label for the whole dataset. Format: {labeling}_{label}
  );
} catch (e) {
  // Error occurred, cannot use the collector as a function to upload.
  console.log(e);
}

try {
  // Function expects 3 arguments
  collector.addDataPoint(
    1618760114000, // Timestamp to set in unix milliseconds
    "sensorName", // Name of the sensor
    1.23 // Value
  );

  // Tells the libarary that all data has been recorded.
  // Uploads all remaining datapoints to the server
  await collector.onComplete();
} catch (e) {
  console.log(e);
}
```

#### Use timestamps from the device

```js
// Generate collector function
try {
  var collector = await datasetCollector(
    "backendUrl", // Backend-URL
    "deviceApiKey", // API-Key
    "datasetName", // Name for the dataset
    true, // True, the library provides timestamps
    ["accX", "accY", "accZ"], // Name of the time-series to create in the dataset
    // These two parameters can be omitted
    { key: "value" }, // Metadata: {} to omit
    "labeling_label" // Labeling and label for the whole dataset. Format: {labeling}_{label}
  );
} catch (e) {
  console.log(e);
}

try {
  // Function expects 2 arguments (timestamp omitted)
  collector.addDataPoint(
    "sensorName", // Name of the sensor
    1.23, // Value 
    );

  // Tells the libarary that all data has been recorded.
  // Uploads all remaining datapoints to the server
  await collector.onComplete();
} catch (e) {
  console.log(e);
}
```