import type { APIRoute } from 'astro';
import { FileAccessService } from '../../../lib/file-access-service';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const token = params.token;
  
  if (!token) {
    return new Response('Invalid token', { status: 400 });
  }

  const fileAccess = new FileAccessService();
  const file = await fileAccess.validateAccess(token);
  
  if (!file) {
    return new Response('Access denied or expired', { status: 403 });
  }

  return new Response('File content would be streamed here', {
    status: 200,
    headers: {
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.name}"`,
    }
  });
}