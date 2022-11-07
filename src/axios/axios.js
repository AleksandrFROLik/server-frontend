import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4444'
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem('token');
  return config;
}); //при каждом запросе будет проверяться зарегин ли пользователь чтобы backend  знал можно ли тебе выдавать
// приватную информацию.

export default instance;