// Keeps the temporary *.netlify.app host (and deploy previews) out of search engines.
// The custom domain (microcks.io) never matches, so nothing has to be removed at cutover.
export default async function noindexNetlifyHost(request, context) {
  const {hostname} = new URL(request.url);
  if (!hostname.endsWith('.netlify.app')) return;

  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set('x-robots-tag', 'noindex, nofollow');
  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export const config = {
  path: '/*',
  onError: 'bypass',
};
