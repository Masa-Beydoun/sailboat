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
    }

    update() {
        environment.updateValues();
        this.checkFlag();


        this.calculateAcceleration();
        this.calculateVelocity();
        this.calculatePosition();
        let water = waterForce.calculateWaterForceZ().add(waterForce.calculateWaterForceX()).add(waterForce.calculateWaterForceY());
        rotationalDynamics.update(water, windForces.calculateWindForceX());
        // console.log("newwwwwwwwww")
    }

    checkFlag() {
        if (environment.flag == true) {
            if (environment.upDown == 0) {
                environment.WaterVelocity.y += 0.2;
                if (environment.WaterVelocity.y >= 20) {
                    environment.upDown = 1;
                }
            }
            else {
                environment.WaterVelocity.y -= 0.2;
                if (environment.WaterVelocity.y <= 0) {
                    environment.flag = false;
                    environment.upDown = 0;
                }
            }
        }

    }
    checkZoba() {
        if (environment.zoba == true) {
            waterForce.zoba();
            rotationalDynamics.zobaTorque(waterForce.calculateWaterForceX());

        }
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
