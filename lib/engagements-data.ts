// Real client engagement data, grouped by location. Source: Cyberxperts
// engagement history as supplied directly (client, engagement, industry,
// location). Service labels are shortened to the 9 categories specified for
// display; the fuller engagement description is kept for detail on hover/click.

export type Engagement = {
  client: string;
  engagement: string;
  industry: string;
  service: string; // one of the 9 shortened categories
};

export type Location = {
  id: string;
  name: string;
  country: string;
  // Position as a percentage within the map's bounding box (x: 0=west/left,
  // y: 0=north/top). Approximate, for a stylised footprint visual — not
  // survey-grade coordinates.
  x: number;
  y: number;
  engagements: Engagement[];
};

export const SERVICE_CATEGORIES = [
  "ISO 27001 Assessment",
  "Managed Security Services",
  "Security Operations Centre Deployment",
  "Vulnerability Assessment and Penetration Testing",
  "NIST Cyber Security Assessment",
  "Governance and Policy Development",
  "Infrastructure Monitoring and Support",
  "Digital Forensics",
  "Business Continuity and Disaster Recovery Audit",
] as const;

export const locations: Location[] = [
  {
    id: "johannesburg",
    name: "Johannesburg",
    country: "South Africa",
    x: 68.65,
    y: 26.78,
    engagements: [
      { client: "Nedbank", engagement: "Cybersecurity audit based on ISO 27001, 2022–2023", industry: "Banking and Financial Services", service: "ISO 27001 Assessment" },
      { client: "Transnet SOC", engagement: "NIST and ISO 27001 cyber security gap and maturity assessment, 2019", industry: "Transport and Logistics", service: "NIST Cyber Security Assessment" },
      { client: "Transnet SOC", engagement: "Threat assessment, 2019", industry: "Transport and Logistics", service: "NIST Cyber Security Assessment" },
      { client: "Bayport Financial Services", engagement: "Cybersecurity audit and vulnerability assessments across multiple countries, 2021–2022", industry: "Financial Services", service: "Vulnerability Assessment and Penetration Testing" },
      { client: "Payments Association of South Africa (PASA)", engagement: "NIST governance framework and policy development, 2022", industry: "Financial Services and Payments", service: "Governance and Policy Development" },
      { client: "Mzimkhulu Holdings", engagement: "NIST cyber framework implementation and maintenance, 2019–2024", industry: "Investment and Business Services", service: "NIST Cyber Security Assessment" },
      { client: "Mzimkhulu Holdings", engagement: "SOC deployment, implementation, monitoring and support, 2023–2026", industry: "Investment and Business Services", service: "Security Operations Centre Deployment" },
      { client: "Mzimkhulu Holdings", engagement: "ICT infrastructure monitoring and support, 2019–2024", industry: "Investment and Business Services", service: "Infrastructure Monitoring and Support" },
      { client: "Siyavuna Trading", engagement: "ICT infrastructure monitoring and support, 2020–2025", industry: "Trading and Distribution", service: "Infrastructure Monitoring and Support" },
      { client: "SA-DRC Chamber of Commerce and Industry", engagement: "ICT infrastructure monitoring and support, 2021–2026", industry: "Trade and Commerce", service: "Infrastructure Monitoring and Support" },
      { client: "Electrical Pension and Provident Fund (EPPF)", engagement: "NIST Cyber Security Framework assessment and support, 2025–2026", industry: "Pension and Financial Services", service: "NIST Cyber Security Assessment" },
      { client: "Electrical Pension and Provident Fund (EPPF)", engagement: "Vulnerability assessment and penetration testing, 2026", industry: "Pension and Financial Services", service: "Vulnerability Assessment and Penetration Testing" },
      { client: "Egoli Gas", engagement: "Network security and penetration testing assessment, 2022–2026", industry: "Energy and Utilities", service: "Vulnerability Assessment and Penetration Testing" },
      { client: "Reatile Group", engagement: "Network security and penetration testing assessment, 2022–2026", industry: "Energy and Infrastructure", service: "Vulnerability Assessment and Penetration Testing" },
      { client: "CNG Group", engagement: "Network security and penetration testing assessment, 2025", industry: "Energy and Infrastructure", service: "Vulnerability Assessment and Penetration Testing" },
    ],
  },
  {
    id: "pretoria",
    name: "Pretoria",
    country: "South Africa",
    x: 69.44,
    y: 24.22,
    engagements: [
      { client: "Companies and Intellectual Property Commission (CIPC)", engagement: "Data security assessment aligned to the POPI Act, 2022", industry: "Government and Regulatory Services", service: "Governance and Policy Development" },
      { client: "Government Employees Medical Scheme (GEMS)", engagement: "Service provider network cyber security audit — ISO 27001 maturity assessments, 2020–2021", industry: "Healthcare Administration", service: "ISO 27001 Assessment" },
      { client: "Government Employees Medical Scheme (GEMS)", engagement: "Business continuity and disaster recovery audit, 2020–2021", industry: "Healthcare Administration", service: "Business Continuity and Disaster Recovery Audit" },
      { client: "Government Employees Medical Scheme (GEMS)", engagement: "NIST and ISO 27001 security assessment, 2020–2021", industry: "Healthcare Administration", service: "NIST Cyber Security Assessment" },
      { client: "Pan South African Language Board (PANSALB)", engagement: "SOC deployment, implementation, monitoring and support, 2023–2026", industry: "Public Sector", service: "Security Operations Centre Deployment" },
      { client: "Pan South African Language Board (PANSALB)", engagement: "Network security and penetration testing assessment, 2024–2026", industry: "Public Sector", service: "Vulnerability Assessment and Penetration Testing" },
      { client: "Office of the Pension Funds Adjudicator (OPFA)", engagement: "Managed security services, 2024–2026", industry: "Financial Regulation", service: "Managed Security Services" },
      { client: "Quality Council for Trades and Occupations (QCTO)", engagement: "ICT infrastructure monitoring and support, 2023–2026", industry: "Education and Skills Development", service: "Infrastructure Monitoring and Support" },
      { client: "South African Qualifications Authority (SAQA)", engagement: "ICT infrastructure monitoring and support, 2025–2026", industry: "Education and Qualifications", service: "Infrastructure Monitoring and Support" },
    ],
  },
  {
    id: "centurion",
    name: "Centurion",
    country: "South Africa",
    x: 69.45,
    y: 24.86,
    engagements: [
      { client: "National Nuclear Regulator (NNR)", engagement: "ISO 27001 maturity assessment and network security assessment, 2021", industry: "Nuclear Energy and Regulation", service: "ISO 27001 Assessment" },
      { client: "National Nuclear Regulator (NNR)", engagement: "Network security testing, 2023", industry: "Nuclear Energy and Regulation", service: "Vulnerability Assessment and Penetration Testing" },
    ],
  },
  {
    id: "midrand",
    name: "Midrand",
    country: "South Africa",
    x: 69.1,
    y: 25.63,
    engagements: [
      { client: "Gijima", engagement: "ISO 27001 ISMS implementation and certification, 2022–2023", industry: "Information Technology Services", service: "ISO 27001 Assessment" },
      { client: "SASSETA", engagement: "Managed security services, 2024–2026", industry: "Education and Training", service: "Managed Security Services" },
      { client: "SASSETA", engagement: "ICT infrastructure monitoring and support, 2022–2026", industry: "Education and Training", service: "Infrastructure Monitoring and Support" },
    ],
  },
  {
    id: "durban",
    name: "Durban (eThekwini)",
    country: "South Africa",
    x: 85.26,
    y: 47.18,
    engagements: [
      { client: "eThekwini Municipality", engagement: "SOC deployment, implementation, monitoring and support, 2023–2026", industry: "Local Government", service: "Security Operations Centre Deployment" },
    ],
  },
  {
    id: "mbombela",
    name: "Mbombela",
    country: "South Africa",
    x: 84.97,
    y: 22.7,
    engagements: [
      { client: "Ehlanzeni District Municipality", engagement: "Network security assessment, 2021", industry: "Local Government", service: "Vulnerability Assessment and Penetration Testing" },
    ],
  },
  {
    id: "thohoyandou",
    name: "Thohoyandou",
    country: "South Africa",
    x: 82.25,
    y: 8.58,
    engagements: [
      { client: "Thulamela Local Municipality", engagement: "Managed security services, 2024–2026", industry: "Local Government", service: "Managed Security Services" },
    ],
  },
  {
    id: "thabazimbi",
    name: "Thabazimbi",
    country: "South Africa",
    x: 65.1,
    y: 17.77,
    engagements: [
      { client: "Thabazimbi Local Municipality", engagement: "Network security and penetration testing assessment, 2023", industry: "Local Government", service: "Vulnerability Assessment and Penetration Testing" },
    ],
  },
  {
    id: "springbok",
    name: "Springbok",
    country: "South Africa",
    x: 11.92,
    y: 46.1,
    engagements: [
      { client: "Namakwa District Municipality", engagement: "Network security assessment, 2021", industry: "Local Government", service: "Vulnerability Assessment and Penetration Testing" },
    ],
  },
  {
    id: "garies",
    name: "Garies",
    country: "South Africa",
    x: 12.46,
    y: 51.1,
    engagements: [
      { client: "Kamiesberg Municipality", engagement: "Network security assessment, 2021", industry: "Local Government", service: "Vulnerability Assessment and Penetration Testing" },
    ],
  },
  {
    id: "port-nolloth",
    name: "Port Nolloth",
    country: "South Africa",
    x: 6.21,
    y: 43.79,
    engagements: [
      { client: "Richtersveld Municipality", engagement: "Network security assessment, 2021", industry: "Local Government", service: "Vulnerability Assessment and Penetration Testing" },
    ],
  },
  {
    id: "williston",
    name: "Williston",
    country: "South Africa",
    x: 28.76,
    y: 55.46,
    engagements: [
      { client: "Karoo Hoogland Municipality", engagement: "Network security assessment, 2021", industry: "Local Government", service: "Vulnerability Assessment and Penetration Testing" },
    ],
  },
];

// Outside the African footprint map's scope — shown as a separate note
// rather than placed inaccurately on the map.
export const internationalEngagement = {
  client: "Grupo Cobra",
  location: "Madrid, Spain",
  engagements: [
    { engagement: "Cybersecurity assessment and digital forensics, 2022", service: "Digital Forensics" },
    { engagement: "SOC deployment, implementation, monitoring and support, 2023–2026", service: "Security Operations Centre Deployment" },
  ],
};
