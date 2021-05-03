export default class API {
    static URL = "https://ajax.test-danit.com/api/v2/cards";

    static getHeaders() {
        return {
            'content-type': 'application/json',
            'authorization': `Bearer ${API.token || sessionStorage.token}`
        }
    }

    static async login(userData) {
        /**
         * @requires object with user's data like: { email: 'your@email.com', password: 'password' }
         * @returns string with token
         */
        await fetch(`${API.URL}/login`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if(response.ok){
                    return response.text()
                }else {
                    throw new Error(`Response status: ${response.status.toString()}`)
                }
            })
            .then(token => API.saveToken(token))
    }

    static saveToken(tokenFromResponse) {
        API.token = tokenFromResponse;
        sessionStorage.setItem("token",tokenFromResponse)
    }

    static async saveCard(cardToSave) {
        /**
         * @requires object
         * @return if success , it returns the same object with id
         * */
        let response = await fetch(`${API.URL}`, {
            method: "POST",
            headers: API.getHeaders(),
            body: JSON.stringify(cardToSave)
        })
            return await response.json()
    }

    static async editCard(cardId, editedCard) {
        /**
         * @requires id of the object that needs to be edited
         * and the object that will be put instead of an old one
         * @returns changed object
         * */
         let response = await fetch(`${API.URL}/${cardId}`, {
            method: 'PUT',
            headers: API.getHeaders(),
            body: JSON.stringify(editedCard)
        })
            return await response.json()
    }

    static async deleteCard(cardId) {
        /**
         * @requires id of the object we need to delete
         * @return if success, it returns status: 200
         * */
         let response = await fetch(`${API.URL}/${cardId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${API.token || sessionStorage.token}`
            }
        })
    }

    static async getSingleCard(cardId) {
        /**
         * @requires id of the object we need to delete
         * @return object
         * */
         let response = await fetch(`${API.URL}/${cardId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${API.token || sessionStorage.token}`
            }
        })
            return await response.json;
    }

    static async getAllCards() {
        /**@return array with objects */
        let response = await fetch(`${API.URL}`, {
            method: "GET",
            headers: {
                'authorization': `Bearer ${API.token || sessionStorage.token}`
            }
        })
            return await response.json()
    }
}

