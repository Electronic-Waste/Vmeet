import {Layout} from "antd";
import {ChatExcelForFriend, ChatExcelForGroup} from "../components/ChatExcel";
import {HeadBar} from "../components/HeadBar";
import {getUid} from "../utils/cookie";

export function ChatExcelView () {
    const getFriendId = () => {
        let uid = getUid();
        if (uid == 654) return 655;
        else return 654;
    }

    return (
        <Layout>
            <ChatExcelForFriend userId={getUid()} friendId={getFriendId()}/>
        </Layout>
    );
}
