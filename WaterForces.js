import { Vector3 } from "three";

import Enviroment from "./Environment";
import { lerp } from "three/src/math/MathUtils.js";

class WaterForce {

    constructor(enviroment) {
        this.environment = enviroment;
    }



    calculateBuoyantForce() {
        //قوة الطفو = كثافة المي * ثابت الجاذبية الأرضية * حجم السائل المزاح
        let yPosition = this.environment.position.y;

        if (yPosition > this.environment.hight / 2) {
            this.environment.boatDepth = 0;
        }
        else if (yPosition > 0) {
            this.environment.boatDepth = parseFloat((this.environment.hight / 2 - yPosition).toFixed(8));
        }
        else {
            this.environment.boatDepth = parseFloat((Math.min(this.environment.hight, this.environment.hight / 2 + Math.abs(yPosition))).toFixed(8));
        }

        let submergedVolume = this.environment.boatDepth * this.environment.length * this.environment.width;
        // Update the displaced volume
        this.environment.besideVolume = submergedVolume;

        let buoyantForce = this.environment.waterDensity * this.environment.gravityConstant * submergedVolume;

        let maxBuoyantForce = this.environment.waterDensity * this.environment.gravityConstant * this.environment.length * this.environment.width * this.environment.hight;
        buoyantForce = Math.min(buoyantForce, maxBuoyantForce);
        return new Vector3(0, parseFloat(buoyantForce.toFixed(8)), 0);
    }

    calculateWeightOfBoat() {
        // كتلة الحمولة = كتلة الركاب + كتلة المعدات
        var weightOfBoat = this.environment.totalMass * this.environment.gravityConstant;
        return new Vector3(0, parseFloat(-weightOfBoat.toFixed(8)), 0);
    }

    calculateWaterForceZ() {

        let relativeVelocity = this.environment.WaterVelocity.clone();
        // relativeVelocity.z += this.enviroment.velocity.z;

        let waterForceZ = 0.5 * this.environment.cd * this.environment.waterDensity * this.environment.surfaceAreaSpace * Math.pow(relativeVelocity.z, 2);
        if (this.environment.WaterVelocity.z < 0) waterForceZ *= -1;

        waterForceZ = parseFloat(waterForceZ.toFixed(8));
        let waterForceVector = new Vector3(0, 0, waterForceZ);

        return waterForceVector;

    }

    calculateWaterForceX() {

        let space = this.environment.width * this.environment.length;

        let relativeVelocity = this.environment.WaterVelocity.clone();
        // relativeVelocity.x += this.enviroment.velocity.x;

        relativeVelocity.x = parseFloat(relativeVelocity.x.toFixed(8));

        let waterForceX = 0.5 * this.environment.cd * this.environment.waterDensity * space * Math.pow(relativeVelocity.x, 2);
        waterForceX = parseFloat(waterForceX.toFixed(8));

        if (this.environment.WaterVelocity.x < 0) waterForceX *= -1;

        let waterForceVector = new Vector3(waterForceX, 0, 0);
        // console.log("water force x", waterForceVector);
        return waterForceVector;
    }


    calculateWaterResistance() {
        // سرعة القارب بالنسبة لسرعة المياه
        let relativeVelocity = this.environment.velocity.clone().sub(this.environment.WaterVelocity);

        // المساحات العرضية للقارب في اتجاهات المحاور المختلفة
        let areaY = this.environment.length * this.environment.width;
        if (this.environment.boatDepth == 0) areaY = 0;
        let areaX = this.environment.boatDepth * this.environment.length;
        let areaZ = this.environment.width * this.environment.boatDepth;

        // حساب قوة مقاومة المياه في كل اتجاه
        let waterResistanceMagnitudeX = 0.5 * this.environment.cd * this.environment.waterDensity * areaX * Math.pow(relativeVelocity.x, 2);
        let waterResistanceMagnitudeY = 0.5 * this.environment.cd * this.environment.waterDensity * areaY * Math.pow(relativeVelocity.y, 2);
        let waterResistanceMagnitudeZ = 0.5 * this.environment.cd * this.environment.waterDensity * areaZ * Math.pow(relativeVelocity.z, 2);


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
        console.log("WaterForceXZ", this.calculateWaterForceX())
        console.log("WaterForceXZ", this.calculateWaterForceZ())


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