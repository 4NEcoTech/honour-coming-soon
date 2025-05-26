import { NextResponse } from "next/server";

/**
 * Global function for batch-wise pagination and search optimization.
 * @param {Object} model - Mongoose model
 * @param {Object} searchParams - URL search parameters
 * @param {Array} searchFields - Fields to search (passed dynamically)
 * @param {Object} projection - Fields to return
 * @returns {Object} Paginated response
 */

export async function getPaginatedResults(
  model,
  searchParams,
  searchFields = [],
  projection = {},
  dataFormatter = null
) {
  try {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const batchSize = 100; // Fetch 100 records at a time

    // Determine batch number
    const batchNumber = Math.ceil(page / (batchSize / pageSize));
    const skip = (batchNumber - 1) * batchSize;

    // Extract search query
    const searchQuery = searchParams.get("search") || "";
    const filterParams = {};

    // Include additional filters dynamically

    // searchParams.forEach((value, key) => {
    //   if (!["page", "pageSize", "search", "status"].includes(key)) {
    //     if ((key === "HCJ_ST_Individual_Id" || key === "CCP_Individual_Id") && value === "__NOT_NULL__") {
    //       filterParams[key] = { $ne: null };
    //     } else if ((key === "HCJ_ST_Individual_Id" || key === "CCP_Individual_Id") && value === "null") {
    //       filterParams[key] = null;
    //     } else {
    //       filterParams[key] = value;
    //     }
    //   }
    // });

    searchParams.forEach((value, key) => {
      if (!["page", "pageSize", "search", "status"].includes(key)) {
        if (
          (key === "HCJ_ST_Individual_Id" || key === "CCP_Individual_Id") &&
          value === "__NOT_NULL__"
        ) {
          filterParams[key] = { $ne: null };
        } else if (
          (key === "HCJ_ST_Individual_Id" || key === "CCP_Individual_Id") &&
          value === "null"
        ) {
          filterParams[key] = null;
        } else if (key.endsWith("__$in")) {
          const actualKey = key.replace("__$in", "");
          filterParams[actualKey] = { $in: JSON.parse(value) };
        } else {
          filterParams[key] = value;
        }
      }
    });

    let query = { ...filterParams };
    if (searchQuery && searchFields.length > 0) {
      query.$or = searchFields.map((field) => ({
        [field]: { $regex: searchQuery, $options: "i" },
      }));
    }

    // console.log("🔍 Final Mongo Query:", query);

    const total = await model.countDocuments(query);
    const results = await model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(batchSize);

    // **APPLY DATA FORMATTER FUNCTION**
    const formattedResults = dataFormatter
      ? await Promise.all(
          results.map(async (record) => await dataFormatter(record))
        )
      : results;

    return NextResponse.json(
      {
        data: formattedResults,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
        batchNumber: batchNumber,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Pagination/Search error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
