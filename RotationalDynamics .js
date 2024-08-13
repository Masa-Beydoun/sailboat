import * as THREE from 'three';

import { Vector3 } from "three";
import TotalForce from "./TotalForce";
import WaterForce from "./WaterForces";

var waterForce;
class RotationalDynamics {
    constructor(enviroment) {
        this.enviroment = enviroment;
        waterForce = new WaterForce(enviroment);
    }



    calculateTorque() {

        const force = waterForce.calculateWaterForceZ();
        const pointOfApplication = new Vector3(0, 0, -this.enviroment.length / 2);

        this.enviroment.torque.z = force.z * pointOfApplication.z;
        console.log("torque ", this.enviroment.torque);
    }

    updateAccelerationAndVelocity() {
        let deltaTime = 0.01666666666666666666666666666667;


        console.log("torque here", this.enviroment.torque);
        console.log("moment of intera here", this.enviroment.momentOfInertia);
        // Angular acceleration = Torque / Moment of Inertia
        this.enviroment.angularAcceleration = this.enviroment.torque.clone().divide(this.enviroment.momentOfInertia);
        console.log("angular Acceleration", this.enviroment.angularAcceleration);

        // Update angular velocity
        this.enviroment.angularVelocity.add(this.enviroment.angularAcceleration.multiplyScalar(deltaTime));
        console.log("angular velocity", this.enviroment.velocity);


        // (0,0,this.enviroment.angularVelocity.z + (this.enviroment.angularAcceleration.z * variables.dt))

        this.enviroment.theta = (this.enviroment.angularVelocity.z * deltaTime) + (0.5 * Math.pow(deltaTime, 2) * this.enviroment.angularAcceleration.z)
        console.log("theta", this.enviroment.theta);


        // (this.enviroment.angularVelocity.z * variables.dt) + (0.5 * Math.pow(variables.dt,2) * this.enviroment.angularAcceleration.z)
    }


    updateRotation() {
        this.enviroment.boatRotation.y += this.enviroment.theta
        const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.enviroment.theta)
        this.enviroment.velocity.applyQuaternion(q1)

        if (this.enviroment.attackAngle <= this.enviroment.alpha) {
            this.enviroment.attackAngle += this.enviroment.alpha * 0.1
            const attackAngleInRad = (this.enviroment.attackAngle * 3.14) / 180
            this.enviroment.rotation.x += -attackAngleInRad
            const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -attackAngleInRad)
            this.enviroment.velocity.applyQuaternion(q2)
        }
    }

    update() {
        this.calculateTorque();
        this.updateAccelerationAndVelocity();
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
