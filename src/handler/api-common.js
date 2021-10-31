import axios from "axios";
const apiBaseUrl = process.env.REACT_APP_SERVICES_URI;


export default axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-type": "application/json"
    }
});