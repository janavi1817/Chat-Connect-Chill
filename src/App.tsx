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
    Telugu: "నేను మీ AI చాట్ కనెక్ట్ చిల్. ఊదా రంగులో సంగీత ప్రపంచాన్ని అన్వేషించండి!",
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
    songs: Song[];
}

const SEARCH_DATA_STRUCTURED: Record<string, ArtistEntry> = {
    // ENGLISH
    'taylor swift': { name: "Taylor Swift", songs: [{ name: "Anti-Hero", theme: ["pop", "happy"] }, { name: "Love Story", theme: ["love"] }, { name: "All Too Well", theme: ["sad"] }, { name: "Shake It Off", theme: ["party"] }] },
    'ed sheeran': { name: "Ed Sheeran", songs: [{ name: "Perfect", theme: ["love"] }, { name: "Bad Habits", theme: ["party"] }] },
    'adele': { name: "Adele", songs: [{ name: "Someone Like You", theme: ["sad"] }, { name: "Easy On Me", theme: ["sad"] }] },
    'drake': { name: "Drake", songs: [{ name: "God's Plan", theme: ["rap"] }, { name: "In My Feelings", theme: ["party"] }] },
    // HINDI
    'arijit singh': { name: "Arijit Singh", songs: [{ name: "Tum Hi Ho", theme: ["love"] }, { name: "Channa Mereya", theme: ["sad"] }, { name: "Nashe Si Chadh Gayi", theme: ["party"] }] },
    'kishore kumar': { name: "Kishore Kumar", songs: [{ name: "Hamen Tumse Pyar Kitna", theme: ["love"] }, { name: "Zindagi Ek Safar", theme: ["happy"] }] },
    'lata mangeshkar hindi': { name: "Lata Mangeshkar", songs: [{ name: "Lag Jaa Gale", theme: ["love"] }, { name: "Tere Bina Zindagi Se", theme: ["sad"] }] },
    // KANNADA
    'puneeth rajkumar': { name: "Puneeth Rajkumar", songs: [{ name: "Raajakumara", theme: ["love"] }, { name: "Tagaru Banthu", theme: ["party"] }, { name: "Bombe Helutaithe", theme: ["sad"] }] },
    'p b sreenivas': { name: "P. B. Sreenivas", songs: [{ name: "Nooru Kannu Saladu", theme: ["love"] }, { name: "Aadisi Nodu", theme: ["happy"] }] },
    's p b kannada': { name: "S. P. Balasubrahmanyam", songs: [{ name: "Jotheyali", theme: ["love"] }, { name: "Naguva Nayana", theme: ["love"] }] },
    // MARATHI
    'lata mangeshkar marathi': { name: "Lata Mangeshkar", songs: [{ name: "Mogara Phulala", theme: ["love"] }, { name: "Airaneechya Deva", theme: ["folk"] }] },
    'ajay-atul': { name: "Ajay-Atul", songs: [{ name: "Zingaat", theme: ["party"] }, { name: "Mauli Mauli", theme: ["spiritual"] }] },
    // TAMIL
    'a r rahman': { name: "A. R. Rahman", songs: [{ name: "Jai Ho", theme: ["happy", "energy"] }, { name: "Kun Faya Kun", theme: ["sad", "spiritual"] }, { name: "Enna Sona", theme: ["love"] }] },
    'anirudh': { name: "Anirudh Ravichander", songs: [{ name: "Arabic Kuthu", theme: ["party"] }, { name: "Vaathi Coming", theme: ["party"] }] },
    'ilayaraja': { name: "Ilayaraja", songs: [{ name: "Thendral Vandhu", theme: ["love"] }, { name: "Kanmani Anbodu", theme: ["love"] }] },
    // TELUGU
    'sid sriram telugu': { name: "Sid Sriram (Telugu)", songs: [{ name: "Samajavaragamana", theme: ["love"] }, { name: "Srivalli", theme: ["love"] }] },
    's p b telugu': { name: "S. P. Balasubrahmanyam (Telugu)", songs: [{ name: "Mate Mantramu", theme: ["love"] }, { name: "Priyathama", theme: ["love"] }] },
    // MALAYALAM
    'k j yesudas': { name: "K. J. Yesudas", songs: [{ name: "Harivarasanam", theme: ["spiritual"] }, { name: "Pramadavanam", theme: ["classical"] }] },
    'mg sreekumar': { name: "M. G. Sreekumar", songs: [{ name: "Kila Kila", theme: ["happy"] }, { name: "Chinnamma", theme: ["party"] }] },

    // NEW LANGUAGES FROM DATASET
    // PUNJABI
    'noor jehan': { name: "Noor Jehan", songs: [{ name: "Dilbar Dil Wich Na Ja", theme: ["love"] }, { name: "Dhol Ja", theme: ["folk"] }] },
    'mahendra kapoor': { name: "Mahendra Kapoor", songs: [{ name: "Ik Kudi Jehda Naa Mohabbat", theme: ["love"] }, { name: "Aaj Te", theme: ["folk"] }] },
    'diljit dosanjh': { name: "Diljit Dosanjh", songs: [{ name: "Proper Patola", theme: ["party"] }, { name: "Lover", theme: ["love"] }, { name: "G.O.A.T.", theme: ["rap"] }] },
    'sidhu moose wala': { name: "Sidhu Moose Wala", songs: [{ name: "295", theme: ["rap"] }, { name: "The Last Ride", theme: ["rap"] }] },
    // BENGALI
    'hemanta mukherjee': { name: "Hemanta Mukherjee", songs: [{ name: "Ei Path Jadi Na Shesh Hoy", theme: ["love"] }, { name: "Nishi Raat", theme: ["sad"] }] },
    'kishore kumar bengali': { name: "Kishore Kumar (Bengali)", songs: [{ name: "Aaj Ei Dintake", theme: ["happy"] }, { name: "Eki Sathe Chala", theme: ["love"] }] },
    'shreya ghoshal bengali': { name: "Shreya Ghoshal (Bengali)", songs: [{ name: "Bhalobashar Gaan", theme: ["love"] }, { name: "Tomake", theme: ["love"] }] },
    'stromae': { name: "Stromae", songs: [{ name: "Alors On Danse", theme: ["party"] }, { name: "Papaoutai", theme: ["sad"] }] }, // Re-adding some French favorites requested before
    // GUJARATI
    'geeta rabari': { name: "Geeta Rabari", songs: [{ name: "Kona Kane Kane", theme: ["folk"] }, { name: "Rona Sher Ma", theme: ["party"] }] },
    'kinjal dave': { name: "Kinjal Dave", songs: [{ name: "Leri Lala", theme: ["party"] }, { name: "Char Char Bangadi", theme: ["party"] }] },
    'osman mir': { name: "Osman Mir", songs: [{ name: "Madi Tara Ashirwad", theme: ["spiritual"] }, { name: "Vhalam Aavo Ne", theme: ["love"] }] }
};

const THEME_DATA: Record<string, Record<Language, string>> = {
    love: {
        English: "💖 Love & Romantic Anthems:\n1. 'Perfect' - Ed Sheeran\n2. 'All of Me' - John Legend",
        Hindi: "💖 रोमांटिक नगमे:\n1. 'Tum Hi Ho' - Arijit Singh\n2. 'Lag Jaa Gale' - Lata Mangeshkar",
        Kannada: "💖 ಪ್ರೇಮ ಗೀತೆಗಳು:\n1. 'ಬೆಳಗೆದ್ದು' - ಕಿರಿಕ್ ಪಾರ್ಟಿ\n2. 'ನೀನೇ ರಾಜಕುಮಾರ'",
        Marathi: "💖 प्रेमगीते:\n1. 'झिंगाट' (Love edit)\n2. 'दिवा तुझे किती'",
        Tamil: "💖 காதல் பாடல்கள்:\n1. 'கண்ணான கண்ணே'\n2. 'முன்பே வா'",
        Telugu: "💖 ప్రేమ గీతాలు:\n1. 'సమాజవరగమన'\n2. 'ఇంకేం ఇంకేం'",
        Malayalam: "💖 പ്രണയ ഗാനങ്ങൾ:\n1. 'മലരേ'\n2. 'ഉയിരേ'",
        Punjabi: "💖 ਪਿਆਰ ਦੇ ਗੀਤ:\n1. 'ਕਸੂਰ' - ਪ੍ਰਤੀਕ ਕੁਹਾੜ\n2. 'ਤੇਰੇ ਰੰਗ ਵਰਗਾ' - ਗੁਰਨਾਮ ਭੁੱਲਰ",
        Bengali: "💖 ভালোবাসার গান:\n1. 'আমি তোমার হতে চাই'\n2. 'তোমাকে'",
        Gujarati: "💖 પ્રેમ ગીતો:\n1. 'વ્હાલમ આવો ને'\n2. 'તારા વિના શ્યામ'"
    },
    sad: {
        English: "💧 Soul-Stirring Sad Songs:\n1. 'Someone Like You' - Adele\n2. 'Fix You' - Coldplay",
        Hindi: "💧 दर्द भरे नगमे:\n1. 'Channa Mereya' - Arijit Singh\n2. 'Agar Tum Saath Ho'",
        Kannada: "💧 ವಿಷಾದದ ಗೀತೆಗಳು:\n1. 'ಅನಿಸುತಿದೆ' - ಮುಂಗಾರು ಮಳೆ",
        Marathi: "💧 दुःखद गाणी:\n1. 'येळकोट' - सैराट",
        Tamil: "💧 சோகமான பாடல்கள்:\n1. 'ஏனோ ஏனோ'\n2. 'போகாதே'",
        Telugu: "💧 విషాద గీతాలు:\n1. 'మనసే ಕవ్వించే'\n2. 'శ్రీవల్లి' (Sad)",
        Malayalam: "💧 ദുഃഖ ഗാനങ്ങൾ:\n1. 'പൂമുത്തോലെ'\n2. 'സീൻ കോൺട്രാ'",
        Punjabi: "💧 ਉਦਾਸ ਗੀਤ:\n1. 'ਚੰਨ ਵਿੱਛੜ ਗਿਆ'\n2. 'ਮੈਨੂੰ ਪਤਾ ਸੀ'",
        Bengali: "💧 বিরহের গান:\n1. 'নিশি রাত'\n2. 'বুকের ভিতর'",
        Gujarati: "💧 દુઃખદ ગીતો:\n1. 'તારક મહેતા' (Sad theme)\n2. 'ક્યાંરે મળીશું'"
    },
    party: {
        English: "🕺 Party Non-Stop:\n1. 'Uptown Funk' - Bruno Mars\n2. 'Levitating' - Dua Lipa",
        Hindi: "🕺 पार्टी के गाने:\n1. 'Kar Gayi Chull'\n2. 'Saturday Saturday'",
        Kannada: "🕺 ಪಾರ್ಟಿ ಹಾಡುಗಳು:\n1. 'ಟಗರು ಬಂತು'\n2. 'ಓಪನ್ ಹೇರ್ ಡೋಲಿ'",
        Marathi: "🕺 पार्टीसाठी गाणी:\n1. 'झिंगाट'\n2. 'शांताबाई'",
        Tamil: "🕺 பார்ட்டி பாடல்கள்:\n1. 'அரபிக் குத்து'\n2. 'வாத்தி கமிங்'",
        Telugu: "🕺 పార్టీ సాంగ్స్:\n1. 'ఊ అంటావా'\n2. 'రాములో రాములా'",
        Malayalam: "🕺 പാർട്ടി ഗാനങ്ങൾ:\n1. 'കുടുക്ക്'\n2. 'ചിന്നമ്മ'",
        Punjabi: "🕺 ਪਾਰਟੀ ਗੀਤ:\n1. 'ਪਰਾਪਰ ਪਟੋਲਾ'\n2. 'ਗੁੜ ਨਾਲੋਂ ਇਸ਼ਕ ਮਿੱਠਾ'",
        Bengali: "🕺 পার্টি গান:\n1. 'টুম্পা'\n2. 'হৃদয়ে আমার'",
        Gujarati: "🕺 પાર્ટી ગીતો:\n1. 'લેરી લાલા'\n2. 'ચાર ચાર બંગડી'"
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
            love: ['love', 'romantic', 'காதல்', 'ప్రేమ', 'പ്രണയം', 'ಪ್ರೀತಿ', 'प्रेम', 'ਪਿਆਰ', 'ভালোবাসা', 'પ્રેમ'],
            sad: ['sad', 'emotional', 'சோகம்', 'విషాదం', 'വിഷാദം', 'ದುಃಖ', 'दुख', 'ਉਦਾਸ', 'দুঃখ', 'દુઃખ'],
            party: ['party', 'dance', 'பார்ட்டி', 'పార్టీ', 'പാർട്ടി', 'ಪಾರ್ಟಿ', 'नाच', 'ਪਾਰਟੀ', 'পার্টি', 'પાર્ટી'],
            rap: ['rap', 'hip hop', 'ರಾಪ್', 'ਰਾਪਰ'],
            happy: ['happy', 'joy', 'சந்தோஷம்', 'సంతోషం', 'ಸಂತೋಷ', 'आनंद', 'ਖੁਸ਼ੀ', 'আনন্দ', 'આનંદ']
        };

        // Detect themes in query
        const detectedThemes = Object.entries(themeKeywords)
            .filter(([_, keywords]) => keywords.some(k => q.includes(k)))
            .map(([theme]) => theme);

        // Detect artist/entry in query
        const detectedArtist = Object.entries(SEARCH_DATA_STRUCTURED)
            .find(([key]) => q.includes(key));

        if (detectedArtist) {
            const [_, artist] = detectedArtist;
            let filteredSongs = artist.songs;

            if (detectedThemes.length > 0) {
                filteredSongs = artist.songs.filter(s =>
                    s.theme.some(t => detectedThemes.includes(t))
                );
            }

            if (filteredSongs.length > 0) {
                const songList = filteredSongs.map((s, i) => `${i + 1}. '${s.name}'`).join('\n');
                const themeStr = detectedThemes.length > 0 ? `${detectedThemes.join(' & ')} ` : '';
                return `🕺 Top ${themeStr}tracks by ${artist.name}:\n${songList}`;
            } else {
                return `I found ${artist.name}, but couldn't find specific ${detectedThemes.join('/')} tracks. Here are some of their hits instead:\n` +
                    artist.songs.slice(0, 3).map((s, i) => `${i + 1}. '${s.name}'`).join('\n');
            }
        }

        // Generic Theme Search
        if (detectedThemes.length > 0) {
            const primaryTheme = detectedThemes[0];
            return THEME_DATA[primaryTheme][lang] || THEME_DATA[primaryTheme]['English'];
        }

        // Greetings
        if (q.includes('hello') || q.includes('hi') || q.includes('வணக்கம்') || q.includes('ਨਮਸਕਾਰ') || q.includes('নমস্কার') || q.includes('નમસ્તે')) {
            return BOT_KNOWLEDGE[lang];
        }

        return lang === 'English' ? `Searching for "${query}" in our library... Try asking for 'Diljit Dosanjh hits', 'Shreya Ghoshal songs', or 'Punjabi party tracks'!` :
            lang === 'Punjabi' ? `ਤੁਹਾਡੀ ਪਸੰਦ ਦੇ ਮੁਤਾਬਕ "${query}" ਲੱਭ ਰਿਹਾ ਹਾਂ! ਦਿਲਜੀਤ ਦੋਸਾਂਝ ਜਾਂ ਸਿੱਧੂ ਮੂਸੇ ਵਾਲਾ ਦੇ ਗੀਤ ਪੁੱਛੋ!` :
                lang === 'Bengali' ? `আপনার পছন্দের "${query}" খুঁজছি! কিশোর কুমার বা শ্রেয়া ঘোষালের গান শুনতে চাইলে লিখুন!` :
                    lang === 'Gujarati' ? `તમારી પસંદ મુજબ "${query}" શોધી રહ્યો છું! ગીતા રબારી કે ઓસમાન મીરના ગીતો વિશે પૂછો!` :
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
