import WaterForce from "./WaterForces";
import Enviroment from "./Enviroment";

import { Vector3 } from "three";
import * as dat from "dat.gui";
import WindForces from "./WindForces";
const enviroment = new Enviroment();
enviroment.addToGui();

const waterForce = new WaterForce(enviroment);
const windForces = new WindForces(enviroment);


class TotalForce {

    constructor() {

    }

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
        // console.log("airResistanceVector", windForces.calculateAirResistance());
        console.log("BuoyantForce", waterForce.calculateBuoyantForce());
        // console.log("waterResistanceVector", waterForce.calculateWaterResistance());

        var totalMass = enviroment.equipmentMass + enviroment.passengerMass;
        enviroment.accelration.copy(tf).divideScalar(totalMass);

        parseFloat(enviroment.accelration.x.toFixed(8));
        parseFloat(enviroment.accelration.y.toFixed(8));
        parseFloat(enviroment.accelration.z.toFixed(8));
        console.log("accelaration", enviroment.accelration);

        // Update velocity
        enviroment.velocity.add(enviroment.accelration.clone().multiplyScalar(deltaTime));

        parseFloat(enviroment.velocity.x.toFixed(8));
        parseFloat(enviroment.velocity.y.toFixed(8));
        parseFloat(enviroment.velocity.z.toFixed(8));
        console.log("velocity", enviroment.velocity);

        // Update position
        enviroment.position.add(enviroment.velocity.clone().multiplyScalar(deltaTime));

        parseFloat(enviroment.position.x.toFixed(8));
        parseFloat(enviroment.position.y.toFixed(8));
        parseFloat(enviroment.position.z.toFixed(8));
        console.log('newwwwwwwwwwwwwwwwwwwwww');
        // Apply damping to simulate water resistance
        enviroment.velocity.multiplyScalar(0.9);


    }


    getPosition() {
        return new Vector3(enviroment.position.x, enviroment.position.y, enviroment.position.z);
    }


    getStartSimulation() {
        return enviroment.startSimulation;
    }
}

export default TotalForce;
