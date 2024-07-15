import WaterForce from "./WaterForces";
import Enviroment from "./Enviroment";

const waterForce = new WaterForce();
const enviroment = new Enviroment();
enviroment.addToGui();
class TotalForce {
    constructor() { }

    totalForce() {

    }




    showSimulation() {
        if (waterForce.startSimulation == true) {
            orbit.update(delta);

            waterForce.update();
        }
    }
}

export default TotalForce;
