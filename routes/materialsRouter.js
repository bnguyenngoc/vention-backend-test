const router = require("express").Router();

const MaterialService = require("../services/materialService.js");

// IMPLEMENT CRUD FOR WEAPON
router.get("/:id", async (req, res) => {
  try {
    const material = await MaterialService().getMaterial(req.params.id);
    res.status(200).json(material);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const materials = await MaterialService().getAllMaterials();
    res.status(200).json(materials);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body)
    const id = await MaterialService().createMaterial(req.body);
    res.status(201).json({ message: "New material created!", id: id });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = await MaterialService().updateMaterial(req.params.id, req.body);
    res.status(301).json({ message: "Material updated!", id });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const powerLevel = req.body.power_level;
    await MaterialService().updateMaterial(req.params.id, {
      power_level: powerLevel,
    });
    res.status(301).json({ message: "Power level updated!" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await MaterialService().deleteMaterial(req.params.id);
    res.status(202).json({ message: "Material deleted!" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});
module.exports = router;
