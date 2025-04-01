import { dbConnect } from '@/app/utils/dbConnect';

/**
 * @swagger
 * /api/global/v1/gblArET90004FtchDcmntDtls:
 *   get:
 *     summary: Fetch country details and document information
 *     description: |
 *       - Retrieves a list of countries with ISO codes.
 *       - Provides document details associated with each country.
 *     tags: [Fetch country details and document information]
 *     responses:
 *       200:
 *         description: Country and document details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 countryDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "United States"
 *                       iso2:
 *                         type: string
 *                         example: "US"
 *                       iso3:
 *                         type: string
 *                         example: "USA"
 *                 documentDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       document:
 *                         type: string
 *                         example: "Passport"
 *                       relatedCountry:
 *                         type: string
 *                         example: "United States"
 *                       relatedCountryCode:
 *                         type: string
 *                         example: "US"
 *       500:
 *         description: Server error
 */

export async function GET(req) {
  try {
    const db = await dbConnect();

    if (!db) {
      throw new Error('Failed to connect to the database');
    }

    const collection = db.collection('document_list');
    const cursor = await collection
      .find(
        {},
        {
          projection: {
            _id: 0,
            country_name: 1,
            alpha2_code: 1,
            alpha3_code: 1,
            country_code: 1,
            documents: 1,
          },
        }
      )
      .toArray();
    const responseObject = {
      countryDetails: [],
      documentDetails: [],
    };

    cursor.forEach((item) => {
      responseObject.countryDetails.push({
        name: item.country_name,
        iso2: item.alpha2_code,
        iso3: item.alpha3_code,
      });
      responseObject.documentDetails.push({
        document: item.documents,
        relatedCountry: item.country_name,
        relatedCountryCode: item.alpha2_code,
      });
    });

    return new Response(JSON.stringify(responseObject), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}