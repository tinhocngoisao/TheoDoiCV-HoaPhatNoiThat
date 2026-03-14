import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { keyword, domain } = await request.json();

    if (!keyword || !domain) {
      return NextResponse.json({ error: 'Missing keyword or domain' }, { status: 400 });
    }

    const apiKey = process.env.SERPER_API_KEY || '80ffa3aaf7c14bc778071a2a1c55fa2539b09473';

    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: keyword,
        gl: 'vn',
        hl: 'vi',
        num: 100 // Fetch top 100 results to find the rank
      })
    });

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.statusText}`);
    }

    const data = await response.json();
    let rank = 0; // 0 means not found in top 100
    let foundUrl = '';

    if (data.organic && Array.isArray(data.organic)) {
      // Find the first organic result that matches the domain
      const cleanDomain = domain.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      
      const found = data.organic.find((result: any) => {
        return result.link.includes(cleanDomain);
      });

      if (found) {
        rank = found.position;
        foundUrl = found.link;
      }
    }

    return NextResponse.json({ rank, url: foundUrl });
  } catch (error: any) {
    console.error('Error checking rank:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
