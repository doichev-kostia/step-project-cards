export default class API {
    static URL = "https://ajax.test-danit.com/api/v2/cards";

    static getHeaders() {
        return {
            'content-type': 'application/json',
            'Authorization': `Bearer ${API.token}`
        }
    }

    static async login(userData) {
        /**
         * @requires object with user's data like: { email: 'your@email.com', password: 'password' }
         * @return string with token
         */
        return await fetch(`${API.URL}/login`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => response.text())
            .then(token => API.saveToken(token))
    }

    static saveToken(tokenFromResponse) {
        API.token = tokenFromResponse;
    }

    static async saveCard(cardToSave) {
        /**
         * @requires object
         * @return if success , it returns the same object with id
         * */
        return await fetch(`${API.URL}`, {
            method: "POST",
            headers: API.getHeaders(),
            body: JSON.stringify(cardToSave)
        })
            .then(response => response.json())
    }

    static async editCard(cardId, cardToEdit) {
        /**
         * @requires id of the object that needs to be edited
         * and the object that will be put instead of an old one
         * @returns changed object
         * */
        return await fetch(`${API.URL}/${cardId}`, {
            method: 'PUT',
            headers: API.getHeaders(),
            body: JSON.stringify(cardToEdit)
        })
            .then(response => response.json())
    }

    static async deleteCard(cardId) {
        /**
         * @requires id of the object we need to delete
         * @return if success, it returns status: 200
         * */
        return await fetch(`${API.URL}/${cardId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${API.token}`
            }
        })
    }

    static async getSingleCard(cardId) {
        /**
         * @requires id of the object we need to delete
         * @return object
         * */
        return await fetch(`${API.URL}/${cardId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${API.token}`
            }
        })
            .then(response => response.json())
    }

    static async getAllCards() {
        /**@return array with objects */
        return await fetch(`${API.URL}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${API.token}`
            }
        })
            .then(response => response.json())
            .then(data => console.log(data))
    }
}

