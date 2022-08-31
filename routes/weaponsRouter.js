const router = require("express").Router();

const WeaponService = require("../services/weaponService")

router.get("/:id/maxquantity", async (req, res) => {
    try{
        const maxQty = await WeaponService().getMaxQty(req.params.id);
        res.status(200).json(maxQty)
    } catch (err){
        res.status(500).json({err: err.message})
    }
})

module.exports = router