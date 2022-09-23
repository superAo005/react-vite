import request from './request';
// import {message} from 'antd';
// 获取天气
export const getWeather = () => request('https://restapi.amap.com/v3/weather/weatherInfo', {
  city: 510100,
  key: '7643af4d54f441a88a37a3307be2fff0'
});
// 登录
export const reqLogin =  (username, password) => request('/login', {username, password}, 'POST');
// 获取菜单
export const reqGetMenu = () => request('/getmenu');

