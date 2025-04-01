import { dbConnect } from '@/app/utils/dbConnect';

/**
 * @swagger
 * /api/global/v1/gblArET90005FtchStateDtls:
 *   get:
 *     summary: Fetch states and cities by country code
 *     description: |
 *       - Retrieves a list of states and cities based on the provided country code.
 *     tags: [Fetch states and cities by country code]
 *     parameters:
 *       - in: query
 *         name: country_code
 *         required: true
 *         schema:
 *           type: string
 *         description: The ISO country code to fetch states and cities for.
 *         example: "US"
 *     responses:
 *       200:
 *         description: States and cities fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 country_code:
 *                   type: string
 *                   example: "US"
 *                 states:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "California"
 *                       state_code:
 *                         type: string
 *                         example: "CA"
 *                 cities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       city_name:
 *                         type: string
 *                         example: "Los Angeles"
 *       400:
 *         description: country_code parameter is required
 *       500:
 *         description: Server error
 */


export async function GET(req) {
  try {
    const db = await dbConnect();

    // Extract country_code parameter from the request URL
    const url = new URL(req.url);
    const countryCode = url.searchParams.get('country_code');

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
    // const db = await connectDB();

    // Fetch states based on country_code
    const stateCollection = db.collection('state_list');
    const statesCursor = await stateCollection
      .find(
        { country_code: countryCode.toUpperCase() }, // Filter by country_code (case-insensitive)
        { projection: { _id: 0, id: 1, name: 1, state_code: 1 } } // Project specific fields
      )
      .toArray();

    // Fetch cities based on country_code
    const cityCollection = db.collection('city_lists');
    const citiesCursor = await cityCollection
      .find(
        { country_code: countryCode.toUpperCase() },
        { projection: { _id: 0, city_name: 1 } } // Project specific fields
      )
      .toArray();

    // Combine states and cities into a single response
    const responseData = {
      country_code: countryCode.toUpperCase(),
      states: statesCursor,
      cities: citiesCursor,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Error fetching states and cities:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch states and cities' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
