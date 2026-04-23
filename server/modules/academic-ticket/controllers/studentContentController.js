const db = require('../../../config/db');

// Get hierarchical content structure for student dashboard
const getStudentHierarchicalContent = async (req, res) => {
  try {
    const { student_id } = req.query;
    
    // Get student information (in real app, this would come from authentication)
    const studentId = student_id || 'STU001';
    
    // Get all content organized hierarchically
    const query = `
      WITH faculty_content AS (
        SELECT DISTINCT 
          f.id as faculty_id,
          f.name as faculty_name,
          f.code as faculty_code
        FROM faculties f
        LEFT JOIN quiz_job qj ON f.id = qj.faculty_id
        LEFT JOIN practical_assignments pa ON f.id = pa.faculty_id
        WHERE qj.id IS NOT NULL OR pa.id IS NOT NULL
        ORDER BY f.name
      ),
      intake_content AS (
        SELECT DISTINCT
          f.id as faculty_id,
          i.id as intake_id,
          i.year as intake_year,
          i.name as intake_name
        FROM intakes i
        JOIN faculties f ON 1=1
        LEFT JOIN quiz_job qj ON i.id = qj.intake_id AND f.id = qj.faculty_id
        LEFT JOIN practical_assignments pa ON i.id = pa.intake_id AND f.id = pa.faculty_id
        WHERE qj.id IS NOT NULL OR pa.id IS NOT NULL
        ORDER BY i.year
      ),
      semester_content AS (
        SELECT DISTINCT
          f.id as faculty_id,
          i.id as intake_id,
          s.id as semester_id,
          s.name as semester_name,
          s.number as semester_number
        FROM semesters s
        JOIN intakes i ON 1=1
        JOIN faculties f ON 1=1
        LEFT JOIN quiz_job qj ON s.id = qj.semester_id AND i.id = qj.intake_id AND f.id = qj.faculty_id
        LEFT JOIN practical_assignments pa ON s.id = pa.semester_id AND i.id = pa.intake_id AND f.id = pa.faculty_id
        WHERE qj.id IS NOT NULL OR pa.id IS NOT NULL
        ORDER BY s.name
      ),
      module_content AS (
        SELECT DISTINCT
          f.id as faculty_id,
          i.id as intake_id,
          s.id as semester_id,
          m.id as module_id,
          m.name as module_name,
          m.code as module_code
        FROM modules m
        JOIN faculties f ON m.faculty_id = f.id
        JOIN intakes i ON m.intake_id = i.id
        JOIN semesters s ON m.semester_id = s.id
        LEFT JOIN quiz_job qj ON m.id = qj.module_id
        LEFT JOIN practical_assignments pa ON m.id = pa.module_id
        WHERE qj.id IS NOT NULL OR pa.id IS NOT NULL
        ORDER BY m.code
      ),
      content_items AS (
        -- Quiz Jobs
        SELECT 
          f.id as faculty_id,
          i.id as intake_id,
          s.id as semester_id,
          m.id as module_id,
          'quiz' as content_type,
          qj.id as content_id,
          qj.title as content_title,
          qj.description as content_description,
          qj.due_date as content_due_date,
          qj.status as content_status,
          qj.created_at as content_created_at,
          qj.job_priority as content_priority,
          qj.completion_status as content_completion_status
        FROM quiz_job qj
        LEFT JOIN faculties f ON qj.faculty_id = f.id
        LEFT JOIN intakes i ON qj.intake_id = i.id
        LEFT JOIN semesters s ON qj.semester_id = s.id
        LEFT JOIN modules m ON qj.module_id = m.id
        
        UNION ALL
        
        -- Practical Assignments
        SELECT 
          f.id as faculty_id,
          i.id as intake_id,
          s.id as semester_id,
          m.id as module_id,
          'practical' as content_type,
          pa.id as content_id,
          pa.title as content_title,
          pa.description as content_description,
          pa.due_date as content_due_date,
          pa.status as content_status,
          pa.created_at as content_created_at,
          pa.priority as content_priority,
          'incomplete' as content_completion_status
        FROM practical_assignments pa
        LEFT JOIN faculties f ON pa.faculty_id = f.id
        LEFT JOIN intakes i ON pa.intake_id = i.id
        LEFT JOIN semesters s ON pa.semester_id = s.id
        LEFT JOIN modules m ON pa.module_id = m.id
        
        UNION ALL
        
        -- Notices (placeholder - add notices table when available)
        SELECT 
          f.id as faculty_id,
          i.id as intake_id,
          s.id as semester_id,
          m.id as module_id,
          'notice' as content_type,
          n.id as content_id,
          n.title as content_title,
          n.content as content_description,
          n.post_date as content_due_date,
          n.status as content_status,
          n.created_at as content_created_at,
          'normal' as content_priority,
          'posted' as content_completion_status
        FROM (SELECT 1 as id, 'Sample Notice' as title, 'This is a sample notice' as content, 
              CURRENT_DATE as post_date, 'active' as status, CURRENT_TIMESTAMP as created_at,
              1 as faculty_id, 1 as intake_id, 1 as semester_id, 1 as module_id) n
      )
      SELECT 
        JSON_BUILD_OBJECT(
          'faculties', (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', fc.faculty_id,
                'name', fc.faculty_name,
                'code', fc.faculty_code,
                'intakes', (
                  SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                      'id', ic.intake_id,
                      'year', ic.intake_year,
                      'name', ic.intake_name,
                      'semesters', (
                        SELECT JSON_AGG(
                          JSON_BUILD_OBJECT(
                            'id', sc.semester_id,
                            'name', sc.semester_name,
                            'number', sc.semester_number,
                            'modules', (
                              SELECT JSON_AGG(
                                JSON_BUILD_OBJECT(
                                  'id', mc.module_id,
                                  'name', mc.module_name,
                                  'code', mc.module_code,
                                  'content', (
                                    SELECT JSON_AGG(
                                      JSON_BUILD_OBJECT(
                                        'type', ci.content_type,
                                        'id', ci.content_id,
                                        'title', ci.content_title,
                                        'description', ci.content_description,
                                        'due_date', ci.content_due_date,
                                        'status', ci.content_status,
                                        'priority', ci.content_priority,
                                        'completion_status', ci.content_completion_status,
                                        'created_at', ci.content_created_at
                                      )
                                    )
                                    FROM content_items ci
                                    WHERE ci.faculty_id = fc.faculty_id 
                                      AND ci.intake_id = ic.intake_id 
                                      AND ci.semester_id = sc.semester_id 
                                      AND ci.module_id = mc.module_id
                                  )
                                )
                              )
                              FROM module_content mc
                              WHERE mc.faculty_id = fc.faculty_id 
                                AND mc.intake_id = ic.intake_id 
                                AND mc.semester_id = sc.semester_id
                            )
                          )
                        )
                        FROM semester_content sc
                        WHERE sc.faculty_id = fc.faculty_id AND sc.intake_id = ic.intake_id
                      )
                    )
                  )
                  FROM intake_content ic
                  WHERE ic.faculty_id = fc.faculty_id
                )
              )
            )
            FROM faculty_content fc
          )
        ) as hierarchical_data
    `;
    
    const result = await db.query(query);
    
    res.json({
      success: true,
      data: result.rows[0].hierarchical_data || { faculties: [] }
    });
  } catch (error) {
    console.error('Error fetching student hierarchical content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student hierarchical content',
      error: error.message
    });
  }
};

// Get content by specific path (faculty/intake/semester/module)
const getContentByPath = async (req, res) => {
  try {
    const { faculty_id, intake_id, semester_id, module_id } = req.params;
    const { content_type, student_id } = req.query;
    
    let query = `
      SELECT 
        'quiz' as content_type,
        qj.id as content_id,
        qj.title as content_title,
        qj.description as content_description,
        qj.due_date as content_due_date,
        qj.status as content_status,
        qj.job_priority as content_priority,
        qj.completion_status as content_completion_status,
        qj.created_at as content_created_at,
        m.name as module_name,
        m.code as module_code,
        f.name as faculty_name,
        i.year as intake_year,
        s.name as semester_name
      FROM quiz_job qj
      LEFT JOIN modules m ON qj.module_id = m.id
      LEFT JOIN faculties f ON qj.faculty_id = f.id
      LEFT JOIN intakes i ON qj.intake_id = i.id
      LEFT JOIN semesters s ON qj.semester_id = s.id
      WHERE qj.faculty_id = $1 AND qj.intake_id = $2 AND qj.semester_id = $3
      
      UNION ALL
      
      SELECT 
        'practical' as content_type,
        pa.id as content_id,
        pa.title as content_title,
        pa.description as content_description,
        pa.due_date as content_due_date,
        pa.status as content_status,
        pa.priority as content_priority,
        'incomplete' as content_completion_status,
        pa.created_at as content_created_at,
        m.name as module_name,
        m.code as module_code,
        f.name as faculty_name,
        i.year as intake_year,
        s.name as semester_name
      FROM practical_assignments pa
      LEFT JOIN modules m ON pa.module_id = m.id
      LEFT JOIN faculties f ON pa.faculty_id = f.id
      LEFT JOIN intakes i ON pa.intake_id = i.id
      LEFT JOIN semesters s ON pa.semester_id = s.id
      WHERE pa.faculty_id = $1 AND pa.intake_id = $2 AND pa.semester_id = $3
    `;
    
    const params = [faculty_id, intake_id, semester_id];
    
    if (module_id) {
      query += ` AND (qj.module_id = $4 OR pa.module_id = $4)`;
      params.push(module_id);
    }
    
    if (content_type) {
      query += ` AND content_type = $${params.length + 1}`;
      params.push(content_type);
    }
    
    query += ` ORDER BY content_due_date ASC, content_created_at DESC`;
    
    const result = await db.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching content by path:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content by path',
      error: error.message
    });
  }
};

// Get student's available navigation paths
const getStudentNavigationPaths = async (req, res) => {
  try {
    const { student_id } = req.query;
    
    const query = `
      SELECT DISTINCT
        f.id as faculty_id,
        f.name as faculty_name,
        f.code as faculty_code,
        i.id as intake_id,
        i.year as intake_year,
        i.name as intake_name,
        s.id as semester_id,
        s.name as semester_name,
        s.number as semester_number,
        m.id as module_id,
        m.name as module_name,
        m.code as module_code
      FROM faculties f
      CROSS JOIN intakes i
      CROSS JOIN semesters s
      LEFT JOIN modules m ON (m.faculty_id = f.id AND m.intake_id = i.id AND m.semester_id = s.id)
      LEFT JOIN quiz_job qj ON (qj.faculty_id = f.id AND qj.intake_id = i.id AND qj.semester_id = s.id AND (qj.module_id = m.id OR qj.module_id IS NULL))
      LEFT JOIN practical_assignments pa ON (pa.faculty_id = f.id AND pa.intake_id = i.id AND pa.semester_id = s.id AND (pa.module_id = m.id OR pa.module_id IS NULL))
      WHERE qj.id IS NOT NULL OR pa.id IS NOT NULL
      ORDER BY f.name, i.year, s.name, m.code
    `;
    
    const result = await db.query(query);
    
    // Group results hierarchically
    const hierarchical = {};
    
    result.rows.forEach(row => {
      if (!hierarchical[row.faculty_id]) {
        hierarchical[row.faculty_id] = {
          id: row.faculty_id,
          name: row.faculty_name,
          code: row.faculty_code,
          intakes: {}
        };
      }
      
      if (!hierarchical[row.faculty_id].intakes[row.intake_id]) {
        hierarchical[row.faculty_id].intakes[row.intake_id] = {
          id: row.intake_id,
          year: row.intake_year,
          name: row.intake_name,
          semesters: {}
        };
      }
      
      if (!hierarchical[row.faculty_id].intakes[row.intake_id].semesters[row.semester_id]) {
        hierarchical[row.faculty_id].intakes[row.intake_id].semesters[row.semester_id] = {
          id: row.semester_id,
          name: row.semester_name,
          number: row.semester_number,
          modules: {}
        };
      }
      
      if (row.module_id && !hierarchical[row.faculty_id].intakes[row.intake_id].semesters[row.semester_id].modules[row.module_id]) {
        hierarchical[row.faculty_id].intakes[row.intake_id].semesters[row.semester_id].modules[row.module_id] = {
          id: row.module_id,
          name: row.module_name,
          code: row.module_code
        };
      }
    });
    
    // Convert to array format
    const faculties = Object.values(hierarchical).map(faculty => ({
      ...faculty,
      intakes: Object.values(faculty.intakes).map(intake => ({
        ...intake,
        semesters: Object.values(intake.semesters).map(semester => ({
          ...semester,
          modules: Object.values(semester.modules)
        }))
      }))
    }));
    
    res.json({
      success: true,
      data: faculties
    });
  } catch (error) {
    console.error('Error fetching student navigation paths:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student navigation paths',
      error: error.message
    });
  }
};

module.exports = {
  getStudentHierarchicalContent,
  getContentByPath,
  getStudentNavigationPaths
};
