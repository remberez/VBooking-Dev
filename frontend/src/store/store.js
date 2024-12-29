import { makeAutoObservable } from "mobx";
import AuthService from "../api/AuthService";
import $api, { BACKEND_URL } from "../api/urls";
import axios from "axios";

export default class Store {
    user = {}; 
    isAuth = false;

    constructor() {
        makeAutoObservable(this);    
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    async setUser() {
        const response = await $api.get("users/profile/");
        this.user = response.data;
    }

    async login(email, password) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            await this.setUser();
            this.setAuth(true);
            return response;
        } catch (e) {
            return e;
        }
    }

    async checkAuth() {
        try {
            const response = await axios.post(`${BACKEND_URL}/auth/jwt/refresh`, {refresh: localStorage.getItem('refresh')});
            localStorage.setItem('access', response.data.access);
            this.isAuth = true;
            this.setUser();
        } catch (e) {

        }
    }

    logout() {
        try {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            this.setAuth(false);
            this.user = {};
        } catch (e) {

        }
    }
}
