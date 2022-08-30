const {
  find,
  findAll,
  create,
  update,
  updateDeletedAt,
} = require("../models/material");

const MaterialService = () => {
  const getMaterial = async (id) => {
    return find(id);
  };
  const getAllMaterials = async () => {
    return findAll();
  };
  const createMaterial = async (mat) => {
    return create(mat);
  };
  const updateMaterial = async (id, mat) => {
    return update(id, mat);
  };
  const deleteMaterial = async (id) => {
    return updateDeletedAt(id);
  };
  return {
    getMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    getAllMaterials,
  };
};

module.exports = MaterialService;
