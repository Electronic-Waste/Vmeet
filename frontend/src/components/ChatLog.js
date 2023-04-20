import {Button, Tooltip} from "antd";
import {EllipsisOutlined, PhoneOutlined, VideoCameraOutlined} from "@ant-design/icons";


export function ChatLog(props) {

    const Style={
        float:"left",
    }

    return(
        <div className="chatlog">
            {/*<Tooltip title="prompt text">*/}
                <VideoCameraOutlined style={{ fontSize: '20px', color: '#050505' }}/>

                <span style={{color:"black"}}>&emsp;&emsp;&emsp; {props.time} &emsp;&emsp;{props.timeslice}&emsp;&emsp;</span>

                {/*<Button shape="circle" icon={<EllipsisOutlined />}></Button>*/}
            {/*</Tooltip>*/}
        </div>
    );
}