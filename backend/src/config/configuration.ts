export default () => ({
  app: {
    host: process.env.HOST || "localhost",
    port: parseInt(process.env.PORT, 10) || 3000,
    jwtSecret: process.env.JWT_SECRET
  },
});