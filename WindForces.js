import { Vector3 } from "three";

import * as dat from "dat.gui";

class WindForces {
    constructor() {
        this.startSimulation = false;

        this.windSpeedX = 1;
        this.windSpeed_X = 1;
        this.windSpeedZ = 1;
        this.windSpeed_Z = 1;


        // متغيرات قوة دفع الهواء
        this.surfaceArea = 8000;
        this.airDensity = 1.225;
        this.airThrustConstant = 1;
        this.velocity = 1000;
        this.position = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
        this.accelration = new Vector3(0, 0, 0);

        //متغيرات قوة مقاومة الهواء
        this.airResistanceConstant = 1;
        this.airDensity = 1.225;
        this.surfaceArea = 15000;
        this.velocity = 1000;
        this.position = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
        this.accelration = new Vector3(0, 0, 0);

        // متغيرات قوة الثقل
        this.passengerMass = 1000;
        this.equipmentMass = 14000;

        this.gravityConstant = 9.81;


        this.gui = new dat.GUI();
        // متغيرات قوة الثقل
        this.gui
            .add(this, "passengerMass")
            .min(0)
            .max(100000)
            .step(1)
            .name("passengerMass");
        this.gui
            .add(this, "equipmentMass")
            .min(0)
            .max(100000)
            .step(1)
            .name("equipmentMass");


        this.gui
            .add(this, "windSpeedX")
            .min(0)
            .max(1000)
            .step(1)
            .name("windSpeedX ");
        this.gui
            .add(this, "windSpeedZ")
            .min(0)
            .max(1000)
            .step(1)
            .name("windSpeedZ ");
        this.gui
            .add(this, "windSpeed_X")
            .min(0)
            .max(1000)
            .step(1)
            .name("windSpeed-X ");
        this.gui
            .add(this, "windSpeed_Z")
            .min(0)
            .max(1000)
            .step(1)
            .name("windSpeed-Z ");
        this.gui
            .add(this, "startSimulation")

            .name("start simulation ");
    }



    calculateWindForceX() {
        let relativeVelocity = this.velocity.clone();
        relativeVelocity.x += this.windSpeedX;

        let windForce = 0.5 * this.airResistanceConstant * this.airDensity * this.surfaceArea * Math.pow(relativeVelocity.x, 2);
        // قوة الهواء =  مقاومة الهواء × كثافة الهواء × مساحة السطح المتأثر × سرعة الهواء للتربيع 

        let windForceVector = new Vector3(windForce, 0, 0);

        return windForceVector;
    }

    calculateWindForce_X() {
        let relativeVelocity = this.velocity.clone();
        relativeVelocity.x += this.windSpeed_X;

        let windForce = 0.5 * this.airResistanceConstant * this.airDensity * this.surfaceArea * Math.pow(relativeVelocity.x, 2);

        let windForceVector = new Vector3(-windForce, 0, 0);

        return windForceVector;
    }

    calculateWindForceZ() {
        let relativeVelocity = this.velocity.clone();
        relativeVelocity.z += this.windSpeedZ;

        let windForce = 0.5 * this.airResistanceConstant * this.airDensity * this.surfaceArea * Math.pow(relativeVelocity.z, 2);

        let windForceVector = new Vector3(0, 0, windForce);

        return windForceVector;
    }
    calculateWindForce_Z() {
        let relativeVelocity = this.velocity.clone();
        relativeVelocity.z += this.windSpeed_Z;

        let windForce = 0.5 * this.airResistanceConstant * this.airDensity * this.surfaceArea * Math.pow(relativeVelocity.z, 2);

        let windForceVector = new Vector3(0, 0, -windForce);

        return windForceVector;
    }


    calculateAirResistance() {
        var airDensityOutside = this.airDensity;
        var airResistance =
            0.5 *
            this.airResistanceConstant *
            airDensityOutside *
            this.surfaceArea *
            this.velocity.lengthSq();
        var airResistanceVector;
        if (this.position.y > 3750) {
            airResistanceVector = new Vector3(0, -airResistance, 0);
        } else {
            airResistanceVector = new Vector3(0, airResistance, 0);
        }
        return airResistanceVector;
    }


    calculateWeightOfBoat() {
        // كتلة الحمولة = كتلة الركاب + كتلة المعدات
        var boatMass = this.passengerMass + this.equipmentMass;

        // قوة الثقل = كتلة المنطاد × ثابت الجاذبية الأرضية
        var weightOfBoat = boatMass * this.gravityConstant;
        var weightVector = new Vector3(0, -weightOfBoat, 0);
        return weightVector;
    }

    totalForce() {
        var tf = new Vector3(0, 0, 0);
        tf = tf.add(this.calculateWeightOfBoat());
        tf = tf.add(this.calculateAirResistance());
        tf = tf.add(this.calculateWindForceX());
        tf = tf.add(this.calculateWindForceZ());
        tf = tf.add(this.calculateWindForce_X());
        tf = tf.add(this.calculateWindForce_Z());

        return tf;
    }

    update() {
        var delta = 0.01666666666666666666666666666667;
        var tf = this.totalForce();
        console.log("weightVector", this.calculateWeightOfBoat());
        console.log("airResistanceVector", this.calculateAirResistance());
        this.accelration = this.accelration.add(tf.multiplyScalar(delta).divideScalar(this.equipmentMass + this.passengerMass));
        console.log("WindForceX", this.calculateWindForceX());
        console.log("WindForceZ", this.calculateWindForceZ());


        this.velocity = this.velocity.add(
            this.accelration.multiplyScalar(delta),
        );


        // if (!this.hasCollided) {
        this.velocity = this.velocity.add(
            this.accelration.multiplyScalar(delta),
        );
        this.position = this.position.add(
            this.velocity.multiplyScalar(delta),
        );
        if (this.position.y <= 0) {
            this.velocity.y *= -200; // ارتداد السرعة بمعامل تأثير
            this.position.y = 10;
            this.accelration.y = 0;
            // this.hasCollided = true; // تعيين المتغير للتصادم
            const endMessage = document.getElementById("endMessage");
            if (endMessage) {
                endMessage.style.display = "block";
            }
        }
        // }
        console.log("Positon", this.position);
    }
}

export default WindForces;