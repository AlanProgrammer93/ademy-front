import axios from 'axios';

const clientAxios = axios.create({
    baseURL: 'http://192.168.50.115:8000'
});

export default clientAxios;