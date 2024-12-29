import axios from "axios";
import { BACKEND_URL } from "./urls";

class CityService {
    static async getCities() {
        const response = await axios.get(BACKEND_URL + "/city/");
        return response.data;
    }
}

export default CityService;