import express from "express";
import FAQ from "../models/FAQ.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        const faqs = await FAQ.find();

        const userQuestion = question.toLowerCase();

        const foundFAQ = faqs.find((faq) => {

            // Check the original question
            if (faq.question.toLowerCase().includes(userQuestion)) {
                return true;
            }

            // Check keywords
            return faq.keywords.some((keyword) =>
                userQuestion.includes(keyword.toLowerCase())
            );
        });

        if (foundFAQ) {
            return res.json({
                answer: foundFAQ.answer
            });
        }

        res.json({
            answer: "माफ करा, या प्रश्नाचे उत्तर सध्या माझ्याकडे उपलब्ध नाही."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Chatbot error"
        });
    }
});

export default router;