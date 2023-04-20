import {Button, Col, Descriptions, Divider, Form, Input, Layout, Menu, Modal, Row, Statistic} from "antd";
import Avatar from "antd/es/avatar/avatar";
import React, {useEffect, useState} from "react";
import {UploadUserAvatar} from "./UploadAvatar";
import {AuthConsumer} from "../utils/Auth";
import {getUid} from "../utils/cookie";
import {GetUserById} from "../service/UserService";
import {decrypt} from "../service/SecurityService";

const ModifyInfoForm = ()=>{
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Telephone"
                name="telephone"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>


            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );

}

const ModifyInfo = ()=>{
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setVisible(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };

    return (
        <div>
            <Button type="primary" onClick={showModal}>
                编辑个人信息
            </Button>
            <Modal
                title="Title"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <ModifyInfoForm/>
            </Modal>
        </div>
    );
}

export default function UserInfoPage (){
    //data:image/jpeg;base64,
    const auth = AuthConsumer();
    console.log('infopage')

    let userjson = localStorage.getItem('user'+getUid());
    let user = JSON.parse(userjson);

    let url = user.avatar;
    let username = decrypt(user.username);

    //console.log(url);
    if(url === null || url === 'null') {
        url = "https://joeschmoe.io/api/v1/random";
    }

    const [userInfo,setUser]=useState();

    /*
    useEffect(()=>{
        GetUserById(getUid(),(data)=>{
            console.log(data);
            // setUser(data);
        })
    },[])
    */

    return(
        <Row className='userinfo'>
            <Col >
                <div className="img_div">
                    <img src={url} className="imgCSS"/>
                    <div className="mask">
                        <div>更换头像</div>
                    </div>
                </div>
                <Descriptions title="User Info" layout="horizontal">
                    <Descriptions.Item label="UserName">{username}</Descriptions.Item>
                </Descriptions>
                <ModifyInfo/>
                <UploadUserAvatar/>
                </Col>
        </Row>
    )
}
