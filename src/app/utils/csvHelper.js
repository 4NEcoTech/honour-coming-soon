import { Parser } from "json2csv";

/**
 * Generates a CSV buffer from an array of objects.
 * @param {Array} data - The data to be converted into CSV.
 * @returns {Buffer} - A CSV formatted buffer.
 */
export function generateCSVBuffer(data) {
  try {
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid data for CSV generation");
    }

    const fields = Object.keys(data[0]); // Extract headers dynamically
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    return Buffer.from(csv, "utf-8");
  } catch (error) {
    console.error("Error generating CSV buffer:", error);
    return null;
  }
}
