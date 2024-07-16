import { Vector3 } from "three";

import Enviroment from "./Enviroment";

class WaterForce {

    constructor(enviroment) {
        this.enviroment = enviroment;
    }




    calculateBuoyantForce() {
        //قوة الطفو = كثافة المي * ثابت الجاذبية الأرضية * حجم السائل المزاح
        let yPosition = this.enviroment.position.y; // Assume y=0 is the water surface level
        var boatDepth = 0;

        if (yPosition > this.enviroment.hight / 2) {
            boatDepth = 0;
        }
        else if (yPosition > 0) {
            boatDepth = parseFloat((this.enviroment.hight / 2 - yPosition).toFixed(8));
        }
        else {
            boatDepth = parseFloat((Math.min(this.enviroment.hight, this.enviroment.hight / 2 + Math.abs(yPosition))).toFixed(8));
        }

        let submergedVolume = boatDepth * this.enviroment.length * this.enviroment.width;
        // Update the displaced volume
        this.enviroment.besideVolume = submergedVolume;

        let buoyantForce = this.enviroment.waterDensity * this.enviroment.gravityConstant * submergedVolume;

        return new Vector3(0, parseFloat(buoyantForce.toFixed(8)), 0);
    }

    calculateWeightOfBoat() {
        // كتلة الحمولة = كتلة الركاب + كتلة المعدات
        var totalMass = this.enviroment.equipmentMass + this.enviroment.passengerMass;
        var weightOfBoat = totalMass * this.enviroment.gravityConstant;
        return new Vector3(0, parseFloat(-weightOfBoat.toFixed(8)), 0);
    }


    calculateWaterForceXZ() {
        // let relativeVelocity = this.enviroment.velocity.clone();
        // relativeVelocity.x += this.enviroment.WaterVelocity.x;

        let waterForce = 0.5 * this.enviroment.cd * this.enviroment.waterDensity * this.enviroment.surfaceAreaSpace * Math.pow(this.enviroment.WaterVelocity.x, 2);
        // قوة الماء =  معامل السحب الديناميكي × كثافة الماء × مساحة السطح المتأثر × سرعة الماء للتربيع 


        let relativeVelocityZ = this.enviroment.velocity.clone();
        relativeVelocityZ.z += this.enviroment.waterSpeedZ;

        let waterForceZ = 0.5 * this.enviroment.cd * this.enviroment.waterDensity * this.enviroment.surfaceAreaSpace * Math.pow(this.enviroment.WaterVelocity.z, 2);

        let waterForceVector = new Vector3(parseFloat(waterForce.toFixed(8)), 0, parseFloat(waterForceZ.toFixed(8)));

        return waterForceVector;
    }

    calculateWaterForce_X_Z() {
        // let relativeVelocity = this.enviroment.velocity.clone();
        // console.log('relativeVelocity ' + relativeVelocity);
        // relativeVelocity.x += this.enviroment.waterSpeed_X;

        let waterForce = 0.5 * this.enviroment.cd * this.enviroment.waterDensity * this.enviroment.surfaceAreaSpace * (-1) * Math.pow(this.enviroment.WaterVelocity.x, 2);

        //z part
        // let relativeVelocityZ = this.enviroment.velocity.clone();
        // relativeVelocityZ.z += this.enviroment.waterSpeed_Z;

        let waterForceZ = 0.5 * this.enviroment.cd * this.enviroment.waterDensity * this.enviroment.surfaceAreaSpace * Math.pow(this.enviroment.WaterVelocity.z, 2);

        let waterForceVector = new Vector3(-waterForce.toFixed(8), 0, -waterForceZ.toFixed(8));
        return waterForceVector;
    }

    calculateWaterResistance() {
        // Calculate the relative velocity
        //
        let relativeVelocity = this.enviroment.velocity.clone().sub(this.enviroment.WaterVelocity);

        let spacFromY = this.enviroment.length * this.enviroment.width;
        let spacFromX = this.enviroment.hight * this.enviroment.length;
        let spacFromZ = this.enviroment.width * this.enviroment.hight;

        let waterResistanceMagnitudeY = 0.5 * this.enviroment.cd * this.enviroment.waterDensity * spacFromY * relativeVelocity.lengthSq();
        let waterResistanceMagnitudeX = 0.5 * this.enviroment.cd * this.enviroment.waterDensity * spacFromX * relativeVelocity.lengthSq();
        let waterResistanceMagnitudeZ = 0.5 * this.enviroment.cd * this.enviroment.waterDensity * spacFromZ * relativeVelocity.lengthSq();
        let waterResistanceVector = relativeVelocity.clone().normalize();
        waterResistanceVector.x *= waterResistanceMagnitudeX;
        waterResistanceVector.y *= waterResistanceMagnitudeY;
        waterResistanceVector.z *= waterResistanceMagnitudeZ;
        parseFloat(waterResistanceVector.x.toFixed(8));
        parseFloat(waterResistanceVector.y.toFixed(8));
        parseFloat(waterResistanceVector.z.toFixed(8));

        return waterResistanceVector;
    }

    calculateBernoly() {
        // let p = this.enviroment.p0 - 0.5 * this.enviroment.waterDensity * Math.pow((this.enviroment.velocity.lengthSq() - this.enviroment.v0), 2);
    }



    totalForce() {
        let tf = new Vector3(0, 0, 0);
        tf = tf.add(this.calculateWeightOfBoat());
        tf = tf.add(this.calculateBuoyantForce());
        console.log("total", tf);
        // tf = tf.add(this.calculateWaterResistance());
        // tf = tf.add(this.calculateWaterForceXZ());
        // tf = tf.add(this.calculateWaterForce_X_Z());

        return tf;
    }

    update() {
        var deltaTime = 0.01666666666666666666666666666667;
        var tf = this.totalForce();

        console.log("weightVector", this.calculateWeightOfBoat());
        console.log("BuoyantForce", this.calculateBuoyantForce());
        // console.log("waterResistanceVector", this.calculateWaterResistance());
        // console.log("WaterForceX", this.calculateWaterForceXZ());
        // console.log("WaterForceZ", this.calculateWaterForce_X_Z());




        var totalMass = this.enviroment.equipmentMass + this.enviroment.passengerMass;
        this.enviroment.accelration.copy(tf).divideScalar(totalMass);
        console.log("accelaration", this.enviroment.accelration);

        // Update velocity
        this.enviroment.velocity.add(this.enviroment.accelration.clone().multiplyScalar(deltaTime));
        console.log("velocity", this.enviroment.velocity);
        // Update position
        this.enviroment.position.add(this.enviroment.velocity.clone().multiplyScalar(deltaTime));
        parseFloat(this.enviroment.position.x.toFixed(8));
        parseFloat(this.enviroment.position.y.toFixed(8));
        parseFloat(this.enviroment.position.z.toFixed(8));
        console.log('newwwwwwwwwwwwwwwwwwwwww');
        // Apply damping to simulate water resistance
        // this.velocity.multiplyScalar(0.99);
    }


}


export default WaterForce;