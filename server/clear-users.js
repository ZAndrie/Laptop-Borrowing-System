require('dotenv').config();
const prisma = require('./src/utils/db');

async function clearUsers() {
  try {
    console.log('Deleting all activity logs...');
    await prisma.activityLog.deleteMany({});
    
    console.log('Deleting all users...');
    await prisma.user.deleteMany({});
    
    console.log('All accounts have been deleted. The database is now completely fresh.');
  } catch (err) {
    console.error('Error clearing accounts:', err);
  } finally {
    await prisma.$disconnect();
  }
}

clearUsers();
