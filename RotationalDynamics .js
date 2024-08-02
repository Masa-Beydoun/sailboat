import { Vector3 } from "three";

class RotationalDynamics {
    constructor(enviroment) {
        this.enviroment = enviroment;
        this.enviroment.momentOfInertia = this.calculateMomentOfInertia();
    }

    calculateMomentOfInertia() {
        const boatMass = this.enviroment.equipmentMass + this.enviroment.passengerMass;
        const length = this.enviroment.length;
        const width = this.enviroment.width;
        const height = this.enviroment.hight;

        const Ix = (1 / 12) * boatMass * (height ** 2 + width ** 2);
        const Iy = (1 / 12) * boatMass * (length ** 2 + height ** 2);
        const Iz = (1 / 12) * boatMass * (length ** 2 + width ** 2);

        return new Vector3(Ix, Iy, Iz);
    }

    calculateTorque() {
        // Placeholder for torque calculation, adjust as needed
        // Here, you might add forces that create rotation, e.g., wind forces acting on sails
        return new Vector3(0, 0, 0);
    }

    update(deltaTime) {
        this.torque = this.calculateTorque();

        // Angular acceleration = Torque / Moment of Inertia
        const angularAcceleration = this.torque.clone().divide(this.momentOfInertia);

        // Update angular velocity
        this.angularVelocity.add(angularAcceleration.multiplyScalar(deltaTime));

        // Update rotation
        this.rotation.x += this.angularVelocity.x * deltaTime;
        this.rotation.y += this.angularVelocity.y * deltaTime;
        this.rotation.z += this.angularVelocity.z * deltaTime;

        // Apply damping to simulate rotational resistance (e.g., from water)
        this.angularVelocity.multiplyScalar(0.9);
    }
}

export default RotationalDynamics;
