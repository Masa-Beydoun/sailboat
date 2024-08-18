import { Vector3 } from "three";

import * as dat from "dat.gui";

class WindForces {
    constructor(environment) {
        this.environment = environment
    }

    calculateWindForceX() {
        // let relativeVelocity = this.environment.velocity.clone();
        // relativeVelocity.x += this.environment.windVelocity.x;
        let relativeVelocity = this.environment.windVelocity;

        let windForce = 0.5 * this.environment.airResistanceConstant * this.environment.airDensity * this.environment.surfaceArea * Math.pow(relativeVelocity.x, 2);
        // قوة الهواء =  مقاومة الهواء × كثافة الهواء × مساحة السطح المتأثر × سرعة الهواء للتربيع 
        if (this.environment.windVelocity.x > 0) windForce *= -1;

        let windForceVector = new Vector3(windForce, 0, 0);

        return windForceVector;
    }

    calculateWindForceZ() {
        // let relativeVelocity = this.environment.velocity.clone();
        // relativeVelocity.z += this.environment.windVelocity.z;
        let relativeVelocity = this.environment.windVelocity;

        let windForce = 0.5 * this.environment.airResistanceConstant * this.environment.airDensity * this.environment.surfaceArea * Math.pow(relativeVelocity.z, 2);

        if (this.environment.windVelocity.z > 0) windForce *= -1;
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
        let airResistanceVector = new Vector3(0, airResistance, 0);

        return airResistanceVector;
    }


    totalForce() {
        var tf = new Vector3(0, 0, 0);
        tf = tf.add(this.calculateAirResistance());
        tf = tf.add(this.calculateWindForceX());
        tf = tf.add(this.calculateWindForceZ());
        return tf;
    }
}

export default WindForces;