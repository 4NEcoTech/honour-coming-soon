import { NextResponse } from 'next/server';
import Skills from '@/app/models/skills'; // Update path as per your directory structure
import { dbConnect } from '@/app/utils/dbConnect'; // Update path if needed

/**
 * @swagger
 * /api/global/v1/gblArET90006FtchSkills:
 *   get:
 *     summary: Fetch industries and corresponding skills
 *     description: |
 *       - Retrieves a list of industries along with their respective skills.
 *     tags: [Fetch industries and corresponding skills]
 *     responses:
 *       200:
 *         description: List of industries and skills fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   industry:
 *                     type: string
 *                     example: "Software Development"
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["JavaScript", "Python", "React"]
 *       404:
 *         description: No industries found
 *       500:
 *         description: Server error
 */


export async function GET(req) {
  try {
    await dbConnect();

    //  Extract industry from query parameters
    const { searchParams } = new URL(req.url);
    const industry = searchParams.get("industry");

    let query = {}; // Default: Fetch all industries and skills

    if (industry) {
      query = { industry_name: industry }; // If industry is provided, filter by industry_name
    }

    //  Fetch industry_name & skills_list
    const results = await Skills.find(query, { _id: 0, industry_name: 1, skills_list: 1 });

    if (!results || results.length === 0) {
      return NextResponse.json({ message: 'No industries or skills found' }, { status: 404 });
    }

    return NextResponse.json({ industries: results }, { status: 200 });

  } catch (error) {
    console.error('Error fetching industries and skills:', error);
    return NextResponse.json({ error: 'Failed to fetch industries and skills' }, { status: 500 });
  }
}
