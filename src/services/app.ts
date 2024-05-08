import axios from 'axios';
import { dataObj } from '../types';

const API_URL = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_API_URL

const getHeaders = () => {
    const { token }: { [key: string | number]: any } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    return { authorization: `Bearer ${token}` }
}
const getConfig = () => {
    const { token }: { [key: string | number]: any } = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    return { headers: { authorization: `Bearer ${token}` } }
}

const sendContactEmail = async (data: dataObj) => {
    try {
        const email = await axios.post(`${API_URL}/api/app/sendContactEmail`, data, getConfig())
        return email.data
    } catch (err) { console.log(err) }
}

export {
    sendContactEmail,
}