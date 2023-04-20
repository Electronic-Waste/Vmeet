// 引用
import cookie from 'react-cookies'

// 获取当前用户cookie
export const loginUser = () => {
    return cookie.load('userInfo')
}

// 用户登录，保存cookie
export const onLogin = (user) => {
    cookie.save('userInfo', user, { path: '/' })
}

// 用户登出，删除cookie
export const onLogout = () => {
    cookie.remove('userInfo')
    window.location.href = '/'
}

export const getUid = () => {
    const url = window.location.pathname;
    return url.substring(url.indexOf('/') + 1, url.lastIndexOf('/'));
}