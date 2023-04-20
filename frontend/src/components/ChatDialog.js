import {Modal} from "antd";
import React from "react";


export function ChatDialog(props) {

    return (
        <>
            {/*<Button type="primary" onClick={showModal}>*/}
            {/*    Open Modal*/}
            {/*</Button>*/}
            <Modal title="Choice the kind of Chat" visible={props.show} onOk={props.onok} onCancel={props.oncancel}
                   okText="Simple" cancelText="Vtuber">
            </Modal>
        </>
    );
}