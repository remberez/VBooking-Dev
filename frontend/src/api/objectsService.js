import axios from "axios";
import $api from "./urls";

class ObjectService {
    static async getObjects(params) {
        const response = await $api.get("/objects/", {
            params: params
        });
        return response.data;
    }

    static async getFavoritesObjects() {
        const response = await $api.get("/favorite/");
        return response.data;
    }

    static async addToFavorites(object, dateStart, dateEnd) {
        console.log(dateStart)
        const response = await $api.post("/favorite/", {object, date_start: dateStart, date_end: dateEnd});
        return response;
    }

    static async removeFromFavorites(objectId) {
        const response = await $api.delete(`/favorite/${objectId}/`);
        return response;
    }
}

export default ObjectService;