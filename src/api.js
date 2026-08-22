import axios from "axios";

const apiURL = axios.create({
    baseURL: "https://database-dramalist.onrender.com"
});

export default apiURL;