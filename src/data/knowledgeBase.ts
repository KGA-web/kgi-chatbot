export const kgiKnowledgeBase = {
  about: {
    name: "Koshys Group of Institutions (KGI)",
    established: "2003",
    location: "#31/1, Kannur P.O, Hennur-Bagalur Road, Mitganahalli, Kadusonnapanahalli, Bengaluru, Karnataka 562149",
    phone: "808 866 0000",
    email: "info@kgi.edu.in",
    website: "kgi.edu.in",
    description: "One of India's premier institutes for higher education, established in 2003 in Bangalore. KGI has been achieving milestones year after year in Academics, Placements, Industry Interaction, Corporate Training, and Extracurricular Activities."
  },
  institutions: [
    {
      name: "Koshys Institute of Management Studies (KIMS)",
      url: "kimsbengaluru.edu.in",
      courses: ["BBA", "BBA Aviation", "BBA Advanced", "B.Com", "B.Com Logistics", "B.Com Advanced", "BCA", "BCA Advanced", "MBA", "MCA"]
    },
    {
      name: "Koshys Institute of Health Sciences (KIHS)",
      url: "kgi.edu.in/KIHS",
      courses: ["GNM Nursing", "B.Sc Nursing", "PBBSc Nursing", "M.Sc Nursing", "B.Sc Renal Dialysis", "B.Sc Respiratory Care", "B.Sc AT & OT", "B.Sc MIT", "B.Sc MLT"]
    },
    {
      name: "Koshys Institute of Hotel Management",
      url: "kimsbengaluru.edu.in/bhm",
      courses: ["Bachelor of Hotel Management (BHM)"]
    },
    {
      name: "Koshys Global Academia (CBSE School)",
      url: "koshysglobalacademia.com",
      courses: ["CBSE School - Pre KG to Class 12"]
    }
  ],
  courses: {
    ug: [
      "B.Sc Forensic Science",
      "BVA - Animation and Multimedia Design",
      "BVA - Applied Arts and Graphic Design",
      "BVA - Interior & Spatial Design",
      "BBA",
      "BBA Aviation (BNU)",
      "BBA Advanced",
      "B.Com",
      "B.Com Logistics",
      "B.Com Advanced",
      "BCA",
      "BCA Advanced"
    ],
    pg: ["MBA", "MCA"],
    nursing: ["GNM", "B.Sc Nursing", "PBBSc", "M.Sc Nursing"],
    alliedHealth: [
      "B.Sc Renal Dialysis",
      "B.Sc Respiratory Care",
      "B.Sc AT & OT (Anesthesia & Operation Theatre)",
      "B.Sc MIT (Medical Imaging Technology)",
      "B.Sc MLT (Medical Laboratory Technology)"
    ],
    school: ["CBSE School - Pre KG to Class 12"]
  },
  admissions: {
    applyNow: "https://apply.kgi.edu.in/",
    brochureUG: "https://kimsbengaluru.edu.in/kimsmail",
    brochureHealth: "https://www.kgi.edu.in/KIHS/kihsmail",
    process: "Visit apply.kgi.edu.in or call 808 866 0000 for admission details."
  },
  campus: {
    facilities: [
      "Separate hostels for boys and girls",
      "Well-furnished rooms with beds, wardrobes, study tables",
      "Hygienic bathroom facilities",
      "Safe drinking water & laundry services",
      "Wi-Fi enabled campus",
      "Natural football turf, basketball court",
      "Volleyball, throwball courts, kabaddi court",
      "Athletics jump pits",
      "Hygienic mess facilities"
    ],
    greenCampus: "Yes, eco-friendly campus with green surroundings"
  },
  placements: {
    partners: ["Infosys", "Tech Mahindra", "IBM", "Kotak", "Reliance", "Tata Motors", "Paytm", "Wipro", "Accenture", "HDFC", "ICICI"],
    highlights: "Students placed with packages up to 10 LPA. Companies like Rinex, Teachnook, SkillHacc, Corizo, iBR visit campus."
  },
  importantNotices: [
    "All fee payments to be made directly to the accounts department of the Institute",
    "Fee receipt to be collected against the same",
    "The institute will not take any responsibility for any fee paid to consultants or third parties"
  ],
  contact: {
    main: {
      phone: "808 866 0000",
      email: "info@kgi.edu.in"
    },
    kims: { phone: "808 866 0000", address: "Hennur Bagalur Road, Kannur P.O., Bangalore - 562149" },
    kihs: { phone: "808 866 0000", address: "Hennur Bagalur Road, Kannur P.O., Bangalore - 562149" },
    globalAcademia: { phone: "+91-90353 32189", address: "#31/1, Kannur P.O, Hennur-Bagalur Road, Bengaluru" },
    koshysHospital: { phone: "080 43517777", address: "Tambuchetty Palaya Road, Ramamurthy Nagar Extn., Bangalore - 560016" },
    littleFlowerHospital: { phone: "+91 6366440907", address: "Opposite to Ramamurthy Nagar Bus Stop, Bangalore - 560016" }
  },
  faqs: [
    {
      q: "What courses are offered?",
      a: "KGI offers Management (BBA, BCA, B.Com, MBA, MCA), Nursing (GNM, B.Sc, M.Sc), Allied Health Sciences, Hotel Management, Animation & Design, and CBSE Schooling."
    },
    {
      q: "How do I apply for admission?",
      a: "You can apply online at apply.kgi.edu.in or call 808 866 0000 for assistance."
    },
    {
      q: "What is the campus location?",
      a: "KGI is located at #31/1, Hennur-Bagalur Road, Kannur P.O., Mitganahalli, Bengaluru, Karnataka 562149."
    },
    {
      q: "Are there hostel facilities?",
      a: "Yes, KGI provides separate hostels for boys and girls with all modern amenities including Wi-Fi, mess, sports facilities."
    },
    {
      q: "What are the placement opportunities?",
      a: "KGI has tie-ups with top companies like Infosys, IBM, TCS, Kotak, Reliance and more. Students get placed with packages up to 10 LPA."
    },
    {
      q: "Is there an entrance exam?",
      a: "For certain courses, entrance exams may be required. Please contact the admission office at 808 866 0000."
    },
    {
      q: "What is the fee structure?",
      a: "Fee structure varies by course. Please contact our admission team at 808 866 0000 for detailed information."
    }
  ]
};

export function generateContextPrompt(userQuery: string): string {
  const faqText = kgiKnowledgeBase.faqs.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n');
  
  return `
You are Kaia (Koshys AI Assistant) for Koshys Group of Institutions, Bangalore.
Help users with admissions, courses, campus info, fees, and general inquiries.

IMPORTANT RULES:
1. Be friendly and helpful
2. For fee-related questions: "For detailed fee information, please contact our admission team at 808 866 0000 or click the Contact button below."
3. Always offer to collect user details (Name, Phone, Course interest) for follow-up
4. Direct to apply.kgi.edu.in for applications

KGI INFORMATION:
- Established: 2003
- Location: ${kgiKnowledgeBase.about.location}
- Phone: ${kgiKnowledgeBase.about.phone}
- Email: ${kgiKnowledgeBase.about.email}
- Institutions: KIMS, KIHS, Hotel Management, Koshys Global Academia

COURSES:
UG: ${kgiKnowledgeBase.courses.ug.join(', ')}
PG: ${kgiKnowledgeBase.courses.pg.join(', ')}
Nursing: ${kgiKnowledgeBase.courses.nursing.join(', ')}
Allied Health: ${kgiKnowledgeBase.courses.alliedHealth.join(', ')}

FAQs:
${faqText}

User Question: ${userQuery}
`;
}