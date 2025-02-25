/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://andriifurmanets.com',
    generateRobotsTxt: true,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
            },
        ],
        additionalSitemaps: [
            'https://andriifurmanets.com/sitemap.xml',
        ],
    },
    exclude: ['/404'],
    generateIndexSitemap: false,
    outDir: 'public',
} 