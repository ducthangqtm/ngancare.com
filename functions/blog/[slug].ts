// Cloudflare Pages Function: GET /blog/:slug
// Enables dynamic edge routing & SEO injection for newly created blog posts
interface Env {
  DB: D1Database;
  ASSETS?: Fetcher;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function injectOrReplaceMeta(
  html: string,
  nameAttr: 'name' | 'property',
  attrValue: string,
  content: string
): string {
  const pattern = new RegExp(
    `<meta\\s+${nameAttr}="${attrValue}"\\s+content=".*?"\\s*\\/?>`,
    'i'
  );
  const newTag = `<meta ${nameAttr}="${attrValue}" content="${escapeHtml(content)}"/>`;
  if (pattern.test(html)) {
    return html.replace(pattern, newTag);
  }
  return html.replace('</head>', `  ${newTag}\n</head>`);
}

function injectOrReplaceLink(html: string, rel: string, href: string): string {
  const pattern = new RegExp(`<link\\s+rel="${rel}"\\s+href=".*?"\\s*\\/?>`, 'i');
  const newTag = `<link rel="${rel}" href="${href}"/>`;
  if (pattern.test(html)) {
    return html.replace(pattern, newTag);
  }
  return html.replace('</head>', `  ${newTag}\n</head>`);
}

export const onRequestGet: PagesFunction<Env, 'slug'> = async (context) => {
  const { request, params, env } = context;
  const url = new URL(request.url);

  let rawSlug = params.slug;
  if (Array.isArray(rawSlug)) rawSlug = rawSlug[0];
  let slug = decodeURIComponent(rawSlug || '').replace(/\/+$/, '');

  // If this is the static fallback shell itself, let static assets serve it directly
  if (slug === 'fallback' || slug === 'fallback.html') {
    return context.next();
  }

  const isRscRequest =
    slug.endsWith('.txt') ||
    request.headers.get('RSC') === '1' ||
    url.searchParams.has('_rsc');

  const cleanSlug = slug.replace(/\.txt$/, '').replace(/\.html$/, '');

  // 1. Try static assets first via context.next()
  const staticResponse = await context.next();
  if (staticResponse.status === 200) {
    return staticResponse;
  }

  // 2. Static asset returned 404: Check if post exists in Cloudflare D1
  if (!env || !env.DB) {
    return staticResponse;
  }

  try {
    const post = await env.DB.prepare(
      'SELECT * FROM posts WHERE slug = ? AND is_published = 1'
    )
      .bind(cleanSlug)
      .first<any>();

    // If post not found in D1, return the 404 response
    if (!post) {
      return staticResponse;
    }

    // Increment views in background
    if (context.waitUntil && post.id) {
      context.waitUntil(
        env.DB.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').bind(post.id).run()
      );
    }

    const fetcher = env.ASSETS || {
      fetch: (req: Request | string) => fetch(req),
    };

    // If this is a Next.js App Router RSC payload request, return fallback.txt
    if (isRscRequest) {
      const rscResponse = await fetcher.fetch(
        new Request(new URL('/blog/fallback.txt', request.url))
      );
      if (rscResponse.ok) {
        return new Response(rscResponse.body, {
          status: 200,
          headers: {
            'Content-Type': 'text/x-component',
            'Cache-Control': 'no-cache',
          },
        });
      }
    }

    // 3. Fetch template HTML (fallback shell or any static blog post)
    let templateResponse = await fetcher.fetch(
      new Request(new URL('/blog/fallback.html', request.url))
    );
    if (!templateResponse.ok) {
      templateResponse = await fetcher.fetch(
        new Request(new URL('/blog/fallback', request.url))
      );
    }
    if (!templateResponse.ok) {
      templateResponse = await fetcher.fetch(
        new Request(new URL('/blog/tac-tia-sua-uong-gi-lam-gi-huong-dan-an-toan.html', request.url))
      );
    }
    if (!templateResponse.ok) {
      templateResponse = await fetcher.fetch(
        new Request(new URL('/blog/tac-tia-sua-uong-gi-lam-gi-huong-dan-an-toan', request.url))
      );
    }

    if (!templateResponse.ok) {
      return staticResponse;
    }

    let html = await templateResponse.text();

    // 4. Inject Dynamic Metadata for SEO & Social Sharing
    const title = post.meta_title || post.title || 'Bài Viết';
    const pageTitle = `${title} | Ngân Care`;
    const description = post.meta_description || post.excerpt || '';
    const postUrl = `https://ngancare.com/blog/${encodeURIComponent(post.slug)}`;
    const coverImage = post.cover_image?.startsWith('http')
      ? post.cover_image
      : `https://ngancare.com${post.cover_image || '/images/banner.jpg'}`;

    // Title tag
    html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`);

    // Meta description & Canonical
    html = injectOrReplaceMeta(html, 'name', 'description', description);
    html = injectOrReplaceLink(html, 'canonical', postUrl);

    // OpenGraph Tags
    html = injectOrReplaceMeta(html, 'property', 'og:title', title);
    html = injectOrReplaceMeta(html, 'property', 'og:description', description);
    html = injectOrReplaceMeta(html, 'property', 'og:url', postUrl);
    html = injectOrReplaceMeta(html, 'property', 'og:image', coverImage);
    html = injectOrReplaceMeta(html, 'property', 'og:image:alt', title);
    html = injectOrReplaceMeta(html, 'property', 'og:type', 'article');

    // Twitter Tags
    html = injectOrReplaceMeta(html, 'name', 'twitter:title', title);
    html = injectOrReplaceMeta(html, 'name', 'twitter:description', description);
    html = injectOrReplaceMeta(html, 'name', 'twitter:image', coverImage);

    // Schema JSON-LD (BlogPosting)
    const blogPostingSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: description,
      image: coverImage,
      url: postUrl,
      datePublished: post.created_at || new Date().toISOString(),
      dateModified: post.updated_at || post.created_at || new Date().toISOString(),
      author: {
        '@id': 'https://ngancare.com/#specialist',
      },
      publisher: {
        '@id': 'https://ngancare.com/#organization',
      },
    };

    const schemaTag = `<script type="application/ld+json">${JSON.stringify(blogPostingSchema)}</script>`;
    if (html.includes('"@type":"BlogPosting"')) {
      html = html.replace(
        /<script\s+type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"BlogPosting".*?\}<\/script>/s,
        schemaTag
      );
    } else {
      html = html.replace('</head>', `  ${schemaTag}\n</head>`);
    }

    // 5. Inject window.__INITIAL_POST__ for client hydration
    const safePostJson = JSON.stringify(post).replace(/</g, '\\u003c');
    const initScript = `<script>window.__INITIAL_POST__ = ${safePostJson};</script>`;
    html = html.replace('</head>', `  ${initScript}\n</head>`);

    // 6. Inject Noscript article for search bots and no-JS visitors
    const noscriptContent = `
<noscript>
  <div style="max-width:800px;margin:2rem auto;padding:1.5rem;font-family:sans-serif;">
    <span style="color:#b45309;font-weight:bold;">${escapeHtml(post.category || 'Kiến Thức Mẹ & Bé')}</span>
    <h1 style="font-size:2rem;margin:0.5rem 0 1rem;">${escapeHtml(post.title)}</h1>
    <p style="color:#555;"><strong>Tác giả:</strong> ${escapeHtml(post.author || 'Điều Dưỡng Nguyễn Thúy Ngân')}</p>
    <div style="margin:1rem 0;font-style:italic;color:#333;">${escapeHtml(post.excerpt || '')}</div>
    <div style="line-height:1.7;">${post.content || ''}</div>
  </div>
</noscript>`;
    html = html.replace('</body>', `${noscriptContent}\n</body>`);

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
    });
  } catch (err: any) {
    return staticResponse;
  }
};
