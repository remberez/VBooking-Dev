import axios from "axios";
import { BACKEND_URL } from "./urls";

class ObjectService {
    static async getObjects(params) {
        const response = await axios.get(BACKEND_URL + "/objects/", {
            params: params
        });
        return response.data;
    }
}

export default ObjectService;