import React from 'react';
import HotelForm from './HotelForm'; // Adjust the import path if needed

const AddHotel = () => {
    // We don't pass any initialData, so the form knows it's in "Add" mode
    return <HotelForm />;
};

export default AddHotel;