import {
    AutoComplete,
    Button,
    Cascader,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select, Upload,
} from 'antd';
import React, { useState } from 'react';
import 'antd/dist/antd.css';
import '../css/login.css';
import {Link, useNavigate} from "react-router-dom";
import { antdOptions, cityData, provinceData } from '@heerey525/china-division-data'
import {Register, UploadAvatar} from "../service/UserService";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {UploadUserAvatar} from "../components/UploadAvatar";
import {createWebSocket} from "../utils/websocket";
import {encrypt} from "../service/SecurityService";

export function RegisterView () {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = (values) => {
        //console.log('Received values of form: ', values);
        const username = encrypt(values.username);
        const password = encrypt(values.password);
        const email = encrypt(values.email);
        const sign = values.sign;
        const province = values.city[0];
        const city = values.city[1];
        const data={
            username:username,
            password:password,
            email:email,
            sign:sign,
            province:province,
            city:city,
            avatar:null
        }
        Register(data,(data)=>{
            //console.log(data);
            const uid = data.id;
            if(uid === -1) {
                alert("用户名不能重复");
                navigate("/register")
            }
            else
            {
                alert("注册成功");
                localStorage.removeItem('user'+data.id);
                localStorage.setItem('user'+data.id,JSON.stringify(data));
                navigate(`/${uid}/FriendView`);
            }
        })
    };

    return (
        <div className="login-space">
            <p className="big-logo">VMeet</p>
            <Form
                form={form}
                name="register"
                className="register-form"
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="username"
                    label="Usernme"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="sign"
                    label="sign"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your sign!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="city"
                    label="city"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your city!',
                        },
                    ]}
                >
                    <Cascader options={antdOptions} placeholder="Please select" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="register-form-button" >
                        register
                    </Button>
                </Form.Item>

            </Form>
        </div>

    );
};
