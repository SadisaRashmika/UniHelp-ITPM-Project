const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const authModel = require('../models/authModel');

const ALLOWED_ROLES = new Set(['student', 'lecturer']);

const normalizeHeaders = (h = '') => h.trim().toLowerCase();

const seedUsersFromCsv = async (csvFilePath) => {
  const absolutePath = path.resolve(csvFilePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`CSV file not found: ${absolutePath}`);
  }

  const users = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(absolutePath)
      .pipe(csv({ mapHeaders: ({ header }) => normalizeHeaders(header) }))
      .on('data', (row) => {
        users.push({
          idNumber: String(row.id_number || '').trim(),
          fullName: String(row.full_name || '').trim(),
          email: String(row.email || '').trim().toLowerCase(),
          role: String(row.role || '').trim().toLowerCase(),
        });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  let processed = 0;
  for (const user of users) {
    if (!user.idNumber || !user.fullName || !user.email || !ALLOWED_ROLES.has(user.role)) {
      continue;
    }

    await authModel.upsertSeedUser({
      idNumber: user.idNumber,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
    processed += 1;
  }

  return { totalRows: users.length, upserted: processed };
};

if (require.main === module) {
  const csvPath = process.argv[2];

  if (!csvPath) {
    console.error('Usage: node modules/login-signin/scripts/seedUsersFromCsv.js <path-to-csv>');
    process.exit(1);
  }

  seedUsersFromCsv(csvPath)
    .then((result) => {
      console.log('Seed complete:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error.message);
      process.exit(1);
    });
}

module.exports = {
  seedUsersFromCsv,
};
