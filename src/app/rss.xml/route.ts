import { getAllBlogPosts } from '@/lib/blog';

export async function GET() {
  const posts = await getAllBlogPosts();
  
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Andrii Furmanets - Full-Stack Developer Blog</title>
    <description>Technical insights on React, Next.js, Ruby on Rails, Web3, and Fintech development by Andrii Furmanets</description>
    <link>https://andriifurmanets.com</link>
    <atom:link href="https://andriifurmanets.com/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>andrii@andriifurmanets.com (Andrii Furmanets)</managingEditor>
    <webMaster>andrii@andriifurmanets.com (Andrii Furmanets)</webMaster>
    <copyright>© ${new Date().getFullYear()} Andrii Furmanets. All rights reserved.</copyright>
    <category>Technology</category>
    <ttl>60</ttl>
    
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>https://andriifurmanets.com/blogs/${post.slug}</link>
      <guid isPermaLink="true">https://andriifurmanets.com/blogs/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>andrii@andriifurmanets.com (Andrii Furmanets)</author>
      <category><![CDATA[${post.tags.join(', ')}]]></category>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}