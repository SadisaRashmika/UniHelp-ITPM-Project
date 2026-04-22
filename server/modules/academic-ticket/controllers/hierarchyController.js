const hierarchyModel = require('../models/hierarchyModel');

const getHierarchyFilters = async (req, res) => {
    try {
        const [faculties, intakes, semesters] = await Promise.all([
            hierarchyModel.getFaculties(),
            hierarchyModel.getIntakes(),
            hierarchyModel.getSemesters()
        ]);
        res.status(200).json({ faculties, intakes, semesters });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hierarchy filters', error: error.message });
    }
};

const getModules = async (req, res) => {
    try {
        const { faculty_id, intake_id, semester_id } = req.query;
        const modules = await hierarchyModel.getModules(faculty_id, intake_id, semester_id);
        res.status(200).json(modules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching modules', error: error.message });
    }
};

const getModuleNotices = async (req, res) => {
    try {
        const { id } = req.params;
        const notices = await hierarchyModel.getModuleNotices(id);
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notices', error: error.message });
    }
};

const createNotice = async (req, res) => {
    try {
        const notice = await hierarchyModel.createModuleNotice(req.body);
        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ message: 'Error creating notice', error: error.message });
    }
};

module.exports = {
    getHierarchyFilters,
    getModules,
    getModuleNotices,
    createNotice
};
