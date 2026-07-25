require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seed() {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
        console.log("Admin already exists:", email);
        process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email: email.toLowerCase(), passwordHash });
    console.log("Admin created:", email);
    process.exit(0);
}

seed();