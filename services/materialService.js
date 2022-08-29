const { find, create, update, updateDeletedAt}= require('../models/material');

const MaterialService = () => {
  const getMaterial = async (id) => {
    return find(id);
  };
  const createMaterial = async (mat) => {
    return create(mat)
  };
  const updateMaterial = async (id, mat) => {
    return update(id, mat)
  }
  const deleteMaterial = async(id) => {
    return updateDeletedAt(id)
  }
  return {
    getMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial
  };
};

module.exports = MaterialService;
