export const kgiKnowledgeBase = {
  name: "Koshys Group of Institutions (KGI)",
  established: 2003,
  founder: "Late Shri. C. Koshy",
  chairman: "Dr. Santhosh Koshy",
  location: "#31/1, Hennur-Bagalur Road, Kannur P.O., Mitganahalli, Bengaluru, Karnataka 562149",
  phone: "808 866 0000",
  email: "info@kgi.edu.in",
  website: "kgi.edu.in",
  applyNow: "https://apply.kgi.edu.in",
  
  vision: "Be One Among the Top Reflective and Active Learning Institutions.",
  mission: "Nurturing an Institutional Environment for Excellence in Education and Positive Transformation in Students & Society.",
  
  philosophy: "ICM Model - Initiate, Create, Manage",
  
  institutions: [
    { name: "KIMS (Management Studies)", url: "kimsbengaluru.edu.in", courses: ["BBA", "BBA Aviation", "B.Com", "B.Com Logistics", "BCA", "MBA", "MCA"] },
    { name: "KIHS (Health Sciences)", url: "kgi.edu.in/KIHS", courses: ["GNM Nursing", "B.Sc Nursing", "M.Sc Nursing", "B.Sc MLT", "B.Sc MIT", "B.Sc Renal Dialysis", "B.Sc Respiratory Care", "B.Sc AT & OT"] },
    { name: "Koshys Institute of Allied Health Sciences", url: "kgi.edu.in", courses: ["B.Sc Anaesthesia & OT", "B.Sc Medical Imaging Technology", "B.Sc Medical Laboratory Technology", "B.Sc Respiratory Care Technology", "B.Sc Renal Dialysis Technology"] },
    { name: "Koshys Institute of Hotel Management", url: "kimsbengaluru.edu.in/bhm", courses: ["BHM"] },
    { name: "Koshys Global Academia (CBSE)", url: "koshysglobalacademia.com", courses: ["Pre KG to Class 12"] }
  ],

  courses: {
    ug: ["BBA", "BBA Aviation", "B.Com", "B.Com Logistics", "BCA", "BHM", "BVA Animation", "BVA Graphic Design", "B.Sc Forensic Science"],
    pg: ["MBA", "MCA"],
    nursing: ["GNM", "B.Sc Nursing", "PBBSc Nursing", "M.Sc Nursing"],
    alliedHealth: ["B.Sc MLT", "B.Sc MIT", "B.Sc Renal Dialysis", "B.Sc Respiratory Care", "B.Sc AT & OT"]
  },

  bbaSpecializations: ["General", "Business Analytics", "Digital Marketing", "E-Commerce", "Tourism & Hospitality", "Aviation Management"],
  bcaSpecializations: ["General", "AI & ML", "Cyber Security", "Data Science", "Cloud Computing"],
  bcomSpecializations: ["General", "Logistics & SCM", "Business Analytics", "ACCA", "CA Foundation"],
  mbaSpecializations: ["Marketing", "HRM", "Finance", "Healthcare Management", "BFIS", "Logistics & SCM", "Business Analytics", "Startups & SMEs"],

  admissions: {
    eligibility: "10+2 with minimum 50% for UG; Bachelor's degree with 50% for PG",
    process: "Apply online at apply.kgi.edu.in or call 808 866 0000",
    entrance: "KMAT, PGCET or national MBA entrance test followed by PI"
  },

  scholarships: "Up to 100% under Koshys National Scholarship Scheme",

  placements: {
    vision: "Placements beyond profits",
    head: "Arun N - placementhead@kgi.edu.in",
    highestPackage: "10 LPA",
    companies: ["Infosys", "Tech Mahindra", "IBM", "Kotak", "Reliance", "Tata Motors", "Paytm", "Wipro", "Accenture", "HDFC", "ICICI", "Marriott", "ITC Hotels"],
    support: "100% placement assistance with training from Semester 1"
  },

  campus: {
    area: "7.13 acres",
    wifi: true,
    facilities: ["Smart classrooms", "Library with DELNET", "Computer labs", "Sports ground", "Gym", "Hostels", "Cafeteria", "Auditorium"],
    hostels: "Separate for boys and girls with Wi-Fi, mess, laundry",
    greenCampus: true
  },

  importantNotices: [
    "All fee payments must be made DIRECTLY to the accounts department. Collect fee receipt.",
    "KGI takes NO RESPONSIBILITY for fees paid to consultants or third parties."
  ],

  faqs: [
    { q: "What courses are offered?", a: "BBA, BBA Aviation, B.Com, B.Com Logistics, BCA, BHM, MBA, MCA, Nursing (GNM, B.Sc, M.Sc), Allied Health Sciences, CBSE School" },
    { q: "How do I apply?", a: "Apply online at https://apply.kgi.edu.in or call 808 866 0000" },
    { q: "What is the eligibility?", a: "10+2 with 50% for UG courses; Bachelor's degree with 50% for PG" },
    { q: "Are scholarships available?", a: "Yes, up to 100% under Koshys National Scholarship Scheme" },
    { q: "What is the campus location?", a: "#31/1, Hennur-Bagalur Road, Kannur P.O., Bengaluru, Karnataka 562149" },
    { q: "Are there hostel facilities?", a: "Yes, separate hostels for boys and girls with Wi-Fi, mess, laundry" },
    { q: "What is the placement record?", a: "Highest package up to 10 LPA with 100% placement assistance" },
    { q: "What is the fee structure?", a: "Contact 808 866 0000 for detailed fee information" }
  ]
};

export function generateContextPrompt(userQuery: string): string {
  const kb = kgiKnowledgeBase;
  return `
You are KAIA, the official AI assistant for Koshys Group of Institutions (KGI), Bangalore.

RULES:
1. Only answer about KGI. For other topics, say "I can only help with KGI-related queries."
2. Never guess fees - direct to 808 866 0000 or apply.kgi.edu.in
3. Use web search for specific details about courses, admissions, events
4. Be friendly, concise. Offer to help with admissions after answering.

KGI FACTS:
- Established: ${kb.established}
- Phone: ${kb.phone} | Email: ${kb.email}
- Apply: ${kb.applyNow}
- Vision: ${kb.vision}
- Institutions: ${kb.institutions.map(i => i.name).join(', ')}
- Courses UG: ${kb.courses.ug.join(', ')}
- Courses PG: ${kb.courses.pg.join(', ')}
- Nursing: ${kb.courses.nursing.join(', ')}
- Highest Placement: ${kb.placements.highestPackage}
- Scholarships: ${kb.scholarships}

IMPORTANT: All fees must be paid directly to Institute accounts. No responsibility for fees paid to consultants.

User Question: ${userQuery}
`;
}
