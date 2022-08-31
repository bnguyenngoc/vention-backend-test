const knexfile = require("../knexfile");
const knex = require("knex")(knexfile.development);
const db = require("../config/dbConfig.js");
const table = "materials";
const { patchWeapon, getPowerLevel } = require("./weapon");
const { findComposite } = require("./composition");
class Material {
  constructor(payload) {
    this.id = payload.id;
    this.power_level = payload.power_level;
    this.qty = payload.qty;
    this.deleted_at = payload.deleted_at;
  }

  /**
   * Note:
   * a material that has a deleted_at date will be considered deleted, and thus should not be
   * appearing while searching
   *
   */
  static async find(id) {
    try {
      let material = await db(table).where("id", id).whereNull("deleted_at").first();
      return new Material(material);
    } catch (e) {
      throw new Error("Material not found");
    }
  }

  static async findAll(query) {
    try {
      let response = await db(table).where(query).whereNull("deleted_at");
      let materials = [];
      if (Array.isArray(response) && response.length !== 0) {
        response.forEach((mat) => {
          let material = new Material(mat);
          materials.push(material);
        });
      } else {
        throw new Error("No materials found");
      }
      return materials;
    } catch (e) {
      throw new Error("Error getting all materials");
    }
  }

  /**
   * Note:
   * Not sure if intentional or not, but because the id is forced in the seed file, psql cannot
   * auto-increment properly and thus you need to add the id in the api body request. So i didn't
   * change the seed file in case you are not suppose to auto-increment the id
   */
  static async create(mat) {
    try {
      let { id, power_level, qty } = mat;
      let material = new Material({ id, power_level, qty, deleted_at: null });
      // id is the primary key and it therefore needed. the rest of the keys in the migration file
      // are nullable and thus can be empty
      if (material.id === undefined || material.id === null) {
        throw new Error("missing id in request");
      }
      let dbID = await db(table).returning("id").insert(material);
      return dbID[0];
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * Note:
   * Just like the create function, we will suppose that the id is not an auto-increment from psql
   * and that the user will have the ability to change the id of a material as well as the power_level
   * and qty. deleted_at will still be forced to null since it is reserved for the the delete function
   */
  static async update(id, mat) {
    try {
      let response = db(table).where("id", id).whereNull("deleted_at").first();
      if (!response) {
        throw new Error("Material to update does not exist");
      }
      // update values to be changed and keep current value if user didn't add anything
      let oldMaterial = new Material(response);
      let material = new Material({ ...mat, deleted_at: null });
      for (let [key, value] of Object.entries(material)) {
        if (value === undefined || value === null) {
          material[key] = oldMaterial[key];
        }
      }
      let dbID = await db(table).returning("id").update(material).where("id", id);
      let newID = dbID[0];
      /*
      NOTE: error in the getPowerLevel function preventing this part to work, so it is commented out for now
      // Update weapon_materials table if material_id has changed
      if (newID !== oldMaterial.id) {
        await db("weapon_materials").update({ material_id: dbID }).where("material_id", oldMaterial.id);
      }
      // if power level has changed, update all weapons using the material
      // NOTE: this currently only covers base material and not composition
      if (material.power_level !== oldMaterial.power_level) {
        let weaponMaterials = await db("weapon_materials").where("material_id", newID);
        let weaponsPromises = weaponMaterials.map((wpnMat) => {
          getPowerLevel(wpnMat.weapon_id);
        });
        await Promise.all(weaponsPromises);
      }
      */
      return newID;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * Note:
   * I named it updateDeletedAt since there is still the possiblity that an admin would want to fully delete
   * a material and not just update the deleted_at key.
   *
   * recursively go through the composition table and update all parent_id with a deleted_at timestamp. once
   * the material doesn't have any more parent, search through every weapon in the weapon_materials table to see
   * if a weapon uses that material and update weapon status to "broken".
   */
  static async updateDeletedAt(id) {
    try {
      let response = await db(table).where("id", id).first();
      let material = new Material(response);
      if (material.deleted_at) {
        throw new Error("Material already deleted");
      } else {
        let composition = await db("composition").where("material_id", id);
        if (Array.isArray(composition) && composition.length === 0) {
          //mark all weapons using the material as broken
          let weapon_materials = await db("weapon_materials").where("material_id", id);
          const promises = weapon_materials.map((wm) => {
            db("weapons").update({ status: "broken" }).where(wm.weapon_id);
            patchWeapon(wm.weapon_id, { status: "broken" });
          });
          await Promise.all(promises);
        } else {
          composition.forEach((composite) => {
            this.updateDeletedAt(composite.material_id);
          });
        }
        return await db(table).update("deleted_at", knex.fn.now()).where("id", id);
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

module.exports = Material;
