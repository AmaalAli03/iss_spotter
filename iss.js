const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    //checking HTTP response code
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      return callback(Error(msg), null);
    }

    const data = JSON.parse(body).ip;
    callback(null, data);
  });
};
const fetchCoordsByIP = function(ip, callback) {
  const url = "http://ipwho.is/" + ip;
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    // console.log('error:', error); // Print the error if one occurred
    // console.log('Type of body:', typeof body); // Print the HTML for the Google homepage.
    const data = JSON.parse(body);
    // const [success] = false
    if (!data.success) {
      const message = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${data.ip}`;
      return callback(Error(message), null);
    } else {
      // console.log(data);
      // console.log("latitude", data.latitude);
      // console.log("longitude", data.longitude);
      // console.log("success:", data.success);
      let coordinates = {
        latitude: data.latitude,
        longitude: data.longitude
      };
      callback(null, coordinates);

    }


  });
};
const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    //check if everything is right with the request
    //thats why we are checking if theres an error
    if (error) {
      return callback(error, null);

    }
    const data = JSON.parse(body);
    if (data.message === "success") {
      return callback(null, data.response);
    }

  });
};
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, data) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, data);
      });
    });
  });
};
module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};