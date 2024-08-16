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

    }



    calculateAcceleration() {
        // Angular acceleration = Torque / Moment of Inertia
        this.enviroment.angularAcceleration = new Vector3(
            this.enviroment.torque.x / this.enviroment.momentOfInertia.x,
            this.enviroment.torque.y / this.enviroment.momentOfInertia.y,
            this.enviroment.torque.z / this.enviroment.momentOfInertia.z
        );
    }
    calculateVelocity() {
        this.enviroment.angularVelocity.addScaledVector(this.enviroment.angularAcceleration, this.enviroment.deltaTime);
    }
    calculateTheta() {

        this.enviroment.alpha = (this.enviroment.angularVelocity.z * this.enviroment.deltaTime) + (0.5 * Math.pow(this.enviroment.deltaTime, 2) * this.enviroment.angularAcceleration.z);
        this.enviroment.beta = (this.enviroment.angularVelocity.x * this.enviroment.deltaTime) + (0.5 * Math.pow(this.enviroment.deltaTime, 2) * this.enviroment.angularAcceleration.x);
    }


    updateRotation() {
        this.enviroment.boatRotation.y = this.enviroment.alpha;
        this.enviroment.boatRotation.z = this.enviroment.beta;
    }

    update(waterForce, windForce) {
        this.calculateTorque(waterForce, windForce);
        this.calculateAcceleration();
        this.calculateVelocity();
        this.calculateTheta();
        this.updateRotation();
    }
}

export default RotationalDynamics;
