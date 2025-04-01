"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { encryptUrl } from "./encryptUrl";

const EncryptedLink = ({ href, className, children }) => {
  const [finalHref, setFinalHref] = useState(href);

  useEffect(() => {
    const encrypt = async () => {
      const encryptedUrl = await encryptUrl(href);
      if (encryptedUrl) {
        // Append the encrypted value as a query parameter
        setFinalHref(`${href}?ref=${encodeURIComponent(encryptedUrl)}`);
      } else {
        console.error("Encryption failed");
      }
    };
    encrypt();
  }, [href]);

  return (
    <Link href={finalHref} className={className}>
      {children}
    </Link>
  );
};

export default EncryptedLink;
