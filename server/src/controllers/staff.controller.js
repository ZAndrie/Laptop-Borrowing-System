const bcrypt = require('bcrypt');
const prisma = require('../utils/db');

const getAllStaff = async (req, res) => {
  try {
    const staff = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new staff account
const createStaff = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    // Check if email exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'STAFF',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'CREATE_STAFF',
        description: `Created new staff account: ${email}`,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update staff details
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'UPDATE_STAFF',
        description: `Updated staff account details: ${updatedUser.email}`,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Toggle staff active status (deactivate/activate)
const toggleStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        isActive: true,
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: isActive ? 'ACTIVATE_STAFF' : 'DEACTIVATE_STAFF',
        description: `${isActive ? 'Activated' : 'Deactivated'} staff account: ${updatedUser.email}`,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'RESET_PASSWORD',
        description: `Reset password for staff account: ${updatedUser.email}`,
      },
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllStaff,
  createStaff,
  updateStaff,
  toggleStaffStatus,
  resetPassword
};
