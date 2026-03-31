import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RestaurantForm from './RestaurantForm';

const EditRestaurant = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [restaurantData, setRestaurantData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/restaurants/${id}/`);
                setRestaurantData(res.data);
            } catch (err) {
                console.error("Failed to fetch restaurant:", err);
                setError("Could not load restaurant data.");
            }
        };
        fetchRestaurant();
    }, [id]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Oops!</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button onClick={() => navigate('/admin')} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all">Go Back</button>
                </div>
            </div>
        );
    }

    if (!restaurantData) return <div className="p-10 text-center font-bold text-gray-500 animate-pulse mt-20">Loading restaurant data...</div>;

    return (
        <RestaurantForm 
            initialData={restaurantData} 
            onCancel={() => navigate('/admin')}
            onSuccess={() => {
                alert("Restaurant updated successfully!");
                navigate('/admin');
            }}
        />
    );
};

export default EditRestaurant;