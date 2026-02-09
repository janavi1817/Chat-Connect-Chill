import React, { useState, useRef, useEffect } from 'react';
import { Music, Send, Loader2, Globe, Music2, Disc, Star, Zap, Heart, CloudRain, PartyPopper, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

type Language = 'English' | 'Hindi' | 'Kannada' | 'Marathi' | 'Tamil' | 'Telugu' | 'Malayalam';

const BOT_KNOWLEDGE: Record<Language, string> = {
    English: "I am your AI Chat Connect Chill. Explore the world of music in Purple!",
    Hindi: "मैं आपका एआई संगीत उस्ताद हूं। बैंगनी रंग में संगीत की दुनिया की खोज करें!",
    Kannada: "ನಾನು ನಿಮ್ಮ AI ಸಂಗೀತ ಮಾಂತ್ರಿಕ. ನೇರಳೆ ಬಣ್ಣದಲ್ಲಿ ಸಂಗೀತದ ಜಗತ್ತನ್ನು ಅನ್ವೇಷಿಸಿ!",
    Marathi: "मी तुमचा एआय संगीत उस्ताद आहे. जांभळ्या रंगात संगीताचे जग शोधा!",
    Tamil: "நான் உங்கள் AI சாட் கனெக்ட் சில். ஊதா நிறத்தில் இசை உலகை ஆராயுங்கள்!",
    Telugu: "నేను మీ AI చాట్ కనెక్ట్ చిల్. ఊదా రంగులో సంగీత ప్రపంచాన్ని అన్వేషించండి!",
    Malayalam: "ഞാൻ നിങ്ങളുടെ AI ചാറ്റ് കണക്ട് ചില്ല് ആണ്. പർപ്പിൾ നിറത്തിൽ സംഗീത ലോകം പര്യവേക്ഷണം ചെയ്യുക!"
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
    'shah rukh khan': { name: "Shah Rukh Khan", songs: [{ name: "Lungi Dance", theme: ["party"] }, { name: "Zaalima", theme: ["love"] }] },
    // KANNADA
    'puneeth rajkumar': { name: "Puneeth Rajkumar", songs: [{ name: "Raajakumara", theme: ["love"] }, { name: "Tagaru Banthu", theme: ["party"] }, { name: "Bombe Helutaithe", theme: ["sad"] }] },
    'yash': { name: "Yash", songs: [{ name: "Salaam Rocky Bhai", theme: ["party"] }, { name: "Mehabooba", theme: ["love"] }] },
    // MARATHI
    'lata mangeshkar': { name: "Lata Mangeshkar", songs: [{ name: "Mogara Phulala", theme: ["love"] }, { name: "Luka Chuppi", theme: ["sad"] }] },
    'ajay-atul': { name: "Ajay-Atul", songs: [{ name: "Zingaat", theme: ["party"] }, { name: "Mauli Mauli", theme: ["spiritual"] }] },

    // TAMIL - SINGERS
    'a r rahman': { name: "A. R. Rahman", songs: [{ name: "Jai Ho", theme: ["happy", "energy"] }, { name: "Kun Faya Kun", theme: ["sad", "spiritual"] }, { name: "Enna Sona", theme: ["love"] }] },
    'anirudh': { name: "Anirudh Ravichander", songs: [{ name: "Arabic Kuthu", theme: ["party"] }, { name: "Vaathi Coming", theme: ["party"] }, { name: "Why This Kolaveri Di", theme: ["sad", "funny"] }] },
    'sid sriram': { name: "Sid Sriram", songs: [{ name: "Kannaana Kanney", theme: ["love", "emotional"] }, { name: "Inkem Inkem", theme: ["love"] }, { name: "Srivalli", theme: ["love"] }] },
    'yuvan shankar raja': { name: "Yuvan Shankar Raja", songs: [{ name: "Rowdy Baby", theme: ["party"] }, { name: "Pogathey", theme: ["sad"] }] },
    's p balasubrahmanyam': { name: "S. P. Balasubrahmanyam", songs: [{ name: "Enna Satham", theme: ["love"] }, { name: "Mounamana Neram", theme: ["love"] }] },
    'k s chithra': { name: "K. S. Chithra", songs: [{ name: "Kannalane", theme: ["love"] }, { name: "Malargal Kaettaen", theme: ["classical"] }] },
    'shweta mohan': { name: "Shweta Mohan", songs: [{ name: "Innum Konjam", theme: ["love"] }] },
    'gv prakash': { name: "G. V. Prakash", songs: [{ name: "Pookkalae Sattru", theme: ["love"] }, { name: "Celebration of Life", theme: ["happy"] }] },
    'harris jayaraj': { name: "Harris Jayaraj", songs: [{ name: "Vaseegara", theme: ["love"] }, { name: "Ava Enna", theme: ["sad"] }] },
    'ilayaraja': { name: "Ilayaraja", songs: [{ name: "Thendral Vandhu", theme: ["love"] }, { name: "Kanmani Anbodu", theme: ["love"] }] },
    // TAMIL - ACTORS
    'rajinikanth': { name: "Rajinikanth", songs: [{ name: "Marana Mass", theme: ["party"] }, { name: "Chumma Kizhi", theme: ["party"] }, { name: "Rakamma Kaiya Thattu", theme: ["happy"] }] },
    'vijay': { name: "Thalapathy Vijay", songs: [{ name: "Ranjithame", theme: ["party"] }, { name: "Verithanam", theme: ["party"] }, { name: "Kutti Story", theme: ["happy"] }] },
    'ajith': { name: "Ajith Kumar", songs: [{ name: "Adchithooku", theme: ["party"] }, { name: "Chilla Chilla", theme: ["party"] }] },
    'kamal haasan': { name: "Kamal Haasan", songs: [{ name: "Pathala Pathala", theme: ["party"] }, { name: "Kanmani Anbodu", theme: ["love"] }] },
    'suriya': { name: "Suriya", songs: [{ name: "Munbe Vaa", theme: ["love"] }, { name: "Naattu Koothu", theme: ["party"] }] },
    'dhanush': { name: "Dhanush", songs: [{ name: "Rowdy Baby", theme: ["party"] }, { name: "Why This Kolaveri Di", theme: ["sad"] }] },
    'vikram': { name: "Vikram", songs: [{ name: "O Podu", theme: ["party"] }] },
    'sivakarthikeyan': { name: "Sivakarthikeyan", songs: [{ name: "Arabic Kuthu", theme: ["party"] }, { name: "Chellamma", theme: ["happy"] }] },
    'nayanthara': { name: "Nayanthara", songs: [{ name: "Naanum Rowdy Dhaan", theme: ["happy"] }] },
    'trisha': { name: "Trisha", songs: [{ name: "Karka Karka", theme: ["energy"] }] },

    // TELUGU - SINGERS
    'sid sriram telugu': { name: "Sid Sriram (Telugu)", songs: [{ name: "Samajavaragamana", theme: ["love"] }, { name: "Srivalli", theme: ["love"] }, { name: "Undiporaadhey", theme: ["love"] }] },
    'devi sri prasad': { name: "Devi Sri Prasad (DSP)", songs: [{ name: "Oo Antava", theme: ["party"] }, { name: "Saami Saami", theme: ["party"] }, { name: "Ringa Ringa", theme: ["party"] }] },
    'thaman s': { name: "Thaman S", songs: [{ name: "Butta Bomma", theme: ["happy", "dance"] }, { name: "Ramuloo Ramulaa", theme: ["party"] }] },
    's p b telugu': { name: "S. P. Balasubrahmanyam (Telugu)", songs: [{ name: "Mate Mantramu", theme: ["love"] }, { name: "Priyathama", theme: ["love"] }] },
    'sunitha upadrashta': { name: "Sunitha Upadrashta", songs: [{ name: "Ee Vela Lo", theme: ["love"] }] },
    'geetha madhuri': { name: "Geetha Madhuri", songs: [{ name: "Pakka Local", theme: ["party"] }] },
    'karthik': { name: "Karthik", songs: [{ name: "Arere Arere", theme: ["love"] }, { name: "Aparichithudu", theme: ["energy"] }] },
    'anurag kulkarni': { name: "Anurag Kulkarni", songs: [{ name: "Pilla Puli", theme: ["happy"] }, { name: "Ramuloo Ramulaa", theme: ["party"] }] },
    'mangli': { name: "Mangli", songs: [{ name: "Saranga Dariya", theme: ["party", "folk"] }, { name: "Bullet Bandi", theme: ["party"] }] },
    'ram miriyala': { name: "Ram Miriyala", songs: [{ name: "Chitti", theme: ["happy", "love"] }, { name: "Bullet Bandi", theme: ["party"] }] },
    // TELUGU - ACTORS
    'mahesh babu': { name: "Mahesh Babu", songs: [{ name: "Mind Block", theme: ["party"] }, { name: "Kalaavathi", theme: ["love"] }, { name: "Dethadi Dethadi", theme: ["energy"] }] },
    'allu arjun': { name: "Allu Arjun", songs: [{ name: "Butta Bomma", theme: ["happy"] }, { name: "Oo Antava", theme: ["party"] }, { name: "Top Lesi Poddi", theme: ["party"] }] },
    'prabhas': { name: "Prabhas", songs: [{ name: "Saahore Baahubali", theme: ["energy"] }, { name: "Bad Boy", theme: ["party"] }] },
    'jr ntr': { name: "Jr. NTR", songs: [{ name: "Naatu Naatu", theme: ["party", "energy"] }, { name: "Follow Follow", theme: ["happy"] }] },
    'ram charan': { name: "Ram Charan", songs: [{ name: "Naatu Naatu", theme: ["party"] }, { name: "Ranga Ranga Rangasthalaana", theme: ["folk"] }] },
    'pawan kalyan': { name: "Pawan Kalyan", songs: [{ name: "Lala Bheemla", theme: ["energy"] }, { name: "Kevvu Keka", theme: ["party"] }] },
    'vijay devarakonda': { name: "Vijay Deverakonda", songs: [{ name: "Inkem Inkem", theme: ["love"] }, { name: "Maate Vinadhuga", theme: ["love"] }] },
    'nani': { name: "Nani", songs: [{ name: "Adiga Adiga", theme: ["love"] }, { name: "Local Boy", theme: ["happy"] }] },
    'chiranjeevi': { name: "Chiranjeevi", songs: [{ name: "Boss Party", theme: ["party"] }, { name: "Ammadu Let's Do Kummudu", theme: ["party"] }] },
    'samantha': { name: "Samantha Ruth Prabhu", songs: [{ name: "Oo Antava", theme: ["party"] }, { name: "Kadhaippoma", theme: ["sad"] }] },

    // MALAYALAM - SINGERS
    'k j yesudas': { name: "K. J. Yesudas", songs: [{ name: "Harivarasanam", theme: ["spiritual"] }, { name: "Pramadavanam", theme: ["classical"] }] },
    'ks chithra malayalam': { name: "K. S. Chithra (Malayalam)", songs: [{ name: "Karmukil", theme: ["love"] }, { name: "Anuragola", theme: ["love"] }] },
    'mg sreekumar': { name: "M. G. Sreekumar", songs: [{ name: "Kila Kila", theme: ["happy"] }, { name: "Chinnamma", theme: ["party"] }] },
    'sujatha mohan': { name: "Sujatha Mohan", songs: [{ name: "Pranayamanithooval", theme: ["love"] }] },
    'shreya ghoshal malayalam': { name: "Shreya Ghoshal (Malayalam)", songs: [{ name: "Paattil Ee Paattil", theme: ["love"] }] },
    'vineeth sreenivasan': { name: "Vineeth Sreenivasan", songs: [{ name: "Onakkan", theme: ["happy"] }, { name: "Kudukku", theme: ["party"] }] },
    'madhu bala': { name: "Madhu Balakrishnan", songs: [{ name: "Pritchayame", theme: ["love"] }] },
    'vijay yesudas': { name: "Vijay Yesudas", songs: [{ name: "Malare", theme: ["love"] }, { name: "Poomuthole", theme: ["sad"] }] },
    'sithara krishnakumar': { name: "Sithara Krishnakumar", songs: [{ name: "Vaanam Thilathilakan", theme: ["energy"] }] },
    'benny dayal': { name: "Benny Dayal", songs: [{ name: "Omanappuzha", theme: ["happy"] }] },
    // MALAYALAM - ACTORS
    'mohanlal': { name: "Mohanlal", songs: [{ name: "Kudukku", theme: ["party"] }, { name: "Lajjavathiye", theme: ["happy"] }] },
    'mammootty': { name: "Mammootty", songs: [{ name: "Oru Murai Vanthu", theme: ["classical", "sad"] }] },
    'dulquer salmaan': { name: "Dulquer Salmaan", songs: [{ name: "Chundari Penne", theme: ["happy"] }, { name: "Kilikili", theme: ["party"] }] },
    'fahadh faasil': { name: "Fahadh Faasil", songs: [{ name: "Ezhutha Kadha", theme: ["love"] }] },
    'nivin pauly': { name: "Nivin Pauly", songs: [{ name: "Malare", theme: ["love"] }, { name: "Scene Contra", theme: ["funny", "sad"] }] },
    'prithviraj': { name: "Prithviraj Sukumaran", songs: [{ name: "Loka Samastha", theme: ["energy"] }] },
    'tovino thomas': { name: "Tovino Thomas", songs: [{ name: "Uyire", theme: ["love"] }] },
    'kunchacko boban': { name: "Kunchacko Boban", songs: [{ name: "Devadoothar Paadi", theme: ["party", "classic"] }] },
    'manju warrier': { name: "Manju Warrier", songs: [{ name: "Kannanthanam", theme: ["happy"] }] },
    'nazriya nazim': { name: "Nazriya Nazim", songs: [{ name: "Nee", theme: ["love"] }] }
};

const THEME_DATA: Record<string, Record<Language, string>> = {
    love: {
        English: "💖 Love & Romantic Anthems:\n1. 'Perfect' - Ed Sheeran\n2. 'All of Me' - John Legend\n3. 'Love Story' - Taylor Swift\n4. 'Adore You' - Harry Styles",
        Hindi: "💖 रोमांटिक नगमे:\n1. 'Tum Hi Ho' - Arijit Singh\n2. 'Raatan Lambiyan' - Shershaah\n3. 'Kesariya' - Brahmastra\n4. 'Pee Loon' - Once Upon A Time In Mumbaai",
        Kannada: "💖 ಪ್ರೇಮ ಗೀತೆಗಳು:\n1. 'ಬೆಳಗೆದ್ದು' - ಕಿರಿಕ್ ಪಾರ್ಟಿ\n2. 'ನೀನೇ ರಾಜಕುಮಾರ' - ಪುನೀತ್ ರಾಜಕುಮಾರ್\n3. 'ಮಳೆ ಬರುವ hಲಾಗಿದೆ' - ಮುಂಗಾರು ಮಳೆ",
        Marathi: "💖 प्रेमगीते:\n1. 'झिंगाट' (Love edit) - सैराट\n2. 'दिवा तुझे किती' - लोकप्रिय",
        Tamil: "💖 காதல் பாடல்கள்:\n1. 'கண்ணான கண்ணே' - விசுவாசம்\n2. 'முன்பே வா' - சில்லுனு ஒரு காதல்\n3. 'என் இனிய பொன் நிலாவே' - மூடுபனி",
        Telugu: "💖 ప్రేమ గీతాలు:\n1. 'సమాజవరగమన' - అల వైకుంఠపురములో\n2. 'ఇంకేం ఇంకేం' - గీత గోవిందం\n3. 'కళావతి' - సర్కారు వారి పాట",
        Malayalam: "💖 പ്രണയ ഗാനങ്ങൾ:\n1. 'മലരേ' - പ്രേമം\n2. 'ഉയിരേ' - ഗൗതമന്റെ രഥം\n3. 'പ്രണയമണിതൂവൽ' - അഴகിയ രാവണൻ"
    },
    sad: {
        English: "💧 Soul-Stirring Sad Songs:\n1. 'Someone Like You' - Adele\n2. 'Let Her Go' - Passenger\n3. 'Fix You' - Coldplay",
        Hindi: "💧 दर्द भरे नगमे:\n1. 'Channa Mereya' - Arijit Singh\n2. 'Agar Tum Saath Ho'\n3. 'Humari Adhuri Kahani'",
        Kannada: "💧 ವಿಷಾದದ ಗೀತೆಗಳು:\n1. 'ಅನಿಸುತಿದೆ' - ಮುಂಗಾರು ಮಳೆ\n2. 'ಜೊತೆ ಜೊತೆಯಲಿ'",
        Marathi: "💧 दुःखद गाणी:\n1. 'येळकोट' - सैराट\n2. 'देवा तुझे किती' (Sad Version)",
        Tamil: "💧 சோகமான பாடல்கள்:\n1. 'ஏனோ ஏனோ' - விசுவாசம்\n2. 'போகாதே' - தீபாவளி\n3. 'கண்ணான கண்ணே' (Sad)",
        Telugu: "💧 విషాద గీతాలు:\n1. 'మనసే కవ్వించే' - గీత గోవిందం\n2. 'శ్రీవల్లి' (Sad)",
        Malayalam: "💧 ദുഃഖ ഗാനങ്ങൾ:\n1. 'പൂമുത്തോലെ' - ജോസഫ്\n2. 'സീൻ കോൺട്രാ' - പ്രേമം"
    },
    party: {
        English: "🕺 Party Non-Stop:\n1. 'Uptown Funk' - Bruno Mars\n2. 'Can't Stop the Feeling' - Justin Timberlake\n3. 'Levitating' - Dua Lipa",
        Hindi: "🕺 पार्टी के गाने:\n1. 'Abhi Toh Party Shuru Hui Hai'\n2. 'Kar Gayi Chull'\n3. 'Saturday Saturday'",
        Kannada: "🕺 ಪಾರ್ಟಿ ಹಾಡುಗಳು:\n1. 'ಟಗರು ಬಂತು'\n2. 'ಓಪನ್ ಹೇರ್ ಡೋಲಿ'",
        Marathi: "🕺 पार्टीसाठी गाणी:\n1. 'झिंगाट'\n2. 'शांताबाई'",
        Tamil: "🕺 பார்ட்டி பாடல்கள்:\n1. 'அரபிக் குத்து' - பீஸ்ட்\n2. 'வாத்தி கமிங்' - மாஸ்டர்\n3. 'மரண மாஸ்' - பேட்ட",
        Telugu: "🕺 పార్టీ సాంగ్స్:\n1. 'ఊ అంటావా' - పుష్ప\n2. 'సామి సామి' - పుష్ప\n3. 'రాములో రాములా' - అల వైకుంఠపురములో",
        Malayalam: "🕺 പാർട്ടി ഗാനങ്ങൾ:\n1. 'കുടുക്ക്' - ലവ് ആക്ഷன் ഡ്രാമ\n2. 'ചിന്നമ്മ' - കിളിച്ചുണ്ടൻ മാമ്പഴം"
    },
    rap: {
        English: "🔥 Hard-Hitting Rap Hits:\n1. 'Godzilla' - Eminem\n2. 'HUMBLE.' - Kendrick Lamar",
        Hindi: "🔥 देसी हिप-हॉप:\n1. 'Apna Time Aayega' - Gully Boy\n2. 'Machayenge' - Emiway Bantai",
        Kannada: "🔥 ರಾಪ್ ಗೀತೆಗಳು:\n1. 'ಬೆಂಗ್ಳೂರು ಸೈಡ್' - ಚಂದನ್ ಶೆಟ್ಟಿ",
        Marathi: "🔥 मराठी रॅप:\n1. 'पुणेकर' - रॅप मिक्स",
        Tamil: "🔥 தமிழ் ராப்:\n1. 'நீயே ஒளி' - சர்பட்டா பரம்பரை\n2. 'கிளிஞ்சல்' - ஹிப்ஹாப் தமிழா",
        Telugu: "🔥 తెలుగు రాప్:\n1. 'FACE OFF' (Telugu Edit)\n2. 'MIND BLOCK' (Rap bridge)",
        Malayalam: "🔥 മലയാളം റാപ്:\n1. 'മണവാളൻ തഗ്' - തല്ലുമാല\n2. 'ഇതിഹസ' - അഗളി സജ്ജു"
    }
};

const LANGUAGES: Language[] = ['English', 'Hindi', 'Kannada', 'Marathi', 'Tamil', 'Telugu', 'Malayalam'];

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
            love: ['love', 'romantic', 'காதல்', 'ప్రేమ', 'പ്രണയം', 'ಪ್ರೀತಿ', 'प्रेम'],
            sad: ['sad', 'patho', 'emotional', 'சோகம்', 'விஷாadam', 'വിഷാദം', 'ದುಃಖ', 'दुख'],
            party: ['party', 'dance', 'பார்ட்டி', 'పార్టీ', 'പാർട്ടി', 'ಪಾರ್ಟಿ', 'नाच', 'जल्लोष'],
            rap: ['rap', 'hip hop', 'ராப்', 'రాప్', 'റാപ്', 'ರಾಪ್', 'रॅप'],
            pop: ['pop', 'ಪಾಪ್', 'पॉप'],
            happy: ['happy', 'joy', 'സന്തോഷം', 'సంతోషం', 'சந்தோஷம்', 'ಸಂತೋಷ', 'आनंद']
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
                return `🕺 Selected ${themeStr}tracks from ${artist.name}:\n${songList}`;
            } else {
                return `I found ${artist.name}, but couldn't find specific ${detectedThemes.join('/')} tracks. Here are some of their top hits instead:\n` +
                    artist.songs.slice(0, 3).map((s, i) => `${i + 1}. '${s.name}'`).join('\n');
            }
        }

        // Generic Theme Search
        if (detectedThemes.length > 0) {
            const primaryTheme = detectedThemes[0];
            return THEME_DATA[primaryTheme][lang] || THEME_DATA[primaryTheme]['English'];
        }

        // Greetings
        if (q.includes('hello') || q.includes('hi') || q.includes('வணக்கம்') || q.includes('నమస్కారం') || q.includes('നമസ്കാരം')) {
            return BOT_KNOWLEDGE[lang];
        }

        return lang === 'English' ? `Interesting choice! I'm currently looking up "${query}" in our vast music library. Try asking for 'Rajinikanth songs', 'Thalapathy Vijay', or 'Sid Sriram hits'!` :
            lang === 'Tamil' ? `சுவாரஸ்யமான தேர்வு! எங்கள் இசை நூலகத்தில் "${query}" தேடுகிறேன். ரஜினிகாந்த், விஜய் அல்லது சித் ஸ்ரீராம் பாடல்களைக் கேளுங்கள்!` :
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
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: msg.sender === 'user' ? 30 : -30, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className={`message ${msg.sender}`}
                        >
                            <div className="msg-icon" style={{ marginBottom: '8px', opacity: 0.7 }}>
                                {msg.sender === 'bot' ? <Music2 size={16} /> : <Zap size={16} />}
                            </div>
                            {msg.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isTyping && (
                    <div className="message bot">
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
                        placeholder={`Ask about albums, genres or artists in ${currentLang}...`}
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
