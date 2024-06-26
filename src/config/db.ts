import mongoose from "mongoose";
import colors from 'colors';
import { exit } from 'node:process';

export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.MONGO_DATABASE_URL)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.magenta.bold(`MongoDB Connect in: ${url}`))
    } catch (error) {
        console.log(colors.red.bold('Connection Error to MongoDB' + error.message))
        exit(1)
    }
}