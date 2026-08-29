/**
 * data.js — Mock Data Layer
 * 
 * All website data lives here as JavaScript objects/arrays.
 * When Firebase is integrated, replace these with Firestore queries.
 * The UI code (app.js, store.js, admin.js) should NOT change.
 */

/* ============================================================
   COMPANY INFORMATION
   ============================================================ */
const companyInfo = {
  name: "SecondLeaf",
  tagline: "Delivering Sustainable Agricultural Solutions",
  description: "SecondLeaf is a leading agricultural solutions provider committed to sustainable farming practices. We supply premium organic products, crop nutrition solutions, and bulk agricultural supplies to farmers and agribusinesses worldwide.",
  logo: "", // Text-only or image logo
  founded: 2014,
  phone: "+91 98765 43210",
  email: "info@secondleaf.com",
  address: "47 Green Valley Road, Coimbatore, Tamil Nadu 641035, India",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125322.0715893!2d76.8830!3d11.0168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f461b59%3A0x30e7a01ecb956027!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1689876543210",
  whatsapp: "+919876543210",
  social: {
    facebook: "https://facebook.com/secondleaf",
    instagram: "https://instagram.com/secondleaf",
    linkedin: "https://linkedin.com/company/secondleaf",
    whatsapp: "https://wa.me/919876543210"
  },
  mission: "To empower farmers with sustainable, science-backed agricultural solutions that improve crop yield while preserving the earth for future generations.",
  vision: "A world where every farmer has access to premium, eco-friendly agricultural inputs that maximize productivity and protect our planet.",
  values: [
    {
      icon: "",
      title: "Sustainability",
      description: "We prioritize eco-friendly practices and products that nurture the soil and protect biodiversity."
    },
    {
      icon: "",
      title: "Innovation",
      description: "Continuous research and development to bring cutting-edge agricultural solutions to the field."
    },
    {
      icon: "",
      title: "Trust",
      description: "Building lasting relationships with farmers through transparency, quality, and reliable service."
    },
    {
      icon: "",
      title: "Global Reach",
      description: "Delivering world-class agricultural products and expertise across borders and climates."
    }
  ]
};


/* ============================================================
   SERVICES
   ============================================================ */
const services = [
  {
    id: 1,
    icon: "",
    title: "Organic Fertilizers",
    description: "Premium organic fertilizers enriched with natural nutrients to boost soil health and crop productivity without harmful chemicals."
  },
  {
    id: 2,
    icon: "",
    title: "Crop Nutrition",
    description: "Scientifically formulated crop nutrition programs tailored to specific soil conditions and crop requirements for maximum yield."
  },
  {
    id: 3,
    icon: "",
    title: "Biological Solutions",
    description: "Advanced bio-stimulants and microbial solutions that enhance plant immunity, root development, and nutrient absorption."
  },
  {
    id: 4,
    icon: "",
    title: "Bulk Supply",
    description: "Large-scale agricultural input supply with competitive pricing, reliable logistics, and consistent quality assurance."
  },
  {
    id: 5,
    icon: "",
    title: "Agricultural Consulting",
    description: "Expert agronomists providing tailored advice on crop management, soil health, pest control, and sustainable farming practices."
  },
  {
    id: 6,
    icon: "",
    title: "Warehouse & Distribution",
    description: "State-of-the-art warehousing facilities and efficient distribution network ensuring timely delivery across regions."
  }
];


/* ============================================================
   STATISTICS / KEY FIGURES
   ============================================================ */
const statistics = {
  clients: { value: 500, suffix: "+", label: "Clients Served" },
  products: { value: 50, suffix: "+", label: "Products" },
  tonsDelivered: { value: 15000, suffix: "+", label: "Tons Delivered" },
  experience: { value: 12, suffix: "", label: "Years Experience" }
};


/* ============================================================
   PRODUCTS (for Store)
   ============================================================ */
const categories = [
  { id: "all", name: "All Products", icon: "" },
  { id: "organic", name: "Organic", icon: "" },
  { id: "seeds", name: "Seeds", icon: "" },
  { id: "fertilizers", name: "Fertilizers", icon: "" },
  { id: "crop-nutrition", name: "Crop Nutrition", icon: "" },
  { id: "bio-products", name: "Bio Products", icon: "" },
  { id: "equipment", name: "Equipment", icon: "" }
];

const products = [
  {
    id: 1,
    name: "Organic Neem Cake Fertilizer",
    category: "organic",
    shortDescription: "100% natural neem cake for soil enrichment and pest deterrence.",
    fullDescription: "Our premium organic neem cake fertilizer is cold-pressed from high-quality neem seeds. It enriches the soil with essential nutrients, improves soil texture, and acts as a natural pest deterrent. Ideal for all types of crops and garden plants.",
    price: 1200,
    currency: "₹",
    unit: "per 50kg bag",
    stock: 340,
    moq: 10,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80",
    usage: "Apply 100-200 kg per acre during soil preparation. Mix thoroughly with topsoil. Best applied 2-3 weeks before sowing.",
    packaging: "50 kg HDPE bags with inner liner",
    availability: "In Stock",
    rating: 4.8,
    reviews: 124,
    featured: true,
    dateAdded: "2025-12-15"
  },
  {
    id: 2,
    name: "Premium Hybrid Rice Seeds",
    category: "seeds",
    shortDescription: "High-yield hybrid rice seeds with disease resistance.",
    fullDescription: "Developed through advanced breeding techniques, these hybrid rice seeds offer exceptional yield potential, disease resistance, and adaptability to various climatic conditions. Certified for purity and germination rate above 95%.",
    price: 3500,
    currency: "₹",
    unit: "per 5kg pack",
    stock: 150,
    moq: 5,
    image: "https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&w=600&q=80",
    usage: "Sow in well-prepared nursery beds. Transplant 20-25 day old seedlings at 20x15 cm spacing. Suitable for both Kharif and Rabi seasons.",
    packaging: "5 kg moisture-proof aluminum foil packs",
    availability: "In Stock",
    rating: 4.6,
    reviews: 89,
    featured: true,
    dateAdded: "2026-01-20"
  },
  {
    id: 3,
    name: "Bio Potash Mobilizer",
    category: "bio-products",
    shortDescription: "Microbial formulation that unlocks soil potassium for plants.",
    fullDescription: "Bio Potash contains Frateuria aurantia bacteria that solubilize fixed potassium in soil, making it available to plants. Reduces chemical potash usage by 25-50% while improving fruit quality and disease resistance.",
    price: 850,
    currency: "₹",
    unit: "per 5L can",
    stock: 220,
    moq: 8,
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    usage: "Dilute 1L in 200L water for foliar spray or mix with irrigation water. Apply at 2L per acre. Best results when applied during flowering stage.",
    packaging: "5 Litre HDPE cans",
    availability: "In Stock",
    rating: 4.5,
    reviews: 67,
    featured: false,
    dateAdded: "2026-02-10"
  },
  {
    id: 4,
    name: "Humic Acid Granules 90%",
    category: "fertilizers",
    shortDescription: "Premium humic acid for soil conditioning and root growth.",
    fullDescription: "Ultra-concentrated humic acid granules derived from leonardite. Improves soil structure, enhances nutrient uptake, stimulates root development, and increases water retention capacity. Essential for degraded soils.",
    price: 2800,
    currency: "₹",
    unit: "per 25kg bag",
    stock: 180,
    moq: 5,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
    usage: "Apply 8-10 kg per acre by broadcasting or mix with basal fertilizer. Can be dissolved in water for fertigation at 2 kg per 1000L.",
    packaging: "25 kg PP woven bags",
    availability: "In Stock",
    rating: 4.9,
    reviews: 156,
    featured: true,
    dateAdded: "2025-11-05"
  },
  {
    id: 5,
    name: "Premium Vermicompost",
    category: "organic",
    shortDescription: "Nutrient-rich earthworm compost for organic farming.",
    fullDescription: "100% organic vermicompost produced from agricultural waste using Eisenia fetida earthworms. Rich in beneficial microorganisms, humus, and plant-available nutrients. Certified for organic farming use.",
    price: 600,
    currency: "₹",
    unit: "per 50kg bag",
    stock: 500,
    moq: 20,
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
    usage: "Apply 1-2 tons per acre as basal application. For potted plants, mix 20-30% with soil. Ideal for vegetable gardens and fruit orchards.",
    packaging: "50 kg PP bags",
    availability: "In Stock",
    rating: 4.7,
    reviews: 203,
    featured: false,
    dateAdded: "2026-03-01"
  },
  {
    id: 6,
    name: "Seaweed Extract Liquid",
    category: "crop-nutrition",
    shortDescription: "Cold-processed seaweed extract for plant growth stimulation.",
    fullDescription: "100% natural seaweed extract from Ascophyllum nodosum, cold-processed to retain all bioactive compounds. Contains natural cytokinins, auxins, betaines, and trace minerals that boost plant vigor.",
    price: 1600,
    currency: "₹",
    unit: "per 5L can",
    stock: 95,
    moq: 6,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    usage: "Foliar spray: 2-3 ml per liter of water. Drip irrigation: 1L per acre. Apply every 15-20 days during vegetative and reproductive stages.",
    packaging: "5 Litre HDPE cans with measuring cap",
    availability: "In Stock",
    rating: 4.8,
    reviews: 112,
    featured: true,
    dateAdded: "2026-01-15"
  },
  {
    id: 7,
    name: "Chelated Micronutrient Mix",
    category: "crop-nutrition",
    shortDescription: "Complete chelated micronutrient blend for deficiency correction.",
    fullDescription: "EDTA-chelated micronutrient mixture containing Zinc, Iron, Manganese, Copper, Boron, and Molybdenum in plant-available forms. Prevents and corrects micronutrient deficiencies across all major crops.",
    price: 950,
    currency: "₹",
    unit: "per 10kg bag",
    stock: 275,
    moq: 10,
    image: "https://images.unsplash.com/photo-1628352081506-83c43074ed31?auto=format&fit=crop&w=600&q=80",
    usage: "Foliar: 2-3 grams per liter water. Soil application: 5-10 kg per acre. Apply at critical growth stages for best results.",
    packaging: "10 kg laminated pouches",
    availability: "In Stock",
    rating: 4.4,
    reviews: 78,
    featured: false,
    dateAdded: "2026-02-28"
  },
  {
    id: 8,
    name: "Neem Oil Insecticide",
    category: "organic",
    shortDescription: "Cold-pressed neem oil for organic pest management.",
    fullDescription: "Premium cold-pressed neem oil with 3000+ ppm Azadirachtin content. Effective against a broad spectrum of agricultural pests including aphids, whiteflies, caterpillars, and mites while being safe for beneficial insects.",
    price: 1400,
    currency: "₹",
    unit: "per 5L can",
    stock: 160,
    moq: 5,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
    usage: "Dilute 5 ml per liter of water with an emulsifier. Spray during evening hours for best efficacy. Repeat every 7-10 days as needed.",
    packaging: "5 Litre HDPE jerry cans",
    availability: "In Stock",
    rating: 4.6,
    reviews: 145,
    featured: false,
    dateAdded: "2026-04-12"
  },
  {
    id: 9,
    name: "NPK 19:19:19 Complex",
    category: "fertilizers",
    shortDescription: "Water-soluble NPK complex for balanced crop nutrition.",
    fullDescription: "Fully water-soluble NPK complex with equal ratios of Nitrogen, Phosphorus, and Potassium. Ideal for fertigation and foliar application. Provides balanced nutrition for vegetative growth and flowering.",
    price: 2200,
    currency: "₹",
    unit: "per 25kg bag",
    stock: 300,
    moq: 10,
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
    usage: "Fertigation: 3-5 kg per acre per application. Foliar: 5 grams per liter. Apply based on crop stage and requirement.",
    packaging: "25 kg HDPE bags with liner",
    availability: "In Stock",
    rating: 4.7,
    reviews: 198,
    featured: true,
    dateAdded: "2025-10-20"
  },
  {
    id: 10,
    name: "Steamed Bone Meal",
    category: "fertilizers",
    shortDescription: "Natural phosphorus source for root development and flowering.",
    fullDescription: "High-quality steamed bone meal with 24% Phosphorus and 22% Calcium content. Slow-release formula provides sustained phosphorus nutrition. Excellent for root crops, flower beds, and fruit orchards.",
    price: 900,
    currency: "₹",
    unit: "per 25kg bag",
    stock: 200,
    moq: 8,
    image: "https://images.unsplash.com/photo-1607513746990-218cc9498260?auto=format&fit=crop&w=600&q=80",
    usage: "Apply 100-150 kg per acre as basal dose. Mix well with soil before planting. Reapply every 3-4 months for perennial crops.",
    packaging: "25 kg PP bags",
    availability: "In Stock",
    rating: 4.3,
    reviews: 56,
    featured: false,
    dateAdded: "2026-05-08"
  },
  {
    id: 11,
    name: "Fish Amino Acid Liquid",
    category: "bio-products",
    shortDescription: "Hydrolyzed fish protein for foliar nutrition and soil health.",
    fullDescription: "Enzymatically hydrolyzed fish amino acid concentrate containing 18 essential amino acids, trace minerals, and vitamins. Promotes robust vegetative growth, enhances photosynthesis, and improves stress tolerance.",
    price: 1100,
    currency: "₹",
    unit: "per 5L can",
    stock: 130,
    moq: 6,
    image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=600&q=80",
    usage: "Foliar: 2-3 ml per liter. Soil drench: 500 ml per acre in drip system. Apply bi-weekly during active growth period.",
    packaging: "5 Litre HDPE cans",
    availability: "In Stock",
    rating: 4.5,
    reviews: 91,
    featured: false,
    dateAdded: "2026-03-22"
  },
  {
    id: 12,
    name: "Trichoderma Viride Bio-Fungicide",
    category: "bio-products",
    shortDescription: "Beneficial fungus for soil-borne disease management.",
    fullDescription: "High CFU count Trichoderma viride formulation (2 x 10⁹ CFU/gm) for biological control of soil-borne pathogens including Fusarium, Pythium, and Rhizoctonia. Also promotes root growth and nutrient solubilization.",
    price: 750,
    currency: "₹",
    unit: "per 5kg bag",
    stock: 180,
    moq: 10,
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80",
    usage: "Seed treatment: 10g per kg seed. Soil application: 2-3 kg per acre mixed with compost. Avoid mixing with chemical fungicides.",
    packaging: "5 kg moisture-proof pouches",
    availability: "In Stock",
    rating: 4.6,
    reviews: 83,
    featured: false,
    dateAdded: "2026-04-05"
  },
  {
    id: 13,
    name: "Solar Insect Light Trap",
    category: "equipment",
    shortDescription: "Solar-powered LED insect trap for IPM programs.",
    fullDescription: "Autonomous solar-powered insect light trap with UV LED attractant and collection funnel. Covers 2-3 acres radius. Built-in rain sensor and dusk-to-dawn operation. Essential tool for Integrated Pest Management.",
    price: 4500,
    currency: "₹",
    unit: "per unit",
    stock: 45,
    moq: 2,
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdcd1d?auto=format&fit=crop&w=600&q=80",
    usage: "Install at 5-6 feet height in the center of the field. Ensure solar panel faces south. Clean collection tray weekly.",
    packaging: "Individual box with mounting accessories",
    availability: "Limited Stock",
    rating: 4.4,
    reviews: 34,
    featured: false,
    dateAdded: "2026-05-15"
  },
  {
    id: 14,
    name: "Knapsack Sprayer 16L",
    category: "equipment",
    shortDescription: "Heavy-duty manual sprayer for farm chemical application.",
    fullDescription: "Professional-grade 16-liter knapsack sprayer with brass nozzle set, adjustable pressure, and ergonomic padded straps. Corrosion-resistant tank suitable for all agricultural chemicals and bio-inputs.",
    price: 2800,
    currency: "₹",
    unit: "per unit",
    stock: 75,
    moq: 3,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80",
    usage: "Fill tank with pre-mixed solution. Pump handle 10-15 times for pressure. Adjust nozzle for fine mist or coarse spray. Clean thoroughly after each use.",
    packaging: "Individual carton with nozzle kit",
    availability: "In Stock",
    rating: 4.2,
    reviews: 47,
    featured: false,
    dateAdded: "2026-06-01"
  },
  {
    id: 15,
    name: "Hybrid Maize Seeds",
    category: "seeds",
    shortDescription: "Drought-tolerant hybrid maize with high starch content.",
    fullDescription: "Advanced single-cross hybrid maize seeds bred for drought tolerance and high starch content. Maturity period 95-105 days. Suitable for both grain and silage production. Excellent standability and husk cover.",
    price: 2400,
    currency: "₹",
    unit: "per 4kg pack",
    stock: 110,
    moq: 5,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
    usage: "Direct sow at 60x20 cm spacing. Sowing depth 4-5 cm. Irrigate immediately after sowing. Apply recommended NPK at sowing.",
    packaging: "4 kg moisture-barrier pouches",
    availability: "In Stock",
    rating: 4.5,
    reviews: 72,
    featured: false,
    dateAdded: "2026-02-18"
  },
  {
    id: 16,
    name: "Calcium Boron Liquid",
    category: "crop-nutrition",
    shortDescription: "Foliar nutrient for preventing fruit cracking and drop.",
    fullDescription: "Concentrated liquid formulation of Calcium and Boron for prevention of blossom end rot, fruit cracking, and pre-harvest fruit drop. Enhanced with natural chelating agents for superior absorption.",
    price: 980,
    currency: "₹",
    unit: "per 5L can",
    stock: 190,
    moq: 6,
    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80",
    usage: "Foliar spray: 2-3 ml per liter of water. Apply during flowering and fruit development stages. 2-3 sprays at 15-day intervals.",
    packaging: "5 Litre HDPE cans",
    availability: "In Stock",
    rating: 4.7,
    reviews: 104,
    featured: false,
    dateAdded: "2026-04-25"
  }
];


/* ============================================================
   REVIEWS / TESTIMONIALS
   ============================================================ */
const reviews = [
  {
    id: 1,
    name: "Suresh",
    location: "Tamil Nadu, India",
    rating: 5,
    review: "The agricultural consulting service is phenomenal. Their agronomist visited our farm and created a customized nutrition plan. Crop quality improved significantly.",
    company: "TN Agri Solutions",
    image: "",
    date: "2025-12-28"
  },
  {
    id: 2,
    name: "Kavitha Nair",
    location: "Kerala, India",
    rating: 3.5,
    review: "The vermicompost quality is the best I've found in the market. Pure, well-processed, and rich in nutrients. My organic vegetable farm thrives with SecondLeaf products.",
    company: "Kerala Organics Ltd",
    image: "",
    date: "2026-06-01"
  },
  {
    id: 3,
    name: "Rajesh Kannan",
    location: "Tamil Nadu, India",
    rating: 5,
    review: "SecondLeaf's organic fertilizers have transformed my yield. I've seen a 30% increase in just two seasons. Their team provides excellent support and timely delivery.",
    company: "Kannan Agro Farms",
    image: "",
    date: "2026-03-15"
  },
  {
    id: 4,
    name: "Mohammed Farooq",
    location: "Kerala, India",
    rating: 4,
    review: "Excellent range of crop nutrition products. The chelated micronutrient mix corrected the zinc deficiency in my crops. Very responsive customer service team.",
    company: "Farooq Agriculture",
    image: "",
    date: "2026-01-10"
  },
  {
    id: 5,
    name: "Krishnan",
    location: "Tamil Nadu, India",
    rating: 5,
    review: "The bio-products from SecondLeaf have helped us reduce chemical inputs by 40%. Our soil health has improved dramatically. Truly a game-changer for organic farming.",
    company: "Green Harvest Organics",
    image: "",
    date: "2026-02-20"
  },
  {
    id: 6,
    name: "Selvam",
    location: "Kerala, India",
    rating: 5,
    review: "We've been sourcing bulk fertilizers from SecondLeaf for 3 years. Their consistency in quality and competitive pricing makes them our preferred supplier. Highly recommended!",
    company: "Menon AgriCorp",
    image: "",
    date: "2026-04-05"
  },
  {
    id: 7,
    name: "Vikram Raj",
    location: "Tamil Nadu, India",
    rating: 4,
    review: "Great products at fair prices. The seaweed extract worked wonders on my chilli crop. Delivery was prompt and packaging was secure. Will order again.",
    company: "Raj Farms",
    image: "",
    date: "2026-05-12"
  }
];


/* ============================================================
   TEAM
   ============================================================ */
const team = [
  {
    id: 1,
    name: "Mr. M. Karthick Agri",
    role: "",
    description: "",
    image: "assets/images/karthick.jpg",
    linkedin: ""
  },
  {
    id: 2,
    name: "K. Sathish Agri",
    role: "",
    description: "",
    image: "assets/images/sathish.jpg",
    linkedin: ""
  }
];


/* ============================================================
   GALLERY
   ============================================================ */
const gallery = [
  {
    id: 1,
    image: "assets/images/gallery/cardamom-plantation-wide.jpg",
    title: "Lush Cardamom Plantation",
    category: "field"
  },
  {
    id: 2,
    image: "assets/images/gallery/cardamom-plantation-misty.png",
    title: "Misty Cardamom Hills",
    category: "field"
  },
  {
    id: 3,
    image: "assets/images/gallery/cardamom-capsules-close.jpg",
    title: "Fresh Cardamom Pods",
    category: "field"
  },
  {
    id: 4,
    image: "assets/images/gallery/cardamom-flowers-bee.jpg",
    title: "Honeybee Pollinating Cardamom",
    category: "field"
  },
  {
    id: 5,
    image: "assets/images/gallery/cardamom-nursery-plantation.jpg",
    title: "Shade-Grown Cardamom Cultivation",
    category: "field"
  },
  {
    id: 6,
    image: "assets/images/gallery/cardamom-warehouse.jpg",
    title: "Cardamom Sorting & Processing Warehouse",
    category: "facility"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    title: "Partner Organic Farm",
    category: "field"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    title: "Quality Testing Lab",
    category: "facility"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
    title: "Sustainable Paddy Cultivation",
    category: "field"
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    title: "Quality Processing & Sorting",
    category: "facility"
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80",
    title: "Bumper Harvest Yield",
    category: "field"
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1505305976870-c0be1cd39939?auto=format&fit=crop&w=800&q=80",
    title: "Automated Packaging",
    category: "facility"
  },
  {
    id: 13,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    title: "AgriExpo Booth",
    category: "event"
  },
  {
    id: 14,
    image: "https://images.unsplash.com/photo-1463171359579-38a96685987a?auto=format&fit=crop&w=800&q=80",
    title: "Drip Irrigation Demo",
    category: "field"
  },
  {
    id: 15,
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
    title: "Dispatch & Logistics",
    category: "facility"
  }
];


/* ============================================================
   TIMELINE — Company Journey
   ============================================================ */
const timeline = [
  {
    year: 2014,
    title: "Foundation",
    description: "SecondLeaf was founded in Coimbatore with a small warehouse and a vision to revolutionize sustainable agriculture."
  },
  {
    year: 2016,
    title: "Product Line Launch",
    description: "Launched our first range of organic fertilizers and bio-inputs, serving farmers across Tamil Nadu."
  },
  {
    year: 2018,
    title: "Regional Expansion",
    description: "Expanded operations to 5 southern states with 50+ distributor partnerships and a dedicated R&D lab."
  },
  {
    year: 2020,
    title: "Innovation Hub",
    description: "Established the SecondLeaf Innovation Center for developing next-generation biological crop solutions."
  },
  {
    year: 2022,
    title: "National Presence",
    description: "Reached 10 states with 200+ distributors, 50+ products, and crossed 10,000 tons annual delivery."
  },
  {
    year: 2024,
    title: "Sustainability Award",
    description: "Received the National Sustainability Award for contributions to organic farming and soil health restoration."
  },
  {
    year: 2026,
    title: "Digital Transformation",
    description: "Launched our e-commerce platform and digital consulting services, making agricultural solutions accessible online."
  }
];


/* ============================================================
   FAQ
   ============================================================ */
const faqs = [
  {
    question: "What is the minimum order quantity for bulk purchases?",
    answer: "MOQ varies by product. Most organic fertilizers have an MOQ of 5-20 bags, while bio-products start from 6 units. Check individual product listings for specific MOQ details or contact our sales team for custom orders."
  },
  {
    question: "Do you provide delivery across India?",
    answer: "Yes, we deliver to all major agricultural regions across India through our network of logistics partners. Delivery time is typically 3-7 business days depending on location. For remote areas, it may take up to 10 days."
  },
  {
    question: "Are your products certified for organic farming?",
    answer: "Yes, all our organic products are certified by recognized bodies including NPOP (National Programme for Organic Production) and carry relevant certifications. Certificates are available on request."
  },
  {
    question: "Can I get a sample before placing a bulk order?",
    answer: "Absolutely! We offer sample kits for most of our products at nominal charges. Contact our sales team to request samples. For orders above ₹50,000, sample charges are credited back to your account."
  },
  {
    question: "Do you offer agricultural consulting services?",
    answer: "Yes, our team of experienced agronomists provides on-site and remote consulting services including soil analysis, crop planning, nutrition programs, and pest management strategies. Contact us to schedule a consultation."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers (NEFT/RTGS), UPI, credit/debit cards, and offer credit terms for established business accounts. For bulk orders, we can arrange milestone-based payment schedules."
  },
  {
    question: "How do you ensure product quality?",
    answer: "Every batch undergoes rigorous quality testing in our in-house laboratory. We test for nutrient content, microbial count, heavy metals, and contaminants. Batch-wise quality certificates accompany all shipments."
  },
  {
    question: "Can I become a distributor for SecondLeaf?",
    answer: "Yes, we're always looking to expand our distributor network. We offer competitive margins, marketing support, and training programs. Fill out the contact form or email us at partners@secondleaf.com to start the conversation."
  }
];


/* ============================================================
   PARTNER LOGOS
   ============================================================ */
const partners = [
  { id: 1, name: "SWAL", logo: "assets/images/partners/swal.jpg" },
  { id: 2, name: "Syngenta", logo: "assets/images/partners/syngenta.jpg" },
  { id: 3, name: "Indofil", logo: "assets/images/partners/indofil.jpg" },
  { id: 4, name: "Dhanuka", logo: "assets/images/partners/dhanuka.jpg" },
  { id: 5, name: "Insecticides India Limited", logo: "assets/images/partners/insecticides-india.jpg" },
  { id: 6, name: "FMC", logo: "assets/images/partners/fmc.jpg" },
  { id: 7, name: "BASF", logo: "assets/images/partners/basf.jpg" },
  { id: 8, name: "Gharda Chemicals Limited", logo: "assets/images/partners/gharda-chemicals.jpg" },
  { id: 9, name: "PI Industries", logo: "assets/images/partners/pi-industries.jpg" },
  { id: 10, name: "UPL", logo: "assets/images/partners/upl.jpg" },
  { id: 11, name: "Rallis India Limited", logo: "assets/images/partners/rallis-india.jpg" },
  { id: 12, name: "Coromandel", logo: "assets/images/partners/coromandel.jpg" },
  { id: 13, name: "Jivagro", logo: "assets/images/partners/jivagro.jpg" },
  { id: 14, name: "Adama", logo: "assets/images/partners/adama.jpg" },
  { id: 15, name: "Corteva Agriscience", logo: "assets/images/partners/corteva.jpg" },
  { id: 16, name: "Bayer", logo: "assets/images/partners/bayer.jpg" }
];


/* ============================================================
   ADMIN — Orders (placeholder data for dashboard)
   ============================================================ */
const orders = [
  { id: "ORD-001", customer: "Kumar Agro Farms", date: "2026-07-01", total: 48000, status: "Delivered", items: 4 },
  { id: "ORD-002", customer: "Green Harvest Organics", date: "2026-07-03", total: 25600, status: "Processing", items: 3 },
  { id: "ORD-003", customer: "Farooq Agriculture", date: "2026-07-05", total: 72000, status: "Shipped", items: 6 },
  { id: "ORD-004", customer: "Sharma AgriCorp", date: "2026-07-07", total: 15400, status: "Pending", items: 2 },
  { id: "ORD-005", customer: "Devi Farms", date: "2026-07-09", total: 33200, status: "Delivered", items: 5 }
];


/* ============================================================
   ADMIN — Settings (prototype defaults)
   ============================================================ */
const siteSettings = {
  companyName: companyInfo.name,
  logo: companyInfo.logo,
  phone: companyInfo.phone,
  email: companyInfo.email,
  address: companyInfo.address,
  facebook: companyInfo.social.facebook,
  instagram: companyInfo.social.instagram,
  linkedin: companyInfo.social.linkedin,
  whatsapp: companyInfo.social.whatsapp,
  primaryColor: "#556B2F",
  secondaryColor: "#3F5F2A",
  accentColor: "#E9DFC8"
};


/* ============================================================
   UTILITY — Cart and Wishlist (runtime state)
   ============================================================ */
let cart = [];
let wishlist = [];

/**
 * Cart utility functions
 * These modify the in-memory cart array.
 * Replace with Firebase writes when integrating backend.
 */
function addToCart(productId, quantity = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return false;

  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit,
      quantity: quantity,
      moq: product.moq
    });
  }
  return true;
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
}

function updateCartQuantity(productId, quantity) {
  const item = cart.find(item => item.productId === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Wishlist utility functions
 */
function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    return false; // removed
  } else {
    wishlist.push(productId);
    return true; // added
  }
}

function isInWishlist(productId) {
  return wishlist.includes(productId);
}
