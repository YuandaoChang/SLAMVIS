import { PerspectiveCamera} from "three";

export function createCamera() {
    // 在这里相机的fov通过计算是90、但是这是一个没有验证过的结果
    const camera = new PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    
    camera.position.set(0, -0.7, -1.8); 
    camera.lookAt(0, 0, 0);
    camera.up.set(0.0,-1.0,0.0);
    return camera;
}
