import mongoose from "mongoose";

const databaseConnection = () => {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Database connected successfully");
        })
        .catch((error) => {
            console.error("Database connection failed:", error.message || error);
        });
};

export default databaseConnection;