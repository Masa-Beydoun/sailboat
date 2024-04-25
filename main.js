import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { Water } from 'three/examples/jsm/objects/Water.js';
//import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";;
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

import pxday from 'C:/Users/karee/Desktop/New folder/pxday.jpg';

import nxday from 'C:/Users/karee/Desktop/New folder/nxday.jpg';

import pyday from 'C:/Users/karee/Desktop/New folder/pyday.jpg';
import nyday from 'C:/Users/karee/Desktop/New folder/nyday.jpg';

import pzday from 'C:/Users/karee/Desktop/New folder/pzday.jpg';
import nzday from 'C:/Users/karee/Desktop/New folder/nzday.jpg';
import { depth, textureLoad } from 'three/examples/jsm/nodes/Nodes.js';
import { TextureLoader } from 'three/src/Three.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

const boatUrl=new URL('C:/Users/karee/Desktop/New folder/scene.gltf',import.meta.url);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
const renderer = new THREE.WebGLRenderer();
const orbit= new OrbitControls(camera,renderer.domElement);


const loader=new GLTFLoader();
loader.load(
    boatUrl.href,
    function(gltf){
       const model=gltf.scene;
       const desiredHeight = 2;
       const desiredDepth = 2;
       const desiredWidth = 4;
       model.scale.set(
           1,
           1,
           1
       );

       scene.add(model);
       model.scale.set(4,4,4);
        model.position.set(0,4.9,0);
     //   model.geometry.parameters.width;
       // console.log("MODEL "+model);
//animate(model);
        animateModel(model);
    },
    undefined
    ,

    function(error)
    {
        console.error(error);
    }
);

renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);
orbit.update();
const textureLoader=new THREE.TextureLoader();
const axeHelper=new THREE.AxesHelper(5);
scene.add(axeHelper);
camera.position.set(0,2,5);

const texture = textureLoader.load(pxday);

const PlaneGeometry=new THREE.PlaneGeometry(30,30);
const PlaneMatirial=new THREE.MeshBasicMaterial({side:THREE.DoubleSide,map:texture});
const plane=new THREE.Mesh(PlaneGeometry,PlaneMatirial);
plane.rotation.x=-0.5 * Math.PI;
//scene.add(plane);

const gridHelper = new THREE.GridHelper(30);
//gridHelper.rotation.x=-0.5 * Math.PI;
//scene.add(gridHelper);

const gui= new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    position: 0, // Initial position value
    depth:0,
    height:0,
    width:0
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
const cubeTextureLoader=new THREE.CubeTextureLoader();
scene.background=cubeTextureLoader.load(
    [
        pxday,
        nxday,
        pyday,
        nyday,
        pzday,
        nzday
    ]
);




gui.add(options,'speed',0,0.1);
gui.add(options,'wireframe').onChange(function(e)
{
    sphere.material.wireframe=e;
});
gui.addColor(options,'sphereColor').onChange(function(e)
{
    sphere.material.color.set(e);
});
let step=0;

const waterGeometry = new THREE.PlaneGeometry(30, 30);
const water = new Water(
    waterGeometry,
    {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load('https://threejs.org/examples/textures/waternormals.jpg', function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined,
        side: THREE.DoubleSide
    }
);
water.rotation.x = - Math.PI / 2;
//fix with water level ??
water.position.y = -0.5;
scene.add(water);
const sailboatGeometry = new THREE.BoxGeometry(4, 2, 16); // You can replace this with your sailboat model
const sailboatMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const sailboat = new THREE.Mesh(sailboatGeometry, sailboatMaterial);
sailboat.position.set(0, 0.5, 0); // Position the sailboat above the water surface
//scene.add(sailboat);
// Animate water
function animateWater() {
    requestAnimationFrame(animateWater);
    const time = performance.now() * 0.00009;
    water.material.uniforms['time'].value += 1.0 / 60.0;
    water.material.uniforms['time'].value = time;
    renderer.render(scene, camera);
}
animateWater();


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




const waterLevel = -0.5; // Adjust this value according to the water level
const GRAVITY = 9.81; // m/s^2, acceleration due to gravity
const WATER_DENSITY = 1000; // kg/m^3, density of water
const MAX_BUOYANT_FORCE = 8000; // Adjust as needed
let velocityY = 0; // Initialize velocityY




function animateModel(model)
{
    requestAnimationFrame(() => animateModel(model));
   // requestAnimationFrame(animateModel);

    // Move the camera based on keyboard input
    if (moveForward) camera.position.z -= 0.1;
    if (moveBackward) camera.position.z += 0.1;
    if (moveLeft) camera.position.x -= 0.1;
    if (moveRight) camera.position.x += 0.1;

    // Calculate submerged volume
    const submergedVolume = calculateSubmergedVolumeMODEL(model);
    console.log("submergedVolume "+submergedVolume);

 // Calculate buoyant force
 const buoyantForce = Math.min(WATER_DENSITY * GRAVITY * submergedVolume, MAX_BUOYANT_FORCE);
 console.log("buoyantForce "+buoyantForce);
 console.log("WATER_DENSITY * GRAVITY * submergedVolume "+WATER_DENSITY * GRAVITY * submergedVolume);
 // Calculate weight of the sailboat
 const boatVolume = 2 * 4 * 16;
 const weight = boatVolume * GRAVITY;

 // Calculate net force
 const netForce = buoyantForce - weight;

 // Apply net force to boat with damping
 const dampingFactor = 0.2; // Adjust damping factor as needed
 velocityY += (netForce / (4 * 16) - velocityY * dampingFactor) * 0.002;
 //0.0005
 model.position.y += velocityY * 0.0005;


 /*
 // Prevent sailboat from sinking too deep
 const minDepth = -2; // Adjust as needed
 if (model.position.y < minDepth) {
    model.position.y = minDepth;
     velocityY = 0;
 }
 const maxDepth = 2; // Adjust as needed
 if (model.position.y > maxDepth) {
    model.position.y = maxDepth;
     velocityY = 0;
     
 }*/
console.log(model.position.y);
console.log(velocityY);

    renderer.render(scene, camera);
}




function calculateSubmergedVolume() {
    // Get the dimensions of the sailboat
    const boatWidth = sailboat.geometry.parameters.width;
    const boatDepth = sailboat.geometry.parameters.depth;
    const boatHeightParam = sailboat.geometry.parameters.height; // Rename to avoid conflict

    // Calculate the volume of the sailboat
    const boatVolume = boatWidth * boatDepth * boatHeightParam;

    // Calculate the volume of water displaced by the submerged portion of the sailboat
    const submergedHeight = Math.min(boatHeightParam, Math.max(0, waterLevel - sailboat.position.y));
    const submergedVolume = boatWidth * boatDepth * submergedHeight;

    // The submerged volume is the difference between the total volume and the volume above water level
    return submergedVolume;
}

function calculateSubmergedVolumeMODEL(model) {
    let submergedVolume = 0;

    // Assuming the dimensions of the boat
    const boatWidth = 4; // Set your desired width here
    const boatDepth = 16; // Set your desired depth here
    const boatHeight = 2; // Set your desired height here

    // Calculate the volume of the sailboat
    const boatVolume = boatWidth * boatDepth * boatHeight;

    // Traverse through the children of the loaded model to find meshes
    model.traverse((child) => {
        if (child.isMesh) {
            const boatGeometry = child.geometry;
            if (boatGeometry) {
                // Get the scale of the child mesh
                const scale = child.scale;

                // Calculate the actual dimensions of the sailboat based on scale
                const actualWidth = 4;//boatWidth * scale.x;
                const actualDepth = 16;//boatDepth * scale.z;
                const actualHeight = 2;//boatHeight * scale.y;

                // Calculate the volume of the sailboat
                const actualVolume = actualWidth * actualDepth * actualHeight;

                // Calculate the volume of water displaced by the submerged portion of the sailboat
                const submergedHeight = Math.min(actualHeight, Math.max(0, waterLevel - model.position.y));
                const submergedVolumePart = actualWidth * actualDepth * submergedHeight;

                // Add the submerged volume of this part to the total submerged volume
                submergedVolume += submergedVolumePart;
            }
        }
    });

    return submergedVolume;
}
// Vertex shader
const vertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader
const fragmentShader = `
  uniform float time;
  uniform vec2 resolution;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float frequency = 2.0;
    float amplitude = 0.1;
    float speed = 1.0;

    float x = uv.x * frequency + time * speed;
    float y = uv.y * frequency + time * speed;

    float distortion = sin(x) * cos(y) * amplitude;
    vec3 color = vec3(0.0, 0.5 + distortion, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;

// Shader material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    time: { value: 0.0 },
    resolution: { value: new THREE.Vector2() },
  },
});

// Set the resolution uniform based on renderer size
material.uniforms.resolution.value.x = renderer.domElement.width;
material.uniforms.resolution.value.y = renderer.domElement.height;

// Create a plane geometry
const geometry = new THREE.PlaneGeometry(100, 100, 100, 100);

// Create mesh with the shader material
const waterMesh = new THREE.Mesh(geometry, material);
waterMesh.position.y=2;
waterMesh.rotation.x = - Math.PI / 2;
scene.add(waterMesh);

function animatesea()
{
    material.uniforms.time.value += 0.01;

}

function animate(model) {
    requestAnimationFrame(animate);

    // Move the camera based on keyboard input
    if (moveForward) camera.position.z -= 0.1;
    if (moveBackward) camera.position.z += 0.1;
    if (moveLeft) camera.position.x -= 0.1;
    if (moveRight) camera.position.x += 0.1;

    // Calculate submerged volume
    const submergedVolume = calculateSubmergedVolume();
    console.log("submergedVolume "+submergedVolume);

 // Calculate buoyant force
 const buoyantForce = WATER_DENSITY * GRAVITY * submergedVolume;
 //const buoyantForce = Math.min(WATER_DENSITY * GRAVITY * submergedVolume, MAX_BUOYANT_FORCE);

 
 // Calculate weight of the sailboat
 const boatVolume = sailboat.geometry.parameters.width * sailboat.geometry.parameters.depth * sailboat.geometry.parameters.height;
 const weight = boatVolume * GRAVITY;

 // Calculate net force
 const netForce = buoyantForce - weight;
 console.log("buoyantForce "+buoyantForce);
 console.log("weight "+weight);


 // Apply net force to boat with damping
 const dampingFactor = 0.2; // Adjust damping factor as needed
 velocityY += (netForce / (sailboat.geometry.parameters.width * sailboat.geometry.parameters.depth) - velocityY * dampingFactor) * 0.002;
 //0.0005
 sailboat.position.y += velocityY * 0.0005;
 console.log("velocityY "+velocityY);

 /*
 // Prevent sailboat from sinking too deep
 const minDepth = -2; // Adjust as needed
 if (sailboat.position.y < minDepth) {
     sailboat.position.y = minDepth;
     velocityY = 0;
 }
 const maxDepth = 2; // Adjust as needed
 if (sailboat.position.y > maxDepth) {
     sailboat.position.y = maxDepth;
     velocityY = 0;
 }*/
console.log("postition y "+sailboat.position.y);
//console.log(velocityY);
//animateModel(model);
animatesea();
    renderer.render(scene, camera);
}
animate();
