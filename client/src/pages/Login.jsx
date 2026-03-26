// Login Page Component
// This is the login form for the UniHelp application

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login() {
    // Get login function from auth context
    const { login } = useAuth();
    
    // State for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        
        // Validate inputs
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);

        // Call login function
        const result = await login(email, password);

        if (!result.success) {
            setError(result.message);
        }

        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">UniHelp</h1>
                    <p className="text-gray-600 mt-2">University Timetable Management</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="mb-4">
                        <label 
                            htmlFor="email" 
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label 
                            htmlFor="password" 
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-lg text-white font-bold ${
                            loading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 font-bold mb-2">Demo Credentials:</p>
                    <p className="text-xs text-gray-500">| Admin | admin@unihelp.com | admin123 |</p>
                    <p className="text-xs text-gray-500">| Lecturer | sarath.gunasekara@unihelp.com | lecturer123 |</p>
                    <p className="text-xs text-gray-500">| Student | kavindu.perera@student.unihelp.com | student123 |</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
