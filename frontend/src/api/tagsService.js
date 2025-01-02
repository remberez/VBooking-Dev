import $api from "./urls";

export default class TagsService {
    static async getTags() {
        const response = await $api.get("/tags/");
        return response.data;
    }
}