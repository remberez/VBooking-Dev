import axios from "axios";
import { BACKEND_URL } from "./urls";

class ObjectsTypeService {
    static async getObjectsType() {
        const response = await axios.get(BACKEND_URL + "/types-of-objects/");
        return response.data;        
    }
}

export default ObjectsTypeService;