const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [100, "Name must be under 100 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
        },
        budgetRange: {
            type: String,
            required: [true, "Budget range is required"],
            enum: {
                values: ["<5k", "5k-15k", "15k-50k", "50k+"],
                message: "Invalid budget range",
            },
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            minlength: [10, "Message must be at least 10 characters"],
            maxlength: [1000, "Message must be under 1000 characters"],
        },
        status: {
            type: String,
            enum: ["New", "Contacted", "Closed"],
            default: "New",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);