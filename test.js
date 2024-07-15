import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import pxday from 'C:/Users/karee/Desktop/New folder/pxday.jpg';

import nxday from 'C:/Users/karee/Desktop/New folder/nxday.jpg';

import pyday from 'C:/Users/karee/Desktop/New folder/pyday.jpg';
import nyday from 'C:/Users/karee/Desktop/New folder/nyday.jpg';

import pzday from 'C:/Users/karee/Desktop/New folder/pzday.jpg';
import nzday from 'C:/Users/karee/Desktop/New folder/nzday.jpg';
// Scene setup

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

camera.position.set(0, 30, 100);

// Update controls
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const orbit= new OrbitControls(camera,renderer.domElement);

renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);
orbit.update();
camera.position.set(0,2,5);
// Orbit controls for camera
//const controls = new OrbitControls(camera, renderer.domElement);
//controls.maxPolarAngle = Math.PI * 0.495;
//controls.target.set(0, 10, 0);
//controls.update();
renderer.setSize(window.innerWidth,window.innerHeight);
//const texture = textureLoader.load(pxday);

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

// Lights
const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(100, 100, 100);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

// Water shader
const waterGeometry = new THREE.PlaneGeometry(20000, 20000, 100, 100);

const waterMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide, // Make material two-sided

  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform float time;
    uniform float amplitude;
    uniform float frequency;
    uniform vec3 lightDirection; // Light direction for lighting calculations
    uniform vec3 lightColor;   // Color of the light source
    uniform vec3 deepColor;    // Deep water color (dark blue)
    uniform vec3 shallowColor; // Shallow water color (lighter blue)

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    vec3 gerstnerWave(float amp, float freq, vec2 uv, float t) {
      float q = 2.0 * 3.14159 * dot(vec2(cos(freq * t), sin(freq * t)), uv);
      return vec3(uv.x - amp * cos(q), amp * sin(q), uv.y);
    }

    void main() {
      vec2 uv = vUv;
      float timeFactor = time * 0.5;
      float amp = amplitude;
      float freq = frequency;

      // Calculate wave displacement (unchanged)
      vec3 wavePos = gerstnerWave(amp, freq, uv, timeFactor);
      vec3 waveNormal = normalize(vNormal + vec3(amp * freq * cos(freq * uv.x + timeFactor), 1.0, amp * freq * cos(freq * uv.y + timeFactor)));

      // Fresnel effect for water sheen
      float fresnel = dot(normalize(cameraPosition - vPosition), waveNormal);
      fresnel = pow(1.0 - fresnel, 3.0);

      // Combine shallow and deep water color based on fresnel
      vec3 baseColor = mix(deepColor, shallowColor, fresnel);

      // Reflected light calculation
      vec3 reflectedLight = reflect(-lightDirection, waveNormal);
      float specular = max(dot(reflectedLight, normalize(cameraPosition - vPosition)), 0.0);
      specular = pow(specular, 50.0) * fresnel;

      // Lighting calculations
      vec3 diffuseLight = max(dot(waveNormal, lightDirection), 0.0) * lightColor;
      vec3 finalColor = baseColor + diffuseLight + vec3(0.2, 0.2, 0.2) * specular;

      // Set final color and alpha
      gl_FragColor = vec4(finalColor, 1.0); // Adjust alpha for water transparency if needed
    }
  `,

  uniforms: {
    time: { value: 0.0 },
    amplitude: { value: 1.0 },
    frequency: { value: 1.0 },
    lightDirection: { value: new THREE.Vector3(1.0, 1.0, 1.0) },  // Set initial light direction
    lightColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) }, // Set white light color
    deepColor: { value: new THREE.Vector3(0.0, 0.3, 0.6) },  // Set deep water color (dark blue)
    shallowColor: { value: new THREE.Vector3(0.2, 0.5, 0.8) }, // Set shallow water color (lighter blue)
    cameraPosition: { value: new THREE.Vector3() } // Camera position will be updated in the animation loop
  }
});

const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2;
scene.add(water);
// const waterGeometry = new THREE.PlaneGeometry(30, 30);
// const water = new Water(
//     waterGeometry,
//     {
//         textureWidth: 512,
//         textureHeight: 512,
//         waterNormals: new THREE.TextureLoader().load('https://threejs.org/examples/textures/waternormals.jpg', function (texture) {
//             texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//         }),
//         sunDirection: new THREE.Vector3(),
//         sunColor: 0xffffff,
//         waterColor: 0x001e0f,
//         distortionScale: 3.7,
//         fog: scene.fog !== undefined,
//         side: THREE.DoubleSide
//     }
// );
// water.rotation.x = - Math.PI / 2;
// //fix with water level ??
// water.position.y = -0.5;
// scene.add(water);
// // Skybox
const skyGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide });
const skybox = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skybox);

camera.position.set(0, 30, 100);
//controls.update();

// Animation loop
function animate() {

    requestAnimationFrame(animate);

    water.material.uniforms.time.value += 0.05;
    water.material.uniforms.cameraPosition.value.copy(camera.position);
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
