import $api from "./urls"

export default class AuthService {
    static async login(email, password) {
        const response = await $api.post("/auth/jwt/create/", {email, password});
        return response;
    }
}