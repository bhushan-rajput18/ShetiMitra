import { useState } from "react";

function App() {
    const [question, setQuestion] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "नमस्कार! 🌱 मी ShetiMitra आहे. केळी शेतीविषयी तुमचा प्रश्न विचारा."
        }
    ]);

    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);

    // 🎤 Start voice recognition
    const startListening = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("तुमच्या ब्राउझरमध्ये Voice Input उपलब्ध नाही.");
            return;
        }

        const recognition = new SpeechRecognition();

        // Marathi language
        recognition.lang = "mr-IN";

        // Get one final result
        recognition.interimResults = false;

        recognition.continuous = false;

        recognition.onstart = () => {
            setListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;

            setQuestion(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognition.start();
    };

    // 💬 Send question to backend
    const sendQuestion = async () => {
        if (!question.trim() || loading) return;

        const userQuestion = question.trim();

        // Show user's message
        setMessages((previousMessages) => [
            ...previousMessages,
            {
                sender: "user",
                text: userQuestion
            }
        ]);

        setQuestion("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/chat", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: userQuestion
                })
            });

            const data = await response.json();

            // Show bot's answer
            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    sender: "bot",
                    text: data.answer
                }
            ]);

        } catch (error) {

            console.error(error);

            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    sender: "bot",
                    text: "सर्व्हरशी कनेक्ट होता आले नाही."
                }
            ]);

        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">

            <div className="w-full max-w-2xl h-[700px] bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-green-600 text-white p-5">

                    <h1 className="text-2xl font-bold">
                        🌱 ShetiMitra
                    </h1>

                    <p className="text-green-100 text-sm mt-1">
                        शेतकऱ्यांचा डिजिटल मित्र
                    </p>

                </div>

                {/* Chat area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">

                    {messages.map((message, index) => (

                        <div
                            key={index}
                            className={`flex ${
                                message.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >

                            <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                                    message.sender === "user"
                                        ? "bg-green-600 text-white rounded-br-none"
                                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                                }`}
                            >

                                {message.sender === "bot" && (
                                    <p className="font-semibold text-green-700 mb-1">
                                        🤖 ShetiMitra
                                    </p>
                                )}

                                <p>{message.text}</p>

                            </div>

                        </div>

                    ))}

                    {/* Loading */}
                    {loading && (

                        <div className="flex justify-start">

                            <div className="bg-gray-100 text-gray-500 px-4 py-3 rounded-2xl">

                                🤖 विचार करत आहे...

                            </div>

                        </div>

                    )}

                </div>

                {/* Input area */}
                <div className="border-t p-4">

                    <div className="flex gap-3">

                        {/* Text input */}
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendQuestion();
                                }
                            }}
                            placeholder="तुमचा प्रश्न लिहा..."
                            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                        />

                        {/* 🎤 Microphone button */}
                        <button
                            onClick={startListening}
                            disabled={loading || listening}
                            className={`px-4 py-3 rounded-xl text-white ${
                                listening
                                    ? "bg-red-500"
                                    : "bg-green-600 hover:bg-green-700"
                            } disabled:bg-gray-400`}
                        >
                            {listening ? "🔴" : "🎤"}
                        </button>

                        {/* Send button */}
                        <button
                            onClick={sendQuestion}
                            disabled={loading}
                            className="bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {loading ? "..." : "पाठवा"}
                        </button>

                    </div>

                    {/* Listening message */}
                    {listening && (
                        <p className="text-sm text-green-600 mt-2 text-center">
                            🎤 ऐकत आहे... मराठीत बोला
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}

export default App;