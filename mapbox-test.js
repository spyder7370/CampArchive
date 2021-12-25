require('dotenv').config();

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

// async function geocoder(location) {
// 	try {	
		// let response = await geocodingClient
		//   .forwardGeocode({
		//     query: location,
		//     limit: 1
		//   })
		//   .send();

// 		console.log(response.body.features[0].geometry.coordinates);
// 	} catch(err) {
// 		console.log(err);
// 	}
// }

// geocoder('Alaska, US');
function geocode(location){
	return geocodingClient
      .forwardGeocode({
        query: location,
        limit: 1,
      })
      .send()
      .then((response) => {
        const match = response.body;
        const coordinates = match.features[0].geometry.coordinates;
        return coordinates;
      });
}
// geocode();
var coor;
var cd = geocode('Dallas, texas');
cd.then(function(result) {
	console.log("result is ",result);
	coor = result;
	console.log("coor is ", coor)
})
