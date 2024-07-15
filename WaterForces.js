import { Vector3 } from "three";

import * as dat from "dat.gui";

import Enviroment from "./Enviroment";
const enviroment = new Enviroment();
class WaterForce {

    constructor() {

        this.startSimulation = false;
        this.position = new Vector3(0, 0, 0);
        this.velocity = new Vector3(1, 1, 1);
        this.accelration = new Vector3(0, 0, 0);

        this.gui = new dat.GUI();

        this.gui
            .add(this, "startSimulation")
            .name("start simulation ");
    }




    calculateBuoyantForce() {
        //قوة الطفو = كثافة المي * ثابت الجاذبية الأرضية * حجم السائل المزاح
        // TODO : edit حجم السائل المزاح
        let buoyant_Force = enviroment.waterDensity * enviroment.gravityConstant * enviroment.besideVolume;

        let buoyantForceVector = new Vector3(0, buoyant_Force, 0);

        return buoyantForceVector;
    }


    calculateWeightOfBoat() {
        // كتلة الحمولة = كتلة الركاب + كتلة المعدات
        var boatMass = enviroment.passengerMass + enviroment.equipmentMass;

        // قوة الثقل = كتلة المنطاد × ثابت الجاذبية الأرضية
        var weightOfBoat = boatMass * enviroment.gravityConstant;
        var weightVector = new Vector3(0, -weightOfBoat, 0);

        return weightVector;
    }






    calculateWaterForceX() {
        let relativeVelocity = this.velocity.clone();
        relativeVelocity.x += enviroment.waterSpeedX;

        let waterForce = 0.5 * enviroment.cd * enviroment.waterDensity * enviroment.surfaceAreaSpace * Math.pow(enviroment.waterSpeedX, 2);
        // قوة الماء =  معامل السحب الديناميكي × كثافة الماء × مساحة السطح المتأثر × سرعة الماء للتربيع 

        let waterForceVector = new Vector3(waterForce, 0, 0);

        return waterForceVector;
    }

    calculateWaterForce_X() {
        let relativeVelocity = this.velocity.clone();
        relativeVelocity.x += enviroment.waterSpeed_X;

        let waterForce = 0.5 * enviroment.cd * enviroment.waterDensity * enviroment.surfaceAreaSpace * Math.pow(enviroment.waterSpeedX, 2);

        let waterForceVector = new Vector3(-waterForce, 0, 0);

        return waterForceVector;
    }

    calculateWaterForceZ() {
        let relativeVelocity = this.velocity.clone();
        relativeVelocity.z += enviroment.waterSpeedZ;

        let waterForce = 0.5 * enviroment.cd * enviroment.waterDensity * enviroment.surfaceAreaSpace * Math.pow(enviroment.waterSpeedZ, 2);

        let waterForceVector = new Vector3(0, 0, waterForce);

        return waterForceVector;
    }
    calculateWaterForce_Z() {
        let relativeVelocity = this.velocity.clone();
        relativeVelocity.z += this.waterSpeed_Z;

        let waterForce = 0.5 * enviroment.cd * enviroment.waterDensity * enviroment.surfaceAreaSpace * Math.pow(enviroment.waterSpeed, 2);

        let waterForceVector = new Vector3(0, 0, -waterForce);

        return waterForceVector;
    }



    calculateWaterResistance() {
        let waterResistance = 0.5 * enviroment.waterDensity * enviroment.surfaceAreaSpace * Math.pow(this.velocity.lengthSq(), 2);
        let waterResistanceVector = new Vector3(0, waterResistance, 0);

        return waterResistanceVector;
    }


    calculateBernoly() {
        let p = enviroment.p0 - 0.5 * enviroment.waterDensity * Math.pow((this.velocity.lengthSq() - enviroment.v0), 2);
    }





    totalForce() {
        var tf = new Vector3(0, 0, 0);
        tf = tf.add(this.calculateWeightOfBoat());
        tf = tf.add(this.calculateWaterResistance());
        tf = tf.add(this.calculateWaterForceX());
        tf = tf.add(this.calculateWaterForceZ());
        tf = tf.add(this.calculateWaterForce_X());
        tf = tf.add(this.calculateWaterForce_Z());

        return tf;
    }

    update() {
        var delta = 0.01666666666666666666666666666667;
        var tf = this.totalForce();
        console.log("weightVector", this.calculateWeightOfBoat());
        console.log("BuoyantForce", this.calculateBuoyantForce());
        console.log("waterResistanceVector", this.calculateWaterResistance());
        console.log("WaterForceX", this.calculateWaterForceX());
        console.log("WaterForceZ", this.calculateWaterForceZ());

    }



}


export default WaterForce;