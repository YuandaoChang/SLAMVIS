import { AmbientLight } from "three";

export function createAmbient() {
    const ambient = new AmbientLight('white', 'darkslategrey',5);
    return ambient;
}