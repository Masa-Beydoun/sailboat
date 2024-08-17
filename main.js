import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { Water } from 'three/examples/jsm/objects/Water.js';
//import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";;
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Vector3 } from "three";


import pxday from './compressedTextures/New folder/pxday.jpg';
import nxday from './compressedTextures/New folder/nxday.jpg';
import pyday from './compressedTextures/New folder/pyday.jpg';
import nyday from './compressedTextures/New folder/nyday.jpg';
import pzday from './compressedTextures/New folder/pzday.jpg';
import nzday from './compressedTextures/New folder/nzday.jpg';

import t from './compressedTextures/New folder/t7.jpg';

import front from './compressedTextures/New folder/newfront.jpg';
import top from './compressedTextures/New folder/newtop.jpg';
import back from './compressedTextures/New folder/newback.jpg';
import left from './compressedTextures/New folder/newleft.jpg';
import right from './compressedTextures/New folder/newright.jpg';
import bottom from './compressedTextures/New folder/bottom.jpg';
import water6 from './compressedTextures/New folder/sea.jpg';

import front2 from './compressedTextures/New folder/newfront2.jpg';
import top2 from './compressedTextures/New folder/newtop2.jpg';
import back2 from './compressedTextures/New folder/newback2.jpg';
import left2 from './compressedTextures/New folder/newleft2.jpg';
import right2 from './compressedTextures/New folder/newright2.jpg';
import bottom2 from './compressedTextures/New folder/newbottom2.jpg';

import front3 from './compressedTextures/New folder/newfront3.jpg';
import top3 from './compressedTextures/New folder/newtop3.jpg';
import back3 from './compressedTextures/New folder/newback3.jpg';
import left3 from './compressedTextures/New folder/newleft3.jpg';
import right3 from './compressedTextures/New folder/newright3.jpg';
import bottom3 from './compressedTextures/New folder/newbottom3.jpg';

import water from './compressedTextures/New folder/water.jpg';
import { depth, mod, reflect, textureLoad } from 'three/examples/jsm/nodes/Nodes.js';
import { TextureLoader } from 'three/src/Three.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

import TotalForce from "./TotalForce"


const boatUrl = new URL('./compressedTextures/New folder/untitled.glb', import.meta.url);
const boatUrl2 = new URL('./compressedTextures/New folder/untitled.glb', import.meta.url);
const anotherboatUrl = new URL('./compressedTextures/New folder/untitled.glb', import.meta.url);
const boatUrl3 = new URL('./compressedTextures/New folder/oldboat.gltf', import.meta.url);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const orbit = new OrbitControls(camera, renderer.domElement);

// const windForce = new WindForces();
const totalForce = new TotalForce();

var cameraOffset = new Vector3(0, 10, -60);
var model, model2, model3, model4;


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
        model.position.set(0, 0, 0);
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
loader.load(
    boatUrl2.href,
    function (gltf) {
        model2 = gltf.scene;
        const desiredHeight = 2;
        const desiredDepth = 2;
        const desiredWidth = 4;
        model2.scale.set(
            0.1, 0.1, 0.2
        );
        model2.position.set(800, 0, -600);
        scene.add(model2);

        const mixer = new THREE.AnimationMixer(model2);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });

        //model.geometry.parameters.width;
        //console.log("MODEL "+model);
        animate(model2);
        animateModel(model2);
    },
    undefined
    ,

    function (error) {
        console.error(error);
    }
);

loader.load(
    anotherboatUrl.href,
    function (gltf) {
        model3 = gltf.scene;
        const desiredHeight = 2;
        const desiredDepth = 2;
        const desiredWidth = 4;
        model3.scale.set(
            0.1, 0.1, 0.33
        );
        model3.position.set(-500, 0, 800);
        model3.rotateY(THREE.MathUtils.degToRad(112));
        scene.add(model3);

        const mixer = new THREE.AnimationMixer(model3);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });

        //model.geometry.parameters.width;
        //console.log("MODEL "+model);
        animate(model3);
        animateModel(model3);
    },
    undefined
    ,

    function (error) {
        console.error(error);
    }
);

loader.load(
    anotherboatUrl.href,
    function (gltf) {
        model4 = gltf.scene;
        const desiredHeight = 2;
        const desiredDepth = 2;
        const desiredWidth = 4;
        model4.scale.set(
            0.1, 0.1, 0.33
        );
        model4.position.set(-800, 0, -800);
        model4.rotateY(THREE.MathUtils.degToRad(160));
        scene.add(model4);

        const mixer = new THREE.AnimationMixer(model4);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });

        //model.geometry.parameters.width;
        //console.log("MODEL "+model);
        animate(model4);
        animateModel(model4);
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


const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load(
    [



        // left,
        // right,
        // top,
        // bottom,
        // back,
        // front


        //     pxday,
        //     nxday,
        //     pyday,
        //     nyday,
        //    // t,
        //     nzday,
        //     pzday,

        // right2,
        // left2,
        // top2,
        // front2,
        // back2, 

        right3,
        left3,
        top3,
        bottom3,
        front3,
        back3,


    ]
);

//scene.background.setSize(1);
scene.background.scale = 14;

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

    // console.log(model.position.y);

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
        float wave1 = sin(pos.x * 7.02 + time) * 4.0;
        float wave2 = cos(pos.y * 7.03 + time * 0.7) * 2.0;
        float wave3 = sin(pos.x * 7.05 + time * 0.5) * 1.5;
        float wave4 = cos(pos.y * 7.07 + time * 0.3) * 0.5;
        float wave5 = noise(vec2(pos.x * 0.1, pos.y * 0.1 + time * 0.2)) * 1.0;
        float wave6 = sin(pos.x * 8.01 + time * 0.9) * 0.5;
        float wave7 = cos(pos.y * 8.02 + time * 0.8) * 0.5;
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
        float depth = gl_FragCoord.y / 1100.0;
        vec3 finalColor = mix(oceanColor, skyColor, depth);
  
        // Apply blue tint and fog effect
        float fogAmount = smoothstep(0.0, 1.0, depth * 2.0);
        finalColor = mix(finalColor, vec3(0.0, 0.4, 1.9), fogAmount);
  
        // Simulate caustics (light patterns on the ocean floor)
        float caustics = sin(vUv.x * 30.0 + time * 10.0) * 0.01;
        finalColor += vec3(caustics * 0.1, caustics * 0.2, caustics * 0.3);
  
        // Add specular highlight for a more realistic water surface
        vec3 lightDir = normalize(vec3(-0.5, 1.5, 1.0));
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
water5.rotation.z = 300;
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
    if (!model) return;


    if (totalForce.getStartSimulation() == true) {

        orbit.update(delta);

        totalForce.update(delta);
    }

    // if(totalForce.)
    var newPosition = totalForce.getPosition();

    var boatRotation = totalForce.getRotation();

    model.position.copy(newPosition);
    model.rotation.x = boatRotation.x;
    model.rotation.y = boatRotation.y;
    model.rotation.z = boatRotation.z;



    // التحقق من عدم تجاوز البحر
    newPosition.clampScalar(-5000, 256);

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


        var deltaTime = 0.01666666666666666666667
        update(deltaTime);
        renderer.render(scene, camera);
    };

    // init();
    loop();
};


// Call the animateBoat function to start the animation
animateBoat();

// Main program
main();