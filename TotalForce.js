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
        var allTF = new Vector3(0, 0, 0);
        allTF = allTF.add(waterForce.totalForce());
        console.log("water force", waterForce.totalForce());
        allTF = allTF.add(windForces.totalForce());
        console.log("wind force", windForces.totalForce());



        allTF.x = parseFloat(allTF.x.toFixed(8));
        allTF.y = parseFloat(allTF.y.toFixed(8));
        allTF.z = parseFloat(allTF.z.toFixed(8));
        return allTF;
    }


    calculateAcceleration() {
        var tf = this.calculateTotalForces();
        console.log("tf", tf);
        enviroment.accelration.copy(tf).divideScalar(enviroment.totalMass);
        enviroment.accelration.x = parseFloat(enviroment.accelration.x.toFixed(8));
        enviroment.accelration.y = parseFloat(enviroment.accelration.y.toFixed(8));
        enviroment.accelration.z = parseFloat(enviroment.accelration.z.toFixed(8));
        console.log("acceleration", enviroment.accelration);
    }
    calculateVelocity() {
        // Update velocity
        //Try equal
        // console.log("accele", enviroment.accelration);
        enviroment.velocity.add(enviroment.accelration.clone().multiplyScalar(enviroment.deltaTime));
        enviroment.velocity.x = parseFloat(enviroment.velocity.x.toFixed(8));
        enviroment.velocity.y = parseFloat(enviroment.velocity.y.toFixed(8));
        enviroment.velocity.z = parseFloat(enviroment.velocity.z.toFixed(8));
        console.log("velocity", enviroment.velocity);
        enviroment.velocity.multiplyScalar(0.9);
    }
    calculatePosition() {
        // Update position
        enviroment.position.add(enviroment.velocity.clone().multiplyScalar(enviroment.deltaTime));
        enviroment.position.x = parseFloat(enviroment.position.x.toFixed(8));
        enviroment.position.y = parseFloat(enviroment.position.y.toFixed(8));
        enviroment.position.z = parseFloat(enviroment.position.z.toFixed(8));
        console.log("position", enviroment.position);

    }
    update() {
        //updating variables
        enviroment.updateValues();

        // var this.enviroment.deltaTime = 0.01666666666666666666666666666667;


        this.calculateAcceleration();
        this.calculateVelocity();
        this.calculatePosition();

        rotationalDynamics.update(waterForce.calculateWaterForceZ());
        // console.log('newwwwwwwwwwwwwwwwwwwwww');
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
