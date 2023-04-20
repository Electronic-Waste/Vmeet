import React, {useState} from "react";
import {GetUserByUsername} from "../service/UserService";
import {getUid} from "../utils/cookie";
import {SendInvitations} from "../service/FriendService";
import {websocket} from "../utils/websocket";
import {Button, Input, Layout, Modal, Row, Typography} from "antd";
import {CreateGroups} from "../service/GroupService";

const { TextArea } = Input;
const { Content } = Layout;
const { Title } = Typography;

export function CreateGroup(props){
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        let groupname = document.getElementById('input1').value;
        let description = document.getElementById('input2').value;
        if(groupname === '') {
            alert('群聊名称不能为空');
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
        let groupname = document.getElementById('input1').value;
        let description = document.getElementById('input2').value;
        let uid = getUid();
        const data = {
            groupName:groupname,
            groupAdmin:uid,
            groupDescription:description
        }
        console.log(data);
        CreateGroups(data,(message)=>{
            console.log(message);
            props.setVisible(false);
        })
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
                <Title level={3}>创建群聊</Title>
                <TextArea placeholder='请输入群聊名称' className="username-inputbox" id='input1'/>
                <TextArea rows={15} placeholder="请输入群聊简介"  className="message-inputbox" id='input2'/>
            </Row>
            <div className="button">
                <Button className = "button1" onClick={showModal}>提交申请</Button>
                <Modal title="确认提交？" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}></Modal>
                <Button className = "button2" onClick={()=>{props.setVisible(false);}}>取消</Button>
            </div>

        </Content>
    );
}
