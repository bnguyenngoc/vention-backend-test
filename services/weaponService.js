const { find } = require('../models/material');


const WeaponService = () => {
  const getWeapon = async (id) => {
    return find(id);
  };

  return {
    getWeapon
  };
};

module.exports = WeaponService;