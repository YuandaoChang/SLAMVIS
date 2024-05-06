import { WebGLRenderer } from "three";

export function createRenderer() {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    return renderer;
}
