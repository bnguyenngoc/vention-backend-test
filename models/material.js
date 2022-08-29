const { default: knex } = require('knex');
const db = require('../config/dbConfig.js');
const table = 'materials';

class Material {
  constructor(payload) {
    this.id = payload.id;
    this.power_level = payload.power_level;
    this.qty = payload.qty;
    this.deleted_at = payload.deleted_at;
  }

  static async find(id) {
    try {
      let material = await db(table).where('id', id).first();
      return new Material(material);
    } catch (e) {
      throw new Error('Material not found');
    }
  }

  static async create(mat){
    try{
      let material = Material(mat);
      return await db(table).insert(material)
    } catch(e) {
      throw new Error('Error creating new material')
    }
  }

  // TO BE IMPLEMENTED
  static async update(id, mat) {
    try{
      let material = Material({...mat, id: id})
      return await db(table).update(material).where('id', material.id)
      //TODO
      // Update weapons, weapon_materials and compositions tables
    } catch(e){
      throw new Error('Error updating material')
    }
  }

  // TO BE IMPLEMENTED
  static async updateDeletedAt(id) {
    try{
      let response = await db(table).where('id', id).first();
      let material = Material(response);
      if (material.deleted_at){
        throw new Error('Material already deleted')
      } else {
        return await db(table).update('deleted_at', Date.now()).where('id', id)
        //TODO
        // Update weapons, weapon_materials and compositions tables
      }
    } catch(e){
      throw new Error('Error deleting material')
    }
  }
}

module.exports = Material;
