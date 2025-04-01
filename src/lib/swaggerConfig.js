const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "My Next.js API",
      version: process.env.NEXT_PUBLIC_API_VERSION || "1.0.0",
      description: "API documentation for my Next.js project",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  };
  
  const swaggerOptions = {
    definition: swaggerDefinition,
    apis: ["./src/app/api/**/*.js"],
  };
  
  export default swaggerOptions;
  