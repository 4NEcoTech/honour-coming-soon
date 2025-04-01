import { dbConnect } from '@/app/utils/dbConnect';

/**
 * @swagger
 * /api/global/v1/gblArET90001FtchCntryDtls:
 *   get:
 *     summary: Fetch country details
 *     description: |
 *       - Retrieves a list of countries with ISO codes.
 *       - Supports optional filtering by Alpha-2 country code.
 *     tags: [Fetch country details]
 *     parameters:
 *       - in: query
 *         name: alpha2
 *         required: false
 *         schema:
 *           type: string
 *         description: The Alpha-2 country code to filter the results.
 *         example: "US"
 *     responses:
 *       200:
 *         description: Country details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "United States"
 *                   iso2:
 *                     type: string
 *                     example: "US"
 *                   iso3:
 *                     type: string
 *                     example: "USA"
 *       500:
 *         description: Server error
 */

export async function GET(req) {
  try {
    // const db = await connectDB();
    const db = await dbConnect();
    const collection = db.collection('country_lists'); // Updated collection name

    // Parse query parameters
    const url = new URL(req.url);
    const alpha2Code = url.searchParams.get('alpha2'); // Query parameter: `alpha2`
    console.log('alpha2Code', alpha2Code);
    let query = {};
    if (alpha2Code) {
      // If alpha2 is provided, filter by the Alpha-2 code
      query = { alpha2Code: alpha2Code.toUpperCase() }; // Updated attribute name for case-insensitivity
    }

    // Fetch the country details based on the query
    const countriesCursor = await collection
      .find(query, {
        projection: { _id: 0, country_name: 1, alpha2_code: 1, alpha3_code: 1 },
      }) // Updated attribute names
      .toArray();

    // Transform the results into an object where keys are formatted
    const countriesObject = countriesCursor.reduce((acc, country) => {
      acc[country.country_name.replace(/\s+/g, '_').toUpperCase()] = {
        name: country.country_name, // Updated attribute name
        iso2: country.alpha2_code, // Updated attribute name
        iso3: country.alpha3_code, // Updated attribute name
      };
      return acc;
    }, {});
    // console.log('countriesObject', countriesObject);
    // console.log('countriesCursor', countriesCursor);

    return new Response(JSON.stringify(countriesObject), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error('Error fetching countries:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch countries' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
