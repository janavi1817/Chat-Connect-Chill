import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Send, Loader2, Globe, Music2, Disc, Star, Zap, Heart, CloudRain, PartyPopper, Smile, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

type Language = 'English' | 'Hindi' | 'Kannada' | 'Marathi' | 'Tamil' | 'Telugu' | 'Malayalam' | 'Punjabi' | 'Bengali' | 'Gujarati';

const BOT_KNOWLEDGE: Record<Language, string> = {
    English: "I am your AI Chat Connect Chill. Explore the world of music in Purple!",
    Hindi: "मैं आपका एआई संगीत उस्ताद हूं। बैंगनी रंग में संगीत की दुनिया की खोज करें!",
    Kannada: "ನಾನು ನಿಮ್ಮ AI ಸಂಗೀತ ಮಾಂತ್ರಿಕ. ನೇರಳೆ ಬಣ್ಣದಲ್ಲಿ ಸಂಗೀತದ ಜಗತ್ತನ್ನು ಅನ್ವೇಷಿಸಿ!",
    Marathi: "मी तुमचा मी संगีताचा जादुई मदतनीस आहे. जांभळ्या ರಂಗಾತ್ ಸಂಗೀತಾಚೆ ಜಗ್ ಶೋಧಾ!",
    Tamil: "நான் உங்கள் AI சாட் கனெக்ட் சில். ஊதா நிறத்தில் இசை உலகை ஆராயுங்கள்!",
    Telugu: "నేను మీ AI చాట్ కనెక్ట్ చిల్. ఊదా రంగులో సంగీత ప్రపంచాన్ని ಅನ್ವೇಷಿಸಿ!",
    Malayalam: "ഞാൻ നിങ്ങളുടെ AI ചാറ്റ് കണക്ട് ചില്ല് ആണ്. പർപ്പിൾ നിറത്തിൽ സംഗീത ലോകം പര്യവേಕ್ಷണം ചെയ്യുക!",
    Punjabi: "ਮੈਂ ਤੁਹਾਡਾ ਏਆਈ ਮਿਊਜ਼ਿਕ ਉਸਤਾਦ ਹਾਂ। ਜਾਮਨੀ ਰੰਗ ਵਿੱਚ ਸੰਗੀਤ ਦੀ ਦੁਨੀਆ ਦੀ ਖੋਜ ਕਰੋ!",
    Bengali: "আমি আপনার এআই মিউজিক ওস্তাদ। বেগুনি রঙে সঙ্গীতের জগত অন্বেষণ করুন!",
    Gujarati: "હું તમારો AI મ્યુઝિક ઉસ્તાદ છું. જાંબલી રંગમાં સંગીતની દુનિયા શોધો!"
};

const LOCALIZED_TEMPLATES = {
    found_songs: {
        English: "🕺 Top tracks by {artist}:",
        Kannada: "🕺 {artist} ಅವರ ಪ್ರಮುಖ ಹಾಡುಗಳು ಇಲ್ಲಿವೆ:",
        Hindi: "🕺 {artist} के बेहतरीन गाने:",
        Tamil: "🕺 {artist} இன் சிறந்த பாடல்கள்:",
        Telugu: "🕺 {artist} యొక్క ప్రసిద్ధ పాటలు:",
        Marathi: "🕺 {artist} यांची लोकप्रिय गाणी:",
        Malayalam: "🕺 {artist} -ന്റെ മികച്ച ഗാനങ്ങൾ:",
        Punjabi: "🕺 {artist} ਦੇ ਚੋਟੀ ਦੇ ਗੀਤ:",
        Bengali: "🕺 {artist}-এর সেরা গান:",
        Gujarati: "🕺 {artist} ના શ્રેષ્ઠ ગીતો:"
    }
};

interface Song {
    name: string;
    theme: string[];
}

interface ArtistEntry {
    name: string;
    aliases: string[];
    songs: Song[];
}

const SEARCH_DATA_STRUCTURED: ArtistEntry[] = [
    // KANNADA - LEGENDS (MASSIVE DATASET)
    {
        name: "Dr. Rajkumar",
        aliases: ['ರಾಜ್ಕುಮಾರ್', 'ಡಾ. ರಾಜ್ಕುಮಾರ್', 'ಅಣ್ಣಾವ್ರು', 'rajkumar', 'dr rajkumar', 'anaavru', 'raj kumar'],
        songs: [
            { name: "Huttidare Kannada Naadalli Huttabeku", theme: ["spirit", "happy"] },
            { name: "Nooru Kannu Saladu", theme: ["love", "classic"] },
            { name: "If You Come Today", theme: ["funny", "happy"] },
            { name: "Ellelli Nodali", theme: ["love"] },
            { name: "Chinnada Mallige Hoove", theme: ["love"] },
            { name: "Baani Gondu Elle", theme: ["philosophical"] },
            { name: "Hrudayadali Idenidhu", theme: ["love"] },
            { name: "Naa Ninna Mareyalare", theme: ["love"] },
            { name: "Thanuvu Manavu", theme: ["love"] },
            { name: "Nagunagutha Nee Baruve", theme: ["happy"] },
            { name: "Yare Koogadali Oore Horaadali", theme: ["energy"] },
            { name: "Ninna Nanna", theme: ["love"] },
            { name: "Thai Thai Bangari", theme: ["folk"] },
            { name: "Muthinantha Mathondu", theme: ["philosophical"] },
            { name: "Sangeethave Nee Nudiyuna Maathella", theme: ["art"] },
            { name: "Yaaru Thiliyaru Ninna", theme: ["spiritual"] },
            { name: "Nannaseyaa Hoove", theme: ["love"] },
            { name: "Love Me Or Hate Me", theme: ["happy"] },
            { name: "Beladingalaagi Baa", theme: ["love"] },
            { name: "Ninna Kangala", theme: ["love"] },
            { name: "My Name Is Raj", theme: ["happy"] },
            { name: "Jagave Ondu Ranaranga", theme: ["philosophical"] },
            { name: "Cheluveya Nota Chenna", theme: ["love"] },
            { name: "Koodi Balona", theme: ["happy"] },
            { name: "Chinna Baalalli", theme: ["classic"] },
            { name: "Endendu Ninnanu Maretu", theme: ["love"] },
            { name: "Baaro Baaro Ranadheera", theme: ["energy"] },
            { name: "Preethi Maadabaaradu", theme: ["love"] }
        ]
    },
    {
        name: "S. Janaki",
        aliases: ['ಎಸ್ ಜಾನಕಿ', 's janaki', 'janaki amma'],
        songs: [
            { name: "Naguva Nayana", theme: ["love"] },
            { name: "Ellelli Nodali", theme: ["love"] },
            { name: "Chinnada Malligalli", theme: ["love"] },
            { name: "Yaaru Neenu Endhu Nanna", theme: ["happy"] },
            { name: "Baani Gondu Elle", theme: ["philosophical"] },
            { name: "Poojisalende Hoovagide", theme: ["devotional"] },
            { name: "Onde Ondu Maatu", theme: ["love"] },
            { name: "Gaganavu Yello", theme: ["nature"] },
            { name: "Ninna Kangala", theme: ["love"] }
        ]
    },
    {
        name: "P. B. Sreenivas",
        aliases: ['ಪಿ ಬಿ ಶ್ರೀನಿವಾಸ್', 'p b sreenivas', 'pbs'],
        songs: [
            { name: "Aadisi Nodu", theme: ["philosophical"] },
            { name: "Noorentu Nomeglallu", theme: ["love"] },
            { name: "Bahu Janmada", theme: ["spirit"] },
            { name: "Nagunagutha Nee Baruve", theme: ["happy"] },
            { name: "Huttidare Kannada Naadalli", theme: ["patriotic"] }
        ]
    },
    {
        name: "Shankar Nag",
        aliases: ['ಶಂಕರ್ ನಾಗ್', 'shankar nag', 'karate raja'],
        songs: [
            { name: "Santoshakke", theme: ["party", "happy"] },
            { name: "Jotheyali ಜೊತೆಯಲಿ", theme: ["love"] },
            { name: "Namma Shaale", theme: ["nostalgia"] },
            { name: "Raja Nanna Raja", theme: ["happy"] },
            { name: "Geluvina Geethe", theme: ["energy"] },
            { name: "Noorentu Nomegalallu", theme: ["love"] }
        ]
    },
    {
        name: "Dr. Vishnuvardhan",
        aliases: ['ವಿಷ್ಣುವರ್ಧನ್', 'ಡಾ. ವಿಷ್ಣುವರ್ಧನ್', 'ಸಾಹಸ ಸಿಂಹ', 'vishnuvardhan', 'saahasa simha', 'vishnu'],
        songs: [
            { name: "Noorentu Nomeglallu", theme: ["love"] },
            { name: "Haalu Jenu", theme: ["love"] },
            { name: "Snehada Kadalalli", theme: ["love", "friendship"] },
            { name: "Veenavaani", theme: ["classical"] },
            { name: "Anandavenu Anuraagavenu", theme: ["happy"] }
        ]
    },
    {
        name: "Puneeth Rajkumar",
        aliases: ['ಪುನೀತ್ ರಾಜ್ಕುಮಾರ್', 'ಅಪ್ಪು', 'appu', 'puneeth', 'power star'],
        songs: [
            { name: "Raajakumara", theme: ["love", "inspiration"] },
            { name: "Tagaru Banthu", theme: ["party", "energy"] },
            { name: "Bombe Helutaithe", theme: ["sad", "classic"] },
            { name: "Appu Dance", theme: ["party"] },
            { name: "Neene Rajakumara", theme: ["love"] },
            { name: "Power Star", theme: ["energy"] },
            { name: "Geleya Geleya", theme: ["friendship"] }
        ]
    }
];

const THEME_DATA: Record<string, Record<Language, string>> = {
    love: {
        English: "💖 Love & Romantic Anthems:\n1. 'Perfect' - Ed Sheeran\n2. 'All of Me' - John Legend",
        Kannada: "💖 ಪ್ರೇಮ ಗೀತೆಗಳು:\n1. 'ಬೆಳಗೆದ್ದು' - ಕಿರಿಕ್ ಪಾರ್ಟಿ\n2. 'ನೀನೇ ರಾಜಕುಮಾರ' - ಪುನೀತ್ ರಾಜಕುಮಾರ್",
        Hindi: "💖 रोमांटिक नगमे:\n1. 'Tum Hi Ho' - Arijit Singh\n2. 'Lag Jaa Gale' - Lata Mangeshkar"
    },
    party: {
        English: "🕺 Party Non-Stop:\n1. 'Uptown Funk' - Bruno Mars\n2. 'Levitating' - Dua Lipa",
        Kannada: "🕺 ಪಾರ್ಟಿ ಹಾಡುಗಳು:\n1. 'ಟಗರು ಬಂತು'\n2. 'ಓಪನ್ ಹೇರ್ ಡೋಲಿ'",
        Hindi: "🕺 पार्टी के गाने:\n1. 'Kar Gayi Chull'\n2. 'Saturday Saturday'"
    }
};

const LANGUAGES: Language[] = ['English', 'Hindi', 'Kannada', 'Marathi', 'Tamil', 'Telugu', 'Malayalam', 'Punjabi', 'Bengali', 'Gujarati'];

const MusicBackground = () => {
    const notes = ['♪', '♫', '♬', '♩', '🎶'];
    return (
        <div className="music-background">
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="floating-note"
                    style={{
                        left: `${Math.random() * 100}%`,
                        fontSize: `${Math.random() * 20 + 20}px`,
                        animationDelay: `${Math.random() * 15}s`,
                        animationDuration: `${Math.random() * 10 + 10}s`
                    }}
                >
                    {notes[i % notes.length]}
                </div>
            ))}
        </div>
    );
};

function App() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: BOT_KNOWLEDGE['English'], sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentLang, setCurrentLang] = useState<Language>('English');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // SPEECH SYNTHESIS (TTS)
    const speak = useCallback((text: string) => {
        if (!isSpeaking) return;
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(text);

        const langMap: Record<Language, string> = {
            English: 'en-US', Hindi: 'hi-IN', Kannada: 'kn-IN', Marathi: 'mr-IN',
            Tamil: 'ta-IN', Telugu: 'te-IN', Malayalam: 'ml-IN', Punjabi: 'pa-IN',
            Bengali: 'bn-IN', Gujarati: 'gu-IN'
        };
        utter.lang = langMap[currentLang] || 'en-US';
        synth.speak(utter);
    }, [isSpeaking, currentLang]);

    // SPEECH RECOGNITION (STT) - Robust Implementation
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                console.log("Listening started...");
            };

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                console.log("Transcript received:", transcript);
                setInput(transcript);
                setIsListening(false);
                handleSend(transcript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                console.log("Listening ended.");
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech Recognition Error:", event.error);
                setIsListening(false);
            };
        }
    }, [currentLang]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition not supported in this browser.");
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            const langMap: Record<Language, string> = {
                English: 'en-US', Hindi: 'hi-IN', Kannada: 'kn-IN', Marathi: 'mr-IN',
                Tamil: 'ta-IN', Telugu: 'te-IN', Malayalam: 'ml-IN', Punjabi: 'pa-IN',
                Bengali: 'bn-IN', Gujarati: 'gu-IN'
            };
            recognitionRef.current.lang = langMap[currentLang];
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Error starting recognition:", e);
                recognitionRef.current.stop();
                setTimeout(() => recognitionRef.current.start(), 100);
            }
        }
    };

    const handleSend = async (customInput?: string) => {
        const textToSend = customInput || input;
        if (!textToSend.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const botResponse = generateResponse(textToSend, currentLang);
            const botMsg: Message = { id: (Date.now() + 1).toString(), text: botResponse, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
            speak(botResponse);
        }, 1500);
    };

    const generateResponse = (query: string, lang: Language): string => {
        const q = query.toLowerCase();

        const themeKeywords: Record<string, string[]> = {
            love: ['love', 'romantic', 'காதல்', 'ಪ್ರೇಮ', 'ಪ್ರಣಯಂ', 'ಪ್ರೀತಿ', 'प्रेम', 'ਪਿਆਰ', 'ভালোবাসা', 'પ્રેમ'],
            sad: ['sad', 'emotional', 'சோகம்', 'விಷಾದ', 'ವಿಷಾಡಂ', 'ದುಃಖ', 'दुख', 'ਉਦਾਸ', 'দুঃখ', 'દુઃಖ'],
            party: ['party', 'dance', 'பார்ட்டி', 'పార్టీ', 'പാർട്ടി', 'ಪಾರ್ಟಿ', 'ನಾಚ', 'ਪਾਰਟੀ', 'পার্টি', 'પાર્ટી'],
            rap: ['rap', 'hip hop', 'ರಾಪ್', 'ರಾಪರ್', 'ರ್ಯಾಪ್'],
            happy: ['happy', 'joy', 'சந்தோஷம்', 'ಸಂತೋಷಂ', 'ಸಂತೋಷ', 'आनंद', 'ਖੁਸ਼ੀ', 'আনন্দ', 'આನંદ']
        };

        const detectedThemes = Object.entries(themeKeywords)
            .filter(([_, keywords]) => keywords.some(k => q.includes(k)))
            .map(([theme]) => theme);

        const detectedArtist = SEARCH_DATA_STRUCTURED.find(artist =>
            q.includes(artist.name.toLowerCase()) ||
            artist.aliases.some(alias => q.includes(alias.toLowerCase()))
        );

        if (detectedArtist) {
            let filteredSongs = detectedArtist.songs;
            if (detectedThemes.length > 0) {
                filteredSongs = detectedArtist.songs.filter(s =>
                    s.theme.some(t => detectedThemes.includes(t))
                );
            }

            const header = LOCALIZED_TEMPLATES.found_songs[lang]?.replace('{artist}', detectedArtist.name) ||
                `🕺 Top tracks by ${detectedArtist.name}:`;

            if (filteredSongs.length > 0) {
                const songList = filteredSongs.map((s, i) => `${i + 1}. '${s.name}'`).join('\n');
                return `${header}\n${songList}`;
            } else {
                return `${header}\n` + detectedArtist.songs.slice(0, 20).map((s, i) => `${i + 1}. '${s.name}'`).join('\n');
            }
        }

        if (detectedThemes.length > 0) {
            const primaryTheme = detectedThemes[0];
            return THEME_DATA[primaryTheme][lang] || THEME_DATA[primaryTheme]['English'];
        }

        if (q.includes('hello') || q.includes('hi') || q.includes('ನಮಸ್ಕಾರ') || q.includes('ನಮಸ್ತೆ') || q.includes('ಹಲೋ')) {
            return BOT_KNOWLEDGE[lang];
        }

        return lang === 'English' ? `Searching for "${query}" in our library... Try asking for 'Dr. Rajkumar songs', 'ಜೊತೆಯಲಿ', or 'Puneeth hits'!` :
            lang === 'Kannada' ? `ನಿಮ್ಮ ಪಸಂದಿನ "${query}" ಹುಡುಕುತ್ತಿದ್ದೇನೆ! ಡಾ. ರಾಜ್ಕುಮಾರ್, ಶಂಕರ್ ನಾಗ್ ಅಥವಾ ಪುನೀತ್ ಅವರ ಹಾಡುಗಳ ಬಗ್ಗೆ ಕೇಳಿ!` :
                `Checking for "${query}"... Try searching for actors, singers, genres or albums!`;
    };

    const changeLanguage = (lang: Language) => {
        setCurrentLang(lang);
        const welcomeMsg: Message = { id: Date.now().toString(), text: BOT_KNOWLEDGE[lang], sender: 'bot' };
        setMessages(prev => [...prev, welcomeMsg]);
        speak(BOT_KNOWLEDGE[lang]);
    };

    return (
        <div className="app-container">
            <MusicBackground />

            <header className="header">
                <div className="logo-section">
                    <Music size={32} className="logo-icon" />
                    <h1>Chat Connect Chill</h1>
                </div>
                <div className="header-controls">
                    <button
                        className={`action-btn ${isSpeaking ? 'active' : ''}`}
                        onClick={() => setIsSpeaking(!isSpeaking)}
                        title={isSpeaking ? "Mute Bot" : "Unmute Bot"}
                    >
                        {isSpeaking ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    <div className="language-selector">
                        <Globe size={18} style={{ marginRight: '8px', color: '#A78BFA' }} />
                        <div className="lang-buttons-grid">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang}
                                    className={`lang-btn ${currentLang === lang ? 'active' : ''}`}
                                    onClick={() => changeLanguage(lang)}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <main className="chat-window">
                <AnimatePresence mode="popLayout">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`message ${msg.sender}`}
                        >
                            <div className="msg-icon" style={{ marginBottom: '8px', opacity: 0.7 }}>
                                {msg.sender === 'bot' ? <Music2 size={16} /> : <Zap size={16} />}
                            </div>
                            <div className="msg-text">{msg.text}</div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isTyping && (
                    <div className="message bot typing">
                        <div className="typing-indicator">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </main>

            <footer className="input-area">
                <div className="input-container">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder={isListening ? "Listening..." : `Ask in ${currentLang}...`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <div className="input-actions-right">
                        <button
                            className={`voice-btn-premium ${isListening ? 'recording' : ''}`}
                            onClick={toggleListening}
                            title="Voice Assistant"
                        >
                            <motion.div
                                animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                {isListening ? <MicOff size={22} color="#EF4444" /> : <Mic size={22} color="#A78BFA" />}
                            </motion.div>
                        </button>
                        <button
                            className="send-btn"
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isTyping}
                        >
                            {isTyping ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
