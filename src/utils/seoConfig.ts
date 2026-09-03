/**
 * Enterprise SEO & Corporate Entity Configuration
 * ValorTrust Integrated Services LTD
 * 
 * Supports parent corporate identity, multi-sector ecosystem,
 * dynamic canonical URLs, and environment-driven overrides.
 */

export const getSiteUrl = (): string => {
  // Use environment variable if provided, fallback to active Vercel domain
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'https://valortrust-official.vercel.app';
};

export const SITE_URL = getSiteUrl();

export const CORPORATE_ENTITY = {
  name: 'ValorTrust Integrated Services LTD',
  legalName: 'ValorTrust Integrated Services Limited',
  shortName: 'ValorTrust',
  brand: 'ValorTrust',
  registrationNumber: 'RC: 9268182',
  foundingDate: '2023-07',
  status: 'Registered Private Limited Company with CAC Nigeria',
  founder: {
    '@type': 'Person',
    name: 'Mustapha Sani Jibrin',
    jobTitle: 'Chief Executive Officer & Quantity Surveyor',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+2348039535043',
    alternateTelephone: '+2347034372698',
    contactType: 'customer service',
    email: 'valortrustintegratedserviceslt@gmail.com',
    areaServed: ['NG', 'Abuja', 'Kano'],
    availableLanguage: ['en', 'ha'],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kano',
    addressRegion: 'Kano State',
    addressCountry: 'NG',
  },
  serviceAreas: [
    'Abuja',
    'Federal Capital Territory',
    'Kano',
    'Northern Nigeria',
    'Nigeria (Nationwide)',
  ],
  logo: `${SITE_URL}/src/Images/Valortrust%20logo.webp`,
  image: `${SITE_URL}/Hero.png`,
  socialLinks: [
    'https://wa.me/2348039535043',
  ],
};

export interface SectorSEO {
  id: string;
  name: string;
  category: string;
  status: 'ACTIVE' | 'DEVELOPING' | 'FUTURE';
  description: string;
  keywords: string[];
}

export const SECTORS_SEO: SectorSEO[] = [
  {
    id: 'construction',
    name: 'Construction & Building Services',
    category: 'Engineering & Construction',
    status: 'ACTIVE',
    description: 'Professional quantity surveying, structural engineering, building construction, and infrastructure project management in Kano, Abuja, and across Nigeria.',
    keywords: ['construction company Nigeria', 'building contractors Kano', 'quantity surveying Abuja', 'civil engineering Nigeria', 'project management'],
  },
  {
    id: 'procurement',
    name: 'Procurement & Sourcing',
    category: 'Supply Chain & Logistics',
    status: 'ACTIVE',
    description: 'Strategic institutional sourcing, corporate procurement, industrial equipment supply, and transparent vendor logistics.',
    keywords: ['procurement services Nigeria', 'corporate sourcing', 'industrial supply chain', 'tender procurement Kano'],
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    category: 'Agribusiness',
    status: 'ACTIVE',
    description: 'Commercial agribusiness, grain cultivation, farm management, and sustainable agricultural production systems.',
    keywords: ['agribusiness Nigeria', 'commercial farming Kano', 'agricultural investments', 'grain production Nigeria'],
  },
  {
    id: 'agro-export',
    name: 'Agro Export & Global Trade',
    category: 'International Trade',
    status: 'ACTIVE',
    description: 'Exportation of certified Nigerian agricultural commodities including sesame seeds, ginger, hibiscus, and raw cashew nuts meeting global standards.',
    keywords: ['agro export Nigeria', 'commodities trade Kano', 'sesame export', 'ginger export Nigeria', 'agricultural trade'],
  },
  {
    id: 'food-processing',
    name: 'Food & Agro Processing',
    category: 'Industrial Processing',
    status: 'ACTIVE',
    description: 'Value-added agro processing and consumer food products, featuring LeemsDTT Pure Palm Oil — unadulterated, farm-fresh edible oil.',
    keywords: ['palm oil supplier Nigeria', 'LeemsDTT palm oil', 'food processing Nigeria', 'pure edible oil Kano'],
  },
  {
    id: 'solar-energy',
    name: 'Solar & Renewable Energy',
    category: 'Energy & Utilities',
    status: 'ACTIVE',
    description: 'Commercial, industrial, and residential solar power installations, inverter systems, mini-grid developments, and clean energy transition solutions.',
    keywords: ['solar installation Kano', 'renewable energy Nigeria', 'commercial solar Abuja', 'inverter systems Nigeria'],
  },
  {
    id: 'technology',
    name: 'Technology & Data',
    category: 'Information Technology',
    status: 'ACTIVE',
    description: 'Enterprise software development, data solutions, cloud infrastructure, and IT systems integration for modern businesses.',
    keywords: ['software development Kano', 'IT consultancy Nigeria', 'enterprise tech solutions'],
  },
  {
    id: 'digital-visuals',
    name: '3D Animation & Digital Visuals',
    category: 'Media & Design',
    status: 'ACTIVE',
    description: 'High-fidelity architectural 3D visualizations, walkthrough animations, structural modeling, and commercial visual production.',
    keywords: ['architectural 3D rendering Nigeria', '3D animation Kano', 'architectural visualization'],
  },
  {
    id: 'consulting',
    name: 'Consulting & Advisory Services',
    category: 'Management Consulting',
    status: 'ACTIVE',
    description: 'Corporate advisory, business development, feasibility studies, investment appraisal, and public-private partnership structuring.',
    keywords: ['business consulting Nigeria', 'project development advisory', 'corporate strategy Kano'],
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Property',
    category: 'Real Estate',
    status: 'DEVELOPING',
    description: 'Property development, commercial asset management, real estate investment appraisal, and facility management.',
    keywords: ['real estate development Kano', 'property investment Abuja', 'commercial real estate Nigeria'],
  },
  {
    id: 'textile',
    name: 'Textile & Fabrics',
    category: 'Textile & Apparel',
    status: 'DEVELOPING',
    description: 'Fabric sourcing, traditional and industrial textile supply, corporate uniform solutions, and apparel material distribution.',
    keywords: ['textile supply Nigeria', 'fabric sourcing Kano', 'corporate apparel materials'],
  },
  {
    id: 'digital-marketing',
    name: 'Digital & Marketing Services',
    category: 'Digital Media & Growth',
    status: 'ACTIVE',
    description: 'Corporate brand positioning, digital growth strategies, performance marketing, and B2B communication campaigns in Nigeria.',
    keywords: ['digital marketing Nigeria', 'corporate branding Kano', 'social media growth Nigeria'],
  },
];
