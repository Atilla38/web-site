import "bootstrap";
import "@fortawesome/fontawesome-free/css/all.css";
import "bootstrap/dist/css/bootstrap.css";
import "./styles.scss";

const MobileDetect = require("mobile-detect");
const EdgeML = require("edge-ml").default;

console.log(EdgeML);

document.getElementById("subject").value = Math.floor(
  (1 + Math.random()) * 0x10000
).toString(16);

var defaultTags = {};

const mobile = new MobileDetect(window.navigator.userAgent);

if (mobile.mobile()) {
  defaultTags.mobile = mobile.mobile();
}

if (mobile.userAgent()) {
  defaultTags.browser = mobile.userAgent();
}

const sensors = {
  deviceorientation: {
    listener: function (/** @type {DeviceOrientationEvent} */ evt) {
      if (evt.alpha === null) return;

      record(
        evt.type,
        {
          alpha: evt.alpha,
          beta: evt.beta,
          gamma: evt.gamma,
        },
        evt.timeStamp + performance.timing.navigationStart
      );
    },
  },
  devicemotion: {
    listener: function (/** @type {DeviceMotionEvent} */ evt) {
      if (evt.acceleration.x === null) return;

      record(
        evt.type,
        {
          x0: evt.acceleration.x,
          y0: evt.acceleration.y,
          z0: evt.acceleration.z,
          x: evt.accelerationIncludingGravity.x,
          y: evt.accelerationIncludingGravity.y,
          z: evt.accelerationIncludingGravity.z,
          alpha: evt.rotationRate.alpha,
          beta: evt.rotationRate.beta,
          gamma: evt.rotationRate.gamma,
        },
        evt.timeStamp + performance.timing.navigationStart
      );
    },
  },
};

async function start_recording() {
  for (const [sensor, fun] of Object.entries(sensors)) {
    try {
      if (sensor == "devicemotion") {
        fun.collector = await EdgeML.datasetCollector(
          "https://app.edge-ml.org",
          "d9647bfc4b3283f4b233b56fb2b43a33",
          sensor,
          false,
          ["x0", "y0", "z0", "x", "y", "z", "alpha", "beta", "gamma"],
          Object.assign(
            { participantId: document.getElementById("subject").value },
            defaultTags
          ),
          "activities_" + document.getElementById("label").value
        );
      } else {
        fun.collector = await EdgeML.datasetCollector(
          "https://app.edge-ml.org",
          "d9647bfc4b3283f4b233b56fb2b43a33",
          sensor,
          false,
          ["alpha", "beta", "gamma"],
          Object.assign(
            { participantId: document.getElementById("subject").value },
            defaultTags
          ),
          "activities_" + document.getElementById("label").value
        );
      }
      window.addEventListener(sensor, fun.listener, true);
    } catch (e) {
      // Error occurred, cannot use the collector as a function to upload
      console.log(e);
    }
  }
}

async function stop_recording() {
  for (const [sensor, fun] of Object.entries(sensors)) {
    try {
      window.removeEventListener(sensor, fun.listener, true);
      await fun.collector.onComplete();
    } catch (e) {
      console.log(e);
    }
  }
}

function record(eventtype, fields, eventtime) {
  // time at which the event happend
  for (const [key, value] of Object.entries(fields)) {
    sensors[eventtype].collector.addDataPoint(eventtime, key, value);
  }
}

// Wir schalten einen Timer an/aus mit der checkbox
document.getElementById("record").onchange = function () {
  if (this.checked) {
    start_recording();
    document.getElementById("debug").innerHTML = "Recording.";
  } else {
    stop_recording();
    document.getElementById("debug").innerHTML = "Not recording.";
  }
};
