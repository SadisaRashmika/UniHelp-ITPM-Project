// Test script for quiz structure API endpoints
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/academic-ticket';

async function testQuizStructure() {
  console.log('Testing Quiz Structure API Endpoints...\n');

  try {
    // Test 1: Get all faculties
    console.log('1. Testing GET /quiz-structure/faculties');
    const facultiesResponse = await axios.get(`${API_BASE}/quiz-structure/faculties`);
    console.log('Status:', facultiesResponse.status);
    console.log('Data:', JSON.stringify(facultiesResponse.data, null, 2));
    console.log('\n');

    // Test 2: Get intakes by faculty (using faculty ID 1)
    console.log('2. Testing GET /quiz-structure/faculty/1/intakes');
    const intakesResponse = await axios.get(`${API_BASE}/quiz-structure/faculty/1/intakes`);
    console.log('Status:', intakesResponse.status);
    console.log('Data:', JSON.stringify(intakesResponse.data, null, 2));
    console.log('\n');

    // Test 3: Get semesters by faculty and intake
    console.log('3. Testing GET /quiz-structure/faculty/1/intake/1/semesters');
    const semestersResponse = await axios.get(`${API_BASE}/quiz-structure/faculty/1/intake/1/semesters`);
    console.log('Status:', semestersResponse.status);
    console.log('Data:', JSON.stringify(semestersResponse.data, null, 2));
    console.log('\n');

    // Test 4: Get modules by complete structure
    console.log('4. Testing GET /quiz-structure/faculty/1/intake/1/semester/1/modules');
    const modulesResponse = await axios.get(`${API_BASE}/quiz-structure/faculty/1/intake/1/semester/1/modules`);
    console.log('Status:', modulesResponse.status);
    console.log('Data:', JSON.stringify(modulesResponse.data, null, 2));
    console.log('\n');

    // Test 5: Get lecturer structure
    console.log('5. Testing GET /quiz-structure/lecturer/structure');
    const lecturerStructureResponse = await axios.get(`${API_BASE}/quiz-structure/lecturer/structure`);
    console.log('Status:', lecturerStructureResponse.status);
    console.log('Data:', JSON.stringify(lecturerStructureResponse.data, null, 2));
    console.log('\n');

    // Test 6: Get quizzes with module filtering
    console.log('6. Testing GET /quizzes?lecturer_id=LEC001&module_id=1');
    const quizzesResponse = await axios.get(`${API_BASE}/quizzes?lecturer_id=LEC001&module_id=1`);
    console.log('Status:', quizzesResponse.status);
    console.log('Data:', JSON.stringify(quizzesResponse.data, null, 2));
    console.log('\n');

    console.log('All tests completed successfully!');

  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the tests
testQuizStructure();
