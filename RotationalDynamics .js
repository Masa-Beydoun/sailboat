import * as THREE from 'three';
import { Vector3 } from "three";

var waterForce;
class RotationalDynamics {
    constructor(enviroment) {
        this.enviroment = enviroment;
    }



    calculateTorque(waterForce, windForce) {

        const pointOfApplicationWind = new Vector3(this.enviroment.surfaceArea / 4, 0, 0);
        const pointOfApplicationWater = new Vector3(this.enviroment.keel / 2, 0, - this.enviroment.length / 2);

        this.enviroment.torque.z = waterForce.z * pointOfApplicationWater.z * this.enviroment.dfa;
        this.enviroment.torque.x = windForce.x * pointOfApplicationWind.x - waterForce.x * pointOfApplicationWater.x;

        console.log("torque ", this.enviroment.torque);
    }



    calculateAcceleration() {
        // Angular acceleration = Torque / Moment of Inertia
        this.enviroment.angularAcceleration = new Vector3(
            this.enviroment.torque.x / this.enviroment.momentOfInertia.x,
            this.enviroment.torque.y / this.enviroment.momentOfInertia.y,
            this.enviroment.torque.z / this.enviroment.momentOfInertia.z
        );
        console.log("angular Acceleration", this.enviroment.angularAcceleration);
    }
    calculateVelocity() {
        this.enviroment.angularVelocity.addScaledVector(this.enviroment.angularAcceleration, this.enviroment.deltaTime);
        console.log("angular velocity", this.enviroment.velocity);
    }
    calculateTheta() {

        this.enviroment.alpha = (this.enviroment.angularVelocity.z * this.enviroment.deltaTime) + (0.5 * Math.pow(this.enviroment.deltaTime, 2) * this.enviroment.angularAcceleration.z);
        this.enviroment.beta = (this.enviroment.angularVelocity.x * this.enviroment.deltaTime) + (0.5 * Math.pow(this.enviroment.deltaTime, 2) * this.enviroment.angularAcceleration.x);
        console.log("alpha", this.enviroment.alpha);
        console.log("beta", this.enviroment.beta);
    }


    updateRotation() {

        // Create quaternions for each rotation
        // let qAlpha = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.enviroment.alpha); // Rotate around X-axis
        // let qBeta = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.enviroment.beta);  // Rotate around Y-axis
        this.enviroment.boatRotation.y = this.enviroment.alpha; // Rotation around Y-axis
        this.enviroment.boatRotation.z = this.enviroment.beta;  // Rotation around Z-axis



    }

    update(waterForce, windForce) {
        this.calculateTorque(waterForce, windForce);
        this.calculateAcceleration();
        this.calculateVelocity();
        this.calculateTheta();
        this.updateRotation();
    }
}

/* final code form gpt


// تعريف قوة الرياح وموقع تطبيقها
const windForce = new THREE.Vector3(0, 1000, 0); // قوة الرياح في الاتجاه Y (نيوتن)
const pointOfApplication = new THREE.Vector3(2.5, 0, 0); // موقع القوة بالنسبة لمركز الكتلة (متر)

// لحظة القصور الذاتي (افترض لحظة القصور الذاتي للقارب على محور Z)
const momentOfInertia = (1 / 12) * (5 * Math.pow(2, 2) + 2 * Math.pow(1, 2)); // لحظة القصور الذاتي لمتوازي المستطيلات

// حساب العزم الزاوي حول المحور الرأسي (محور Z)
const torque = new THREE.Vector3().crossVectors(pointOfApplication, windForce);
const torqueMagnitude = torque.length();

// حساب التسارع الزاوي
const angularAcceleration = torqueMagnitude / momentOfInertia;

// متغيرات للسرعة الزاوية والزاوية الدوارة
let angularVelocity = 0; // السرعة الزاوية الابتدائية
let initialTime = Date.now(); // الوقت الابتدائي

// وظيفة لتحديث الرسم البياني
function animate() {
    requestAnimationFrame(animate);

    // حساب الوقت المنقضي
    const elapsedTime = (Date.now() - initialTime) / 1000; // الوقت بالثواني

    // حساب السرعة الزاوية
    angularVelocity = angularVelocity + angularAcceleration * elapsedTime;

    // حساب الزاوية الدوارة
    const angle = angularVelocity * elapsedTime + 0.5 * angularAcceleration * Math.pow(elapsedTime, 2);

    // تحديث دوران القارب
    boat.rotation.z = angle;

    renderer.render(scene, camera);
}
animate();



*/

export default RotationalDynamics;
