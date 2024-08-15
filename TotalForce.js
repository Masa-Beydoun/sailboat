import WaterForce from "./WaterForces";
import Enviroment from "./Environment";
import { Vector3 } from "three";
import WindForces from "./WindForces";
import RotationalDynamics from "./RotationalDynamics ";
const environment = new Enviroment();
environment.addToGui();

const waterForce = new WaterForce(environment);
const windForces = new WindForces(environment);
const rotationalDynamics = new RotationalDynamics(environment);


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
        environment.acceleration.copy(tf).divideScalar(environment.totalMass);
    }

    calculateVelocity() {
        environment.velocity.add(environment.acceleration.clone().multiplyScalar(environment.deltaTime));
        environment.velocity.multiplyScalar(0.9); // Apply damping
    }

    calculatePosition() {
        environment.position.add(environment.velocity.clone().multiplyScalar(environment.deltaTime));
        environment.position.y = Math.min(environment.hight / 2, environment.position.y);
        console.log("position", environment.position);
    }

    update() {
        environment.updateValues();
        this.calculateAcceleration();
        this.calculateVelocity();
        this.calculatePosition();
        let water = waterForce.calculateWaterForceZ().add(waterForce.calculateWaterForceX());
        rotationalDynamics.update(water, windForces.calculateWindForceX());
    }


    getPosition() {
        return environment.position;
    }
    getRotation() {
        return environment.boatRotation;
    }

    getStartSimulation() {
        return environment.startSimulation;
    }
}

export default TotalForce;
