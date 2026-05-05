require("dotenv").config();
console.log("LOG_SERVICE_URL:", process.env.LOG_SERVICE_URL);

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});