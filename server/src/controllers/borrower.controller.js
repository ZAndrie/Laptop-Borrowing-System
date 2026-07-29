const prisma = require('../utils/db');

// Get all borrowers
const getAllBorrowers = async (req, res) => {
  try {
    const borrowers = await prisma.borrower.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(borrowers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Register a new borrower
const registerBorrower = async (req, res) => {
  try {
    const { studentId, firstName, lastName, middleName, course, yearLevel, college, email, contactNumber } = req.body;

    const existingBorrower = await prisma.borrower.findUnique({
      where: { studentId }
    });

    if (existingBorrower) {
      return res.status(400).json({ error: 'Student ID already registered' });
    }

    const newBorrower = await prisma.borrower.create({
      data: {
        studentId,
        firstName,
        lastName,
        middleName,
        course,
        yearLevel,
        college,
        email,
        contactNumber
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'REGISTER_BORROWER',
        description: `Registered new borrower: ${studentId} (${firstName} ${lastName})`,
      }
    });

    res.status(201).json(newBorrower);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update borrower details
const updateBorrower = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, firstName, lastName, middleName, course, yearLevel, college, email, contactNumber } = req.body;

    const updatedBorrower = await prisma.borrower.update({
      where: { id },
      data: {
        studentId,
        firstName,
        lastName,
        middleName,
        course,
        yearLevel,
        college,
        email,
        contactNumber
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'UPDATE_BORROWER',
        description: `Updated borrower details: ${updatedBorrower.studentId}`,
      }
    });

    res.json(updatedBorrower);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Lookup borrower by student ID (for auto-fill)
const lookupBorrower = async (req, res) => {
  try {
    const { studentId } = req.params;
    const borrower = await prisma.borrower.findUnique({
      where: { studentId }
    });
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }
    res.json(borrower);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllBorrowers,
  registerBorrower,
  updateBorrower,
  lookupBorrower
};
