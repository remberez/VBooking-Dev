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

    setUser(userData) {
        this.user = userData;
    }

    async fetchUser() {
        const response = await $api.get("users/profile/");
        return response.data;
    }

    async login(email, password) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            const userData = await this.fetchUser();
            this.setUser(userData);
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
            const userData = await this.fetchUser();
            this.setAuth(true);
            this.setUser(userData);
        } catch (e) {
            console.log(e);
        }
    }

    logout() {
        try {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            this.setAuth(false);
            this.user = {};
        } catch (e) {
            console.log(e);
        }
    }
}
