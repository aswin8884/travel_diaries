"""
Management command to seed 5 Indian destinations with hotels and restaurants.
Usage: python manage.py seed_india_data
"""
import urllib.request
import io
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from destinations.models import Destination, Hotel, Restaurant


def fetch_image(url, filename):
    """Download image from URL and return a ContentFile."""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as response:
            data = response.read()
        return ContentFile(data, name=filename)
    except Exception as e:
        print(f"  [WARN] Could not fetch {url}: {e}")
        return None


SEED_DATA = [
    {
        "name": "Jaipur",
        "short_description": "The Pink City — royal palaces, vibrant bazaars and Rajput heritage.",
        "long_description": (
            "Jaipur, the capital of Rajasthan, is one of India's most iconic cities. "
            "Founded in 1727 by Maharaja Sawai Jai Singh II, its rose-pink buildings give it "
            "the nickname 'The Pink City'. Explore the magnificent Amber Fort, the ornate Hawa Mahal, "
            "City Palace, and the astronomical marvel Jantar Mantar — a UNESCO World Heritage Site. "
            "Stroll through the bustling Johari Bazaar for gems and jewellery or pick up hand-block "
            "printed textiles in Bapu Bazaar."
        ),
        "latitude": 26.9124,
        "longitude": 75.7873,
        "rating": 4.8,
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=80",
        "image_name": "jaipur.jpg",
        "hotels": [
            {
                "name": "Rambagh Palace Hotel",
                "description": (
                    "Once the residence of Maharaja of Jaipur, Rambagh Palace is a legendary luxury "
                    "hotel set on 47 acres of lush Mughal gardens. Experience royal Rajasthani hospitality "
                    "with opulent suites, spa, polo grounds and an award-winning Indian cuisine restaurant."
                ),
                "price_per_night": 18500,
                "rating": 4.9,
                "total_rooms": 78,
                "latitude": 26.8977,
                "longitude": 75.8074,
                "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
                "image_name": "rambagh_palace.jpg",
            },
            {
                "name": "ITC Rajputana Jaipur",
                "description": (
                    "A grand heritage hotel in the heart of Jaipur, ITC Rajputana blends Rajasthani "
                    "architecture with modern luxury. Features multiple restaurants, an outdoor pool, "
                    "spa and easy access to city's major attractions."
                ),
                "price_per_night": 8200,
                "rating": 4.6,
                "total_rooms": 50,
                "latitude": 26.9021,
                "longitude": 75.7924,
                "image_url": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80",
                "image_name": "itc_rajputana.jpg",
            },
        ],
        "restaurants": [
            {
                "name": "Suvarna Mahal — Palace Dining",
                "description": (
                    "Dine like royalty in a breathtaking ballroom adorned with gold chandeliers and "
                    "frescoes. Suvarna Mahal serves authentic Rajasthani and North Indian cuisine — "
                    "think Dal Baati Churma, Laal Maas and Ker Sangri in true palace-style grandeur."
                ),
                "opening_time": "19:00:00",
                "closing_time": "23:00:00",
                "max_guests_per_slot": 80,
                "average_cost": 3500,
                "rating": 4.8,
                "latitude": 26.8977,
                "longitude": 75.8074,
                "image_url": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
                "image_name": "suvarna_mahal.jpg",
            },
            {
                "name": "Bapu Shree Traditional Kitchen",
                "description": (
                    "A beloved local eatery in the old city serving time-honoured Rajasthani thalis. "
                    "Famous for their crispy Pyaaz Kachori, hearty Gatte Ki Sabzi and ghevar dessert. "
                    "A must-visit for authentic street-food flavours in a relaxed setting."
                ),
                "opening_time": "08:00:00",
                "closing_time": "22:00:00",
                "max_guests_per_slot": 120,
                "average_cost": 450,
                "rating": 4.5,
                "latitude": 26.9228,
                "longitude": 75.8225,
                "image_url": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&q=80",
                "image_name": "bapu_shree.jpg",
            },
        ],
    },
    {
        "name": "Alleppey",
        "short_description": "The Venice of the East — serene backwaters, houseboats and coconut groves.",
        "long_description": (
            "Alleppey (Alappuzha) in Kerala is famous for its intricate network of backwater canals, "
            "lagoons and lakes. Glide through the tranquil backwaters on a traditional kettuvallam "
            "(rice-boat houseboat), watch village life unfold on the banks, and witness the thrilling "
            "Nehru Trophy Boat Race. The golden beaches, ancient temples and fresh seafood make "
            "Alleppey one of India's most unique and relaxing destinations."
        ),
        "latitude": 9.4981,
        "longitude": 76.3388,
        "rating": 4.7,
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80",
        "image_name": "alleppey.jpg",
        "hotels": [
            {
                "name": "Lemon Tree Vembanad Lake Resort",
                "description": (
                    "Perched on the edge of Vembanad Lake, this resort offers stunning waterfront "
                    "villas and cottages surrounded by coconut palms. Wake up to misty lake views, "
                    "enjoy Ayurvedic spa treatments and sample Kerala's famous seafood cuisine."
                ),
                "price_per_night": 6800,
                "rating": 4.6,
                "total_rooms": 45,
                "latitude": 9.5012,
                "longitude": 76.3420,
                "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
                "image_name": "vembanad_resort.jpg",
            },
            {
                "name": "Marari Beach Resort",
                "description": (
                    "An eco-friendly retreat on the pristine Marari Beach, offering thatched-roof "
                    "cottages amid lush tropical gardens. Activities include yoga, Ayurveda, "
                    "fishing with local fishermen and cycling through sleepy fishing villages."
                ),
                "price_per_night": 5200,
                "rating": 4.5,
                "total_rooms": 35,
                "latitude": 9.5889,
                "longitude": 76.2988,
                "image_url": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80",
                "image_name": "marari_beach.jpg",
            },
        ],
        "restaurants": [
            {
                "name": "Thaff Restaurant — Backwater Dining",
                "description": (
                    "Enjoy authentic Kerala Sadhya served on banana leaf while gazing over the "
                    "shimmering backwaters. Specialities include Karimeen Pollichathu (pearl-spot fish), "
                    "prawn curry, appam with stew and an array of fresh coconut-based dishes."
                ),
                "opening_time": "07:00:00",
                "closing_time": "22:30:00",
                "max_guests_per_slot": 100,
                "average_cost": 800,
                "rating": 4.6,
                "latitude": 9.4985,
                "longitude": 76.3390,
                "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=80",
                "image_name": "thaff_restaurant.jpg",
            },
            {
                "name": "Chakara Restaurant",
                "description": (
                    "A floating restaurant on the backwaters serving the freshest catch of the day. "
                    "Specialises in crab masala, lobster, and traditional Kerala fish curry. "
                    "The serene water setting makes every meal a memorable experience."
                ),
                "opening_time": "11:00:00",
                "closing_time": "22:00:00",
                "max_guests_per_slot": 60,
                "average_cost": 1200,
                "rating": 4.7,
                "latitude": 9.5010,
                "longitude": 76.3350,
                "image_url": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
                "image_name": "chakara_restaurant.jpg",
            },
        ],
    },
    {
        "name": "Goa",
        "short_description": "Sun, sand and soul — India's beach paradise with Portuguese charm.",
        "long_description": (
            "Goa is India's smallest state but packs a world-class punch — golden beaches, "
            "azure waters, colonial-era Portuguese churches (several UNESCO-listed), and a "
            "legendary nightlife scene. From the lively beaches of Baga and Calangute in North Goa "
            "to the peaceful shores of Palolem and Agonda in South Goa, there's a vibe for everyone. "
            "Savour Goan fish curry rice, prawn balchão and bebinca dessert while watching the sun "
            "dip into the Arabian Sea."
        ),
        "latitude": 15.2993,
        "longitude": 74.1240,
        "rating": 4.7,
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
        "image_name": "goa.jpg",
        "hotels": [
            {
                "name": "Taj Exotica Resort & Spa, Goa",
                "description": (
                    "Nestled on 56 acres of lush Goan landscape overlooking Benaulim Beach, "
                    "Taj Exotica is the epitome of luxury. Private pool villas, a world-class spa, "
                    "multiple dining venues and impeccable Taj hospitality await you."
                ),
                "price_per_night": 14500,
                "rating": 4.9,
                "total_rooms": 140,
                "latitude": 15.2447,
                "longitude": 73.9457,
                "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
                "image_name": "taj_exotica_goa.jpg",
            },
            {
                "name": "The Leela Goa — Beach Resort",
                "description": (
                    "A palatial resort spread across 75 acres on Mobor Beach, Cavelossim. "
                    "Features a vast lagoon-style pool, Ayurveda spa, golf course and "
                    "superb dining options ranging from coastal Goan to continental cuisine."
                ),
                "price_per_night": 9800,
                "rating": 4.7,
                "total_rooms": 206,
                "latitude": 15.1648,
                "longitude": 73.9470,
                "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
                "image_name": "leela_goa.jpg",
            },
        ],
        "restaurants": [
            {
                "name": "Vinayak Family Restaurant",
                "description": (
                    "An iconic Goan institution in Margao known for its authentic Goan-Portuguese "
                    "cuisine. Must-tries include prawn rissois, sorpotel, pork vindaloo and the "
                    "famous Goan fish thali — all at incredibly wallet-friendly prices."
                ),
                "opening_time": "11:30:00",
                "closing_time": "22:30:00",
                "max_guests_per_slot": 150,
                "average_cost": 600,
                "rating": 4.6,
                "latitude": 15.2736,
                "longitude": 73.9575,
                "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
                "image_name": "vinayak_goa.jpg",
            },
            {
                "name": "Gunpowder — Goan Coastal Kitchen",
                "description": (
                    "Set in a charming colonial villa in Assagao, Gunpowder offers "
                    "contemporary interpretations of South Indian and Goan coastal flavours. "
                    "Famous for their crab claws, bebinca sundae and curated cocktail list."
                ),
                "opening_time": "12:00:00",
                "closing_time": "23:00:00",
                "max_guests_per_slot": 80,
                "average_cost": 1400,
                "rating": 4.7,
                "latitude": 15.5562,
                "longitude": 73.7736,
                "image_url": "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1200&q=80",
                "image_name": "gunpowder_goa.jpg",
            },
        ],
    },
    {
        "name": "Manali",
        "short_description": "Snow-clad peaks, cedar forests and adventure in the Himalayas.",
        "long_description": (
            "Manali in Himachal Pradesh sits at 2,050 m in the Kullu Valley, cradled by the "
            "Beas River and towering Himalayan peaks. It is the gateway to Ladakh and Spiti, "
            "and a year-round adventure destination. In winter, Solang Valley and Rohtang Pass "
            "transform into a snow wonderland for skiing and snowboarding. Summers bring trekking, "
            "paragliding and river-rafting. The old town with its Hadimba Temple and apple orchards "
            "adds a spiritual and rustic charm."
        ),
        "latitude": 32.2396,
        "longitude": 77.1887,
        "rating": 4.7,
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80",
        "image_name": "manali.jpg",
        "hotels": [
            {
                "name": "Span Resort & Spa, Manali",
                "description": (
                    "Perched on the banks of the Beas River, Span Resort offers deluxe cottages "
                    "with private balconies overlooking the gushing river and snow-capped mountains. "
                    "Features a heated indoor pool, spa, trout fishing and bonfires under the stars."
                ),
                "price_per_night": 7500,
                "rating": 4.6,
                "total_rooms": 40,
                "latitude": 32.2500,
                "longitude": 77.1730,
                "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
                "image_name": "span_resort.jpg",
            },
            {
                "name": "Johnson Hotel & Restaurant",
                "description": (
                    "A charming heritage property in Old Manali set in apple orchards, Johnson's "
                    "has been welcoming travellers for decades. Cosy log-fire rooms, a beloved "
                    "multi-cuisine restaurant and walking distance from the Mall Road."
                ),
                "price_per_night": 3800,
                "rating": 4.4,
                "total_rooms": 30,
                "latitude": 32.2429,
                "longitude": 77.1891,
                "image_url": "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=1200&q=80",
                "image_name": "johnson_hotel.jpg",
            },
        ],
        "restaurants": [
            {
                "name": "Drifters' Inn & Rooftop Café",
                "description": (
                    "A cosy backpacker-favourite in Old Manali with stunning mountain views from "
                    "the rooftop. Serves everything from Tibetan momos and thukpa to wood-fired "
                    "pizzas and fresh apple pies — perfect après-trek fuel."
                ),
                "opening_time": "08:00:00",
                "closing_time": "22:00:00",
                "max_guests_per_slot": 60,
                "average_cost": 500,
                "rating": 4.5,
                "latitude": 32.2445,
                "longitude": 77.1909,
                "image_url": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
                "image_name": "drifters_inn.jpg",
            },
            {
                "name": "Il Forno — Italian Kitchen Manali",
                "description": (
                    "A warm trattoria tucked in the Manali bazaar, Il Forno is famed for its "
                    "wood-fired pizzas, fresh pasta and rich tiramisu. A perfect retreat from "
                    "the mountain chill with its crackling fireplace and homely ambience."
                ),
                "opening_time": "12:00:00",
                "closing_time": "22:30:00",
                "max_guests_per_slot": 50,
                "average_cost": 700,
                "rating": 4.4,
                "latitude": 32.2412,
                "longitude": 77.1876,
                "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
                "image_name": "il_forno_manali.jpg",
            },
        ],
    },
    {
        "name": "Varanasi",
        "short_description": "The spiritual soul of India — ancient ghats, sacred rituals on the Ganga.",
        "long_description": (
            "Varanasi (Benaras) is one of the world's oldest continuously inhabited cities and "
            "Hinduism's holiest. The city's 88 ghats along the Ganges are a spectacle of life, "
            "faith and ceremony — from dawn boat rides witnessing the grand Ganga Aarti to the "
            "sombre Manikarnika cremation ghat burning round the clock. Wander the labyrinthine "
            "lanes of the old city, visit the Kashi Vishwanath Temple and Sarnath where Buddha "
            "gave his first sermon. Sample malaiyo, thandai and the legendary Kashi chaat."
        ),
        "latitude": 25.3176,
        "longitude": 82.9739,
        "rating": 4.6,
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=1200&q=80",
        "image_name": "varanasi.jpg",
        "hotels": [
            {
                "name": "BrijRama Palace — Heritage Hotel",
                "description": (
                    "An 18th-century palace on the banks of the Ganges, BrijRama Palace offers "
                    "palatial rooms with river views, heritage art installations and a rooftop "
                    "restaurant. Watch the Ganga Aarti from the privacy of your own balcony."
                ),
                "price_per_night": 11000,
                "rating": 4.8,
                "total_rooms": 15,
                "latitude": 25.3088,
                "longitude": 83.0104,
                "image_url": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80",
                "image_name": "brijrama_palace.jpg",
            },
            {
                "name": "Ramada by Wyndham Varanasi",
                "description": (
                    "A contemporary luxury hotel in the cantonment area offering all modern comforts. "
                    "Features rooftop pool with Ganga views, multi-cuisine restaurant, spa and "
                    "daily guided heritage tours to the ghats and temples."
                ),
                "price_per_night": 5500,
                "rating": 4.4,
                "total_rooms": 88,
                "latitude": 25.3285,
                "longitude": 82.9811,
                "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
                "image_name": "ramada_varanasi.jpg",
            },
        ],
        "restaurants": [
            {
                "name": "Keshari Restaurant — Pure Veg",
                "description": (
                    "A Varanasi institution since 1960, Keshari serves pure-vegetarian North Indian "
                    "and Banarasi cuisine. Famous for their kadhi-chawal, kachori-sabzi breakfast, "
                    "rabri and the legendary Banarasi paan to finish a meal in true local style."
                ),
                "opening_time": "07:00:00",
                "closing_time": "22:00:00",
                "max_guests_per_slot": 200,
                "average_cost": 350,
                "rating": 4.5,
                "latitude": 25.3192,
                "longitude": 82.9730,
                "image_url": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1200&q=80",
                "image_name": "keshari_restaurant.jpg",
            },
            {
                "name": "Aum Café — Ghat View Dining",
                "description": (
                    "A serene rooftop café overlooking Assi Ghat, Aum Café is beloved by travellers "
                    "for its all-day breakfast, fresh juices, lassi and simple Indian thalis. "
                    "The perfect spot to sip chai while watching the Ganga's eternal flow."
                ),
                "opening_time": "07:30:00",
                "closing_time": "21:30:00",
                "max_guests_per_slot": 50,
                "average_cost": 400,
                "rating": 4.4,
                "latitude": 25.2882,
                "longitude": 83.0101,
                "image_url": "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&q=80",
                "image_name": "aum_cafe.jpg",
            },
        ],
    },
]


class Command(BaseCommand):
    help = "Seed 5 Indian destinations with hotels and restaurants (downloads images from Unsplash)"

    def handle(self, *args, **options):
        created_dest = 0
        created_hotel = 0
        created_rest = 0

        for dest_data in SEED_DATA:
            # Skip if destination already exists
            if Destination.objects.filter(name=dest_data["name"]).exists():
                self.stdout.write(f"  [SKIP] Destination '{dest_data['name']}' already exists.")
                dest = Destination.objects.get(name=dest_data["name"])
            else:
                self.stdout.write(f"Creating destination: {dest_data['name']} ...")
                dest = Destination(
                    name=dest_data["name"],
                    short_description=dest_data["short_description"],
                    long_description=dest_data["long_description"],
                    latitude=dest_data["latitude"],
                    longitude=dest_data["longitude"],
                    rating=dest_data["rating"],
                    is_featured=dest_data["is_featured"],
                )
                img = fetch_image(dest_data["image_url"], dest_data["image_name"])
                if img:
                    dest.image.save(dest_data["image_name"], img, save=False)
                dest.save()
                created_dest += 1
                self.stdout.write(self.style.SUCCESS(f"  ✓ Destination '{dest.name}' created."))

            # Hotels
            for h in dest_data["hotels"]:
                if Hotel.objects.filter(name=h["name"], destination=dest).exists():
                    self.stdout.write(f"  [SKIP] Hotel '{h['name']}' already exists.")
                    continue
                self.stdout.write(f"  Creating hotel: {h['name']} ...")
                hotel = Hotel(
                    destination=dest,
                    name=h["name"],
                    description=h["description"],
                    price_per_night=h["price_per_night"],
                    rating=h["rating"],
                    total_rooms=h["total_rooms"],
                    latitude=h["latitude"],
                    longitude=h["longitude"],
                )
                img = fetch_image(h["image_url"], h["image_name"])
                if img:
                    hotel.image.save(h["image_name"], img, save=False)
                hotel.save()
                created_hotel += 1
                self.stdout.write(self.style.SUCCESS(f"    ✓ Hotel '{hotel.name}' created."))

            # Restaurants
            for r in dest_data["restaurants"]:
                if Restaurant.objects.filter(name=r["name"], destination=dest).exists():
                    self.stdout.write(f"  [SKIP] Restaurant '{r['name']}' already exists.")
                    continue
                self.stdout.write(f"  Creating restaurant: {r['name']} ...")
                rest = Restaurant(
                    destination=dest,
                    name=r["name"],
                    description=r["description"],
                    opening_time=r["opening_time"],
                    closing_time=r["closing_time"],
                    max_guests_per_slot=r["max_guests_per_slot"],
                    average_cost=r["average_cost"],
                    rating=r["rating"],
                    latitude=r["latitude"],
                    longitude=r["longitude"],
                )
                img = fetch_image(r["image_url"], r["image_name"])
                if img:
                    rest.image.save(r["image_name"], img, save=False)
                rest.save()
                created_rest += 1
                self.stdout.write(self.style.SUCCESS(f"    ✓ Restaurant '{rest.name}' created."))

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(
            f"Done! Created {created_dest} destinations, {created_hotel} hotels, {created_rest} restaurants."
        ))
