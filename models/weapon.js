const db = require("../config/dbConfig.js");
const { findComposite } = require("../models/composition");
const table = "weapons";

class Weapon {
  constructor(payload) {
    this.id = payload.id;
    this.name= payload.name;
    this.power_level = payload.power_level;
    this.qty = payload.qty;
    this.status = payload.status;
  }

  static async findWeapon(id){
    try{
      let weapon = await db(table).where("id", id).first();
      return new Weapon(weapon)
    } catch (e) {
      throw new Error("Weapon not found")
    }
  }

  static async getPowerLevel(weaponID) {
    try{
      let weapon = await this.findWeapon(weaponID)
      // get all materials
      /*
      To prevent circular dependencies between weapon and material,
      we will write the queries to find the materials instead of using the find 
      function from the material model. Optimally, a separate function would have been used
      to reuse the code between the weapon and material model
      */
      let weaponMaterials = await db("weapon_materials").where("weapon_id", weapon.id)
      const promises = weaponMaterials.map((wpnMat) => {
        db("materials").where("id", wpnMat).whereNull("deleted_at").first()
      });
      const materialResponse = await Promise.all(promises);

      let totalSum = 0;
      for (const material of materialResponse) {
        let materialSum = await calculateComposite(material);
        totalSum += materialSum;
      };
      return totalSum
    } catch (e) {
      throw new Error("Error calculating power level")
    }
  }

  // Calculate the quantity per material and find the lowest one
  static async getMaxQuantity(weaponID) {
    try {
      // Get the weapon
      let weapon = await this.findWeapon(weaponID)
      // Find all materials made for the weapon
      let weaponMaterials = await db("weapon_materials").where("weapon_id", weapon.id)
      const promises = weaponMaterials.map(wpnMat => {
        db("materials").where("id", wpnMat.material_id).whereNull("deleted_at").first()
      });
      const materials = await Promise.all(promises);
      let qtyArray = []
      // Calculate the quantity of each material
      for (const material of materials) {
        qty = await this.calculateMaxQuantity(material)
        qtyArray.push(qty)
      }
      // return the smallest of the array
      return Math.min.apply(null, qtyArray)

    } catch(e){
      throw new Error(`Error fetching maximum quantity: ${e.message}`)
    }

  }

  static async patchWeapon(id, updatedValue){
    return await db(table).update(updatedValue).where("id",id)

  }

  // Function to recursively find every material of a composition and calculate
  // the power level
  static async calculateComposite(material) {
  let sum = material.powerLevel;
  let composite = await findComposite(material.id, 'material_id');
  if (Array.isArray(composite) && composite.length === 0) {
    return sum;
  } else {
    composite.forEach((mat) => {
      sum += material.qty * mat.powerLevel;
      calculateComposite(mat);
    });
    }
  }

  // Function to recursively calculate the quantity of each material in a weapon
  static async calculateMaxQuantity(material) {
    let sum = material.qty;
    let compositeSum = 0;
    let composite = await findComposite(material.id, 'parent_id');
    if (Array.isEmpty(composite)) {
      return sum;
    } else {
      for (const comp of composite) {
        let mat = await db("materials").where("id", comp.parent_id).whereNull("deleted_at").first()
        //find if there is any secondary composite of the original composite
        // since we need to sum all of them before dividing 
        let secondComposite = await findComposite(mat.id, 'parent_id')
        if (Array.isEmpty(secondComposite)){
          compositeSum += mat.qty / comp.qty;
        } else {
          calculateMaxQuantity(mat);
        }
      };
      return sum + compositeSum;
    }
  }
}

module.exports = Weapon;
