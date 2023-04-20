import {
    Button,
    Col,
    Image,
    Input,
    Layout,
    Popconfirm,
    Row,
    message,
    Alert,
    Modal,
    Typography,
    Card,
    Form,
    Mentions
} from "antd";
import React, {useState} from 'react';
import "../css/addFriend.css"
import {Option} from "antd/es/mentions";
import {GetUserByUsername} from "../service/UserService";
import {SendInvitations} from "../service/FriendService";
import {getUid} from "../utils/cookie";
import {websocket} from "../utils/websocket";
import {encrypt} from "../service/SecurityService";
const { TextArea } = Input;
const { Content } = Layout;
const { Title } = Typography;

export function AddFriend1(){
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = (e) => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return(
        <Content
            className="site-layout-background"
            style={{
                padding: 24,
                margin: 0,
                minHeight: 610,
            }}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Title level={3}>添加好友</Title>
                    <Image width={350} height={250} src={require("../utils/portrait.jpg")} id="portrait"/>
                    <Card title="个人信息"  style={{ width: 300 }} className="showbox">
                        <p>我是魏靖霖</p>
                    </Card>
                    {/*
                    <TextArea rows={10} placeholder="我是魏靖霖" maxLength={6}  />
                    */}
                </Col>
                <Col span={12}>
                    <TextArea rows={24} placeholder="请输入验证信息" maxLength={6} className="inputbox"/>
                </Col>
            </Row>
            <div className="button">
                <Button className = "button1" onClick={showModal}>提交申请</Button>
                <Modal title="确认提交？" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}></Modal>
                <Button className = "button2">取消</Button>
            </div>


        </Content>
    );
}

export function AddFriend2(props){
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        let username = document.getElementById('input1').value;
        let description = document.getElementById('input2').value;
        if(username === '') {
            alert('用户名不能为空');
            return;
        }
        if(description === '') {
            alert('简介不能为空');
            return;
        }
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
        props.setVisible(false);
        let username = encrypt(document.getElementById('input1').value);
        let description = document.getElementById('input2').value;
        GetUserByUsername(username,(user)=>{
            //friendId:user.id,userId:uid
            if(user.id === -1){
                alert('该用户不存在')
            }
            else{
                console.log(description);
                let userId = getUid();
                if(userId === user.id)
                    alert('不能加自己为好友');
                else{
                    const data={
                        userId:userId,
                        friendId:user.id,
                        description:description
                    }
                    console.log(data);
                    SendInvitations(data);
                    const message = {"target": "invitation", "task": "refresh", "from": userId, "to": user.id};
                    websocket.send(JSON.stringify(message));
                    alert('提交成功');
                }
            }
        })
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        props.setVisible(false);
    };
    return(
        <Content
            className="site-layout-background"
            style={{
                padding: 24,
                margin: 0,
                minHeight: 610,
            }}
        >
            <Row gutter={16}>
                <Title level={3}>通过搜索添加好友</Title>
                <TextArea placeholder='请输入用户名称' className="username-inputbox" id='input1'/>
                <TextArea rows={15} placeholder="请输入验证信息"  className="message-inputbox" id='input2'/>
            </Row>
            <div className="button">
                <Button className = "button1" onClick={showModal}>提交申请</Button>
                <Modal title="确认提交？" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}></Modal>
                <Button className = "button2" onClick={()=>{props.setVisible(false)}}>取消</Button>
            </div>


        </Content>
    );
}
