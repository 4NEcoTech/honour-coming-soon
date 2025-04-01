"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Swagger UI to avoid SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });
import "swagger-ui-react/swagger-ui.css"; // Ensure default styles are applied

export default function SwaggerPage() {
  const [swaggerSpec, setSwaggerSpec] = useState(null);

  useEffect(() => {
    const fetchSwaggerJSON = async () => {
      try {
        const response = await fetch("/api/swagger");
        const data = await response.json();
        setSwaggerSpec(data);
      } catch (error) {
        console.error("Failed to load Swagger JSON:", error);
      }
    };

    fetchSwaggerJSON();
  }, []);

  return (
    <div style={{
      padding: "20px", 
      backgroundColor: "#f8f9fa", 
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{
        textAlign: "center", 
        color: "#2c3e50", 
        fontSize: "2.5rem", 
        fontWeight: "bold",
        marginBottom: "10px"
      }}>
        📖 API Documentation
      </h1>
      <p style={{
        textAlign: "center", 
        fontSize: "1.2rem", 
        color: "#34495e",
        marginBottom: "20px"
      }}>
        Explore and test all available API endpoints below.
      </p>
      {swaggerSpec ? (
        <div style={{
          backgroundColor: "#ffffff", 
          padding: "20px", 
          borderRadius: "10px", 
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
        }}>
          <SwaggerUI spec={swaggerSpec} />
        </div>
      ) : (
        <p style={{ textAlign: "center", fontSize: "1rem", color: "#e74c3c" }}>
          Loading Swagger Documentation...
        </p>
      )}
    </div>
  );
}
