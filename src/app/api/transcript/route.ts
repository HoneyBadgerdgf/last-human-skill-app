import { NextRequest, NextResponse } from 'next/server';

// Extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  const videoId = searchParams.get('videoId');
  
  const id = videoId || (url ? extractVideoId(url) : null);
  
  if (!id) {
    return NextResponse.json({ error: 'Missing videoId or url parameter' }, { status: 400 });
  }
  
  try {
    // Dynamic import for ESM module
    const { YoutubeTranscript } = await import('youtube-transcript');
    
    const transcript = await YoutubeTranscript.fetchTranscript(id);
    
    // Get video metadata
    const metaResponse = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
    );
    const metaData = metaResponse.ok ? await metaResponse.json() : {};
    
    return NextResponse.json({
      success: true,
      videoId: id,
      title: metaData.title || 'Unknown Title',
      channelName: metaData.author_name,
      transcript: transcript.map((t: any) => t.text).join(' '),
      segments: transcript,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false, 
      error: `Failed to fetch transcript: ${message}` 
    }, { status: 500 });
  }
}
