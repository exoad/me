export async function onRequest() {
  return new Response(JSON.stringify({ authenticated: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
