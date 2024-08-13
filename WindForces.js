import { Vector3 } from "three";

import * as dat from "dat.gui";

class WindForces {
    constructor(enviroment) {

        this.enviroment = enviroment

        // this.startSimulation = false;


        // // متغيرات قوة دفع الهواء
        // this.surfaceArea = 8000;
        // this.airDensity = 1.225;
        // this.airThrustConstant = 1;
        // this.velocity = 1000;
        // this.position = new Vector3(0, 0, 0);
        // this.velocity = new Vector3(0, 0, 0);
        // this.accelration = new Vector3(0, 0, 0);

        // //متغيرات قوة مقاومة الهواء
        // this.airResistanceConstant = 1;
        // this.airDensity = 1.225;
        // this.surfaceArea = 15000;
        // this.velocity = 1000;
        // this.position = new Vector3(0, 0, 0);
        // this.velocity = new Vector3(0, 0, 0);
        // // this.accelration = new Vector3(0, 0, 0);

        // // متغيرات قوة الثقل
        // this.passengerMass = 300;//1000
        // this.equipmentMass = 7000 ;//14000

        // this.gravityConstant = 9.81;


        // this.gui = new dat.GUI();
        // // متغيرات قوة الثقل
        // this.gui
        //     .add(this, "passengerMass")
        //     .min(0)
        //     .max(10000)
        //     .step(1)
        //     .name("passengerMass");
        // this.gui
        //     .add(this, "equipmentMass")
        //     .min(0)
        //     .max(10000)
        //     .step(1)
        //     .name("equipmentMass");

        // this.gui
        //     .add(this, "startSimulation")

        //     .name("start simulation ");
    }

    calculateWindForceX() {
        let relativeVelocity = this.enviroment.velocity.clone();
        relativeVelocity.x += this.enviroment.windVelocity.x;

        let windForce = 0.5 * this.enviroment.airResistanceConstant * this.enviroment.airDensity * this.enviroment.surfaceArea * Math.pow(relativeVelocity.x, 2);
        // قوة الهواء =  مقاومة الهواء × كثافة الهواء × مساحة السطح المتأثر × سرعة الهواء للتربيع 

        let windForceVector = new Vector3(windForce, 0, 0);

        return windForceVector;
    }

    calculateWindForceZ() {
        let relativeVelocity = this.enviroment.velocity.clone();
        relativeVelocity.z += this.enviroment.windVelocity.z;

        let windForce = 0.5 * this.enviroment.airResistanceConstant * this.enviroment.airDensity * this.enviroment.surfaceArea * Math.pow(relativeVelocity.z, 2);

        let windForceVector = new Vector3(0, 0, windForce);

        return windForceVector;
    }

    calculateAirResistance() {
        var airDensityOutside = this.enviroment.airDensity;
        var v = this.enviroment.velocity.lengthSq();
        var airResistance =
            0.5 *
            this.enviroment.airResistanceConstant *
            airDensityOutside *
            this.enviroment.surfaceArea *
            v;
        var airResistanceVector;
        if (this.enviroment.position.y > 3750) {
            airResistanceVector = new Vector3(0, -airResistance, 0);
        } else {
            airResistanceVector = new Vector3(0, airResistance, 0);
        }
        return airResistanceVector;
    }


    totalForce() {
        var tf = new Vector3(0, 0, 0);
        tf = tf.add(this.calculateAirResistance());
        tf = tf.add(this.calculateWindForceX());
        tf = tf.add(this.calculateWindForceZ());
        // console.log("total wind", tf);
        return tf;
    }

    //     update() {
    //         var delta = 0.01666666666666666666666666666667;
    //         var tf = this.totalForce();

    //         console.log("airResistanceVector", this.calculateAirResistance());
    //         this.accelration = this.accelration.add(tf.multiplyScalar(delta).divideScalar(this.enviroment.totalMass));
    //         console.log("WindForceX", this.calculateWindForceX());
    //         console.log("WindForceZ", this.calculateWindForceZ());


    //         this.enviroment.velocity = this.enviroment.velocity.add(
    //             this.accelration.multiplyScalar(delta),
    //         );


    //         // if (!this.hasCollided) {
    //         this.enviroment.velocity = this.enviroment.velocity.add(
    //             this.enviroment.accelration.multiplyScalar(delta),
    //         );
    //         this.enviroment.position = this.enviroment.position.add(
    //             this.enviroment.velocity.multiplyScalar(delta),
    //         );


    //         if (this.enviroment.position.y <= 0) {
    //             this.enviroment.velocity.y *= -200; // ارتداد السرعة بمعامل تأثير
    //             this.enviroment.position.y = 10;
    //             this.enviroment.accelration.y = 0;


    //             // this.hasCollided = true; // تعيين المتغير للتصادم
    //             const endMessage = document.getElementById("endMessage");
    //             if (endMessage) {
    //                 endMessage.style.display = "block";
    //             }
    //         }
    //         // }
    //         console.log("Positon", this.enviroment.position);
    //     }
}

export default WindForces;