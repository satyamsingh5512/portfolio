import { about } from "@/config/About";
import { heroConfig, socialLinks } from "@/config/Hero";
import { siteConfig } from "@/config/Meta";

/**
 * JSON-LD structured data for the site: a Person schema describing the site
 * owner (used by Google for knowledge panel / rich results) and a WebSite
 * schema describing the site itself.
 *
 * Rendered once in the root layout so it applies site-wide.
 */
export default function StructuredData() {
  const sameAs = socialLinks
    .filter((link) => link.name !== "Email")
    .map((link) => link.href);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: heroConfig.name,
    alternateName: siteConfig.author.name,
    jobTitle: heroConfig.title,
    description: about.expertise.join(". "),
    url: siteConfig.url,
    image: heroConfig.avatar,
    email: `mailto:${siteConfig.author.email}`,
    sameAs,
    knowsAbout: heroConfig.skills.map((skill) => skill.name),
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "NIST University",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.title,
    alternateName: `${heroConfig.name} Portfolio`,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      "@type": "Person",
      name: heroConfig.name,
    },
    inLanguage: "en",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
