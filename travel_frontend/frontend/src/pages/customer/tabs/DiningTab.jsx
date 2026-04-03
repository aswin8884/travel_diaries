import { Link, useNavigate } from 'react-router-dom';
import { Clock, Utensils, Star, Users, Lock } from 'lucide-react';

const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

const DiningTab = ({ restaurants, isLoggedIn }) => {
    const navigate = useNavigate();

    if (!restaurants || restaurants.length === 0) {
        return (
            <div className="text-center p-10 text-gray-400 dark:text-gray-500 font-bold">
                No dining options available here yet.
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            {restaurants.map(restaurant => (
                <div key={restaurant.id} className="flex gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-[2rem] hover:shadow-lg transition-all bg-white dark:bg-gray-800">
                    <img src={getImageUrl(restaurant.image)} alt={restaurant.name} className="w-32 h-32 object-cover rounded-3xl shrink-0" />

                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="text-xl font-black text-gray-900 dark:text-white">{restaurant.name}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="flex items-center gap-1 text-xs font-bold text-orange-500">
                                        <Clock size={12}/> {restaurant.opening_time.slice(0,5)} - {restaurant.closing_time.slice(0,5)}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                                        <Star size={12} fill="currentColor"/>
                                        {restaurant.rating || '—'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-600">
                                <Users size={12}/> Up to {restaurant.max_guests_per_slot}
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{restaurant.short_description || restaurant.description}</p>

                        {isLoggedIn ? (
                            <Link to={`/restaurant/${restaurant.id}`} className="inline-flex items-center justify-center gap-2 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold py-2 px-4 rounded-xl hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white transition-colors w-fit text-sm">
                                <Utensils size={16}/> Reserve Table
                            </Link>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold py-2 px-4 rounded-xl hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white transition-colors w-fit text-sm"
                            >
                                <Lock size={14}/> Sign In to Reserve
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DiningTab;
