
import Geocode from "react-geocode";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_APIKEY);

// set response language. Defaults to english.
Geocode.setLanguage("en");

export const getLocation = () => localStorage.getItem('userLocation') !== null ? JSON.parse(localStorage.getItem('userLocation')) : ''

export const getDeviceCurrentLocation = () => {

    if ("geolocation" in navigator) {
        let promise = new Promise(function (resolve, reject) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    Geocode.fromLatLng(latitude, longitude).then(
                        response => {
                            const address = response.results[0];                             
                            // resolve(address,position.coords)
                            resolve(response.results[0])
                        },
                        error => {

                            reject(error)
                        }
                    );
                },
                (error) => {

                    reject(error)
                },
                { timeout: 10000 }
            )
        });
        return promise
    } else {
        return {
            error: "Location denied",
            message: "Failed to access location"
        }
    }
}

