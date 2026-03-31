const UsersTab = ({ users }) => {
    return (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-sm overflow-hidden animate-in fade-in duration-500">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50 text-sm text-gray-500 border-b border-gray-100">
                        <th className="p-5 font-bold uppercase tracking-wider">ID</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Email</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Role</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Joined Date</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                            <td className="p-5 text-sm text-gray-500 font-medium">#{u.id}</td>
                            <td className="p-5 font-bold text-gray-900">{u.email}</td>
                            <td className="p-5">
                                <span className={`px-3 py-1 text-xs rounded-full font-bold tracking-wide ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {u.role.toUpperCase()}
                                </span>
                            </td>
                            <td className="p-5 text-sm text-gray-600 font-medium">{new Date(u.date_joined).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default UsersTab;