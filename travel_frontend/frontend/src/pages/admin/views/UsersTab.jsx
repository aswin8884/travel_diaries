import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';

const UsersTab = ({ users: initialUsers }) => {
    const [users, setUsers] = useState(initialUsers);
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (userId, userEmail) => {
        if (!window.confirm(`Permanently delete user "${userEmail}"? This cannot be undone.`)) return;

        setDeletingId(userId);
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://localhost:8000/api/users/${userId}/delete/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (e) {
            alert(e.response?.data?.error || 'Failed to delete user.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-base font-black text-gray-900 dark:text-white">Registered Users</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{users.length} total accounts on the platform</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                            <th className="px-6 py-3.5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">#</th>
                            <th className="px-6 py-3.5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3.5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3.5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3.5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3.5 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-400 dark:text-gray-600 font-mono">#{u.id}</td>
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-sm">{u.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : '—'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs rounded-full font-bold tracking-wide ${
                                        u.role === 'admin'
                                            ? 'bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800'
                                            : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900'
                                    }`}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    {new Date(u.date_joined).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric'})}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDelete(u.id, u.email)}
                                        disabled={deletingId === u.id}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900 rounded-xl text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-50 transition-colors"
                                        title={`Delete ${u.email}`}
                                    >
                                        <Trash2 size={13}/>
                                        {deletingId === u.id ? 'Deleting…' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="py-16 text-center text-gray-400 dark:text-gray-600 font-medium">No users found.</div>
                )}
            </div>
        </div>
    );
};

export default UsersTab;
