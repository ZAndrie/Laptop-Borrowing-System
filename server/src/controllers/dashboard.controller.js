const prisma = require('../utils/db');

const getDashboardStats = async (req, res) => {
  try {
    const totalLaptops = await prisma.laptop.count();
    const availableLaptops = await prisma.laptop.count({ where: { status: 'AVAILABLE' } });
    const borrowedLaptops = await prisma.laptop.count({ where: { status: 'BORROWED' } });
    
    // Count transactions that are still borrowed but past their due date
    const overdueTransactions = await prisma.borrowTransaction.count({
      where: {
        status: 'BORROWED',
        dueDate: { lt: new Date() }
      }
    });

    res.json({
      totalLaptops,
      available: availableLaptops,
      borrowed: borrowedLaptops,
      overdue: overdueTransactions
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getDashboardStats };
