import express from "express";
import FAQ from "../models/FAQ.js";

const router = express.Router();

// Get all FAQs
router.get("/", async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch FAQs"
        });
    }
});

// Add a new FAQ
router.post("/", async (req, res) => {
    try {
        const faq = await FAQ.create(req.body);
        res.status(201).json(faq);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create FAQ",
            error: error.message
        });
    }
});

export default router;