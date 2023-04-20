import "../css/VtuberViewForGroup.css"
import * as PIXI from "pixi.js";
import * as Kalidokit from "kalidokit";
import '@mediapipe/holistic/holistic';
import {FaceMesh,FACEMESH_TESSELATION} from "@mediapipe/face_mesh";
import {drawConnectors,drawLandmarks} from "@mediapipe/drawing_utils";
import {Camera} from '@mediapipe/camera_utils/camera_utils';
import {useEffect, useRef, useState} from "react";
import "pixi-live2d-display"
import {Bounds} from "pixi.js";
import {Avatar, Button, Image, Modal, Select} from "antd";
import 'antd/dist/antd.css';

// with a global PIXI variable, this plugin can automatically take
// the needed functionality from it, such as window.PIXI.Ticker
window.PIXI = PIXI;

// accordingly, here we should use require() to import the module,
// instead of the import statement because the latter will be hoisted
// over the above assignment when compiling the script
const { Live2DModel } = require('pixi-live2d-display');

const datacache = ["../../models/hiyori/hiyori_pro_t10.model3.json","../../models/haru_greeter_pro_jp/runtime/haru_greeter_t03.model3.json"
    ,"../../models/mao_pro_zh/runtime/mao_pro_t02.model3.json"];


const { Option } = Select;

export function ChoiceDialog(props) {

    return (
        <>
            {/*<Button type="primary" onClick={showModal}>*/}
            {/*    Open Modal*/}
            {/*</Button>*/}
            <Modal title="choice your visual model" visible={props.show} onOk={props.onok} onCancel={props.oncancel}
                   okText="ok" cancelText="cancel">
                <Select
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={props.onchange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                    <Option value="first"><Avatar
                        src={
                            <Image
                                src={require("../assets/sun.png")}
                                style={{
                                    width: 32,
                                }}
                            />
                        }
                    /></Option>
                    <Option value="second"><Avatar
                        src={
                            <Image
                                src={require("../assets/girl.png")}
                                style={{
                                    width: 32,
                                }}
                            />
                        }
                    /></Option>
                    <Option value="third"><Avatar
                        src={
                            <Image
                                src={require("../assets/magic.png")}
                                style={{
                                    width: 32,
                                }}
                            />
                        }
                    /></Option>
                </Select>
            </Modal>
        </>
    );
}
export function VtuberViewForGroup(props) {
    // console.log("???")
    const [isChoice,setIsChoice] = useState(false);

    const [exeTime,setExeTime] = useState(0);
    const choice = useRef();
    // const modelUrl = useRef("jetbrains://idea/navigate/reference?project=live2d&path=public/models/hiyori/hiyori_pro_t10.cdi3.json");
    const modelUrl = useRef(props.model)
    // const {
    //     Application,
    //     live2d: { Live2DModel },
    // } = PIXI;
    var urlForModel = props.model;
    // useEffect(()=>{
    //     urlForModel = modelUrl.current;
    //     // console.log("修改了")
    //     // document.querySelector("#live2d").remove();
    //
    //     // var canvas = document.createElement("canvas");
    //     // canvas.setAttribute("id","live2d");
    //     // document.append(canvas)
    // })



    const videoElement = document.querySelector(".input_video");
    var guideCanvas = document.querySelector("canvas.guides");

// Kalidokit provides a simple easing function
// (linear interpolation) used for animation smoothness
// you can use a more advanced easing function if you want
    const {
        Face,
        Vector: { lerp },
        Utils: { clamp },
    } = Kalidokit;

// Url to Live2D

    // const modelUrl = "./models/hiyori/hiyori_pro_t10.model3.json";

    var currentModel, facemesh;


    console.log(facemesh);



    async function main(videoElement) {
        // create pixi application

        guideCanvas = document.querySelector("canvas.guides");


        const app = new PIXI.Application({
            view: document.getElementById("live2d"),
            autoStart: true,
            backgroundAlpha: 0,
            backgroundColor: 0xffffff,
            resizeTo: window,
        });

        console.log("test2");

        // load live2d model
        // currentModel = await Live2DModel.from("https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/haru/haru_greeter_t03.model3.json", { autoInteract: false });
        // currentModel = await Live2DModel.from("shizuku.model.json", { autoInteract: false });
        console.log(modelUrl.current);
        currentModel = await Live2DModel.from(urlForModel, { autoInteract: false });
        currentModel.scale.set(0.2);
        currentModel.interactive = true;
        currentModel.anchor.set(0.5, 0.8);
        if (modelUrl.current === "../../models/mao_pro_zh/runtime/mao_pro_t02.model3.json")
        {

            currentModel.position.set(window.innerWidth * 0.5, window.innerHeight * 1.5);
        }
        else{
            currentModel.position.set(window.innerWidth * 0.5, window.innerHeight * 0.8);
        }


        console.log("test3");

        // Add events to drag model
        currentModel.on("pointerdown", (e) => {
            currentModel.offsetX = e.data.global.x - currentModel.position.x;
            currentModel.offsetY = e.data.global.y - currentModel.position.y;
            currentModel.dragging = true;
        });
        currentModel.on("pointerup", (e) => {
            currentModel.dragging = false;
        });
        currentModel.on("pointermove", (e) => {
            if (currentModel.dragging) {
                currentModel.position.set(e.data.global.x - currentModel.offsetX, e.data.global.y - currentModel.offsetY);
            }
        });



        // Add mousewheel events to scale model
        // document.querySelector("#live2d").addEventListener("wheel", (e) => {
        //     e.preventDefault();
        //     currentModel.scale.set(clamp(currentModel.scale.x + e.deltaY * -0.001, -0.5, 10));
        // });

        // add live2d model to stage
        app.stage.addChild(currentModel);

        if(!facemesh){
            console.log("initing...");
            // create media pipe facemesh instance
            facemesh = new FaceMesh({
                locateFile: (file) => {
                    // console.log("loading...")
                    console.log(file);
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
                },
            });

            try {
                await facemesh.initialize();
            }catch (e){
                // await facemesh.initialize();
            }
        }


        // set facemesh config
        facemesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });


        // pass facemesh callback function
        facemesh.onResults(onResults);

        startCamera(videoElement);

    }

    useEffect(()=>{
        const videoElement = document.querySelector(".input_video");
            // guideCanvas = document.querySelector("canvas.guides");

        console.log(videoElement);
        main(videoElement);
        // setExeTime(1);

    },[]);

    const onResults = (results) => {
        drawResults(results.multiFaceLandmarks[0]);
        animateLive2DModel(results.multiFaceLandmarks[0]);
    };

// draw connectors and landmarks on output canvas
    const drawResults = (points) => {
        if (!guideCanvas || !videoElement || !points) return;
        guideCanvas.width = videoElement.videoWidth;
        guideCanvas.height = videoElement.videoHeight;
        let canvasCtx = guideCanvas.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
        // Use `Mediapipe` drawing functions
        drawConnectors(canvasCtx, points, FACEMESH_TESSELATION, {
            color: "#C0C0C070",
            lineWidth: 1,
        });
        if (points && points.length === 478) {
            //draw pupils
            drawLandmarks(canvasCtx, [points[468], points[468 + 5]], {
                color: "#ffe603",
                lineWidth: 2,
            });
        }
    };

    const animateLive2DModel = (points) => {
        if (!currentModel || !points) return;

        let riggedFace;

        if (points) {
            // use kalidokit face solver
            riggedFace = Face.solve(points, {
                runtime: "mediapipe",
                video: videoElement,
            });
            rigFace(riggedFace, 0.5);
        }
    };

// update live2d model internal state
    const rigFace = (result, lerpAmount = 0.7) => {
        if (!currentModel || !result) return;
        const coreModel = currentModel.internalModel.coreModel;

        currentModel.internalModel.motionManager.update = (...args) => {
            // disable default blink animation
            currentModel.internalModel.eyeBlink = undefined;

            coreModel.setParameterValueById(
                "ParamEyeBallX",
                lerp(result.pupil.x, coreModel.getParameterValueById("ParamEyeBallX"), lerpAmount)
            );
            coreModel.setParameterValueById(
                "ParamEyeBallY",
                lerp(result.pupil.y, coreModel.getParameterValueById("ParamEyeBallY"), lerpAmount)
            );

            // X and Y axis rotations are swapped for Live2D parameters
            // because it is a 2D system and KalidoKit is a 3D system
            coreModel.setParameterValueById(
                "ParamAngleX",
                lerp(result.head.degrees.y, coreModel.getParameterValueById("ParamAngleX"), lerpAmount)
            );
            coreModel.setParameterValueById(
                "ParamAngleY",
                lerp(result.head.degrees.x, coreModel.getParameterValueById("ParamAngleY"), lerpAmount)
            );
            coreModel.setParameterValueById(
                "ParamAngleZ",
                lerp(result.head.degrees.z, coreModel.getParameterValueById("ParamAngleZ"), lerpAmount)
            );

            // update body params for models without head/body param sync
            const dampener = 0.3;
            coreModel.setParameterValueById(
                "ParamBodyAngleX",
                lerp(result.head.degrees.y * dampener, coreModel.getParameterValueById("ParamBodyAngleX"), lerpAmount)
            );
            coreModel.setParameterValueById(
                "ParamBodyAngleY",
                lerp(result.head.degrees.x * dampener, coreModel.getParameterValueById("ParamBodyAngleY"), lerpAmount)
            );
            coreModel.setParameterValueById(
                "ParamBodyAngleZ",
                lerp(result.head.degrees.z * dampener, coreModel.getParameterValueById("ParamBodyAngleZ"), lerpAmount)
            );

            // Simple example without winking.
            // Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
            let stabilizedEyes = Kalidokit.Face.stabilizeBlink(
                {
                    l: lerp(result.eye.l, coreModel.getParameterValueById("ParamEyeLOpen"), 0.7),
                    r: lerp(result.eye.r, coreModel.getParameterValueById("ParamEyeROpen"), 0.7),
                },
                result.head.y
            );
            // eye blink
            coreModel.setParameterValueById("ParamEyeLOpen", stabilizedEyes.l);
            coreModel.setParameterValueById("ParamEyeROpen", stabilizedEyes.r);

            // mouth
            coreModel.setParameterValueById(
                "ParamMouthOpenY",
                lerp(result.mouth.y, coreModel.getParameterValueById("ParamMouthOpenY"), 0.3)
            );
            // Adding 0.3 to ParamMouthForm to make default more of a "smile"
            coreModel.setParameterValueById(
                "ParamMouthForm",
                0.3 + lerp(result.mouth.x, coreModel.getParameterValueById("ParamMouthForm"), 0.3)
            );
        };
    };


// start camera using mediapipe camera utils
    const startCamera = (video) => {
        console.log("fix1");
        // sleep(1000);
        if(!facemesh){
            console.log("aaaaaaaa");
        }
        const camera = new Camera(video, {
            onFrame: async () => {
                //console.log("fix");
                //console.log(video);
                await facemesh.send({ image: video });
            },
            // width: 640,
            //
            // height: 480,
        });
        console.log("fix2");
        console.log("camera",camera);
        if(camera.video === null){
            // window.location.reload();
            // setExeTime(0);
            // sleep(1000);
            return;
        }
        camera.start();
        // console.log("fix3");
    };



    return (
        <div id="body">
            <div className="preview">
                <video className="input_video" width="0px" height="720px" />
                {/*<canvas className="guides"></canvas>*/}
                {/*<section>*/}
                {/*    <a className="current" href="/live2d/"><p>Live2D</p></a>*/}
                {/*    <a href="/"><p>VRM</p></a>*/}
                {/*</section>*/}
            </div>
            {/*<h1 className="notranslate">
                <a href="https://3d.kalidoface.com">VMEET</a>
            </h1>
            <nav>
                <a href="https://www.npmjs.com/package/kalidokit">
                    <img
                        src="https://cdn.glitch.me/447b6603-7eae-4da6-957d-73ee30c8e731%2Fnpm.png?v=1635133318451"
                    />
                </a>
                <a href="https://github.com/yeemachine/kalidokit">
                    <img
                        src="https://cdn.glitch.me/447b6603-7eae-4da6-957d-73ee30c8e731%2Fgithub.png?v=1635133310517"
                    />
                </a>
                <a href="https://twitter.com/yeemachine">
                    <img
                        src="https://cdn.glitch.me/447b6603-7eae-4da6-957d-73ee30c8e731%2Ftwitter.png?v=1635133322561"
                    />
                </a>
            </nav>*/}
            <canvas id="live2d" style={{width:'25%',height:'16%'}} />
            {/*<p className="linkOut">
                Visit
                <a id="full" href="https://kalidoface.com">the full Vtuber App</a>!
            </p>
            <script type="module" src="./script.js"></script>*/}
        </div>
    );
}


