const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");

// POST /api/leads - create a lead (public)
router.post("/", async (req, res) => {
    try {
        const { name, email, budgetRange, message } = req.body;

        // server-side validation (defense in depth, beyond schema validators)
        if (!name || !email || !budgetRange || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const lead = await Lead.create({ name, email, budgetRange, message });
        res.status(201).json(lead);
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ error: messages.join(", ") });
        }
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// GET /api/leads?search=&status= - list leads (admin)
router.get("/", async (req, res) => {
    try {
        const { search, status } = req.query;
        const filter = {};

        if (status && status !== "All") {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const leads = await Lead.find(filter).sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// PATCH /api/leads/:id - update status (admin)
router.patch("/:id", async (req, res) => {
    try {
        const { status } = req.body;

        if (!["New", "Contacted", "Closed"].includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: "after", runValidators: true }
        );

        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }

        res.json(lead);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;