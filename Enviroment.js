
import { Vector3 } from "three";

import * as dat from "dat.gui";


class Enviroment {
    constructor() {

        this.startSimulation = false;


        //Boat name : Beneteau Oceanis 38 (Cruising Sailboat)


        //general variables
        this.passengerMass = 300;//1000 // 300-500
        this.equipmentMass = 7000;//14000 // Boat mass
        this.gravityConstant = 9.81;
        this.waterDensity = 1000;
        this.airDensity = 1.225;
        this.surfaceArea = 37.04; //8000
        // this.surfaceArea = 37.04;

        // سرعة الرياح 
        this.windSpeedX = 1;
        this.windSpeed_X = 1;
        this.windSpeedZ = 1;
        this.windSpeed_Z = 1;


        //position,velocity,accelration for boat
        this.position = new Vector3(0, 0, 0);
        // this.position = 0;
        this.velocity = new Vector3(0, 0, 0);
        this.accelration = new Vector3(0, 0, 0);
        this.besideVolume = 0;



        //rotational dynamics
        this.angularVelocity = new Vector3(0, 0, 0);
        this.torque = new Vector3(0, 0, 0);
        this.rotation = new Euler(0, 0, 0);
        this.momentOfInertia = new Vector3(0, 0, 0);



        //boat variables
        this.length = 11.5;
        this.width = 3.99;
        this.hight = 1.95;
        this.surfaceAreaSpace = this.length * this.width;

        // this.velocity2 = 1000;

        //water speed
        this.WaterVelocity = new Vector3(0, 1, 0);


        //water forces variables
        this.besideVolume = 0.53;
        this.cd = 0.1;

        // متغيرات قوة برنولي
        this.p0 = 13;
        this.v0 = 13;
        this.boatDepth = 0;


        // متغيرات قوة دفع الهواء
        this.airThrustConstant = 1;
        this.velocity = 1000;
        // this.position = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
        // this.accelration = new Vector3(0, 0, 0);

        //متغيرات قوة مقاومة الهواء
        this.airResistanceConstant = 1;
        // this.airDensity = 1.225;
        // this.velocity = 1000;
        // this.velocity = new Vector3(0, 0, 0);
        // this.accelration = new Vector3(0, 0, 0);



    }
    addToGui() {
        this.gui = new dat.GUI();
        // this.gui.add(this, "passengerMass").min(0).max(1000).step(10).name("passengerMass");
        // this.gui.add(this, "equipmentMass").min(0).max(1000).step(10).name("equipmentMass");
        this.gui.add(this, "waterDensity").min(0).max(1000).step(1).name("waterDensity ");
        this.gui.add(this, "hight").min(0).max(10).step(1).name("hight");
        this.gui.add(this, "length").min(0).max(10).step(1).name("length");
        this.gui.add(this, "width").min(0).max(10).step(1).name("width");
        this.gui.add(this, "gravityConstant").min(0).max(20).step(0.01).name("gravityConstant");
        this.gui.add(this.WaterVelocity, 'x').min(-100).max(100).step(10).name("water velocity x ");
        this.gui.add(this.WaterVelocity, 'y').min(-100).max(100).step(10).name("water velocity y ");
        this.gui.add(this.WaterVelocity, 'z').min(-100).max(100).step(10).name("water velocity z ");

        // متغيرات قوة الثقل
        this.gui
            .add(this, "passengerMass")
            .min(0)
            .max(10000)
            .step(1)
            .name("passengerMass");
        this.gui
            .add(this, "equipmentMass")
            .min(0)
            .max(10000)
            .step(1)
            .name("equipmentMass");


        this.gui
            .add(this, "windSpeedX")
            .min(0)
            .max(400)
            .step(1)
            .name("windSpeedX ");
        this.gui
            .add(this, "windSpeedZ")
            .min(0)
            .max(400)
            .step(1)
            .name("windSpeedZ ");
        this.gui
            .add(this, "windSpeed_X")
            .min(0)
            .max(400)
            .step(1)
            .name("windSpeed-X ");
        this.gui
            .add(this, "windSpeed_Z")
            .min(0)
            .max(400)
            .step(1)
            .name("windSpeed-Z ");
        this.gui
            .add(this, "startSimulation")

            .name("start simulation ");
    }

}

export default Enviroment;
