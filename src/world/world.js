import { Matrix4, LineBasicMaterial, BufferGeometry, Float32BufferAttribute, LineSegments, Line, Vector3, Points, PointsMaterial, BufferAttribute } from "three";
import { createCamera } from "./compoenets/camera"
import { createScene } from "./compoenets/scene"
import { createRenderer } from "./systems/renderer"
import { createControls } from "./systems/controls"
import { createAmbient } from "./compoenets/light"
import Resizer from "./systems/resizer"


let camera;
let renderer;
let scene;
let cameraFrame;
let ambient;
class World {


    constructor(container) {
        camera = createCamera();
        renderer = createRenderer();
        scene = createScene();
        ambient = createAmbient();
        container.appendChild(renderer.domElement);


        const controls = createControls(camera, renderer.domElement);
        //controls.addEventListener("change",this.render);
        const resizer = new Resizer(container, camera, renderer);

        console.log(controls)
    }

    render(SLAM) {
        // set cameraPose
        scene.clear();
        const customeMatrix = new Matrix4();
        customeMatrix.fromArray(SLAM.cameraPose);
        camera.updateMatrixWorld();
        const cameraSize = 0.2;
        const cameraHeight = cameraSize * 0.75;
        const cameraDepth = cameraSize * 0.6;
        const cameraGeometry = new BufferGeometry();
        const cameraMaterial = new LineBasicMaterial({ color: 0x339999 });
        cameraGeometry.setAttribute('position', new Float32BufferAttribute([
            0, 0, 0,
            cameraSize, cameraHeight, cameraDepth,
            0, 0, 0,
            cameraSize, -cameraHeight, cameraDepth,
            0, 0, 0,
            -cameraSize, -cameraHeight, cameraDepth,
            0, 0, 0,
            -cameraSize, cameraHeight, cameraDepth,
            cameraSize, cameraHeight, cameraDepth,
            cameraSize, -cameraHeight, cameraDepth,
            -cameraSize, cameraHeight, cameraDepth,
            -cameraSize, -cameraHeight, cameraDepth,
            -cameraSize, cameraHeight, cameraDepth,
            cameraSize, cameraHeight, cameraDepth,
            -cameraSize, -cameraHeight, cameraDepth,
            cameraSize, -cameraHeight, cameraDepth
        ], 3));

        const cameraPose = new LineSegments(cameraGeometry, cameraMaterial);
        scene.add(cameraPose)


   
        // set keyFrame
        const keyFrameSize = 0.125;
        const keyFrameHeight = keyFrameSize * 0.75;
        const keyFrameDepth = keyFrameSize * 0.6;
        const keyFrameGeometry = new BufferGeometry();
        const keyFrameMaterial = new LineBasicMaterial({ color: 0x003399 });
        keyFrameGeometry.setAttribute('position', new Float32BufferAttribute([
            0, 0, 0,
            keyFrameSize, keyFrameHeight, keyFrameDepth,
            0, 0, 0,
            keyFrameSize, -keyFrameHeight, keyFrameDepth,
            0, 0, 0,
            -keyFrameSize, -keyFrameHeight, keyFrameDepth,
            0, 0, 0,
            -keyFrameSize, keyFrameHeight, keyFrameDepth,
            keyFrameSize, keyFrameHeight, keyFrameDepth,
            keyFrameSize, -keyFrameHeight, keyFrameDepth,
            -keyFrameSize, keyFrameHeight, keyFrameDepth,
            -keyFrameSize, -keyFrameHeight, keyFrameDepth,
            -keyFrameSize, keyFrameHeight, keyFrameDepth,
            keyFrameSize, keyFrameHeight, keyFrameDepth,
            -keyFrameSize, -keyFrameHeight, keyFrameDepth,
            keyFrameSize, -keyFrameHeight, keyFrameDepth
        ], 3));

        for (const keyFrameData of SLAM.keyFrame) {
            // console.log("keyframedata:", keyFrameData)
            const customeMatrix = new Matrix4();
            customeMatrix.fromArray(keyFrameData);
            // 创建一个相机的外框
            const keyFrame = new LineSegments(keyFrameGeometry, keyFrameMaterial);
            keyFrame.applyMatrix4(customeMatrix);
            scene.add(keyFrame)
        }

    

        // 创建材质实例
        const lineMaterial = new LineBasicMaterial({ color: 0x339999, linewidth: 0.5 });

        // 处理 SLAM.covisibilityGraph
        for (const data of SLAM.covisibilityGraph) {
            const point1 = new Vector3(data[0], data[1], data[2]);
            const point2 = new Vector3(data[3], data[4], data[5]);
            const covGraphGeometry = new BufferGeometry().setFromPoints([point1, point2]);
            const covGraph = new Line(covGraphGeometry, lineMaterial);
            scene.add(covGraph);
        }

        // 处理 SLAM.spanningTree
        for (const data of SLAM.spanningTree) {
            const point1 = new Vector3(data[0], data[1], data[2]);
            const point2 = new Vector3(data[3], data[4], data[5]);
            const spaTreeGeometry = new BufferGeometry().setFromPoints([point1, point2]);
            const spaTree = new Line(spaTreeGeometry, lineMaterial);
            scene.add(spaTree);
        }

        // 处理 SLAM.loops
        for (const data of SLAM.loops) {
            const point1 = new Vector3(data[0], data[1], data[2]);
            const point2 = new Vector3(data[3], data[4], data[5]);
            const loopsGeometry = new BufferGeometry().setFromPoints([point1, point2]);
            const loops = new Line(loopsGeometry, lineMaterial);
            scene.add(loops);
        }

    
        // set mapPoints
        // 示例中的点材质初始化，黑色
        const mapPointsMaterial = new PointsMaterial({ color: 0x009966, size: 0.005 });

        // 示例中的点几何体初始化
        const mapPointGeometry = new BufferGeometry();

        // 将几何体的初始化放在循环外部
        const mapVertices = new Float32Array(SLAM.mapPoints.length * 3);
        mapPointGeometry.setAttribute('position', new BufferAttribute(mapVertices, 3));
        const mapPoints = new Points(mapPointGeometry, mapPointsMaterial);

        // 将点对象添加到场景中
        scene.add(mapPoints);

        // 循环遍历每个对象，并将其坐标添加到几何体的顶点数组中
        SLAM.mapPoints.forEach((data, index) => {
            mapVertices[index * 3] = data[0];
            mapVertices[index * 3 + 1] = data[1];
            mapVertices[index * 3 + 2] = data[2];
        });

        // 设置几何体的顶点数组并标记为需要更新
        mapPointGeometry.attributes.position.array = mapVertices;
        mapPointGeometry.attributes.position.needsUpdate = true;

        // 示例中的点材质初始化
        const refPointsMaterial = new PointsMaterial({ color: 0xcc0033, size: 0.005 });
        // 示例中的点几何体初始化
        const refPointGeometry = new BufferGeometry();
        // 将几何体的初始化放在循环外部
        const refVertices = new Float32Array(SLAM.referMapPoints.length * 3);
        refPointGeometry.setAttribute('position', new BufferAttribute(refVertices, 3));
        const refPoints = new Points(refPointGeometry, refPointsMaterial);
        // 将点对象添加到场景中
        scene.add(refPoints);
        // 循环遍历每个对象，并将其坐标添加到几何体的顶点数组中
        SLAM.referMapPoints.forEach((data, index) => {
            refVertices[index * 3] = data[0];
            refVertices[index * 3 + 1] = data[1];
            refVertices[index * 3 + 2] = data[2];
        });
        // 设置几何体的顶点数组并标记为需要更新
        refPointGeometry.attributes.position.array = refVertices;
        refPointGeometry.attributes.position.needsUpdate = true;

        console.log("renderbefore")
        renderer.render(scene, camera);
        console.log("renderafter")
    }

}

export default World;