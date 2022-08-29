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
   * @param {Array<string>} array an array containing the ids of all materials
   * @return {number} the powerlevel
   *
   */
  async getPowerLevel(array) {
    // get all materials
    const promises = array.map((id) => find(id));
    const materialResponse = await Promise.all(promises);

    let totalSum = 0;
    materialResponse.foreach((material) => {
      let materialSum = calculateComposite(material);
      totalSum += materialSum;
    });
    return totalSum
  }

  /**
   * Returns power level of a weapon
   * @param {Array<string>} array an array containing the ids of all materials
   * @return {number} the Maximum Quantity
   *
   */
  async getMaxQuantity(array) {
    const promises = array.map(id => find(id));
    const materialResponse = await Promise.all(promises);
    let qtyArray = []
    materialResponse.forEach(material => {
      let qty = calculateMaxQuanity(material);
      qtyArray.push(qty)
    })
    return Math.max.apply(null, qtyArray)
  }
}
//findParent will return an array of materials linked to the composite
async function calculateComposite(material) {
  let sum = material.powerLevel;
  let composite = findParent(material.id);
  if (Array.isArray(composite) && composite.length === 0) {
    return sum;
  } else {
    composite.forEach((mat) => {
      sum += material.qty * mat.powerLevel;
      calculateComposite(mat);
    });
  }
}

//TODO finish recursive quantity calculator
async function calculateMaxQuanity(material) {
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
