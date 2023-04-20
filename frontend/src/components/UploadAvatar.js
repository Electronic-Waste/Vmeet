import {Upload} from "antd";
import React, {useState} from "react";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {UploadAvatar} from "../service/UserService";
import {AuthConsumer} from "../utils/Auth";
import {useNavigate} from "react-router-dom";
import {getUid} from "../utils/cookie";


export function UploadUserAvatar(){
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

        if (!isJpgOrPng) {
            window.message.error('You can only upload JPG/PNG file!');
        }

        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
            window.message.error('Image must smaller than 2MB!');
        }

        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info) => {
        //console.log(info);
        if (info.file.status === 'uploading') {
            //console.log('uploading');
            setLoading(true);
            return;
        }
        //该if没有生效
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            console.log('done');
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 10,
                }}
            >
                更换头像
            </div>
        </div>
    );

    const customRequest = (info) => {
        getBase64(info.file,(base64)=>{
            //console.log(base64);
            UploadAvatar(base64,(data)=>{
                //console.log(data);
                setLoading(false);
                setImageUrl(base64);

                let userjson = localStorage.getItem('user'+getUid());
                let user = JSON.parse(userjson);
                //console.log(user);
                user['avatar'] = base64;
                localStorage.removeItem('user'+getUid());
                localStorage.setItem('avatar'+getUid(),JSON.stringify(user));

                /**
                 * 这句代码好像有点小问题
                 */
                // window.open(`/${uid}/UserInfoView`,'_self');
            })
        });
    }

    return(
        <div>
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                //action="http://localhost:8080/uploadavatar"
                beforeUpload={beforeUpload}
                onChange={handleChange}
                customRequest={customRequest}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="avatar"
                        style={{
                            width: '100%',
                        }}
                    />
                ) : (
                    uploadButton
                )}
            </Upload>
        </div>

    );
}