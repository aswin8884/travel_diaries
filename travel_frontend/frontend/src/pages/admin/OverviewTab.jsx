import { DollarSign, BookOpen, Map } from 'lucide-react';
import { mockBookings } from '../../data/mockData';

const OverviewTab = ({ destinationsCount, usersCount }) => {
    const totalRevenue = mockBookings
        .filter(b => b.status === 'CONFIRMED')
        .reduce((sum, booking) => sum + booking.adminCommission, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3.5 bg-green-100 text-green-600 rounded-2xl"><DollarSign size={24}/></div>
                        <div>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Platform Cut</p>
                            <h3 className="text-3xl font-black text-gray-900">${totalRevenue.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3.5 bg-purple-100 text-purple-600 rounded-2xl"><Map size={24}/></div>
                        <div>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Active Destinations</p>
                            <h3 className="text-3xl font-black text-gray-900">{destinationsCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3.5 bg-blue-100 text-blue-600 rounded-2xl"><BookOpen size={24}/></div>
                        <div>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Users</p>
                            <h3 className="text-3xl font-black text-gray-900">{usersCount}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default OverviewTab;