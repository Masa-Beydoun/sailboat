import * as dat from "dat.gui";

class Enviroment {
    constructor() {

        //general variables
        this.passengerMass = 0;
        this.equipmentMass = 500;
        this.gravityConstant = 9.81;
        this.waterDensity = 1000;




        //boat variables
        this.length = 8;
        this.width = 4;
        this.surfaceAreaSpace = this.length * this.width;
        this.velocity = 1000;

        //water speed
        this.waterSpeedX = 1;
        this.waterSpeed_X = 1;
        this.waterSpeedZ = 1;
        this.waterSpeed_Z = 1;


        //water forces variables
        this.besideVolume = 0.53;
        this.cd = 0.1;

        // متغيرات قوة برنولي
        this.p0 = 13;
        this.v0 = 13;

    }
    addToGui() {
        this.gui = new dat.GUI();
        this.gui.add(this, "waterDensity").min(0).max(1000).step(1).name("waterDensity ");
        this.gui.add(this, "length").min(0).max(1000).step(1).name("length ");
        this.gui.add(this, "width").min(0).max(1000).step(1).name("width");
        this.gui.add(this, "gravityConstant").min(-10).max(10).step(1).name("gravityConstant ");
        this.gui.add(this, "waterSpeedX").min(0).max(1000).step(1).name("waterSpeedX ");
        this.gui.add(this, "waterSpeedZ").min(0).max(1000).step(1).name("waterSpeedZ ");
        this.gui.add(this, "waterSpeed_X").min(0).max(1000).step(1).name("waterSpeed-X ");
        this.gui.add(this, "waterSpeed_Z").min(0).max(1000).step(1).name("waterSpeed-Z ");
    }
}

export default Enviroment;
