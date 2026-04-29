import Table from "../models/Table.js";

export const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity, status } = req.body;

    if (!tableNumber?.trim()) {
      return res.status(400).json({ message: "Table number is required" });
    }

    if (!Number.isFinite(capacity) || capacity < 1) {
      return res.status(400).json({ message: "Capacity must be at least 1" });
    }

    const table = await Table.create({
      tableNumber: tableNumber.trim(),
      capacity,
      status,
    });

    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ createdAt: -1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
