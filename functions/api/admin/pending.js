export async function onRequest(context) {
  const { env } = context;

  try {
    const { results } = await env.DB.prepare(
      'SELECT id, name, message, created_at, approved FROM entries WHERE approved != 3 ORDER BY datetime(created_at) DESC, id DESC'
    ).all();

    return new Response(JSON.stringify({ entries: results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
