import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { Water } from 'three/examples/jsm/objects/Water.js';
//import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";;
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Vector3 } from "three";


import pxday from './pxday.jpg';
import nxday from './nxday.jpg';
import pyday from './pyday.jpg';
import nyday from './nyday.jpg';
import pzday from './pzday.jpg';
import nzday from './nzday.jpg';


import front from './front.jpg';
import top from './top.jpg';
import back from './back.jpg';
import left from './left.jpg';
import right from './right.jpg';
import bottom from './bottom.jpg';
import water6 from './sea.jpg';

import water from './water.jpg';
import { depth, mod, reflect, textureLoad } from 'three/examples/jsm/nodes/Nodes.js';
import { TextureLoader } from 'three/src/Three.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

import WindForces from "./WindForces";
import TotalForce from "./TotalForce"


const boatUrl = new URL('./untitled.glb', import.meta.url);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const orbit = new OrbitControls(camera, renderer.domElement);

const windForce = new WindForces();
const totalForce = new TotalForce();
totalForce.showSimulation();

var cameraOffset = new Vector3(0, 10, -60);
var model;


const loader = new GLTFLoader();
loader.load(
    boatUrl.href,
    function (gltf) {
        model = gltf.scene;
        const desiredHeight = 2;
        const desiredDepth = 2;
        const desiredWidth = 4;
        model.scale.set(
            1,
            1,
            1
        );

        scene.add(model);
        model.scale.set(0.1, 0.1, 0.1);
        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
        //  model.position.set(0,4.9,0);
        //   model.geometry.parameters.width;
        // console.log("MODEL "+model);
        animate(model);
        animateModel(model);
    },
    undefined
    ,

    function (error) {
        console.error(error);
    }
);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
orbit.update();
const textureLoader = new THREE.TextureLoader();
const axeHelper = new THREE.AxesHelper(5);
scene.add(axeHelper);
camera.position.set(0, 2, 5);



const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    position: 0, // Initial position value
    depth: 0,
    height: 0,
    width: 0
};
gui.add(options, 'depth', 2, 10).onChange(function (value) {
    // Update boat geometry when depth changes
    sailboat.geometry = new THREE.BoxGeometry(options.width, options.height, value);
});

gui.add(options, 'height', 2, 10).onChange(function (value) {
    // Update boat geometry when height changes
    sailboat.geometry = new THREE.BoxGeometry(options.width, value, options.depth);
});

gui.add(options, 'width', 4, 10).onChange(function (value) {
    // Update boat geometry when width changes
    sailboat.geometry = new THREE.BoxGeometry(value, options.height, options.depth);
});
// Add GUI control for position
gui.add(options, 'position', -10.0, 10.0).onChange(function (e) {
    sailboat.position.y = e;
});
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load(
    [

        left,
        right,
        top,
        bottom,
        back,
        front

        // left,
        // right,
        // top,
        // bottom,
        // back,
        // front

        // pxday,
        // nxday,
        // pyday,
        // nyday,
        // pzday,
        // nzday
    ]
);




gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'wireframe').onChange(function (e) {
    sphere.material.wireframe = e;
});
gui.addColor(options, 'sphereColor').onChange(function (e) {
    sphere.material.color.set(e);
});


var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

function onKeyDown(event) {
    switch (event.key) {
        case "w":
            moveForward = true;
            break;
        case "s":
            moveBackward = true;
            break;
        case "a":
            moveLeft = true;
            break;
        case "d":
            moveRight = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.key) {
        case "w":
            moveForward = false;
            break;
        case "s":
            moveBackward = false;
            break;
        case "a":
            moveLeft = false;
            break;
        case "d":
            moveRight = false;
            break;
    }
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);



function animateModel(model) {
    requestAnimationFrame(() => animateModel(model));
    // requestAnimationFrame(animateModel);

    // Move the camera based on keyboard input
    if (moveForward) camera.position.z -= 0.1;
    if (moveBackward) camera.position.z += 0.1;
    if (moveLeft) camera.position.x -= 0.1;
    if (moveRight) camera.position.x += 0.1;

    console.log(model.position.y);

    renderer.render(scene, camera);
}






function animate(model) {
    requestAnimationFrame(animate);


    waterMaterial5.uniforms.time.value += 0.0089;

    renderer.render(scene, camera);
    // Move the camera based on keyboard input
    if (moveForward) camera.position.z -= 0.1;
    if (moveBackward) camera.position.z += 0.1;
    if (moveLeft) camera.position.x -= 0.1;
    if (moveRight) camera.position.x += 0.1;

    renderer.render(scene, camera);
}



// THE MOST GOOD WATER 



const ambientLight = new THREE.AmbientLight(0xaaaaaa);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(-1, 1, 1).normalize();
scene.add(directionalLight);

// Water Geometry

const waterGeometry5 = new THREE.PlaneGeometry(10000, 10000, 512, 512);

// Water Shader
const waterUniforms = {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
    oceanColor: { value: new THREE.Color(0x017f99) },
    skyColor: { value: new THREE.Color(0x87ceeb) },
    sunDirection: { value: new THREE.Vector3(0.70707, 0.70707, 0) }
};

const waterMaterial5 = new THREE.ShaderMaterial({
    uniforms: waterUniforms,
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
  
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
  
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) +
               (c - a) * u.y * (1.0 - u.x) +
               (d - b) * u.x * u.y;
      }
  
      void main() {
        vUv = uv;
        vNormal = normal;
        vPosition = position;
  
        vec3 pos = position;
        float wave1 = sin(pos.x * 7.02 + time) * 2.0;
        float wave2 = cos(pos.y * 7.03 + time * 0.7) * 2.0;
        float wave3 = sin(pos.x * 7.05 + time * 0.5) * 1.5;
        float wave4 = cos(pos.y * 7.07 + time * 0.3) * 1.5;
        float wave5 = noise(vec2(pos.x * 0.1, pos.y * 0.1 + time * 0.2)) * 2.0;
        float wave6 = sin(pos.x * 8.01 + time * 0.9) * 1.0;
        float wave7 = cos(pos.y * 8.02 + time * 0.8) * 1.0;
        pos.z += wave1 + wave2 + wave3 + wave4 + wave5 + wave6 + wave7;
  
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 oceanColor;
      uniform vec3 skyColor;
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
  
      void main() {
        float depth = gl_FragCoord.y / 500.0;
        vec3 finalColor = mix(oceanColor, skyColor, depth);
  
        // Apply blue tint and fog effect
        float fogAmount = smoothstep(0.0, 1.0, depth * 2.0);
        finalColor = mix(finalColor, vec3(0.0, 0.4, 0.7), fogAmount);
  
        // Simulate caustics (light patterns on the ocean floor)
        float caustics = sin(vUv.x * 30.0 + time * 10.0) * 0.01;
        finalColor += vec3(caustics * 0.1, caustics * 0.2, caustics * 0.3);
  
        // Add specular highlight for a more realistic water surface
        vec3 lightDir = normalize(vec3(-0.5, 0.5, 1.0));
        float specular = pow(max(dot(reflect(lightDir, normalize(vNormal)), vec3(0, 0, 1)), 0.0), 32.0);
        finalColor += vec3(specular * 0.3);
  
        gl_FragColor = vec4(finalColor, 0.9); // Adjust opacity here
      }
    `,
    transparent: true, // Enable transparency
    side: THREE.DoubleSide
});

const water5 = new THREE.Mesh(waterGeometry5, waterMaterial5);
water5.rotation.x = -Math.PI / 2;
// Adjust the position as needed to fit within your scene
water5.position.set(-60, 0, 0);
scene.add(water5);


const boxGeometry = new THREE.BoxGeometry(5, 2, 3);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Adjust the color as needed
const box = new THREE.Mesh(boxGeometry, boxMaterial);

// Set initial position of the box
box.position.set(0, 5, 0); // Adjust the position as needed to place it on the water surface
scene.add(box);

//window.addEventListener('resize', onWindowResize, false);
//onWindowResize();

animate();
function animateBoat() {
    // Calculate the displacement of the water at the position of the boat
    const boatPosition = new THREE.Vector3();
    water5.getWorldPosition(boatPosition);
    const waterDisplacement = Math.sin((boatPosition.x + boatPosition.z) / 10 + waterUniforms.time.value) * 0.5; // Adjust the parameters as needed for the desired effect

    // Update box position to simulate boat movement
    box.position.y = water5.position.y + waterDisplacement + 2 - 1; // Adjust the offset as needed to keep the box above the water surface

    // Request animation frame
    requestAnimationFrame(animateBoat);
    update();
}


const update = (delta) => {
    if (windForce.startSimulation == true) {
        orbit.update(delta);

        windForce.update();
    }


    //   تحديث موقع المنطاد بناءا على الفيزياء 
    const newPosition = new Vector3(
        windForce.position.x,
        windForce.position.y,
        windForce.position.z,
    );

    // // التحقق من عدم تجاوز الحدود الداخلية للسكاي بوكس
    // const halfSkyboxSize = 2450; // نصف أبعاد السكاي بوكس
    // newPosition.clampScalar(-halfSkyboxSize, halfSkyboxSize);

    // ballon.position.copy(newPosition);
    model.position.copy(newPosition);

    // تحديث موقع الكاميرا بناءً على الموقع الجديد للمنطاد
    //  camera.position.x = 2 * model.position.x +  cameraOffset.x ;
    //  camera.position.y = model.position.y + cameraOffset.y;
    //  camera.position.z = 2 * model.position.z + cameraOffset.z;


    // camera.lookAt(model.position);

    // رسم السيناريو
};


export const main = () => {

    let lastTime = new Date().getTime();

    const loop = () => {
        window.requestAnimationFrame(loop);
        const currentTime = new Date().getTime();
        const delta = currentTime - lastTime;
        lastTime = currentTime;

        update(delta);
        renderer.render(scene, camera);
    };

    // init();
    loop();
};


// Call the animateBoat function to start the animation
animateBoat();

// Main program
main();