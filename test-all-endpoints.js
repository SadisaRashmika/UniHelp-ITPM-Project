// Comprehensive test script for all quiz structure and related endpoints
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/academic-ticket';

async function testAllEndpoints() {
  console.log('Testing All Quiz Structure and Related Endpoints...\n');

  const tests = [
    // Quiz Structure Endpoints
    {
      name: 'GET /quiz-structure/faculties',
      url: `${API_BASE}/quiz-structure/faculties`,
      method: 'GET'
    },
    {
      name: 'GET /quiz-structure/faculty/1/intakes',
      url: `${API_BASE}/quiz-structure/faculty/1/intakes`,
      method: 'GET'
    },
    {
      name: 'GET /quiz-structure/faculty/1/intake/1/semesters',
      url: `${API_BASE}/quiz-structure/faculty/1/intake/1/semesters`,
      method: 'GET'
    },
    {
      name: 'GET /quiz-structure/faculty/1/intake/1/semester/1/modules',
      url: `${API_BASE}/quiz-structure/faculty/1/intake/1/semester/1/modules`,
      method: 'GET'
    },
    {
      name: 'GET /quiz-structure/lecturer/structure',
      url: `${API_BASE}/quiz-structure/lecturer/structure`,
      method: 'GET'
    },
    
    // Quiz Endpoints
    {
      name: 'GET /quizzes?lecturer_id=LEC001',
      url: `${API_BASE}/quizzes?lecturer_id=LEC001`,
      method: 'GET'
    },
    {
      name: 'GET /quizzes?lecturer_id=LEC001&module_id=1',
      url: `${API_BASE}/quizzes?lecturer_id=LEC001&module_id=1`,
      method: 'GET'
    },
    
    // Task/Activity Endpoints
    {
      name: 'GET /recent-activities?lecturer_id=LEC001&limit=5',
      url: `${API_BASE}/recent-activities?lecturer_id=LEC001&limit=5`,
      method: 'GET'
    },
    
    // Test POST endpoint
    {
      name: 'POST /quizzes (Create Quiz)',
      url: `${API_BASE}/quizzes`,
      method: 'POST',
      data: {
        title: 'Test Quiz',
        description: 'Test Description',
        duration: 30,
        total_marks: 50,
        faculty_id: 1,
        intake_id: 1,
        semester_id: 1,
        module_id: 1,
        questions: []
      }
    }
  ];

  let passedTests = 0;
  let failedTests = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      
      let response;
      if (test.method === 'GET') {
        response = await axios.get(test.url);
      } else if (test.method === 'POST') {
        response = await axios.post(test.url, test.data);
      }
      
      console.log(`Status: ${response.status} - Success!`);
      
      if (response.data) {
        if (Array.isArray(response.data.data)) {
          console.log(`Returned ${response.data.data.length} items`);
        } else if (response.data.activities) {
          console.log(`Returned ${response.data.activities.length} activities`);
        } else if (response.data.quizzes) {
          console.log(`Returned ${response.data.quizzes.length} quizzes`);
        }
      }
      
      passedTests++;
      
    } catch (error) {
      console.log(`Status: ERROR - ${error.message}`);
      if (error.response) {
        console.log(`Response Status: ${error.response.status}`);
        if (error.response.data && typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
          console.log('Response: HTML Error Page (404 Not Found)');
        } else {
          console.log('Response:', JSON.stringify(error.response.data, null, 2));
        }
      }
      failedTests++;
    }
    
    console.log('---');
  }

  console.log(`\nTest Results:`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Total: ${passedTests + failedTests}`);
  
  if (failedTests === 0) {
    console.log('\nAll tests passed! The quiz structure system is working correctly.');
  } else {
    console.log('\nSome tests failed. Please check the failed endpoints.');
  }
}

// Run the tests
testAllEndpoints();
