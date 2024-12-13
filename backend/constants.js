const FRONTEND_ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://d37nqf2xwvpc9t.cloudfront.net" // CloudFront URL for production
    : "http://localhost:5173"; // Local frontend for development

export { FRONTEND_ORIGIN };
