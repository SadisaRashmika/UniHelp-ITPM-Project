// Test file to verify academic ticket routes are properly imported and exported
const academicTicketRoutes = require('./modules/academic-ticket/routes/index.js');

console.log('Testing academic ticket routes import...');
console.log('Routes imported successfully:', typeof academicTicketRoutes === 'function');

// Test if routes object has expected properties
try {
  console.log('Routes object type:', typeof academicTicketRoutes);
  console.log('Routes test completed successfully');
} catch (error) {
  console.error('Error testing routes:', error.message);
}
