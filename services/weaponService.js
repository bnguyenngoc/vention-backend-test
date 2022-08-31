const { getMaxQuantity } = require("../models/weapon");

const WeaponService = () => {
  const getMaxQty = async (id) => {
    return getMaxQuantity(id)
  }

  return {
    getMaxQty,
  };
};

module.exports = WeaponService;
