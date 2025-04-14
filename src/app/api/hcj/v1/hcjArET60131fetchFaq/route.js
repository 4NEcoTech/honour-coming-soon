import Faq from "@/app/models/faq";
import { dbConnect } from "@/app/utils/dbConnect";
import { NextResponse } from "next/server";


/**
 * @swagger
 * /api/hcj/v1/hcjArET60131fetchFaq:
 *   get:
 *     summary: Get FAQs with optional keyword search
 *     description: Fetches a list of FAQs. You can optionally filter them by keyword using the `search` query parameter.
 *     tags: [Fetch FAQs]
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Keyword to search in question and answer fields (case-insensitive)
 *     responses:
 *       200:
 *         description: FAQs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64bacefc1f84b6c348dd1f88"
 *                       question:
 *                         type: string
 *                         example: "How do I reset my password?"
 *                       answer:
 *                         type: string
 *                         example: "Click on 'Forgot Password' at the login page and follow the instructions."
 *       500:
 *         description: Internal Server Error
 */



export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("search");

  const query = keyword
    ? {
        $or: [
          { question: { $regex: keyword, $options: "i" } },
          { answer: { $regex: keyword, $options: "i" } },
        ],
      }
    : {};

  const faqs = await Faq.find(query).limit(50);
  return NextResponse.json({ success: true, data: faqs });
}
