const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting script to normalize parent codes...');

  const userDetailsToUpdate = await prisma.userDetails.findMany({
    where: {
      parentCode: {
        not: null,
      },
    },
  });

  if (userDetailsToUpdate.length === 0) {
    console.log('No parent codes found to normalize.');
    return;
  }

  console.log(`Found ${userDetailsToUpdate.length} userDetails entries with a parent code.`);

  let updatedCount = 0;
  for (const detail of userDetailsToUpdate) {
    // This check is crucial to only update codes that are not already uppercase.
    if (detail.parentCode && detail.parentCode !== detail.parentCode.toUpperCase()) {
      try {
        await prisma.userDetails.update({
          where: { userId: detail.userId },
          data: { parentCode: detail.parentCode.toUpperCase() },
        });
        updatedCount++;
        console.log(`  - Updated code for user: ${detail.userId}`);
      } catch (error) {
        // We log the error but continue the script for other users.
        console.error(`  - FAILED to update code for user ${detail.userId}. Error:`, error);
      }
    }
  }

  console.log(`
Script finished.`);
  console.log(`Total codes that required normalization: ${updatedCount}`);
}

main()
  .catch((e) => {
    console.error('\nA critical error occurred during script execution:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Database connection closed.');
  });
