import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createControls(camera, canvas) 
{
    const controls = new OrbitControls(camera, canvas);
    //console.log(controls)
    return controls;
 }