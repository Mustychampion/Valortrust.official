/**
 * Schema.org JSON-LD Structured Data Generator
 * ValorTrust Integrated Services LTD
 * 
 * Provides rigorous, search-engine-compliant structured data
 * adhering to Google Search Central and Schema.org standards.
 */

import { SITE_URL, CORPORATE_ENTITY, SECTORS_SEO } from './seoConfig';

export function getOrganizationJsonLd(): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Corporation',
    '@id': `${SITE_URL}/#organization`,
    name: CORPORATE_ENTITY.name,
    legalName: CORPORATE_ENTITY.legalName,
    alternateName: [CORPORATE_ENTITY.shortName, 'ValorTrust Group', 'ValorTrust Integrated Services'],
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: CORPORATE_ENTITY.logo,
      caption: 'ValorTrust Integrated Services LTD Logo',
    },
    image: CORPORATE_ENTITY.image,
    description: 'ValorTrust Integrated Services LTD is a diversified Nigerian multi-sector enterprise operating across 12 specialised sectors including construction, agribusiness, agro export, solar energy, procurement, and consulting.',
    foundingDate: CORPORATE_ENTITY.foundingDate,
    identifier: CORPORATE_ENTITY.registrationNumber,
    taxID: CORPORATE_ENTITY.registrationNumber,
    founder: CORPORATE_ENTITY.founder,
    address: CORPORATE_ENTITY.address,
    contactPoint: [
      {
        ...CORPORATE_ENTITY.contactPoint,
        telephone: CORPORATE_ENTITY.contactPoint.telephone,
      },
      {
        ...CORPORATE_ENTITY.contactPoint,
        telephone: CORPORATE_ENTITY.contactPoint.alternateTelephone,
        contactType: 'technical support',
      },
    ],
    areaServed: CORPORATE_ENTITY.serviceAreas.map((area) => ({
      '@type': 'AdministrativeArea',
      name: area,
    })),
    sameAs: CORPORATE_ENTITY.socialLinks,
    knowsAbout: [
      'Quantity Surveying',
      'Civil Engineering & Building Construction',
      'Agro Commodity Export (Sesame, Ginger, Hibiscus)',
      'Edible Oil Processing & LeemsDTT Palm Oil',
      'Solar & Renewable Power Systems',
      'Institutional Procurement & Sourcing',
      'Corporate Advisory & Business Development',
    ],
    department: SECTORS_SEO.map((sector) => ({
      '@type': 'Organization',
      name: `ValorTrust ${sector.name}`,
      description: sector.description,
      url: `${SITE_URL}/#sectors`,
    })),
  };
}

export function getWebSiteJsonLd(): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: CORPORATE_ENTITY.name,
    alternateName: CORPORATE_ENTITY.shortName,
    description: 'Official digital portal of ValorTrust Integrated Services LTD — Built on Trust, Driven by Quality.',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en-NG',
  };
}

export function getLocalBusinessJsonLd(): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#localbusiness`,
    name: CORPORATE_ENTITY.name,
    parentOrganization: {
      '@id': `${SITE_URL}/#organization`,
    },
    url: `${SITE_URL}/`,
    telephone: CORPORATE_ENTITY.contactPoint.telephone,
    email: CORPORATE_ENTITY.contactPoint.email,
    priceRange: '₦₦ - ₦₦₦₦',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kano',
      addressRegion: 'Kano State',
      addressCountry: 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 11.9964,
      longitude: 8.5167,
    },
    areaServed: [
      { '@type': 'City', name: 'Kano' },
      { '@type': 'City', name: 'Abuja' },
      { '@type': 'AdministrativeArea', name: 'Federal Capital Territory' },
      { '@type': 'Country', name: 'Nigeria' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
  };
}

export function getSectorsItemListJsonLd(): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ValorTrust Business Sectors & Commercial Services',
    description: 'The 12 specialised business divisions and commercial service lines of ValorTrust Integrated Services LTD',
    numberOfItems: SECTORS_SEO.length,
    itemListElement: SECTORS_SEO.map((sector, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: sector.name,
        category: sector.category,
        description: sector.description,
        provider: {
          '@id': `${SITE_URL}/#organization`,
        },
        areaServed: {
          '@type': 'Country',
          name: 'Nigeria',
        },
      },
    })),
  };
}

export function getBreadcrumbJsonLd(items: { name: string; url: string }[]): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function getArticleJsonLd(article: {
  headline: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  keywords?: string[];
}): Record<string, any> {
  const fullUrl = article.url.startsWith('http') ? article.url : `${SITE_URL}${article.url}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    headline: article.headline,
    description: article.description,
    image: article.imageUrl
      ? (article.imageUrl.startsWith('http') ? article.imageUrl : `${SITE_URL}${article.imageUrl}`)
      : `${SITE_URL}/Hero.png`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.authorName || 'Mustapha Sani Jibrin',
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    keywords: article.keywords ? article.keywords.join(', ') : undefined,
    inLanguage: 'en-NG',
  };
}
