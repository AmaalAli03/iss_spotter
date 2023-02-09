const request = require('request');
/**

 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org/?format=json', (error, response, body) => {

    //pass through the error to the callback if an error occurs when requesting the IP data
    if (error) {
      return callback(error, null);
    }
    //checking HTTP response code
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    //parse and extract the IP address
    const data = JSON.parse(body).ip;
    console.log("This is the data:", data);

    // pass that through to the callback (as the second argument) if there is no error
    callback(null, data);


  });

};
const fetchCoordsByIP = function(ip, callback) {
  request('http://ipwho.is/' + ip, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    const responseData = JSON.parse(body);
    console.log("Response Data", responseData);
    if (!responseData.success) {
      const message = `${ip} - ${responseData.message}`;
      return callback(message);
    }

    // const latitude = responseData.latitude;
    // const longitude = responseData.longitude;
    //created new object to pass data
    // const data = {
    //   latitude,
    //   longitude
    // };

    return callback(null, { longitude: responseData.longitude, latitude: responseData.latitude });



  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  //console.log(JSON.parse(coords));
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    const passes = JSON.parse(body).response;
    return callback(null, passes);

  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(data, (error, passTimes) => {
        if (error) {
          return callback(error, null);
        }
        callback(error, passTimes);
      });
    });

  });

};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };