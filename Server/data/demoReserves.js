const demoReserves = [
  {
    MainTitle: "Royal Pearl Hotel",
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    ],
    address: "MG Road",
    location: "Bengaluru",
    description:
      "Premium city-center stay with modern rooms, rooftop dining, and 24x7 service.",
    category: "accommodation",
    price: "120",
    rating: "4.8",
    amenities: ["WiFi", "Parking", "Breakfast", "Pool"],
    Date: "1/1/2026",
  },
  {
    MainTitle: "Prisma Plaza",
    photos: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    ],
    address: "Linking Road",
    location: "Mumbai",
    description:
      "Business-friendly hotel with spacious suites and quick access to key city hubs.",
    category: "accommodation",
    price: "95",
    rating: "4.5",
    amenities: ["WiFi", "Gym", "Airport Pickup", "Room Service"],
    Date: "1/1/2026",
  },
  {
    MainTitle: "Emerald Heights Suites",
    photos: [
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80",
    ],
    address: "Banjara Hills",
    location: "Hyderabad",
    description:
      "Comfort-focused suites with city views, business desk, and premium hospitality.",
    category: "accommodation",
    price: "110",
    rating: "4.6",
    amenities: ["WiFi", "Breakfast", "Gym", "Parking"],
    Date: "1/1/2026",
  },
  {
    MainTitle: "Maple Grand Residency",
    photos: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    ],
    address: "Anna Salai",
    location: "Chennai",
    description:
      "Elegant stay option near prime shopping and office districts with modern rooms.",
    category: "accommodation",
    price: "85",
    rating: "4.4",
    amenities: ["WiFi", "AC", "Room Service", "Airport Shuttle"],
    Date: "1/1/2026",
  },
  {
    MainTitle: "Skyline Crown Hotel",
    photos: [
      "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1200&q=80",
    ],
    address: "Sector 18",
    location: "Noida",
    description:
      "Modern premium hotel with rooftop lounge, meeting spaces, and curated experiences.",
    category: "accommodation",
    price: "130",
    rating: "4.9",
    amenities: ["Pool", "Rooftop", "WiFi", "Parking"],
    Date: "1/1/2026",
  },
  {
    MainTitle: "Lotus Bay Retreat",
    photos: [
      "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1200&q=80",
    ],
    address: "Beach Road",
    location: "Goa",
    description:
      "Relaxed coastal accommodation with scenic ambience and quick access to beaches.",
    category: "accommodation",
    price: "140",
    rating: "3.9",
    amenities: ["Beach Access", "Pool", "WiFi", "Breakfast"],
    Date: "1/1/2026",
  },
  {
    MainTitle: "Spice Route Bistro",
    photos: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    ],
    address: "Church Street",
    location: "Bengaluru",
    description:
      "Contemporary Indian dining with chef specials and a warm family-friendly vibe.",
    category: "restaurant",
    price: "30",
    rating: "4.7",
    amenities: ["Live Music", "Indoor Seating", "Family Tables"],
    Date: "1/1/2026",
  },
  {
    MainTitle: "Harbor Flame Grill",
    photos: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
    ],
    address: "Marine Drive",
    location: "Kochi",
    description:
      "Seafood-focused dining experience with signature grills and ocean-inspired flavors.",
    category: "restaurant",
    price: "40",
    rating: "4.6",
    amenities: ["Sea View", "Reservation", "AC Hall"],
    Date: "1/1/2026",
  },
  {
    MainTitle: "Tandoor Junction",
    photos: [
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
    ],
    address: "Civil Lines",
    location: "Jaipur",
    description:
      "Popular North Indian dining with signature kebabs, curries, and family seating.",
    category: "restaurant",
    price: "25",
    rating: "4.3",
    amenities: ["Family Seating", "AC Hall", "Fast Service"],
    Date: "1/1/2026",
  },
  {
    MainTitle: "Basil & Brick Oven",
    photos: [
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80",
    ],
    address: "Koregaon Park",
    location: "Pune",
    description:
      "Italian-inspired menu with handcrafted pizza, pasta, and dessert specials.",
    category: "restaurant",
    price: "35",
    rating: "4.5",
    amenities: ["Outdoor Seating", "Reservation", "Dessert Bar"],
    Date: "1/1/2026",
  },
  {
    MainTitle: "Urban Curry House",
    photos: [
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80",
    ],
    address: "Connaught Place",
    location: "Delhi",
    description:
      "Contemporary Indian kitchen serving regional favorites in a modern setting.",
    category: "restaurant",
    price: "28",
    rating: "4.4",
    amenities: ["Central Location", "Family Tables", "Quick Service"],
    Date: "1/1/2026",
  },
  {
    MainTitle: "Bluefin Coastal Table",
    photos: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    ],
    address: "Law Garden",
    location: "Ahmedabad",
    description:
      "Fresh coastal flavors, curated menu, and a vibrant dining atmosphere.",
    category: "restaurant",
    price: "32",
    rating: "4.6",
    amenities: ["Reservation", "Chef Specials", "Premium Seating"],
    Date: "1/1/2026",
  },
  {
    MainTitle: "Midnight Biryani Works",
    photos: [
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    ],
    address: "Hazratganj",
    location: "Lucknow",
    description:
      "Late-night biryani and kebab destination with rich flavors and quick service.",
    category: "restaurant",
    price: "20",
    rating: "4.2",
    amenities: ["Late Night", "Takeaway", "Family Friendly"],
    Date: "1/1/2026",
  },
];

export default demoReserves;
