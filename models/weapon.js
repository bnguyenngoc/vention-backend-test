const db = require("../config/dbConfig.js");
const { find } = require("../models/material");
const { findParent } = require("../models/composition");
const table = "weapons";

class Weapon {
  constructor(payload) {
    this.id = payload.id;
    this.name= payload.name;
    this.power_level = payload.power_level;
    this.qty = payload.qty;
    this.status = payload.status;
  }

  /**
   * Returns power level of a weapon
   * @param {Array<string>} array an array containing all materials
   * @return {number} the powerlevel
   *
   */
  async getPowerLevel(array) {
    // get all materials
    const promises = array.map((id) => find(id));
    const materialResponse = await Promise.all(promises);

    totalSum = 0;
    materialResponse.foreach((material) => {
      materialSum = calculateComposite(material);
      totalSum += materialSum;
    });
  }
}
async function calculateComposite(material) {
  sum = material.powerLevel;
  composite = findParent(material.id);
  if (Array.isEmpty(composite)) {
    return sum;
  } else {
    composite.forEach((mat) => {
      sum += material.qty * mat.powerLevel;
      calculateComposite(mat);
    });
  }
}
module.exports = Weapon;
