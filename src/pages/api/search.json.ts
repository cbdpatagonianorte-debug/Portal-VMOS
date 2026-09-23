// API endpoint for search - returns all articles for client-side filtering
// Astro supports file-based API routes via the pages directory
import { getCollection } from 'astro:content';

export async function GET({ request }) {
  try {
    const allNews = await getCollection('noticias');
    const articles = allNews.map((n) => ({
      title: n.data.title,
      description: n.data.description || '',
      category: n.data.category,
      section: n.data.section || n.data.category,
      tags: n.data.tags || [],
      href: `/noticias/${n.slug}`,
      readingMinutes: n.data.readingMinutes,
    }));
    return new Response(JSON.stringify({ articles }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ articles: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}