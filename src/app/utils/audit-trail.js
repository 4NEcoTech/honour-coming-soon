import { UAParser } from "ua-parser-js";

export async function generateAuditTrail(req) {
  try {
     // Get the IP address from the request headers or socket
    const ipAddress = req.headers.get("x-forwarded-for") || req.socket.remoteAddress;

     // Parse the User-Agent string
    const uaParser = new UAParser();
    const userAgent = req.headers.get("user-agent");
    const parsed = uaParser.setUA(userAgent).getResult();

    // Fetch location details using the IP address
    const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
    const data = await response.json();

    return {
      ipAddress: data.query || "Unknown",
      os: parsed.os.name || "Unknown",
      browser: parsed.browser.name || "Unknown",
      device: parsed.device.type || "Unknown",
      location: {
        timezone: data.timezone || "Unknown",
        isp: data.isp || "Unknown",
        lon: data.lon || 0,
        lat: data.lat || 0,
        zip: data.zip || "Unknown",
        city: data.city || "Unknown",
        region: data.region || "Unknown",
        country: data.country || "Unknown",
      },
    };
  } catch (error) {
    console.error("Error generating audit trail:", error);
    return {
      ipAddress: "Unknown",
      os: "Unknown",
      browser: "Unknown",
      device: "Unknown",
      location: {
        timezone: "Unknown",
        isp: "Unknown",
        lon: 0,
        lat: 0,
        zip: "Unknown",
        city: "Unknown",
        region: "Unknown",
        country: "Unknown",
      },
    };
  }
}
