import $api from "./urls"

class UserService {
    static async changeProfileInfo(userId, ...data) {
        const response = await $api.patch(`/users/${userId}/`, ...data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    }

    static validateField(value, currentValue) {
        return value !== currentValue && (currentValue !== null || value !== "");
    }
}

export default UserService;