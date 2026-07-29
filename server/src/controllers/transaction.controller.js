const prisma = require('../utils/db');
const crypto = require('crypto');

// Get all borrowing transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.borrowTransaction.findMany({
      include: {
        borrower: true,
        laptop: true,
        user: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { borrowDate: 'desc' },
    });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Process a new laptop borrow transaction
const borrowLaptop = async (req, res) => {
  try {
    const { studentId, firstName, lastName, course, yearLevel, college, contactNumber, laptopId, dueDate, remarks } = req.body;
    const userId = req.user.id;

    if (!studentId || !firstName || !lastName || !laptopId || !dueDate) {
      return res.status(400).json({ error: 'Student details, Laptop, and Due Date are required.' });
    }

    // Wrap in a Prisma transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify laptop is still available
      const laptop = await tx.laptop.findUnique({ where: { id: laptopId } });
      if (!laptop) throw new Error('Laptop not found');
      if (laptop.status !== 'AVAILABLE') throw new Error('Laptop is not available for borrowing');

      // 2. Fetch or create borrower
      let borrower = await tx.borrower.findUnique({ where: { studentId } });
      if (!borrower) {
        borrower = await tx.borrower.create({
          data: {
            studentId,
            firstName,
            lastName,
            course,
            yearLevel,
            college,
            contactNumber
          }
        });
      }

      // 3. Generate transaction number (TRN-YYYYMMDD-XXXX)
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase();
      const transactionNumber = `TRN-${datePart}-${randomPart}`;

      // 4. Create the transaction
      const transaction = await tx.borrowTransaction.create({
        data: {
          transactionNumber,
          borrowerId: borrower.id,
          laptopId,
          userId,
          dueDate: new Date(dueDate),
          remarks
        }
      });

      // 5. Update the laptop status to BORROWED
      await tx.laptop.update({
        where: { id: laptopId },
        data: { status: 'BORROWED' }
      });

      // 6. Log the activity
      await tx.activityLog.create({
        data: {
          userId,
          action: 'BORROW_LAPTOP',
          description: `Processed borrow transaction ${transactionNumber} for ${borrower.firstName} ${borrower.lastName}. Laptop: ${laptop.assetNumber}`,
        }
      });

      return transaction;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    if (error.message.includes('Laptop') || error.message.includes('Borrower')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllTransactions,
  borrowLaptop,
};
