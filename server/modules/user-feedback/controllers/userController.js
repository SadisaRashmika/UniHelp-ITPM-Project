const userModel = require('../models/userModel');


const getAllUsers = async (req, res) => {
    try {
        const allUsers = await userModel.getAllUsers();
        res.status(200).json(allUsers);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};


const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, category, role, user_id } = req.body;

    try {
        let result;
        if (role === 'Lecturer') {
            result = await userModel.updateLecturer(id, name, email, category, user_id);
        } else if (role === 'Student') {
            result = await userModel.updateStudent(id, name, email, category, user_id);
        } else {
            return res.status(400).json({ error: 'Invalid user role' });
        }

        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: result });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

module.exports = {
    getAllUsers,
    updateUser
};
