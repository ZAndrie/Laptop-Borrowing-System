const prisma = require('../utils/db');

// Get all laptops (Available for both roles)
const getAllLaptops = async (req, res) => {
  try {
    const laptops = await prisma.laptop.findMany({
      orderBy: { assetNumber: 'asc' },
    });
    res.json(laptops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add a new laptop (Librarian only)
const addLaptop = async (req, res) => {
  try {
    const {
      assetNumber, name, serialNumber, brand, model, processor, ram,
      storage, operatingSystem, purchaseDate, condition, status, location
    } = req.body;

    const finalSerialNumber = serialNumber?.trim() || null;

    const existingLaptop = await prisma.laptop.findFirst({
      where: {
        OR: [
          { assetNumber },
          ...(finalSerialNumber ? [{ serialNumber: finalSerialNumber }] : [])
        ]
      }
    });

    if (existingLaptop) {
      return res.status(400).json({ error: 'Laptop with this Asset Number or Serial Number already exists' });
    }

    const newLaptop = await prisma.laptop.create({
      data: {
        assetNumber,
        name,
        serialNumber: finalSerialNumber,
        brand: brand?.trim() || null,
        model: model?.trim() || null,
        operatingSystem: operatingSystem?.trim() || null,
        condition: condition || 'GOOD',
        status: status || 'AVAILABLE',
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'ADD_LAPTOP',
        description: `Added new laptop to inventory: ${assetNumber} (${brand} ${model})`,
      }
    });

    res.status(201).json(newLaptop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update laptop information (Librarian only)
const updateLaptop = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      assetNumber, name, serialNumber, brand, model, processor, ram,
      storage, operatingSystem, purchaseDate, condition, status, location
    } = req.body;

    const finalSerialNumber = serialNumber?.trim() || null;

    const updatedLaptop = await prisma.laptop.update({
      where: { id },
      data: {
        assetNumber,
        name,
        serialNumber: finalSerialNumber,
        brand: brand?.trim() || null,
        model: model?.trim() || null,
        operatingSystem: operatingSystem?.trim() || null,
        condition,
        status,
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'UPDATE_LAPTOP',
        description: `Updated laptop details: ${updatedLaptop.assetNumber}`,
      }
    });

    res.json(updatedLaptop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a laptop (Librarian only)
const deleteLaptop = async (req, res) => {
  try {
    const { id } = req.params;

    const laptop = await prisma.laptop.findUnique({ where: { id } });
    if (!laptop) return res.status(404).json({ error: 'Laptop not found' });

    if (laptop.status === 'BORROWED') {
      return res.status(400).json({ error: 'Cannot delete a laptop that is currently borrowed.' });
    }

    await prisma.laptop.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'DELETE_LAPTOP',
        description: `Removed laptop from inventory: ${laptop.assetNumber}`,
      }
    });

    res.json({ message: 'Laptop deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllLaptops,
  addLaptop,
  updateLaptop,
  deleteLaptop,
};
