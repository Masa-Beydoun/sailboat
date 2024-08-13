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
        allTF = allTF.add(windForces.totalForce());

        allTF.x = parseFloat(allTF.x.toFixed(8));
        allTF.y = parseFloat(allTF.y.toFixed(8));
        allTF.z = parseFloat(allTF.z.toFixed(8));
        return allTF;
    }

    update() {
        //updating variables
        enviroment.updateValues();


        this.MAX_VALUE = 99999999;
        //calculating forces
        var deltaTime = 0.01666666666666666666666666666667;
        var tf = this.calculateTotalForces();
        // rotationalDynamics.update();

        rotationalDynamics.update();
        // tf.x = Math.min(Math.max(tf.x, -this.MAX_VALUE), this.MAX_VALUE);
        // tf.y = Math.min(Math.max(tf.y, -this.MAX_VALUE), this.MAX_VALUE);
        // tf.z = Math.min(Math.max(tf.z, -this.MAX_VALUE), this.MAX_VALUE);

        console.log("total force ", tf);
        // console.log("weightVector", waterForce.calculateWeightOfBoat());
        // console.log("airResistanceVector", windForces.calculateAirResistance());
        // console.log("BuoyantForce", waterForce.calculateBuoyantForce());
        // console.log("waterResistanceVector", waterForce.calculateWaterResistance());
        // console.log("WaterForceXZ", waterForce.calculateWaterForceXZ());



        enviroment.accelration.copy(tf).divideScalar(enviroment.totalMass);
        enviroment.accelration.x = parseFloat(enviroment.accelration.x.toFixed(8));
        enviroment.accelration.y = parseFloat(enviroment.accelration.y.toFixed(8));
        enviroment.accelration.z = parseFloat(enviroment.accelration.z.toFixed(8));
        // console.log("accelaration", enviroment.accelration);

        // Update velocity
        enviroment.velocity.add(enviroment.accelration.clone().multiplyScalar(deltaTime));
        enviroment.velocity.x = parseFloat(enviroment.velocity.x.toFixed(8));
        enviroment.velocity.y = parseFloat(enviroment.velocity.y.toFixed(8));
        enviroment.velocity.z = parseFloat(enviroment.velocity.z.toFixed(8));
        // console.log("velocity", enviroment.velocity);

        // Update position
        enviroment.position.add(enviroment.velocity.clone().multiplyScalar(deltaTime));
        parseFloat(enviroment.position.x.toFixed(8));
        parseFloat(enviroment.position.y.toFixed(8));
        parseFloat(enviroment.position.z.toFixed(8));
        // console.log("position", enviroment.position);

        // Apply damping to simulate water resistance
        enviroment.velocity.multiplyScalar(0.9);

        console.log('newwwwwwwwwwwwwwwwwwwwww');
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
