const { Pool } = require('pg');
const axios = require('axios');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'uni-help',
  password: '123456789',
  port: 5432,
});

const API_BASE = 'http://localhost:5000/api/academic-ticket';

async function testQuizJobSystem() {
  try {
    console.log('=== TESTING QUIZ JOB SYSTEM ===');
    
    // Test 1: Create sample quiz jobs
    console.log('\n1. Creating sample quiz jobs...');
    
    const sampleQuizJobs = [
      {
        title: 'Web Development Fundamentals Quiz',
        description: 'Test your knowledge of HTML, CSS, and JavaScript basics',
        due_date: '2026-05-15',
        priority: 'medium',
        course_code: 'CS102',
        lecturer_id: 'LEC001',
        max_marks: 100,
        duration: 60,
        questions: [
          {
            question: 'What does HTML stand for?',
            options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
            correct_answer: 'Hyper Text Markup Language'
          }
        ],
        type: 'quiz',
        module_id: 2, // Web Development Fundamentals
        faculty_id: 1, // Computing
        intake_id: 1, // 2023
        semester_id: 1, // Year 1 Semester 1
        total_marks: 100,
        job_status: 'active',
        job_priority: 'normal',
        completion_status: 'incomplete'
      },
      {
        title: 'Database Management Systems Assessment',
        description: 'Comprehensive assessment of database concepts and SQL',
        due_date: '2026-05-20',
        priority: 'high',
        course_code: 'CS301',
        lecturer_id: 'LEC001',
        max_marks: 150,
        duration: 90,
        questions: [
          {
            question: 'What is a primary key?',
            options: ['A unique identifier', 'A foreign key', 'A composite key', 'A secondary key'],
            correct_answer: 'A unique identifier'
          }
        ],
        type: 'quiz',
        module_id: 1, // Database Management Systems
        faculty_id: 1, // Computing
        intake_id: 2, // 2024
        semester_id: 5, // Year 3 Semester 1
        total_marks: 150,
        job_status: 'active',
        job_priority: 'high',
        completion_status: 'incomplete'
      },
      {
        title: 'Business Statistics Final Exam',
        description: 'Statistical methods for business analysis',
        due_date: '2026-05-25',
        priority: 'urgent',
        course_code: 'BUS201',
        lecturer_id: 'LEC002',
        max_marks: 200,
        duration: 120,
        questions: [
          {
            question: 'What is the mean of a dataset?',
            options: ['The middle value', 'The most frequent value', 'The average value', 'The range'],
            correct_answer: 'The average value'
          }
        ],
        type: 'quiz',
        module_id: 6, // Business Statistics
        faculty_id: 2, // Business
        intake_id: 3, // 2025
        semester_id: 4, // Year 2 Semester 2
        total_marks: 200,
        job_status: 'active',
        job_priority: 'urgent',
        completion_status: 'incomplete'
      }
    ];

    for (const quizJob of sampleQuizJobs) {
      try {
        const response = await axios.post(`${API_BASE}/quiz-jobs`, quizJob);
        console.log(`Created quiz job: ${quizJob.title} (ID: ${response.data.data.id})`);
      } catch (error) {
        console.error(`Error creating quiz job ${quizJob.title}:`, error.response?.data || error.message);
      }
    }

    // Test 2: Fetch all quiz jobs
    console.log('\n2. Fetching all quiz jobs...');
    try {
      const response = await axios.get(`${API_BASE}/quiz-jobs`);
      console.log(`Found ${response.data.data.length} quiz jobs`);
      response.data.data.forEach(qj => {
        console.log(`  - ${qj.title} (${qj.faculty_name || 'N/A'} - ${qj.module_name || 'N/A'})`);
      });
    } catch (error) {
      console.error('Error fetching quiz jobs:', error.response?.data || error.message);
    }

    // Test 3: Test student hierarchical content API
    console.log('\n3. Testing student hierarchical content API...');
    try {
      const response = await axios.get(`${API_BASE}/student-content/hierarchical`);
      const hierarchicalData = response.data.data;
      console.log(`Hierarchical structure contains ${hierarchicalData.faculties.length} faculties`);
      
      hierarchicalData.faculties.forEach(faculty => {
        console.log(`  Faculty: ${faculty.name}`);
        faculty.intakes?.forEach(intake => {
          console.log(`    Intake: ${intake.year}`);
          intake.semesters?.forEach(semester => {
            console.log(`      Semester: ${semester.name}`);
            semester.modules?.forEach(module => {
              console.log(`        Module: ${module.name} (${module.content?.length || 0} items)`);
              module.content?.forEach(content => {
                console.log(`          - ${content.type}: ${content.title}`);
              });
            });
          });
        });
      });
    } catch (error) {
      console.error('Error fetching hierarchical content:', error.response?.data || error.message);
    }

    // Test 4: Test student content by path
    console.log('\n4. Testing student content by path...');
    try {
      const response = await axios.get(`${API_BASE}/student-content/path/1/1/1`);
      const pathContent = response.data.data;
      console.log(`Content for Computing/2023/Year 1 Semester 1: ${pathContent.length} items`);
      pathContent.forEach(content => {
        console.log(`  - ${content.type}: ${content.title} (${content.status})`);
      });
    } catch (error) {
      console.error('Error fetching content by path:', error.response?.data || error.message);
    }

    // Test 5: Test student navigation paths
    console.log('\n5. Testing student navigation paths...');
    try {
      const response = await axios.get(`${API_BASE}/student-content/navigation`);
      const navigationPaths = response.data.data;
      console.log(`Available navigation paths: ${navigationPaths.length} faculties`);
      
      navigationPaths.forEach(faculty => {
        console.log(`  Faculty: ${faculty.name}`);
        faculty.intakes?.forEach(intake => {
          console.log(`    Intake: ${intake.year}`);
          intake.semesters?.forEach(semester => {
            console.log(`      Semester: ${semester.name}`);
            semester.modules?.forEach(module => {
              console.log(`        Module: ${module.name}`);
            });
          });
        });
      });
    } catch (error) {
      console.error('Error fetching navigation paths:', error.response?.data || error.message);
    }

    console.log('\n=== QUIZ JOB SYSTEM TEST COMPLETED ===');
    
  } catch (error) {
    console.error('Test system error:', error);
  } finally {
    await db.end();
  }
}

testQuizJobSystem();
