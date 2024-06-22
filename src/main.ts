import { connectDB } from './db';
import { v4 as uuidv4 } from 'uuid';

const handler = async (req: Request) => {
  if (req.method === 'GET' && req.url === '/') {
    const client = await connectDB();
    const data = uuidv4();

    await client.query(`INSERT INTO entries(data) VALUES ($1)`, [data]);

    const result = await client.query(`SELECT COUNT(*) FROM entries;`);
    const count = result.rows[0].count;

    await client.end();

    return new Response(
      JSON.stringify({
        message: `This is a simple, basic Bun application running on Zerops.io,
          each request adds an entry to the PostgreSQL database and returns a count.
          See the source repository (https://github.com/zeropsio/recipe-nodejs) for more information.`,
        newEntry: data,
        count: count
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } else if (req.method === 'GET' && req.url === '/status') {
    return new Response(JSON.stringify({ status: 'UP' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Not Found', { status: 404 });
};

Bun.serve({ fetch: handler, port: 3000 });
