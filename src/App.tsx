import React, { useState, useRef, useEffect } from 'react';
import { Music, Send, Loader2, Globe, Music2, Disc, Star, Zap, Heart, CloudRain, PartyPopper, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

type Language = 'English' | 'Hindi' | 'Kannada' | 'Marathi' | 'Tamil' | 'Telugu' | 'Malayalam' | 'Punjabi' | 'Bengali' | 'Gujarati';

const BOT_KNOWLEDGE: Record<Language, string> = {
    English: "I am your AI Chat Connect Chill. Explore the world of music in Purple!",
    Hindi: "मैं आपका एआई संगीत उस्ताद हूं। बैंगनी रंग में संगीत की दुनिया की खोज करें!",
    Kannada: "ನಾನು ನಿಮ್ಮ AI ಸಂಗೀತ ಮಾಂತ್ರಿಕ. ನೇರಳೆ ಬಣ್ಣದಲ್ಲಿ ಸಂಗೀತದ ಜಗತ್ತನ್ನು ಅನ್ವೇಷಿಸಿ!",
    Marathi: "मी तुमचा मी संगीताचा जादुई मदतनीस आहे. जांभळ्या रंगात संगीताचे जग शोधा!",
    Tamil: "நான் உங்கள் AI சாட் கனெக்ட் சில். ஊதா நிறத்தில் இசை உலகை ஆராயுங்கள்!",
    Telugu: "నేను మీ AI చాಟ್ కనెక్ಟ್ చిల్. ఊదా రంగులో సంగీత ప్రపంచాన్ని అನ್వేషించండి!",
    Malayalam: "ഞാൻ നിങ്ങളുടെ AI ചാറ്റ് കണക്ട് ചില്ല് ആണ്. പർപ്പിൾ നിറത്തിൽ സംഗീറ്റ പര്യവേക്ഷണം നടത്തൂ!",
    Punjabi: "ਮੈਂ ਤੁਹਾਡਾ ਏਆਈ ਮਿਊਜ਼ਿਕ ਉਸਤਾਦ ਹਾਂ। ਜਾਮਨੀ ਰੰਗ ਵਿੱਚ ਸੰਗੀਤ ਦੀ ਦੁਨੀਆ ਦੀ ਖੋਜ ਕਰੋ!",
    Bengali: "আমি আপনার এআই মিউজিক ওস্তাদ। বেগুনি রঙে সঙ্গীতের জগত অন্বেষণ করুন!",
    Gujarati: "હું તમારો AI મ્યુઝિક ઉસ્તાદ છું. જાંબલી રંગમાં સંગીતની દુનિયા શોધો!"
};

interface Song {
    name: string;
    theme: string[];
}

interface ArtistEntry {
    name: string;
    aliases: string[]; // Added aliases for better matching (including native scripts)
    songs: Song[];
}

const SEARCH_DATA_STRUCTURED: Record<string, ArtistEntry> = {
    // KANNADA - LEGENDS & STARS
    'rajkumar': {
        name: "Dr. Rajkumar",
        aliases: ['ರಾಜ್ಕುಮಾರ್', 'ಡಾ. ರಾಜ್ಕುಮಾರ್', 'ಅಣ್ಣಾವ್ರು', 'rajkumar', 'dr rajkumar'],
        songs: [
            { name: "Huttidare Kannada Naadalli Huttabeku", theme: ["spirit", "happy"] },
            { name: "Nooru Kannu Saladu", theme: ["love", "classic"] },
            { name: "If You Come Today", theme: ["funny", "happy"] },
            { name: "Ellili Nodali Chinnada", theme: ["love"] },
            { name: "Yaaru Thiliyaru Ninna", theme: ["spiritual"] },
            { name: "Naguva Nayana", theme: ["love"] }
        ]
    },
    'puneeth rajkumar': {
        name: "Puneeth Rajkumar",
        aliases: ['ಪುನೀತ್ ರಾಜ್ಕುಮಾರ್', 'ಅಪ್ಪು', 'appu', 'puneeth', 'power star'],
        songs: [
            { name: "Raajakumara", theme: ["love", "inspiration"] },
            { name: "Tagaru Banthu", theme: ["party", "energy"] },
            { name: "Bombe Helutaithe", theme: ["sad", "classic"] },
            { name: "Appu Dance", theme: ["party"] }
        ]
    },
    'yash': {
        name: "Yash",
        aliases: ['ಯಶ್', 'rocky bhai', 'kgf yash'],
        songs: [
            { name: "Salaam Rocky Bhai", theme: ["energy", "party"] },
            { name: "Mehabooba", theme: ["love"] },
            { name: "Sulthana", theme: ["energy"] }
        ]
    },
    // HINDI
    'arijit singh': {
        name: "Arijit Singh",
        aliases: ['अरिजीत सिंह', 'arijit'],
        songs: [
            { name: "Tum Hi Ho", theme: ["love"] },
            { name: "Channa Mereya", theme: ["sad"] },
            { name: "Nashe Si Chadh Gayi", theme: ["party"] }
        ]
    },
    'kishore kumar': {
        name: "Kishore Kumar",
        aliases: ['किशोर कुमार', 'kishore da'],
        songs: [
            { name: "Hamen Tumse Pyar Kitna", theme: ["love"] },
            { name: "Zindagi Ek Safar", theme: ["happy"] },
            { name: "O Mere Dil Ke Chain", theme: ["love"] }
        ]
    },
    // TAMIL
    'a r rahman': {
        name: "A. R. Rahman",
        aliases: ['ஏ ஆர் ரகுமான்', 'rahman', 'arr'],
        songs: [
            { name: "Jai Ho", theme: ["happy", "energy"] },
            { name: "Kun Faya Kun", theme: ["sad", "spiritual"] },
            { name: "Enna Sona", theme: ["love"] }
        ]
    },
    'rajinikanth': {
        name: "Rajinikanth",
        aliases: ['ರಜಿನಿಕಾಂತ್', 'ரஜினிகாந்த்', 'thalaivar', 'superstar'],
        songs: [
            { name: "Marana Mass", theme: ["party", "energy"] },
            { name: "Chumma Kizhi", theme: ["party"] }
        ]
    },
    // TELUGU
    'sid sriram': {
        name: "Sid Sriram",
        aliases: ['సిద్ శ్రీరాம்', 'sid sriram'],
        songs: [
            { name: "Samajavaragamana", theme: ["love"] },
            { name: "Srivalli", theme: ["love"] },
            { name: "Kannaana Kanney", theme: ["love", "sad"] }
        ]
    },
    // PUNJABI
    'diljit dosanjh': {
        name: "Diljit Dosanjh",
        aliases: ['ਦਿਲਜੀਤ ਦੋਸਾਂਝ', 'diljit'],
        songs: [
            { name: "Proper Patola", theme: ["party"] },
            { name: "Lover", theme: ["love"] },
            { name: "G.O.A.T.", theme: ["rap"] }
        ]
    },
    'sidhu moose wala': {
        name: "Sidhu Moose Wala",
        aliases: ['ਸਿੱਧੂ ਮੂਸੇ ਵਾਲਾ', 'sidhu', 'moosewala'],
        songs: [
            { name: "295", theme: ["rap"] },
            { name: "The Last Ride", theme: ["rap"] },
            { name: "Levels", theme: ["rap"] }
        ]
    }
};

const THEME_DATA: Record<string, Record<Language, string>> = {
    love: {
        English: "💖 Love & Romantic Anthems:\n1. 'Perfect' - Ed Sheeran\n2. 'All of Me' - John Legend",
        Hindi: "💖 रोमांटिक नगमे:\n1. 'Tum Hi Ho' - Arijit Singh\n2. 'Lag Jaa Gale' - Lata Mangeshkar",
        Kannada: "💖 ಪ್ರೇಮ ಗೀತೆಗಳು:\n1. 'ಬೆಳಗೆದ್ದು' - ಕಿರಿಕ್ ಪಾರ್ಟಿ\n2. 'ನೀನೇ ರಾಜಕುಮಾರ'",
        Marathi: "💖 प्रेमगीते:\n1. 'झिंगाટ' (Love edit)\n2. 'दिवा तुझे किती'",
        Tamil: "💖 காதல் பாடல்கள்:\n1. 'கண்ணான கண்ணே'\n2. 'முன்பே வா'",
        Telugu: "💖 ప్రేమ గీతాలు:\n1. 'సమాజవరగమన'\n2. 'ఇంకేం ఇంకేం'",
        Malayalam: "💖 പ്രണയ ഗാനങ്ങൾ:\n1. 'മലരേ'\n2. 'ഉയിരേ'",
        Punjabi: "💖 ਪਿਆਰ ਦੇ ਗੀਤ:\n1. 'ਕਸੂਰ'\n2. 'ਤੇਰੇ ਰੰਗ ਵਰਗਾ'",
        Bengali: "💖 ভালোবাসার গান:\n1. 'আমি তোমার হতে চাই'\n2. 'তোমাকে'",
        Gujarati: "💖 પ્રેમ ગીતો:\n1. 'વ્હાલમ આવો ને'\n2. 'તારા વિના શ્યામ'"
    },
    sad: {
        English: "💧 Soul-Stirring Sad Songs:\n1. 'Someone Like You' - Adele\n2. 'Fix You' - Coldplay",
        Hindi: "💧 दर्द भरे नगमे:\n1. 'Channa Mereya' - Arjit Singh\n2. 'Agar Tum Saath Ho'",
        Kannada: "💧 ವಿಷಾದದ ಗೀತೆಗಳು:\n1. 'ಅನಿಸುತಿದೆ' - ಮುಂಗಾರು ಮಳೆ",
        Marathi: "💧 दुःखद गाणी:\n1. 'येळकोट' - सैराट",
        Tamil: "💧 சோகமான பாடல்கள்:\n1. 'ஏனோ ஏனோ'\n2. 'போகாதே'",
        Telugu: "💧 విషాద గీతాలు:\n1. 'మనసే ಕవ్వించే'\n2. 'శ్రీవల్లి' (Sad)",
        Malayalam: "💧 ദുഃഖ ഗാനങ്ങൾ:\n1. 'പൂമുത്തോലെ'\n2. 'സീൻ കോൺട്രാ'",
        Punjabi: "💧 ਉਦਾਸ ਗੀਤ:\n1. 'ਚੰਨ ਵਿੱਛੜ ਗਿਆ'",
        Bengali: "💧 বিরহের গান:\n1. 'নিশি রাত'",
        Gujarati: "💧 દુઃખદ ગીતો:\n1. 'તારક મહેતા' (Sad theme)"
    },
    party: {
        English: "🕺 Party Non-Stop:\n1. 'Uptown Funk' - Bruno Mars\n2. 'Levitating' - Dua Lipa",
        Hindi: "🕺 पार्टी के गाने:\n1. 'Kar Gayi Chull'\n2. 'Saturday Saturday'",
        Kannada: "🕺 ಪಾರ್ಟಿ ಹಾಡುಗಳು:\n1. 'ಟಗರು ಬಂತು'\n2. 'ಓಪನ್ ಹೇರ್ ಡೋಲಿ'",
        Marathi: "🕺 पार्टीसाठी गाणी:\n1. 'झिंगाट'\n2. 'शांताबाई'",
        Tamil: "🕺 பார்ட்டி பாடல்கள்:\n1. 'அரபிக் குத்து'\n2. 'வாத்தி கமிங்'",
        Telugu: "🕺 పార్టీ సాంగ్స్:\n1. 'ఊ అంటావా'\n2. 'రాములో రాములా'",
        Malayalam: "🕺 പാർട്ടി ഗാനങ്ങൾ:\n1. 'കുടുക്ക്'\n2. 'ചിന്നമ്മ'",
        Punjabi: "🕺 ਪਾਰਟੀ ਗੀਤ:\n1. 'ਪਰਾਪਰ ਪਟੋਲਾ'",
        Bengali: "🕺 পার্টি গান:\n1. 'টুম্পা'",
        Gujarati: "🕺 પાર્ટી ગીતો:\n1. 'લેરી લાલા'"
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
        {
            id: '1',
            text: BOT_KNOWLEDGE['English'],
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [currentLang, setCurrentLang] = useState<Language>('English');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const botResponse = generateResponse(input, currentLang);
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const generateResponse = (query: string, lang: Language): string => {
        const q = query.toLowerCase();

        // Theme keyword map
        const themeKeywords: Record<string, string[]> = {
            love: ['love', 'romantic', 'காதல்', 'ಪ್ರೇಮ', 'പ്രണയം', 'ಪ್ರೀತಿ', 'प्रेम', 'ਪਿਆਰ', 'ভালোবাসা', 'પ્રેમ'],
            sad: ['sad', 'emotional', 'சோகம்', 'விஷாదం', 'ವಿಷಾദം', 'ದುಃಖ', 'दुख', 'ਉਦਾਸ', 'দুঃখ', 'દુઃખ'],
            party: ['party', 'dance', 'பார்ட்டி', 'పార్టీ', 'പാർട്ടി', 'ಪಾರ್ಟಿ', 'ನಾಚ', 'ਪਾਰਟੀ', 'পার্টি', 'પાર્ટી'],
            rap: ['rap', 'hip hop', 'ರಾಪ್', 'ರಾಪರ್'],
            happy: ['happy', 'joy', 'சந்தோஷம்', 'ಸంతోಷಂ', 'ಸಂತೋಷ', 'आनंद', 'ਖੁਸ਼ੀ', 'আনন্দ', 'આનંદ']
        };

        // Detect themes in query
        const detectedThemes = Object.entries(themeKeywords)
            .filter(([_, keywords]) => keywords.some(k => q.includes(k)))
            .map(([theme]) => theme);

        // ADVANCED SEARCH LOGIC: Match by aliases and native scripts
        const detectedArtist = Object.values(SEARCH_DATA_STRUCTURED)
            .find(artist =>
                artist.name.toLowerCase().includes(q) ||
                artist.aliases.some(alias => q.includes(alias.toLowerCase()))
            );

        if (detectedArtist) {
            let filteredSongs = detectedArtist.songs;

            if (detectedThemes.length > 0) {
                filteredSongs = detectedArtist.songs.filter(s =>
                    s.theme.some(t => detectedThemes.includes(t))
                );
            }

            if (filteredSongs.length > 0) {
                const songList = filteredSongs.map((s, i) => `${i + 1}. '${s.name}'`).join('\n');
                const themeStr = detectedThemes.length > 0 ? `${detectedThemes.join(' & ')} ` : '';
                return `🕺 Top ${themeStr}tracks by ${detectedArtist.name}:\n${songList}`;
            } else {
                return `I found ${detectedArtist.name}, but couldn't find specific ${detectedThemes.join('/')} tracks. Here are some of their hits instead:\n` +
                    detectedArtist.songs.slice(0, 5).map((s, i) => `${i + 1}. '${s.name}'`).join('\n');
            }
        }

        // Generic Theme Search
        if (detectedThemes.length > 0) {
            const primaryTheme = detectedThemes[0];
            return THEME_DATA[primaryTheme][lang] || THEME_DATA[primaryTheme]['English'];
        }

        // Greetings
        if (q.includes('hello') || q.includes('hi') || q.includes('வணக்கம்') || q.includes('ನಮಸ್ಕಾರ') || q.includes('ನಮಸ್ಕಾರ') || q.includes('ನಮಸ್ತೆ')) {
            return BOT_KNOWLEDGE[lang];
        }

        return lang === 'English' ? `Searching for "${query}" in our library... Try asking for 'Dr. Rajkumar songs', 'ಜೊತೆಯಲಿ', or 'Diljit Dosanjh hits'!` :
            lang === 'Kannada' ? `ನಿಮ್ಮ ಪಸಂದಿನ "${query}" ಹುಡುಕುತ್ತಿದ್ದೇನೆ! ಡಾ. ರಾಜ್ಕುಮಾರ್, ಪುನೀತ್ ಅಥವಾ ಯಶ್ ಅವರ ಹಾಡುಗಳ ಬಗ್ಗೆ ಕೇಳಿ!` :
                `Checking for "${query}"... Try searching for actors, singers, genres or albums!`;
    };

    const changeLanguage = (lang: Language) => {
        setCurrentLang(lang);
        const welcomeMsg: Message = {
            id: Date.now().toString(),
            text: BOT_KNOWLEDGE[lang],
            sender: 'bot',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, welcomeMsg]);
    };

    return (
        <div className="app-container">
            <MusicBackground />

            <header className="header">
                <div className="logo-section">
                    <Music size={32} className="logo-icon" />
                    <h1>Chat Connect Chill</h1>
                </div>
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
            </header>

            <main className="chat-window">
                <AnimatePresence mode="popLayout">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className={`message ${msg.sender}`}
                        >
                            <div className="msg-icon" style={{ marginBottom: '8px', opacity: 0.7 }}>
                                {msg.sender === 'bot' ? <Music2 size={16} /> : <Zap size={16} />}
                            </div>
                            <div className="msg-text">{msg.text}</div>
                            <div className="msg-time">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
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
                        placeholder={`Ask about songs in ${currentLang}...`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        className="send-btn"
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                    >
                        {isTyping ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    </button>
                </div>
            </footer>
        </div>
    );
}

export default App;
