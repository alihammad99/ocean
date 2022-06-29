import "regenerator-runtime/runtime";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// init

export default class Sketch {
  constructor(options) {
    this.time = 0;
    this.container = options.dom;
    this.scene = new THREE.Scene();
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      10
    );
    this.camera.position.z = 1;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    //Draging the object controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.setUpResize();
    this.resize();
    this.addObjects();
    this.render();
  }

  setUpResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }
  addObjects() {
    this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    // this.material = new THREE.MeshNormalMaterial();
    this.material = new THREE.ShaderMaterial({
      fragmentShader: `varying vec2 vUv;
      void main()	{
          // vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
          gl_FragColor = vec4(vUv,0.0,1.);
      }`,
      vertexShader: `varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  render() {
    window.requestAnimationFrame(this.render.bind(this));

    this.time += 0.05;
    this.mesh.rotation.x = this.time / 2000;
    this.mesh.rotation.y = this.time / 1000;

    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.querySelector("#container"),
});

// const camera = new THREE.PerspectiveCamera(
//   70,
//   window.innerWidth / window.innerHeight,
//   0.01,
//   10
// );
// camera.position.z = 1;

// const scene = new THREE.Scene();

// const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
// const material = new THREE.MeshNormalMaterial();

// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setAnimationLoop(animation);
// document.body.appendChild(renderer.domElement);

// // animation

// function animation(time) {
//   mesh.rotation.x = time / 2000;
//   mesh.rotation.y = time / 1000;

//   renderer.render(scene, camera);
// }
