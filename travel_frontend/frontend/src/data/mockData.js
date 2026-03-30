export const mockDestinations = [
    { id: 1, name: "Paris, France", description: "City of Light", image: "https://placehold.co/600x400?text=Paris", lat: 48.8566, lng: 2.3522 },
    { id: 2, name: "Tokyo, Japan", description: "Bustling metropolis", image: "https://placehold.co/600x400?text=Tokyo", lat: 35.6762, lng: 139.6503 }
];

export const mockHotels = [
    { id: 1, destinationId: 1, name: "Le Grand Hotel", price_per_night: 250, rating: 4.8, image: "https://placehold.co/400x300?text=Hotel+Paris" },
    { id: 2, destinationId: 2, name: "Tokyo Tower Inn", price_per_night: 150, rating: 4.5, image: "https://placehold.co/400x300?text=Hotel+Tokyo" }
];

// We will use let so we can mutate it in memory for now
export let mockBookings = [
    { id: 101, hotelName: "Le Grand Hotel", checkIn: "2026-05-10", checkOut: "2026-05-15", totalPrice: 1250, adminCommission: 250, status: "CONFIRMED" }
];