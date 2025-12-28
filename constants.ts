import { Project, Hobby, HobbyType, Experience, Education } from './types';

export const NAV_LINKS = [
  { id: 'home', label: '00 // ENTRY' },
  { id: '9-5', label: '01 // WORK' },
  { id: '5-9', label: '02 // LIFE' },
  { id: 'about', label: '03 // ARCHIVE' },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "White River Water Quality Improvement Plan",
    category: "Environmental Planning",
    year: "2024",
    description: "Indiana has the highest total miles of rivers impaired for recreation, and the White River is a key example of this ongoing challenge. Flowing through the heart of the state, the river has suffered from long-term pollution, habitat degradation, and historic events such as the 1999 toxic discharge that caused a massive fish kill. Today, the White River remains heavily impacted by nutrient pollution, E. coli, and runoff from agricultural, urban, and industrial sources, limiting its recreational and ecological potential.\n\nThis project proposes a Water Quality Improvement Plan that focuses on design-driven interventions to address nutrient pollution in the White River. Building on existing planning efforts, the research identifies major pollution sources and translates scientific analysis into site-specific design strategies along the riverbanks. By targeting different stages and conditions of the river edge, the project explores how landscape design can actively contribute to water quality improvement and the long-term ecological health of the White River.",
    imageUrl: "/images/proj1/white-river-01.jpeg",
    mainImageCaption: "PROJECT STATEMENT + WHITE RIVER HISTORY",
    mainImageCategory: "OVERVIEW",
    tags: ["Urban Design", "Sustainability"],
    locationCoordinates: "Indianapolis, IN",
    gallery: [
      { url: "/images/proj1/white-river-02.jpeg", caption: "RESEARCH QUESTION", category: "OVERVIEW" },
      { url: "/images/proj1/white-river-03.jpeg", caption: "PROJECT METHODS + PROCESS", category: "OVERVIEW" },
      { url: "/images/proj1/white-river-04.jpeg", caption: "SITE + DATA ANALYSIS", category: "ANALYSIS" },
      { url: "/images/proj1/white-river-05.jpeg", caption: "SELECTED WATER SAMPLE LOCATION ANALYSIS", category: "ANALYSIS" },
      { url: "/images/proj1/white-river-06.jpeg", caption: "PRECEDENT IMAGE BOARD", category: "ANALYSIS" },
      { url: "/images/proj1/white-river-07.jpeg", caption: "PROJECT GOALS + OBJECTIVES", category: "PROPOSAL" },
      { url: "/images/proj1/white-river-08.jpeg", caption: "DESIGN INTERVENTION VISION PLAN", category: "PROPOSAL" },
      { url: "/images/proj1/white-river-09.jpeg", caption: "DESIGN DETAIL - AGRICULTURAL CONTEXT REPRESENTATIVE SITE", category: "DETAILS" },
      { url: "/images/proj1/white-river-10.jpeg", caption: "REPRESENTATIVE SITE - VISUALIZATION", category: "DETAILS" },
      { url: "/images/proj1/white-river-11.jpeg", caption: "REPRESENTATIVE SITE - VISUALIZATION", category: "DETAILS" },
      { url: "/images/proj1/white-river-12.jpeg", caption: "DESIGN DETAIL - SUBURBAN CONTEXT REPRESENTATIVE SITE", category: "DETAILS" },
      { url: "/images/proj1/white-river-13.jpeg", caption: "REPRESENTATIVE SITE - VISUALIZATION", category: "DETAILS" },
      { url: "/images/proj1/white-river-14.jpeg", caption: "REPRESENTATIVE SITE - VISUALIZATION", category: "DETAILS" }
    ]
  },
  {
    id: 2,
    title: "Denver Downtown Master Plan",
    category: "Urban Design",
    year: "2023-2024",
    description: "This project is a comprehensive master plan for Downtown Denver, focusing on enhancing urban connectivity, public spaces, and sustainable growth. The proposal integrates new green corridors, pedestrian-friendly zones, and mixed-use developments to revitalize the city center. By analyzing existing urban fabrics and identifying key opportunity areas, the plan aims to create a more vibrant, resilient, and accessible downtown for residents and visitors alike.",
    imageUrl: "/images/proj2/denver-01.jpeg",
    mainImageCaption: "MASTER PLAN OVERVIEW",
    mainImageCategory: "OVERVIEW",
    hideMainImageInDetail: true,
    tags: ["Master Planning", "Urbanism"],
    locationCoordinates: "Denver, CO",
    gallery: [
      { url: "/images/proj2/denver-02.png", caption: "EXISTING CONDITIONS - DOWNTOWN DENVER", category: "ANALYSIS" },
      { url: "/images/proj2/denver-03.png", caption: "EXISTING CONDITIONS - DOWNTOWN DENVER", category: "ANALYSIS" },
      { url: "/images/proj2/denver-04.png", caption: "DESIGN STRATEGIES - CONNECTIVITY & GREEN SPACE", category: "PLAN" },
      { url: "/images/proj2/denver-05.png", caption: "DESIGN STRATEGIES - CONNECTIVITY & GREEN SPACE", category: "PLAN" },
      { url: "/images/proj2/denver-06.png", caption: "MASTER PLAN PROPOSAL", category: "PLAN" },
      { url: "/images/proj2/denver-07.png", caption: "MASTER PLAN PROPOSAL", category: "PLAN" }
    ]
  },
  {
    id: 3,
    title: "Oak Street Streetscape Renovation",
    category: "Streetscape Design",
    year: "2023",
    description: "A comprehensive streetscape renovation project aimed at revitalizing Oak Street. The design focuses on enhancing pedestrian safety, improving accessibility, and introducing green infrastructure to create a vibrant and sustainable urban corridor.",
    imageUrl: "https://picsum.photos/id/54/1200/800",
    mainImageCaption: "STREETSCAPE OVERVIEW",
    mainImageCategory: "OVERVIEW",
    tags: ["Urban Design", "Infrastructure"],
    locationCoordinates: "Zionsville, IN",
    gallery: [
      { url: "https://picsum.photos/id/55/1200/800", caption: "DETAIL VIEW", category: "DETAILS" },
      { url: "https://picsum.photos/id/56/1200/800", caption: "DETAIL VIEW", category: "DETAILS" },
      { url: "https://picsum.photos/id/57/1200/800", caption: "DETAIL VIEW", category: "DETAILS" },
      { url: "https://picsum.photos/id/58/1200/800", caption: "DETAIL VIEW", category: "DETAILS" }
    ]
  },
  {
    id: 4,
    title: "Howland Ditch Development Plan",
    category: "Environmental Planning",
    year: "2021",
    description: "A strategic development plan focused on the ecological restoration and recreational activation of the Howland Ditch corridor. The project integrates stormwater management strategies with community amenities.",
    imageUrl: "https://picsum.photos/id/28/1200/800",
    mainImageCaption: "DEVELOPMENT PLAN OVERVIEW",
    mainImageCategory: "OVERVIEW",
    tags: ["Planning", "Restoration"],
    locationCoordinates: "Indianapolis, IN",
    gallery: [
      { url: "https://picsum.photos/id/29/1200/800", caption: "DETAIL VIEW", category: "DETAILS" },
      { url: "https://picsum.photos/id/30/1200/800", caption: "DETAIL VIEW", category: "DETAILS" },
      { url: "https://picsum.photos/id/31/1200/800", caption: "DETAIL VIEW", category: "DETAILS" },
      { url: "https://picsum.photos/id/32/1200/800", caption: "DETAIL VIEW", category: "DETAILS" }
    ]
  }
];

export const HOBBIES: Hobby[] = [
  { 
    id: 1, 
    title: "Latte Art", 
    type: HobbyType.HAND, 
    imageUrl: "/images/latte-art/latte-art-cover.jpg", 
    date: "2025-Present",
    description: "Exploring the fluid dynamics of milk and espresso. A daily practice of patience and precision.",
    gallery: [
        { url: "/images/latte-art/latte-art-20251106.png", caption: "11/06/2025" },
        { url: "/images/latte-art/latte-art-20251123.png", caption: "11/23/2025" },
        { url: "/images/latte-art/latte-art-20251216.png", caption: "12/16/2025" }
    ]
  },
  { 
    id: 2, 
    title: "Ceramics", 
    type: HobbyType.HAND, 
    imageUrl: "/images/ceramics/ceramics-cover.jpg", 
    date: "2026",
    description: "Hand-thrown ceramics focusing on functional forms and glazing techniques.",
    gallery: [
        { url: "https://picsum.photos/id/158/800/800", caption: "Wheel Throwing1" },
        { url: "https://picsum.photos/id/157/800/800", caption: "Wheel Throwing2" },
        { url: "https://picsum.photos/id/156/800/800", caption: "Trimming1" },
        { url: "https://picsum.photos/id/155/800/800", caption: "Trimming2" },
        { url: "https://picsum.photos/id/154/800/800", caption: "Bisque Firing1" },
        { url: "https://picsum.photos/id/153/800/800", caption: "Bisque Firing2" },
        { url: "https://picsum.photos/id/159/800/800", caption: "Glazing Process1" },
        { url: "https://picsum.photos/id/152/800/800", caption: "Glazing Process2" },
        { url: "https://picsum.photos/id/160/800/800", caption: "Finished Bowls1" },
        { url: "https://picsum.photos/id/452/800/800", caption: "Kiln Loading1" },
        { url: "https://picsum.photos/id/351/800/800", caption: "Kiln Loading2" },
        { url: "https://picsum.photos/id/544/800/800", caption: "Kiln Loading3" },
        { url: "https://picsum.photos/id/637/800/800", caption: "Kiln Loading4" }
    ]
  },

  // By Pen - Drawing (Single Entry)
  { 
    id: 3, 
    title: "Sketches", 
    type: HobbyType.PEN, 
    imageUrl: "/images/sketches/sketches-cover.jpg", 
    date: "2023-2024",
    description: "A visual diary capturing the whimsy and quiet beauty of daily life through ink. These sketches observe the charming details that soften the edges of the built environment.",
    gallery: [
        { url: "/images/sketches/IMG_5540.png", caption: "Sketch 1" },
        { url: "/images/sketches/IMG_5859.png", caption: "Sketch 2" }
    ]
  },

  // By Electronics - Photography (Single Entry)
  { 
    id: 4, 
    title: "Photography", 
    type: HobbyType.ELECTRONICS, 
    imageUrl: "https://picsum.photos/id/435/600/600", 
    date: "2023-2024",
    description: "Digital explorations of light, texture, and composition.",
    gallery: [
        { url: "https://picsum.photos/id/44/800/800", caption: "Light & Shadow" },
        { url: "https://picsum.photos/id/47/800/800", caption: "Urban Texture" },
        { url: "https://picsum.photos/id/51/800/800", caption: "Nature Macro" },
        { url: "https://picsum.photos/id/58/800/800", caption: "Street Scene" }, 
        { url: "https://picsum.photos/id/61/800/800", caption: "Architectural Lines" },
        { url: "https://picsum.photos/id/64/800/800", caption: "Reflections" },
        { url: "https://picsum.photos/id/67/800/800", caption: "Color Study" },
        { url: "https://picsum.photos/id/70/800/800", caption: "Night Lights" },
        { url: "https://picsum.photos/id/73/800/800", caption: "Urban Geometry" },
        { url: "https://picsum.photos/id/76/800/800", caption: "Natural Patterns" },
        { url: "https://picsum.photos/id/79/800/800", caption: "City Silhouette" }, 
        { url: "https://picsum.photos/id/82/800/800", caption: "Abstract Forms" },
        { url: "https://picsum.photos/id/85/800/800", caption: "Street Portrait" },
        { url: "https://picsum.photos/id/88/800/800", caption: "Urban Decay" },
        { url: "https://picsum.photos/id/91/800/800", caption: "Light Trails" },
        { url: "https://picsum.photos/id/94/800/800", caption: "City at Dusk" }
    ]
  },
];

export const EXPERIENCES: Experience[] = [
  {
    role: "Landscape Architect I",
    company: "MKSK",
    period: "Jul 2024 - Present",
    description: "Full-time landscape architecture practice focused on planning and urban design.",
    location: "Indianapolis, IN"
  },
  {
    role: "Landscape Architecture Intern",
    company: "OJB Landscape Architecture",
    period: "Aug 2022 - Jul 2023",
    description: "Collaborated on design and documentation for high-profile landscape projects.",
    location: "Boston, MA"
  },
  {
    role: "Research Assistant",
    company: "Purdue University",
    period: "May 2022 - Jul 2022",
    description: "Provided research support for academic landscape architecture studies.",
    location: "West Lafayette, IN"
  },
  {
    role: "Student Research Assistant",
    company: "Landscape Architecture Foundation",
    period: "Feb 2022 - Jul 2022",
    description: "Contributed to LAF Case Study Investigation (CSI) program.",
    location: "Remote / Hybrid"
  }
];

export const EDUCATION: Education[] = [
  {
    degree: "Bachelor of Science in Landscape Architecture",
    school: "Purdue University",
    year: "2019 - 2024"
  }
];