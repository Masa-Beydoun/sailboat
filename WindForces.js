import { Vector3 } from "three";

import * as dat from "dat.gui";

class WindForces {
    constructor(environment) {
        this.environment = environment
    }

    calculateWindForceX() {
        let relativeVelocity = this.environment.velocity.clone();
        relativeVelocity.x += this.environment.windVelocity.x;

        // console.log("relative velocity", relativeVelocity);
        // console.log("airResistanceConstant", this.environment.airResistanceConstant);
        // console.log("air den ", this.environment.airDensity);

        let windForce = 0.5 * this.environment.airResistanceConstant * this.environment.airDensity * this.environment.surfaceArea * Math.pow(relativeVelocity.x, 2);
        // قوة الهواء =  مقاومة الهواء × كثافة الهواء × مساحة السطح المتأثر × سرعة الهواء للتربيع 

        let windForceVector = new Vector3(windForce, 0, 0);

        return windForceVector;
    }

    calculateWindForceZ() {
        let relativeVelocity = this.environment.velocity.clone();
        relativeVelocity.z += this.environment.windVelocity.z;

        let windForce = 0.5 * this.environment.airResistanceConstant * this.environment.airDensity * this.environment.surfaceArea * Math.pow(relativeVelocity.z, 2);

        let windForceVector = new Vector3(0, 0, windForce);

        return windForceVector;
    }

    calculateAirResistance() {
        var airDensityOutside = this.environment.airDensity;
        var v = this.environment.velocity.lengthSq();
        var airResistance =
            0.5 *
            this.environment.airResistanceConstant *
            airDensityOutside *
            this.environment.surfaceArea *
            v;
        var airResistanceVector;
        if (this.environment.position.y > 3750) {
            airResistanceVector = new Vector3(0, -airResistance, 0);
        } else {
            airResistanceVector = new Vector3(0, airResistance, 0);
        }
        return airResistanceVector;
    }


    totalForce() {
        var tf = new Vector3(0, 0, 0);
        tf = tf.add(this.calculateAirResistance());
        // console.log("air rese", this.calculateAirResistance());
        tf = tf.add(this.calculateWindForceX());
        // console.log("wind force x", this.calculateWindForceX());
        tf = tf.add(this.calculateWindForceZ());
        // console.log("wind force z", this.calculateWindForceZ());
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