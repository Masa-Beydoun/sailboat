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

        this.startSimulation = false;

        this.gui = new dat.GUI();

        this.gui
            .add(this, "startSimulation")
            .name("start simulation ");
    }

    calculateTotalForces() {
        var allTF = new Vector3(0,0,0);
        allTF = allTF.add(waterForce.totalForce());
        allTF = allTF.add(windForces.totalForce());
        
        return allTF;
    }

    update() {

        var delta = 0.01666666666666666666666666666667;
        var tf = this.calculateTotalForces();

        console.log("weightVector", windForces.calculateWeightOfBoat());
        console.log("airResistanceVector", windForces.calculateAirResistance());
        console.log("BuoyantForce", waterForce.calculateBuoyantForce());
        console.log("waterResistanceVector", waterForce.calculateWaterResistance());

        var totalMass = enviroment.equipmentMass + enviroment.passengerMass;

        enviroment.accelration = enviroment.accelration.add(tf.multiplyScalar(delta).divideScalar(totalMass));
        console.log("accelaration", enviroment.accelration);

        
        // Update velocity
        enviroment.velocity.add(enviroment.accelration.clone().multiplyScalar(deltaTime));
        console.log("velocity", enviroment.velocity);

        // Update position
        this.enviroment.position.add(enviroment.velocity.clone().multiplyScalar(deltaTime));



        
    }


    getPosition() {
        return new Vector3(enviroment.position.x, enviroment.position.y, enviroment.position.z);
    }


}

export default TotalForce;
