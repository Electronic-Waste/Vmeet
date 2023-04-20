import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import '../css/login.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import {AuthConsumer} from "../utils/Auth";
import {Navigate} from "react-router";
import {Link, useNavigate} from "react-router-dom";
import {Login} from "../service/UserService";
import {loginUser, onLogin, onLogout} from "../utils/cookie";
import ParticlesBg from 'particles-bg'
import '../css/loginView.css'
import {decrypt, encrypt} from "../service/SecurityService";


export function LoginView(props) {
    const navigate = useNavigate();
    const auth = AuthConsumer();

    const onFinish = (values) => {
        //console.log('Received values of form: ', values);
        values["username"] = encrypt(values.username);
        values["password"] = encrypt(values.password);
        Login(values,(data)=>{
            const uid = data.id;
            if(data.id === -1) {
                alert("用户名或密码错误");
                return;
            }
            //localStorage.removeItem('avatar'+data.id);
            //if(data.avatar === null)
            //    localStorage.setItem('avatar'+data.id,data.avatar);
            //else
            //    localStorage.setItem('avatar'+data.id,'data:image/jpeg;base64,' + data.avatar);

            if(data.avatar !== null)
                data['avatar'] = 'data:image/jpeg;base64,' + data.avatar

            localStorage.removeItem('user'+data.id);
            localStorage.setItem('user'+data.id,JSON.stringify(data));

            //console.log(data);


            //console.log('avatar',data.avatar);
            //const userinfo = loginUser();
            //console.log(userinfo);

            auth.login();
            navigate(`/${uid}/FriendView`);

            //need to add the logic to load the friend and group

        })
    };

    return (
         <div className="login-space">
            <p className="big-logo">VMeet</p>
             {/*<SignIn/>*/}
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                        Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" >
                        Log in
                    </Button>
                    Or <Link to={"/register"}>register now!</Link>
                </Form.Item>
            </Form>
             <ParticlesBg type="fountain" bg={true} />
         </div>
    );

}
