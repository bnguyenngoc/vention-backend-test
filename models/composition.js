const db = require('../config/dbConfig.js');
const Material = require('./material.js');
const table = compositions

//parent_id, material_id, qty

class Composition {
    constructor(payload){
        this.parent_id = payload.parent_id;
        this.material_id = payload.material_id
        this.qty = qty
    }

    //TODO, returns array of objects
    static async findParent(id){
        try {
            let composition = await db(table).where('parent_id', id).first();
            return Composition(composition)
        } catch (e){
            throw new Error('Composition not found')
        }
    }
}

module.exports = Composition