import QRCode from "qrcode";
import Jimp from "jimp";

export async function generateQRCodeWithLogo(url, userImageUrl = null, qrSize = 500, logoSizeRatio = 0.2) {
  try {
    // Step 1: Generate QR Code
    const qrBuffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: qrSize,
    });

    // Step 2: Load QR Code
    const qrCode = await Jimp.read(qrBuffer);
    
    // Step 3: Only add logo if provided
    if (userImageUrl) {
      let logo;
      try {
        // Try to read as URL first
        logo = await Jimp.read(userImageUrl);
        
        // Resize logo
        const logoSize = Math.floor(qrSize * logoSizeRatio);
        logo.resize(logoSize, logoSize);

        // Calculate position
        const x = (qrSize - logoSize) / 2;
        const y = (qrSize - logoSize) / 2;

        // Composite logo onto QR code
        qrCode.composite(logo, x, y, {
          mode: Jimp.BLEND_SOURCE_OVER,
          opacitySource: 1,
          opacityDest: 1,
        });
      } catch (error) {
        console.warn("Couldn't load logo image, generating plain QR code");
      }
    }

    // Return as PNG buffer
    return await qrCode.getBufferAsync(Jimp.MIME_PNG);
  } catch (error) {
    console.error("Error generating QR Code:", error);
    throw new Error("Failed to generate QR Code.");
  }
}

