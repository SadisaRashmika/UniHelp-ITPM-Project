import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, UserCheck, GraduationCap, Search } from 'lucide-react';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Admin'); 
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/user-feedback/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/user-feedback/users/${editingUser.id}`, editingUser);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    const filteredUsers = users.filter(user => 
        user.role === activeTab && 
        (user.name.toLowerCase().includes(search.toLowerCase()) || 
         user.user_id.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading && users.length === 0) return (
        <div className="flex items-center justify-center p-20 grow">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="space-y-4 grow animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-1 bg-gray-100/50 p-0.5 rounded-lg w-fit border border-gray-100 shadow-inner">
                    <TabBtn 
                        active={activeTab === 'Admin'} 
                        label="Admins" 
                        onClick={() => setActiveTab('Admin')} 
                        icon={<UserCheck size={14} />} 
                    />
                    <TabBtn 
                        active={activeTab === 'Lecturer'} 
                        label="Lecturers" 
                        onClick={() => setActiveTab('Lecturer')} 
                        icon={<UserCheck size={14} />} 
                    />
                    <TabBtn 
                        active={activeTab === 'Student'} 
                        label="Students" 
                        onClick={() => setActiveTab('Student')} 
                        icon={<GraduationCap size={14} />} 
                    />
                </div>

                <div className="relative max-w-sm w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search protocols..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-100 outline-none transition-all placeholder:text-gray-400 shadow-xs"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs relative">
                
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-50/20 rounded-full blur-3xl pointer-events-none" />
                
                <table className="w-full text-left border-collapse relative z-10">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Entity Signature</th>
                            <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">System ID</th>
                            <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Email Node</th>
                            <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                {activeTab === 'Lecturer' ? 'Dept' : activeTab === 'Student' ? 'Level' : 'Cat'}
                            </th>
                            <th className="px-6 py-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={`${user.role}-${user.id}`} className="hover:bg-blue-50/30 transition-all group">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-transform border border-transparent
                                                ${activeTab === 'Lecturer' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                                                  activeTab === 'Student' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                                  'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                {user.name[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{user.name}</span>
                                                <span className="text-[8px] font-medium text-gray-400 uppercase tracking-widest">{user.role}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className="text-[9px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md tracking-tighter uppercase shadow-xs">{user.user_id}</span>
                                    </td>
                                    <td className="px-6 py-3.5 text-[10px] font-semibold text-gray-400 group-hover:text-gray-600 transition-colors">{user.email}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest italic px-2 py-1 rounded-md border
                                            ${activeTab === 'Lecturer' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 
                                              activeTab === 'Student' ? 'text-blue-600 bg-blue-50 border-blue-100' : 
                                              'text-emerald-600 bg-emerald-50 border-emerald-100'}`}>
                                            {user.category || 'System'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-right">
                                        <button 
                                            onClick={() => setEditingUser(user)}
                                            className="text-[9px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-xs active:scale-95"
                                        >
                                            Modify
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest italic">
                                    No records found matching search protocols.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            
            {editingUser && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden border border-white/20 transform animate-in slide-in-from-bottom-8 duration-500">
                        <div className="bg-linear-to-br from-blue-600 to-indigo-800 p-10 text-white relative">
                            
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                            
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-2 italic flex items-center gap-2">
                                    <ShieldCheck size={12} /> Secure Identity Hub
                                </p>
                                <h3 className="text-2xl font-bold tracking-tight italic">Modify {editingUser.role} Entity</h3>
                            </div>
                            <button 
                                onClick={() => setEditingUser(null)} 
                                className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all text-xl font-light active:scale-95"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-10 space-y-8 bg-gray-50/30">
                            <InputField 
                                label="Entity Recognition Name"
                                value={editingUser.name}
                                onChange={(val) => setEditingUser({...editingUser, name: val})}
                            />
                            <InputField 
                                label="Primary System Email"
                                type="email"
                                value={editingUser.email}
                                onChange={(val) => setEditingUser({...editingUser, email: val})}
                            />
                            <div className="grid grid-cols-2 gap-6">
                                <InputField 
                                    label="System Identification"
                                    value={editingUser.user_id}
                                    onChange={(val) => setEditingUser({...editingUser, user_id: val})}
                                    disabled={true}
                                />
                                <InputField 
                                    label={editingUser.role === 'Lecturer' ? 'Dept' : editingUser.role === 'Student' ? 'Level' : 'Category'}
                                    value={editingUser.category}
                                    onChange={(val) => setEditingUser({...editingUser, category: val})}
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="flex-1 px-6 py-4 rounded-2xl text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 border border-transparent hover:border-gray-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                                >
                                    Apply Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const InputField = ({ label, value, onChange, type = "text", disabled = false }) => (
    <div className="space-y-2 group">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4 transition-colors group-focus-within:text-blue-600">{label}</label>
        <input 
            type={type} 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`w-full px-6 py-3.5 rounded-2xl text-sm font-bold outline-none transition-all border
                ${disabled ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 
                  'bg-white border-gray-100 text-gray-900 focus:ring-4 focus:ring-blue-50 focus:border-blue-200 shadow-xs'}`}
            required
        />
    </div>
);

const TabBtn = ({ active, label, onClick, icon }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2.5 rounded-lg flex items-center gap-3 text-[10px] transition-all font-bold uppercase tracking-widest
          ${active ? 'bg-white shadow-sm text-blue-600 border border-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
    >
        {icon} {label}
    </button>
);

const ShieldCheck = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default AdminUserList;
