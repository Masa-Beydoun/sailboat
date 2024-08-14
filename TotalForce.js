import WaterForce from "./WaterForces";
import Enviroment from "./Environment";
import { Vector3 } from "three";
import WindForces from "./WindForces";
import RotationalDynamics from "./RotationalDynamics ";
const enviroment = new Enviroment();
enviroment.addToGui();

const waterForce = new WaterForce(enviroment);
const windForces = new WindForces(enviroment);
const rotationalDynamics = new RotationalDynamics(enviroment);


class TotalForce {

    constructor() { }

    calculateTotalForces() {
        let allTF = new Vector3();
        allTF.add(waterForce.totalForce());
        allTF.add(windForces.totalForce());
        return allTF;
    }

    calculateAcceleration() {
        const tf = this.calculateTotalForces();
        enviroment.acceleration.copy(tf).divideScalar(enviroment.totalMass);
    }

    calculateVelocity() {
        enviroment.velocity.add(enviroment.acceleration.clone().multiplyScalar(enviroment.deltaTime));
        enviroment.velocity.multiplyScalar(0.9); // Apply damping
    }

    calculatePosition() {
        enviroment.position.add(enviroment.velocity.clone().multiplyScalar(enviroment.deltaTime));
    }

    update() {
        enviroment.updateValues();
        this.calculateAcceleration();
        this.calculateVelocity();
        this.calculatePosition();
        rotationalDynamics.update(waterForce.calculateWaterForceZ(), windForces.calculateWindForceX());
    }


    getPosition() {
        return enviroment.position;
    }
    getRotation() {
        return rotationalDynamics.rotation;
    }

    getStartSimulation() {
        return enviroment.startSimulation;
    }
}

export default TotalForce;
