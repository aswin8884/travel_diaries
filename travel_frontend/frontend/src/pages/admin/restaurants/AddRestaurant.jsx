import React from 'react';
import RestaurantForm from './RestaurantForm'; // Adjust the import path if needed

const AddRestaurant = () => {
    // We don't pass any initialData, so the form knows it's in "Add" mode
    return <RestaurantForm />;
};

export default AddRestaurant;