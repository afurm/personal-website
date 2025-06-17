/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://andriifurmanets.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
  },
  exclude: ['/404', '/500', '/api/*'],
  generateIndexSitemap: false,
  outDir: 'public',
  changefreq: 'monthly',
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // Custom transform function to ensure proper URL formatting
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
};
