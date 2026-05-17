import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  name?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  name = 'exoad - Jiaming Meng'
}: SEOProps) {
  const currentUrl = url || window.location.href;
  const siteTitle = title.includes('exoad') ? title : `exoad - Jiaming Meng | ${title}`;
  const absoluteImage = image
    ? (image.startsWith('http') ? image : `https://exoad.net${image}`)
    : undefined;

  const schemaPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Jiaming Meng",
    "alternateName": "exoad",
    "url": "https://exoad.net",
    "sameAs": [
      "https://github.com/exoad",
      "https://linkedin.com/in/jack-meng",
    ],
    "jobTitle": "Software Developer"
  };

  const schemaWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "exoad",
    "url": "https://exoad.net",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://exoad.net/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const schemaBreadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://exoad.net"
      }, {
        "@type": "ListItem",
        "position": 2,
        "name": title,
        "item": currentUrl
      }]
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={currentUrl} />
      <meta name="author" content="Jiaming Meng" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={name} />

      {/* Twitter */}
      {absoluteImage ? (
        <>
          <meta name="twitter:card" content='summary_large_image' />
          <meta name='twitter:title' content={siteTitle} />
          <meta name='twitter:description' content={description} />
          <meta name='twitter:image' content={absoluteImage} />
        </>
      ) : (
        <>
          <meta name='twitter:card' content='summary' />
          <meta name='twitter:title' content={siteTitle} />
          <meta name='twitter:description' content={description} />
        </>
      )}

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaPerson)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(schemaWebSite)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(schemaBreadcrumb)}
      </script>
    </Helmet>
  );
}
