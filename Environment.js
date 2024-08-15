
import { Vector3 } from "three";

import * as dat from "dat.gui";


class Environment {
    constructor() {

        this.startSimulation = false;


        //Boat name : Beneteau Oceanis 38 (Cruising Sailboat)


        //general variables
        this.passengerMass = 300;//1000 // 300-500 // kg
        this.boatMass = 7000;//14000 //  //kg
        this.totalMass = this.passengerMass + this.boatMass; //kg
        this.gravityConstant = 9.81;  //   m/s^2
        this.waterDensity = 1000;    //
        this.airDensity = 1.225;     //
        this.surfaceArea = 37.04; //8000                // 

        // سرعة الرياح 
        this.windVelocity = new Vector3(0, 0, 0);                  //
        this.WaterVelocity = new Vector3(0, 0, 0);                 //

        //position,velocity,accelration for boat
        this.position = new Vector3(0, 0, 0);                      //
        this.velocity = new Vector3(0, 0, 0);                      //
        this.acceleration = new Vector3(0, 0, 0);                   //
        this.besideVolume = 0;


        this.boatRotation = new Vector3(0, 0, 0);
        //rotational dynamics
        this.angularVelocity = new Vector3(0, 0, 0);                 //
        this.angularAcceleration = new Vector3(0, 0, 0);             //
        this.momentOfInertia = new Vector3(0, 0, 0);                 //


        this.alpha = 0;
        this.beta = 0;
        this.theta = 0;
        this.torque = new Vector3(0, 0, 0);


        //boat variables
        this.length = 11.5;                                         //
        this.width = 3.99;                                          // 
        this.hight = 1.95;
        this.keel = 2.5;
        this.surfaceAreaSpace = this.length * this.width;           //

        this.cd = 0.7;                                              //

        // متغيرات قوة برنولي
        this.p0 = 13;
        this.v0 = 13;
        this.boatDepth = 0;


        // متغيرات قوة دفع الهواء
        this.airThrustConstant = 1;

        //متغيرات قوة مقاومة الهواء
        this.airResistanceConstant = 1;

        this.dfa = 0;
        //متغيرات كثافة الماء
        this.temprature = 35;
        this.rho = 1000;
        this.salty = 35;
        this.pressure = 1;

        this.deltaTime = 0.016666666666666666667;


    }
    addToGui() {
        this.gui = new dat.GUI();
        this.gui.add(this, "passengerMass").min(10).max(100000).step(100).name("passengerMass");
        this.gui.add(this, "boatMass").min(10).max(100000).step(100).name("boat mass");
        this.gui.add(this, "waterDensity").min(0).max(1000).step(1).name("waterDensity ");
        this.gui.add(this, "hight").min(0).max(10).step(1).name("hight");
        this.gui.add(this, "length").min(0).max(10).step(1).name("length");
        this.gui.add(this, "width").min(0).max(10).step(1).name("width");
        this.gui.add(this, "gravityConstant").min(0).max(20).step(0.01).name("gravityConstant");
        this.gui.add(this.WaterVelocity, 'x').min(-100).max(100).step(10).name("water velocity x ");
        this.gui.add(this.WaterVelocity, 'y').min(-100).max(100).step(10).name("water velocity y ");
        this.gui.add(this.WaterVelocity, 'z').min(-100).max(100).step(10).name("water velocity z ");
        this.gui.add(this, "temprature").min(4).max(100).step(5).name("Water Temprature");
        this.gui.add(this, "salty").min(0).max(100).step(5).name("salty");
        this.gui.add(this, "pressure").min(0).max(10).step(1).name("Pressure");
        this.gui.add(this.windVelocity, 'x').min(-100).max(100).step(10).name("wind velocity x");
        this.gui.add(this.windVelocity, 'z').min(-100).max(100).step(10).name("wind velocity z");
        this.gui.add(this, "dfa").min(-1).max(1).step(1).name("dfa");
        this.gui.add(this, "startSimulation").name("start simulation ");
    }
    updateWaterDensity() {

        const rho0 = 999.84;
        const Beta = 0.000214;

        // صافي كثافة المياه تبعا للحرارة يحسب حيث كثافة الماء العظمى عند الدرجة 4
        const rhoPure = rho0 * (1 - Beta * (this.temprature - 4));

        // ثوابت حساب تاثير الملوحة حسب الحرارة
        const A = 0.824493 - 0.0040899 * this.temprature + 0.000076438 * Math.pow(this.temprature, 2) - 0.00000082467 * Math.pow(this.temprature, 3) + 0.0000000053875 * Math.pow(this.temprature, 4);
        const B = -0.005724 + 0.00010227 * this.temprature - 0.0000016546 * Math.pow(this.temprature, 2);
        const C = 0.00048314;

        // حساب تاثير الملوحة عالكثافة
        const salinityContribution = A * this.salty + B * Math.pow(this.salty, 1.5) + C * Math.pow(this.salty, 2);


        // Calculate density contribution from pressure
        const K = 2.2e9; // Bulk modulus of water in Pascals

        const pressureContribution = this.pressure / K;
        // const densityAtPressure = rho0 * (1 + pressureContribution);


        // Total density calculation
        const rho = rhoPure + salinityContribution + pressureContribution;
        // console.log("rho", rho);



        /*
        const rho0 = 1000; // كثافة الماء عند 4°C (كجم/م³)

    // المعاملات التجريبية
    const alpha = 0.0002; // معامل الحرارة
    const beta = 0.00001; // معامل الحرارة
    const gamma = 0.8; // معامل الملوحة

    // الضغط المرجعي
    const P0 = 1; // بار

    // حساب الكثافة
    const density = rho0 * 
        (1 - (alpha * (temperature - 4)) / (1 + beta * (temperature - 4))) *
        (1 + gamma * salinity / 1000) *
        (1 + pressure / P0);

        */

    }
    updateeMomentOfInertia() {
        this.momentOfInertia.x = (1 / 12) * this.totalMass * (Math.pow(this.hight, 2) + Math.pow(this.width, 2));
        this.momentOfInertia.y = (1 / 12) * this.totalMass * (Math.pow(this.length, 2) + Math.pow(this.hight, 2));
        this.momentOfInertia.z = (1 / 12) * this.totalMass * (Math.pow(this.length, 2) + Math.pow(this.width, 2));

    }
    updateTotalMass() {
        this.totalMass = this.boatMass + this.passengerMass;
    }


    updateValues() {
        this.updateTotalMass();
        this.updateWaterDensity();
        this.updateeMomentOfInertia();
    }
}

export default Environment;
