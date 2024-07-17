
import { Vector3 } from "three";

import * as dat from "dat.gui";

class Enviroment {
    constructor() {

        //general variables
        this.passengerMass = 500;
        this.equipmentMass = 7000; // boat mass
        this.gravityConstant = 9.81;
        this.waterDensity = 1000;




        //position,velocity,accelration for boat
        this.position = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
        this.accelration = new Vector3(0, 0, 0);
        this.besideVolume = 0;


        //boat variables
        this.length = 11.5;
        this.width = 3.99;
        this.hight = 1.95;
        this.surfaceAreaSpace = this.length * this.width;
        this.velocity2 = 1000;

        //water speed
        this.WaterVelocity = new Vector3(0, 1, 0);


        //water forces variables
        this.besideVolume = 0.53;
        this.cd = 0.1;

        // متغيرات قوة برنولي
        this.p0 = 13;
        this.v0 = 13;

    }
    addToGui() {
        this.gui = new dat.GUI();
        this.gui.add(this, "passengerMass").min(0).max(100000).step(1000).name("passengerMass");
        this.gui.add(this, "equipmentMass").min(0).max(100000).step(1000).name("equipmentMass");
        this.gui.add(this, "waterDensity").min(0).max(1000).step(1).name("waterDensity ");
        this.gui.add(this, "hight").min(0).max(10).step(1).name("hight");
        this.gui.add(this, "length").min(0).max(10).step(1).name("length");
        this.gui.add(this, "width").min(0).max(10).step(1).name("width");
        this.gui.add(this, "gravityConstant").min(0).max(20).step(0.01).name("gravityConstant");
        this.gui.add(this.velocity, 'x').min(-100).max(100).step(10).name("water velocity x ");
        this.gui.add(this.velocity, 'y').min(-100).max(100).step(10).name("water velocity y ");
        this.gui.add(this.velocity, 'z').min(-100).max(100).step(10).name("water velocity z ");


    }
}

export default Enviroment;
