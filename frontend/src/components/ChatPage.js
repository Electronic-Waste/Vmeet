import "../css/chat.css"

export function OneToOneChatPage() {
    return (
        <div className="one-one-video-area">
            <div className="one-one-video-local">
                <video id="local_video" width="480px" height="320px"/>
            </div>
            <div className="one-one-video-remote">
                <video id="remote_video" width="480px" height="320px"/>
            </div>
        </div>

    );
}

export function VtubChatPage() {
    const MyStyle = {
        display:'none'
    }
    return (
        <div className="one-one-video-area">
            <div className="preview">
                <video className="input_video" width="1280px" height="720px" style={MyStyle}></video>
            </div>
            <div className="one-one-video-local">
                <canvas id="live2d"></canvas>
            </div>
            <div className="one-one-video-remote">
                <video id="remote_video" width="480px" height="320px" autoPlay></video>
            </div>
        </div>
    );
}
