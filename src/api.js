import axios from "axios";

const apiURL = axios.create({
    baseURL: "https://database-dramalist-1.onrender.com"
});

export default apiURL;