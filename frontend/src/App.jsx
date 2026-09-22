
import { useState } from "react";
import "./App.css";

function App() {
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "नमस्कार! 👋 मी ShetiMitra आहे. केळी शेतीबद्दल तुमची मदत करण्यासाठी मी इथे आहे."
        }
    ]);

    // 🎤 Voice Input
    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("तुमच्या ब्राउझरमध्ये Voice Input उपलब्ध नाही.");
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = "mr-IN";
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

    // 💬 Send question
    const sendQuestion = async (text = question) => {
        if (!text.trim() || loading) return;

        const userQuestion = text.trim();

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
            const response = await fetch(
                "http://localhost:5000/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        question: userQuestion
                    })
                }
            );

            const data = await response.json();

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
                    text: "सर्व्हरशी कनेक्ट होता आले नाही. कृपया पुन्हा प्रयत्न करा."
                }
            ]);
        }

        setLoading(false);
    };

    // Quick question
    const quickQuestion = (text) => {
        setQuestion(text);
    };

    return (
        <div className="app">

            {/* ================= HEADER ================= */}

            <header className="topbar">

                <div className="brand">
                    <div className="brand-icon">
                        🌱
                    </div>

                    <div>
                        <h1>ShetiMitra</h1>
                        <span>शेतकऱ्यांचा डिजिटल मित्र</span>
                    </div>
                </div>

                <div className="status">
                    <span className="status-dot"></span>
                    ऑनलाइन
                </div>

            </header>


            {/* ================= MAIN ================= */}

            <main className="main">

                {/* Hero */}

                <section className="hero">

                    <div className="hero-content">

                        <span className="welcome-tag">
                            🌾 तुमच्या शेतीसाठी
                        </span>

                        <h2>
                            नमस्कार !👋
                        </h2>

                        <p>
                            तुमच्या केळी पिकाबद्दल प्रश्न विचारा,
                            आवाजात बोला किंवा पिकाचा फोटो पाठवा.
                        </p>

                    </div>

                    <div className="hero-farmer">
                        👨‍🌾
                    </div>

                </section>


                {/* ================= FEATURE CARDS ================= */}

                <section className="feature-section">

                    <h3>तुम्हाला कशात मदत हवी?</h3>

                    <div className="feature-grid">

                        {/* Voice */}

                        <button
                            className="feature-card voice-card"
                            onClick={startListening}
                        >

                            <div className="feature-icon">
                                🎤
                            </div>

                            <div>
                                <strong>बोलून विचारा</strong>
                                <p>मराठीत प्रश्न विचारा</p>
                            </div>

                        </button>


                        {/* Photo */}

                        <button
                            className="feature-card photo-card"
                            onClick={() =>
                                alert("Photo upload feature लवकरच येत आहे.")
                            }
                        >

                            <div className="feature-icon">
                                📷
                            </div>

                            <div>
                                <strong>पिकाचा फोटो</strong>
                                <p>रोग किंवा समस्या तपासा</p>
                            </div>

                        </button>

                    </div>

                </section>


                {/* ================= QUICK QUESTIONS ================= */}

                <section className="quick-section">

                    <div className="section-title">
                        <h3>लोकप्रिय प्रश्न</h3>
                        <span>जलद प्रश्न</span>
                    </div>

                    <div className="quick-grid">

                        <button
                            onClick={() =>
                                quickQuestion(
                                    "केळी पिकासाठी योग्य खत कोणते?"
                                )
                            }
                        >
                            <span>🌱</span>
                            <div>
                                <strong>खत</strong>
                                <small>योग्य खत कोणते?</small>
                            </div>
                        </button>

                        <button
                            onClick={() =>
                                quickQuestion(
                                    "केळीला किती पाणी द्यावे?"
                                )
                            }
                        >
                            <span>💧</span>
                            <div>
                                <strong>पाणी</strong>
                                <small>किती पाणी द्यावे?</small>
                            </div>
                        </button>

                        <button
                            onClick={() =>
                                quickQuestion(
                                    "केळीच्या पानांवर पिवळेपणा का येतो?"
                                )
                            }
                        >
                            <span>🍃</span>
                            <div>
                                <strong>पानांचा रोग</strong>
                                <small>पाने पिवळी का होतात?</small>
                            </div>
                        </button>

                        <button
                            onClick={() =>
                                quickQuestion(
                                    "केळीच्या पिकावर कीड दिसल्यास काय करावे?"
                                )
                            }
                        >
                            <span>🐛</span>
                            <div>
                                <strong>कीड</strong>
                                <small>काय उपाय करावा?</small>
                            </div>
                        </button>

                    </div>

                </section>


                {/* ================= CHAT ================= */}

                <section className="chat-section">

                    <div className="chat-heading">

                        <div>
                            <h3>ShetiMitra सोबत बोला</h3>
                            <p>तुमचे प्रश्न येथे दिसतील</p>
                        </div>

                        <div className="chat-leaf">
                            🌱
                        </div>

                    </div>


                    <div className="messages">

                        {messages.map((message, index) => (

                            <div
                                key={index}
                                className={`message-row ${
                                    message.sender === "user"
                                        ? "user-row"
                                        : "bot-row"
                                }`}
                            >

                                {message.sender === "bot" && (
                                    <div className="avatar">
                                        🌱
                                    </div>
                                )}

                                <div
                                    className={`message ${
                                        message.sender === "user"
                                            ? "user-message"
                                            : "bot-message"
                                    }`}
                                >

                                    {message.sender === "bot" && (
                                        <strong>
                                            ShetiMitra
                                        </strong>
                                    )}

                                    <p>{message.text}</p>

                                </div>

                            </div>

                        ))}


                        {loading && (

                            <div className="message-row bot-row">

                                <div className="avatar">
                                    🌱
                                </div>

                                <div className="message bot-message loading">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>

                            </div>

                        )}

                    </div>

                </section>

            </main>


            {/* ================= INPUT ================= */}

            <footer className="bottom-area">

                {listening && (
                    <div className="listening">
                        🔴 ऐकत आहे... मराठीत बोला
                    </div>
                )}

                <div className="input-wrapper">

                    <button
                        className={`mic-button ${
                            listening ? "active" : ""
                        }`}
                        onClick={startListening}
                        disabled={loading || listening}
                    >
                        🎤
                    </button>

                    <input
                        type="text"
                        value={question}
                        onChange={(e) =>
                            setQuestion(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendQuestion();
                            }
                        }}
                        placeholder="तुमचा प्रश्न येथे लिहा..."
                    />

                    <button
                        className="send-button"
                        onClick={() => sendQuestion()}
                        disabled={loading || !question.trim()}
                    >
                        ➤
                    </button>

                </div>

                <p className="footer-text">
                    🌱 ShetiMitra • केळी शेतीसाठी तुमचा डिजिटल साथीदार
                </p>

            </footer>

        </div>
    );
}

export default App;
