export default {
  providers: [
    {
      domain:
        process.env.CLERK_JWT_ISSUER_DOMAIN ||
        "https://big-starling-40.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
