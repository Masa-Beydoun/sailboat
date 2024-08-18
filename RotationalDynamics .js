import * as THREE from 'three';
import { Vector3 } from "three";

var waterForce;
class RotationalDynamics {
    constructor(enviroment) {
        this.enviroment = enviroment;
    }



    calculateTorque(waterForce, windForce) {

        const pointOfApplicationWind = new Vector3(this.enviroment.surfaceArea / 4, 0, 0);
        const pointOfApplicationWater = new Vector3(this.enviroment.keel / 2, 0, this.enviroment.length / 2);

        this.enviroment.torque.z = waterForce.z * pointOfApplicationWater.z * this.enviroment.dfa;
        this.enviroment.torque.x = -windForce.x * pointOfApplicationWind.x - waterForce.x * pointOfApplicationWater.x;

        this.enviroment.torque.y = waterForce.y * pointOfApplicationWater.z;


        let stabilizationFactor = 0.1;
        if (Math.abs(windForce.x) + Math.abs(waterForce.x) < 1e-5) {
            this.enviroment.torque.x -= this.enviroment.boatRotation.x * stabilizationFactor;
        }

        if (Math.abs(waterForce.y) < 1e-5) {
            this.enviroment.torque.y -= this.enviroment.boatRotation.y * stabilizationFactor;
        }
        if (Math.abs(waterForce.z) < 1e-5) {
            this.enviroment.torque.z -= this.enviroment.boatRotation.z * stabilizationFactor;
        }

    }

    zobaTorque(waterForce) {
        if (this.enviroment.zoba == false) return;
        const pointOfApplication = new Vector3(0, 0, this.enviroment.length / 2);
        const v = pointOfApplication.z * waterForce.z;
        this.enviroment.torque.z += v;
    }


    calculateAcceleration() {
        // Angular acceleration = Torque / Moment of Inertia
        this.enviroment.angularAcceleration = new Vector3(
            this.enviroment.torque.x / this.enviroment.momentOfInertia.x,
            this.enviroment.torque.y / this.enviroment.momentOfInertia.y,
            this.enviroment.torque.z / this.enviroment.momentOfInertia.z
        );
        // console.log("acceleration", this.enviroment.angularAcceleration);
    }
    calculateVelocity() {
        const dampingFactor = 0.95;
        this.enviroment.angularVelocity.multiplyScalar(dampingFactor);
        this.enviroment.angularVelocity.addScaledVector(this.enviroment.angularAcceleration, this.enviroment.deltaTime);
        // console.log("velocity", this.enviroment.angularVelocity);
    }
    calculateTheta() {

        this.enviroment.alpha = (this.enviroment.angularVelocity.z * this.enviroment.deltaTime) + (0.5 * Math.pow(this.enviroment.deltaTime, 2) * this.enviroment.angularAcceleration.z);
        this.enviroment.beta = (this.enviroment.angularVelocity.x * this.enviroment.deltaTime) + (0.5 * Math.pow(this.enviroment.deltaTime, 2) * this.enviroment.angularAcceleration.x);
        this.enviroment.theta = (this.enviroment.angularVelocity.y * this.enviroment.deltaTime) + (0.5 * Math.pow(this.enviroment.deltaTime, 2) * this.enviroment.angularAcceleration.y);
    }


    updateRotation() {
        this.enviroment.boatRotation.y = this.enviroment.alpha;
        this.enviroment.boatRotation.z = this.enviroment.beta;
        this.enviroment.boatRotation.x = this.enviroment.theta;
    }

    update(waterForce, windForce) {
        if (this.enviroment.zoba == true) {
            this.zobaTorque(windForce);
        }
        else {
            this.calculateTorque(waterForce, windForce);
        }
        this.calculateAcceleration();
        this.calculateVelocity();
        this.calculateTheta();
        this.updateRotation();
    }
}

export default RotationalDynamics;
