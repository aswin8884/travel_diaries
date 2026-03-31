import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HotelForm from './HotelForm'; // Make sure this path is correct!

const EditHotel = () => {
    const { id } = useParams(); // Gets the '1' from '/admin/edit-hotel/1'
    const navigate = useNavigate();
    
    const [hotelData, setHotelData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/hotels/${id}/`);
                setHotelData(res.data);
            } catch (err) {
                console.error("Failed to fetch hotel:", err);
                setError("Could not load hotel data. It might have been deleted or the server is down.");
            }
        };
        fetchHotel();
    }, [id]);

    // If there is an error, show it gracefully
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
                    <h2 className="text-xl font-bold text-red-500 mb-2">Oops!</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button onClick={() => navigate('/admin')} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all">Go Back to Dashboard</button>
                </div>
            </div>
        );
    }

    // Show a loading state until the data arrives from Django
    if (!hotelData) return <div className="p-10 text-center font-bold text-gray-500 animate-pulse mt-20">Loading hotel data...</div>;

    // Pass the fetched data into the form engine!
    return (
        <HotelForm 
            initialData={hotelData} 
            onCancel={() => navigate('/admin')}
            onSuccess={() => {
                alert("Hotel updated successfully!");
                navigate('/admin');
            }}
        />
    );
};

export default EditHotel;