const Service = require("../models/Service");

exports.getAll = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 GET NEXT SERVICE ID
exports.getNextId = async (req, res) => {
  try {
    const lastService = await Service.findOne().sort({ id: -1 });

    let nextNum = 101;
    if (lastService?.id) {
      nextNum = parseInt(lastService.id.split("-")[1]) + 1;
    }

    res.json({ nextId: `SER-${nextNum}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const lastService = await Service.findOne().sort({ id: -1 });

    let nextNum = 101;
    if (lastService?.id) {
      nextNum = parseInt(lastService.id.split("-")[1]) + 1;
    }

    await Service.create({
      ...req.body,
      id: `SER-${nextNum}`
    });

    res.json({ message: "Service saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Service.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Service updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
