import { dbConnect } from '@/app/utils/dbConnect';

/**
 * @swagger
 * /api/global/v1/gblArET90002FtchCityDtls:
 *   get:
 *     summary: Fetch cities by country code
 *     description: |
 *       - Retrieves a list of cities based on the provided country code.
 *       - Supports optional filtering by city name (case-insensitive search).
 *     tags: [Fetch cities by country code]
 *     parameters:
 *       - in: query
 *         name: country_code
 *         required: true
 *         schema:
 *           type: string
 *         description: The ISO country code to fetch cities for.
 *         example: "US"
 *       - in: query
 *         name: city_name
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional search filter for city name.
 *         example: "New York"
 *     responses:
 *       200:
 *         description: List of cities fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   city_name:
 *                     type: string
 *                     example: "New York"
 *       400:
 *         description: country_code parameter is required
 *       500:
 *         description: Server error
 */

export async function GET(req) {
  try {
    // Extract query parameters
    const url = new URL(req.url);
    const countryCode = url.searchParams.get('country_code');
    const cityName = url.searchParams.get('city_name'); // optional

    if (!countryCode) {
      return new Response(
        JSON.stringify({ error: 'country_code parameter is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Connect to the database
    const db = await dbConnect();
    const collection = db.collection('city_lists');

    // Build the query
    const query = { country_code: countryCode.toUpperCase() };
    if (cityName) {
      query.city_name = { $regex: cityName, $options: 'i' };
    }

    // Fetch filtered documents
    const citiesCursor = await collection
      .find(query, { projection: { _id: 0, city_name: 1 } })
      .toArray();

    return new Response(JSON.stringify(citiesCursor), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error fetching cities:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch cities' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
