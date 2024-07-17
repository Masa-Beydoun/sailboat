import WaterForce from "./WaterForces";
import Enviroment from "./Enviroment";

import { Vector3 } from "three";
import * as dat from "dat.gui";
const enviroment = new Enviroment();
enviroment.addToGui();

const waterForce = new WaterForce(enviroment);


class TotalForce {

    constructor() {

        this.startSimulation = false;

        this.gui = new dat.GUI();

        this.gui
            .add(this, "startSimulation")
            .name("start simulation ");
    }

    update(delta) {
        console.log("position", enviroment.position);
        waterForce.update();
    }


    getPosition() {
        return new Vector3(enviroment.position.x, enviroment.position.y, enviroment.position.z);
    }


}

export default TotalForce;
