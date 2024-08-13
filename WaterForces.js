import { Vector3 } from "three";

import Enviroment from "./Environment";
import { lerp } from "three/src/math/MathUtils.js";

class WaterForce {

    constructor(enviroment) {
        this.enviroment = enviroment;
    }




    calculateBuoyantForce() {
        //قوة الطفو = كثافة المي * ثابت الجاذبية الأرضية * حجم السائل المزاح
        let yPosition = this.enviroment.position.y;

        if (yPosition > this.enviroment.hight / 2) {
            this.enviroment.boatDepth = 0;
        }
        else if (yPosition > 0) {
            this.enviroment.boatDepth = parseFloat((this.enviroment.hight / 2 - yPosition).toFixed(8));
        }
        else {
            this.enviroment.boatDepth = parseFloat((Math.min(this.enviroment.hight, this.enviroment.hight / 2 + Math.abs(yPosition))).toFixed(8));
        }

        let submergedVolume = this.enviroment.boatDepth * this.enviroment.length * this.enviroment.width;
        // Update the displaced volume
        this.enviroment.besideVolume = submergedVolume;

        let buoyantForce = this.enviroment.waterDensity * this.enviroment.gravityConstant * submergedVolume;

        let maxBuoyantForce = this.enviroment.waterDensity * this.enviroment.gravityConstant * this.enviroment.length * this.enviroment.width * this.enviroment.hight;
        buoyantForce = Math.min(buoyantForce, maxBuoyantForce);
        return new Vector3(0, parseFloat(buoyantForce.toFixed(8)), 0);
    }

    calculateWeightOfBoat() {
        // كتلة الحمولة = كتلة الركاب + كتلة المعدات
        var weightOfBoat = this.enviroment.totalMass * this.enviroment.gravityConstant;
        return new Vector3(0, parseFloat(-weightOfBoat.toFixed(8)), 0);
    }

    calculateWaterForceZ() {

        let relativeVelocity = this.enviroment.WaterVelocity.clone();
        // relativeVelocity.z += this.enviroment.velocity.z;

        let waterForceZ = 0.5 * this.enviroment.cd * this.enviroment.waterDensity * this.enviroment.surfaceAreaSpace * Math.pow(relativeVelocity.z, 2);
        if (this.enviroment.WaterVelocity.z < 0) waterForceZ *= -1;

        waterForceZ = parseFloat(waterForceZ.toFixed(8));
        let waterForceVector = new Vector3(0, 0, waterForceZ);

        return waterForceVector;

    }

    calculateWaterForceX() {

        let space = this.enviroment.width * this.enviroment.length;

        let relativeVelocity = this.enviroment.WaterVelocity.clone();
        // relativeVelocity.x += this.enviroment.velocity.x;

        relativeVelocity.x = parseFloat(relativeVelocity.x.toFixed(8));

        let waterForceX = 0.5 * this.enviroment.cd * this.enviroment.waterDensity * space * Math.pow(relativeVelocity.x, 2);
        waterForceX = parseFloat(waterForceX.toFixed(8));

        if (this.enviroment.WaterVelocity.x < 0) waterForceX *= -1;

        let waterForceVector = new Vector3(waterForceX, 0, 0);
        // console.log("water force x", waterForceVector);
        return waterForceVector;
    }


    calculateWaterResistance() {
        // سرعة القارب بالنسبة لسرعة المياه
        let relativeVelocity = this.enviroment.velocity.clone().sub(this.enviroment.WaterVelocity);

        // المساحات العرضية للقارب في اتجاهات المحاور المختلفة
        let areaY = this.enviroment.length * this.enviroment.width;
        if (this.enviroment.boatDepth == 0) areaY = 0;
        let areaX = this.enviroment.boatDepth * this.enviroment.length;
        let areaZ = this.enviroment.width * this.enviroment.boatDepth;

        // حساب قوة مقاومة المياه في كل اتجاه
        let waterResistanceMagnitudeX = 0.5 * this.enviroment.cd * this.enviroment.waterDensity * areaX * Math.pow(relativeVelocity.x, 2);
        let waterResistanceMagnitudeY = 0.5 * this.enviroment.cd * this.enviroment.waterDensity * areaY * Math.pow(relativeVelocity.y, 2);
        let waterResistanceMagnitudeZ = 0.5 * this.enviroment.cd * this.enviroment.waterDensity * areaZ * Math.pow(relativeVelocity.z, 2);


        // اتجاه قوة مقاومة المياه يكون معاكسا لاتجاه سرعة القارب بالنسبة للماء
        let waterResistanceVector = new Vector3(
            -Math.sign(relativeVelocity.x) * waterResistanceMagnitudeX,
            -Math.sign(relativeVelocity.y) * waterResistanceMagnitudeY,
            -Math.sign(relativeVelocity.z) * waterResistanceMagnitudeZ
        );

        // تقليل الأعداد العشرية إلى 8 خانات بعد الفاصلة
        waterResistanceVector.x = parseFloat(waterResistanceVector.x.toFixed(8));
        waterResistanceVector.y = parseFloat(waterResistanceVector.y.toFixed(8));
        waterResistanceVector.z = parseFloat(waterResistanceVector.z.toFixed(8));

        return waterResistanceVector;
    }

    calculateBernoly() {
        // let p = this.enviroment.p0 - 0.5 * this.enviroment.waterDensity * Math.pow((this.enviroment.velocity.lengthSq() - this.enviroment.v0), 2);
    }



    totalForce() {
        let tf = new Vector3(0, 0, 0);
        tf.add(this.calculateBuoyantForce());
        tf.add(this.calculateWeightOfBoat());
        tf.add(this.calculateWaterResistance());
        tf.add(this.calculateWaterForceZ());
        tf.add(this.calculateWaterForceX());
        return tf;
    }

    update() {
        var deltaTime = 0.01666666666666666666666666666667;
        var tf = this.totalForce();

        console.log("weightVector", this.calculateWeightOfBoat());
        console.log("BuoyantForce", this.calculateBuoyantForce());
        console.log("waterResistanceVector", this.calculateWaterResistance());
        console.log("WaterForceXZ", this.calculateWaterForceXZ())


        // this.enviroment.accelration.copy(tf).divideScalar(this.enviroment.totalMass);
        // Update velocity
        // this.enviroment.velocity.add(this.enviroment.accelration.clone().multiplyScalar(deltaTime));
        // Update position
        // this.enviroment.position.add(this.enviroment.velocity.clone().multiplyScalar(deltaTime));
        // Apply damping to simulate water resistance
        // this.enviroment.velocity.multiplyScalar(0.9);
    }


}


export default WaterForce;