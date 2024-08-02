import WaterForce from "./WaterForces";
import Enviroment from "./Enviroment";

import { Vector3 } from "three";
import * as dat from "dat.gui";
import WindForces from "./WindForces";
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

        return allTF;
    }

    update() {

        var deltaTime = 0.01666666666666666666666666666667;
        var tf = this.calculateTotalForces();

        console.log("position", enviroment.position);
        console.log("total force ", tf);
        console.log("weightVector", windForces.calculateWeightOfBoat());
        console.log("airResistanceVector", windForces.calculateAirResistance());
        console.log("BuoyantForce", waterForce.calculateBuoyantForce());
        console.log("waterResistanceVector", waterForce.calculateWaterResistance());
        console.log("WaterForceXZ", waterForce.calculateWaterForceXZ());


        var totalMass = enviroment.equipmentMass + enviroment.passengerMass;
        enviroment.accelration.copy(tf).divideScalar(totalMass);

        console.log("accelaration", enviroment.accelration);

        // Update velocity
        enviroment.velocity.add(enviroment.accelration.clone().multiplyScalar(deltaTime));

        console.log("velocity", enviroment.velocity);

        // Update position
        enviroment.position.add(enviroment.velocity.clone().multiplyScalar(deltaTime));

        console.log('newwwwwwwwwwwwwwwwwwwwww');
        // Apply damping to simulate water resistance
        enviroment.velocity.multiplyScalar(0.9);


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
