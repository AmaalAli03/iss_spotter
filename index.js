// const { fetchMyIP } = require('./iss');
// const { fetchISSFlyOverTimes } = require('./iss');
// const { fetchCoordsByIP } = require('./iss');
const { nextISSTimesForMyLocation } = require('./iss');
// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }
//   console.log('It worked! Returned IP:', ip);

// });
// fetchCoordsByIP("99.252.182.238", (error, data) => {
// if(error){
//   console.log(error)
// } else {
//   console.log(data);
// }
  
//   // if (success)
//   // return false

// });
// fetchISSFlyOverTimes({ latitude: '49.27670', longitude: '-123.13000' }, (error, data) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(data);
//   }

// });

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});




// pass through the error to the callback if an error occurs when requesting the IP data
// parse and extract the IP address using JSON and then pass that through to the callback
// (as the second argument) if there is no error.