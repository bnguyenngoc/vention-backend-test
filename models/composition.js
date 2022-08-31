const db = require("../config/dbConfig.js");
const Material = require("./material.js");
const table = "compositions";

//parent_id, material_id, qty

class Composition {
  constructor(payload) {
    this.parent_id = payload.parent_id;
    this.material_id = payload.material_id;
    this.qty = qty;
  }

  //Find all composition based on if the search is for "parent_id" or "material_id"
  static async findComposite(id, parentOrChild) {
    try {
      let composition = await db(table).where(parentOrChild, id);
      return new Composition(composition);
    } catch (e) {
      throw new Error("Composition not found");
    }
  }
}

module.exports = Composition;
