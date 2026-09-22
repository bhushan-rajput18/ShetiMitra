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

        let bestFAQ = null;
        let highestScore = 0;

        for (const faq of faqs) {

            let score = 0;

            // Check original question
            if (faq.question.toLowerCase().includes(userQuestion)) {
                score += 2;
            }

            // Check keywords
            for (const keyword of faq.keywords) {
                if (userQuestion.includes(keyword.toLowerCase())) {
                    score++;
                }
            }

            // Keep the FAQ with the highest score
            if (score > highestScore) {
                highestScore = score;
                bestFAQ = faq;
            }
        }

        if (bestFAQ) {
            return res.json({
                answer: bestFAQ.answer
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