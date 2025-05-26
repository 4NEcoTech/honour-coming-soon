import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/encrypt/encrypt-url:
 *   post:
 *     summary: Encrypt a URL using Base64 encoding
 *     description: >
 *       Accepts a plain URL string and returns a Base64-encoded version of it.  
 *       This simulates simple encryption (not secure for production use).
 *     tags:
 *       - Encrypt Urls
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://example.com
 *     responses:
 *       200:
 *         description: Encrypted URL returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 encryptedUrl:
 *                   type: string
 *                   example: aHR0cHM6Ly9leGFtcGxlLmNvbQ==
 *       400:
 *         description: URL field missing in request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: URL is required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *   get:
 *     summary: Disallowed GET method
 *     description: GET method is not supported for this endpoint.
 *     tags:
 *       - Utility
 *     responses:
 *       405:
 *         description: Method Not Allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: GET method not allowed
 */


export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Simulate encryption logic
    const encryptedUrl = Buffer.from(body.url).toString('base64');

    return NextResponse.json({ encryptedUrl });
  } catch (error) {
    console.error('Error in API handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: 'GET method not allowed' }, { status: 405 });
}
