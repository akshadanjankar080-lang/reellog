import {
  FaArrowLeft, FaBolt, FaBookOpen, FaBrain, FaCheck, FaChevronLeft,
  FaChevronRight, FaCog, FaCompass, FaDragon, FaEye, FaFire, FaFilm,
  FaGhost, FaGift, FaHatCowboy, FaHeart, FaLandmark, FaLaugh, FaMagic,
  FaMusic, FaPlay, FaPlus, FaQuestionCircle, FaRobot, FaSearch, FaShieldAlt,
  FaStar, FaTheaterMasks, FaTimes, FaUserCircle, FaUserSecret, FaUserShield
} from "react-icons/fa";

// ─── TMDB ────────────────────────────────────────────────────────────────────
export const TMDB_IMG = "https://image.tmdb.org/t/p/w300";
export const TMDB_W = "https://image.tmdb.org/t/p/w780";
export const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_KEY = "dfb570e7a09aa4e72df7064fc4a703f0";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
export const STATUSES = ["Want to Watch", "Watching", "Watched"];
export const SCOLOR = { Watched: "#b2f0c5", Watching: "#f4e08a", "Want to Watch": "#8ebbf5" };
export const SICON = { Watched: "✓", Watching: "▶", "Want to Watch": "◎" };

// ─── OTT STREAMING PLATFORMS ─────────────────────────────────────────────────
export const OTT = {
  nf: { name: "Netflix", short: "NF", color: "#E50914", bg: "#141414", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", url: "https://www.netflix.com/search?q=" },
  prime: { name: "Prime Video", short: "PV", color: "#00A8E1", bg: "#0F171E", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png", url: "https://www.primevideo.com/search?phrase=" },
  hs: { name: "JioHotstar", short: "HS", color: "#1a56db", bg: "#0D0D2B", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg", url: "https://www.hotstar.com/in/search?q=" },
  hbo: { name: "Max", short: "MAX", color: "#7B2FBE", bg: "#0B0B1A", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/HBO_Max_Logo.svg/512px-HBO_Max_Logo.svg.png", url: "https://www.max.com/search?q=" },
  sony: { name: "SonyLIV", short: "SONY", color: "#003087", bg: "#001A4E", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/SonyLIV_logo.svg", url: "https://www.sonyliv.com/search?keyword=" },
  zee5: { name: "ZEE5", short: "ZEE5", color: "#7B2D8B", bg: "#1A0030", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/ZEE5_logo.svg", url: "https://www.zee5.com/search?q=" },
  atv: { name: "Apple TV+", short: "ATV", color: "#888", bg: "#1C1C1E", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Apple_TV_Plus_Logo.svg/512px-Apple_TV_Plus_Logo.svg.png", url: "https://tv.apple.com/search?term=" },
  cr: { name: "Crunchyroll", short: "CR", color: "#F47521", bg: "#1A0800", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Crunchyroll_icon_2024.svg/512px-Crunchyroll_icon_2024.svg.png", url: "https://www.crunchyroll.com/search?q=" },
};

// ─── STATIC CATALOG ──────────────────────────────────────────────────────────
export const STATIC_ANIME = [
  { id: "a1", tmdbId: 1429, tmdbType: "tv", title: "Attack on Titan", year: 2013, rating: 9.1, type: "Anime", poster: "/hTP1DtLGFAmna71pe5kzkm7zBCc.jpg", streaming: ["cr", "nf"], categories: ["Action", "Adventure", "Animated"], overview: "Humanity battles giant humanoid Titans behind massive walls. When the walls are breached, young Eren Yeager vows revenge and changes the world." },
  { id: "a2", tmdbId: 85937, tmdbType: "tv", title: "Demon Slayer", year: 2019, rating: 8.7, type: "Anime", poster: "/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg", streaming: ["cr", "nf"], categories: ["Action", "Adventure", "Anime"], overview: "A boy trains as a demon slayer to avenge his family and cure his sister who was turned into a demon." },
  { id: "a3", tmdbId: 95479, tmdbType: "tv", title: "Jujutsu Kaisen", year: 2020, rating: 8.6, type: "Anime", poster: null, streaming: ["cr"], categories: ["Action", "Anime", "Animated"], overview: "A boy swallows a cursed object and must battle dangerous cursed spirits alongside Jujutsu sorcerers." },
  { id: "a4", tmdbId: 31911, tmdbType: "tv", title: "Fullmetal Alchemist: Brotherhood", year: 2009, rating: 9.1, type: "Anime", poster: "/9Yjx4OutGMrJNgLdmLLNLJaQBMX.jpg", streaming: ["cr", "nf"], categories: ["Anime", "Adventure", "Anthology"], overview: "Two brothers search for the Philosopher's Stone after a failed alchemical ritual leaves them broken." },
  { id: "a5", tmdbId: 46298, tmdbType: "tv", title: "Hunter x Hunter", year: 2011, rating: 9.0, type: "Anime", poster: "/gHuCPlS2bMbcuONEqRDvMV0AVgO.jpg", streaming: ["cr"], categories: ["Anime", "Adventure", "Action"], overview: "A boy follows his father's footsteps to become a legendary Hunter in a world of wonder and danger." },
  { id: "a6", tmdbId: 80777, tmdbType: "tv", title: "Vinland Saga", year: 2019, rating: 8.8, type: "Anime", poster: "/4mFJHHlMoOWhEEqtFjVKv3CRbQr.jpg", streaming: ["cr", "prime"], categories: ["Anime", "Adventure", "Action", "Animated"], overview: "A young Viking warrior seeks revenge in a brutal medieval world, eventually questioning the meaning of true strength." },
  { id: "a7", tmdbId: 64927, tmdbType: "tv", title: "Re:Zero", year: 2016, rating: 8.3, type: "Anime", poster: "/aGrqIBHi09G2RPQHH79RGkJFYvB.jpg", streaming: ["cr"], categories: ["Anime", "Adventure"], overview: "A boy transported to a fantasy world discovers he can reset time upon death — a power that becomes a curse." },
  { id: "a8", tmdbId: 120089, tmdbType: "tv", title: "Spy x Family", year: 2022, rating: 8.5, type: "Anime", poster: "/4SRTuMnT3XbMRAfAtBKlXKHoqkT.jpg", streaming: ["cr", "nf"], categories: ["Anime", "Action", "Animated"], overview: "A spy assembles a fake family for a mission, unaware each member harbours a secret of their own." },
  { id: "a9", tmdbId: 114410, tmdbType: "tv", title: "Chainsaw Man", year: 2022, rating: 8.5, type: "Anime", poster: "/npdB6oBX4SHkH9LhEVrSYOHhDpd.jpg", streaming: ["cr"], categories: ["Anime", "Action", "Animated"], overview: "A destitute boy merges with his devil dog and becomes a Devil Hunter, craving the simplest things in life." },
  { id: "a10", tmdbId: 65806, tmdbType: "tv", title: "Mob Psycho 100", year: 2016, rating: 8.5, type: "Anime", poster: null, streaming: ["cr", "nf"], categories: ["Anime", "Animated"], overview: "A powerful esper boy tries to live a normal life, suppressing emotions that could level a city." },
  { id: "a11", tmdbId: 209867, tmdbType: "tv", title: "Frieren: Beyond Journey's End", year: 2023, rating: 9.0, type: "Anime", poster: "/9LDpSFAJQnrYQurFP4cFhNdIrNM.jpg", streaming: ["cr"], categories: ["Anime", "Adventure", "Animated"], overview: "An elf mage reflects on a completed journey years after defeating the Demon King, discovering what it means to connect." },
  { id: "a12", tmdbId: 30984, tmdbType: "tv", title: "Bleach: Thousand-Year Blood War", year: 2022, rating: 8.9, type: "Anime", poster: "/2EewmxXe72ogD0EaWM8gqa0BPDR.jpg", streaming: ["cr", "nf"], categories: ["Anime", "Action", "Animated"], overview: "Ichigo and Soul Society face their most powerful enemy in a war that will redefine what it means to be a Soul Reaper." },
];

export const STATIC_MOVIES = [
  { id: "m1", tmdbId: 693134, tmdbType: "movie", title: "Dune: Part Two", year: 2024, rating: 8.5, type: "Movie", poster: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", streaming: ["hs", "hbo"], categories: ["Action", "Adventure", "Adaptation"], overview: "Paul Atreides unites with the Fremen while seeking revenge against the conspirators who destroyed his family." },
  { id: "m2", tmdbId: 872585, tmdbType: "movie", title: "Oppenheimer", year: 2023, rating: 8.9, type: "Movie", poster: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", streaming: ["prime"], categories: ["Biography", "Drama", "Adaptation"], overview: "The story of J. Robert Oppenheimer and the development of the atomic bomb that changed warfare forever." },
  { id: "m3", tmdbId: 157336, tmdbType: "movie", title: "Interstellar", year: 2014, rating: 8.7, type: "Movie", poster: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", streaming: ["nf", "prime"], categories: ["Adventure", "Sci-Fi"], overview: "Explorers travel through a wormhole in space to ensure humanity's survival across galaxies." },
  { id: "m4", tmdbId: 27205, tmdbType: "movie", title: "Inception", year: 2010, rating: 8.8, type: "Movie", poster: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", streaming: ["nf", "prime"], categories: ["Action", "Adventure", "Adult Comedy"], overview: "A thief who steals corporate secrets through the art of dream-sharing is given one last impossible mission." },
  { id: "m5", tmdbId: 155, tmdbType: "movie", title: "The Dark Knight", year: 2008, rating: 9.0, type: "Movie", poster: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg", streaming: ["hs", "prime"], categories: ["Action", "Drama"], overview: "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy." },
  { id: "m6", tmdbId: 129, tmdbType: "movie", title: "Spirited Away", year: 2001, rating: 8.6, type: "Movie", poster: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", streaming: ["nf"], categories: ["Animation", "Adventure", "Anime", "Art House"], overview: "A girl enters the spirit world to rescue her parents turned into pigs — a breathtaking journey of growth." },
  { id: "m7", tmdbId: 372058, tmdbType: "movie", title: "Your Name", year: 2016, rating: 8.4, type: "Movie", poster: "/q719jXXEzOoYaps6babgKnONONX.jpg", streaming: ["nf", "prime"], categories: ["Anime", "Adventure", "Anthology"], overview: "Two strangers find themselves inexplicably linked through body-swapping dreams that transcend time." },
  { id: "m8", tmdbId: 496243, tmdbType: "movie", title: "Parasite", year: 2019, rating: 8.5, type: "Movie", poster: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", streaming: ["prime", "hs"], categories: ["Drama"], overview: "Greed and class discrimination threaten a symbiotic relationship between two families in modern Seoul." },
  { id: "m9", tmdbId: 545611, tmdbType: "movie", title: "Everything Everywhere All at Once", year: 2022, rating: 7.8, type: "Movie", poster: "/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg", streaming: ["prime", "hs"], categories: ["Adventure", "Comedy", "Drama", "Anthology"], overview: "A Chinese immigrant is swept up in an adventure across the multiverse to save the world." },
  { id: "m10", tmdbId: 278, tmdbType: "movie", title: "The Shawshank Redemption", year: 1994, rating: 9.3, type: "Movie", poster: "/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg", streaming: ["nf", "prime"], categories: ["Drama", "Adaptation"], overview: "Two imprisoned men bond over decades, finding solace and eventual redemption through acts of decency." },
];

export const STATIC_SERIES = [
  { id: "s1", tmdbId: 1396, tmdbType: "tv", title: "Breaking Bad", year: 2008, rating: 9.5, type: "TV Show", poster: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", streaming: ["nf"], categories: ["Drama"], overview: "A chemistry teacher turns to manufacturing meth to secure his family's financial future after a terminal diagnosis." },
  { id: "s2", tmdbId: 1438, tmdbType: "tv", title: "The Wire", year: 2002, rating: 9.3, type: "TV Show", poster: "/4lbclFySvugI51fwsyxBTOm4DqK.jpg", streaming: ["hbo"], categories: ["Drama"], overview: "The Baltimore drug scene, seen through the eyes of both drug dealers and law enforcement." },
  { id: "s3", tmdbId: 94605, tmdbType: "tv", title: "Arcane", year: 2021, rating: 9.0, type: "TV Show", poster: "/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg", streaming: ["nf"], categories: ["Animation", "Adventure"], overview: "Two sisters on opposite sides of a conflict born in the utopian region of Piltover and its oppressed undercity." },
  { id: "s4", tmdbId: 95396, tmdbType: "tv", title: "Severance", year: 2022, rating: 8.7, type: "TV Show", poster: "/tE3zEVeNaxD2aJMXnFfPHpQxOhJ.jpg", streaming: ["atv"], categories: ["Drama", "Sci-Fi"], overview: "Workers have their work and personal memories surgically separated, creating a haunting corporate dystopia." },
  { id: "s5", tmdbId: 100088, tmdbType: "tv", title: "The Last of Us", year: 2023, rating: 8.8, type: "TV Show", poster: "/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg", streaming: ["hbo", "hs"], categories: ["Action", "Adventure"], overview: "A hardened smuggler and a teenage girl traverse a post-apocalyptic United States filled with infected and factions." },
  { id: "s6", tmdbId: 94997, tmdbType: "tv", title: "House of the Dragon", year: 2022, rating: 8.5, type: "TV Show", poster: "/z2yahl2uefxDCl0nogcRBstwruJ.jpg", streaming: ["hbo", "hs"], categories: ["Action", "Adventure", "Drama"], overview: "The internal succession war of House Targaryen, set 200 years before the events of Game of Thrones." },
  { id: "s7", tmdbId: 63351, tmdbType: "tv", title: "Succession", year: 2018, rating: 8.9, type: "TV Show", poster: "/e2X8fBflR3zqzWNBlHFzSAE5Jah.jpg", streaming: ["hbo"], categories: ["Drama"], overview: "The Roy family controls one of the biggest media empires in the world — and tears itself apart fighting for it." },
  { id: "s8", tmdbId: 70523, tmdbType: "tv", title: "Dark", year: 2017, rating: 8.8, type: "TV Show", poster: "/apbrbWs5M0SUFOSnPKzFm8Jj3jv.jpg", streaming: ["nf"], categories: ["Drama", "Sci-Fi"], overview: "A mind-bending family saga involving four interdependent families in a German town across different time periods." },
  { id: "s9", tmdbId: 95557, tmdbType: "tv", title: "Invincible", year: 2021, rating: 8.7, type: "TV Show", poster: "/yDWJYRAwMNKa767NIf0q8jk6r7i.jpg", streaming: ["prime"], categories: ["Action", "Adventure", "Animation"], overview: "A teenage boy discovers his father is the most powerful superhero on the planet — and something far darker." },
  { id: "s10", tmdbId: 136315, tmdbType: "tv", title: "The Bear", year: 2022, rating: 8.8, type: "TV Show", poster: null, streaming: ["hs", "atv"], categories: ["Comedy", "Drama"], overview: "A James Beard-nominated chef returns to Chicago to run his family's chaotic sandwich shop after a family tragedy." },
];

export const HERO_ITEMS = [
  { title: "Attack on Titan", tmdbId: 1429, tmdbType: "tv", poster: "/hTP1DtLGFAmna71pe5kzkm7zBCc.jpg", backdrop: "/d8duYyyC9J5T825Hg7grmaabfxQ.jpg", rating: "9.1", type: "Anime", year: 2013, streaming: ["cr", "nf"], overview: "Humanity's last survivors fight giant humanoid Titans behind colossal walls. When the walls are breached, young Eren Yeager vows revenge that will change the world." },
  { title: "Dune: Part Two", tmdbId: 693134, tmdbType: "movie", poster: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", backdrop: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", rating: "8.5", type: "Movie", year: 2024, streaming: ["hs", "hbo"], overview: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family." },
  { title: "Arcane", tmdbId: 94605, tmdbType: "tv", poster: "/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg", backdrop: "/sPUBwJ2TxJAKcVaA6axzBVi6UKN.jpg", rating: "9.0", type: "TV Show", year: 2021, streaming: ["nf"], overview: "Set in the utopian region of Piltover and the oppressed underground of Zaun, two sisters champion different sides of a brewing conflict." },
  { title: "Frieren", tmdbId: 209867, tmdbType: "tv", poster: "/9LDpSFAJQnrYQurFP4cFhNdIrNM.jpg", backdrop: "/yDWJYRAwMNKa767NIf0q8jk6r7i.jpg", rating: "9.0", type: "Anime", year: 2023, streaming: ["cr"], overview: "After the party's victory, elf mage Frieren sets out on a journey of reflection, exploring what it means to truly live and connect with others." },
];

export const EXPLORE_CATEGORY_GROUPS = {
  A: ["Action", "Adaptation", "Adult Comedy", "Adventure", "Animated", "Anthology", "Art House"],
  B: ["Based on Book", "Based on Game", "Based on True Story", "Biopic", "Blood & Gore", "Body Horror", "Bottle Movies", "Bromance", "Buddy Movie", "Business"],
  C: ["Campy", "Christmas", "Coming of Age", "Concert Film", "Crime", "Cult Classic", "Cyberpunk", "Cyber Thriller"],
  D: ["Dance", "Dark Comedy", "Dark / Gritty", "Date Night", "Disaster", "Disturbing", "Documentary", "Drama", "Dystopia"],
  E: ["Empowering", "Epic", "Espionage"],
  F: ["Family Drama", "Fantasy", "Feel Good", "Festive", "Found Footage", "Friendship", "Futuristic"],
  G: ["Game Show", "Gangster"],
  H: ["Harem", "Heartbreaking", "Heist", "Highschool", "Historical", "Historical Fiction", "Horror", "Humour", "Hyperlink"],
  I: ["Indie", "Inspirational", "Isekai"],
  L: ["Legal Drama", "Lighthearted & Fun"],
  M: ["Mass Movie", "Mecha", "Mind-Bending", "Mockumentary", "Monster", "Murder Mystery", "Musical", "Mystery"],
  N: ["Neo Noir", "Noir"],
  O: ["Original Anime"],
  P: ["Parody", "Patriotic", "Period Drama", "Political", "Post-Apocalyptic", "Psychological"],
  R: ["Reality TV", "Relaxing", "Remake", "Revenge", "Romance", "Rom-Com"],
  S: ["Satire", "Seinen", "Shonen", "Short Films", "Shoujo", "Sitcom", "Slasher", "Slice of Life", "Slow Burn", "Social Drama", "Spin-Off", "Spiritual", "Spoof", "Sports", "Spy", "Stand-up", "Steamy", "Superhero", "Supernatural", "Survival"],
  T: ["Talk Show", "Teen", "Time Travel", "Tragedy", "Travel"],
  W: ["War", "Western", "Witty"],
  Y: ["Yaoi", "Yuri"],
  Z: ["Zombie Apocalypse"],
};

export const EXPLORE_GENRE_CARDS = [
  { name: "Action", gradient: "linear-gradient(135deg, #1a0a0a, #8B0000)", icon: <FaFire />, tmdbGenreId: 28 },
  { name: "Adventure", gradient: "linear-gradient(135deg, #0a1628, #1a4a2e)", icon: <FaCompass />, tmdbGenreId: 12 },
  { name: "Animation", gradient: "linear-gradient(135deg, #1a0a2e, #4a1a6e)", icon: <FaFilm />, tmdbGenreId: 16 },
  { name: "Comedy", gradient: "linear-gradient(135deg, #1a1200, #5a4a00)", icon: <FaLaugh />, tmdbGenreId: 35 },
  { name: "Crime", gradient: "linear-gradient(135deg, #0a0a0a, #2a1a00)", icon: <FaUserSecret />, tmdbGenreId: 80 },
  { name: "Documentary", gradient: "linear-gradient(135deg, #0a1a1a, #003333)", icon: <FaBookOpen />, tmdbGenreId: 99 },
  { name: "Drama", gradient: "linear-gradient(135deg, #1a0a1a, #3a003a)", icon: <FaTheaterMasks />, tmdbGenreId: 18 },
  { name: "Fantasy", gradient: "linear-gradient(135deg, #0a0a2a, #1a003a)", icon: <FaMagic />, tmdbGenreId: 14 },
  { name: "History", gradient: "linear-gradient(135deg, #1a1000, #3a2800)", icon: <FaLandmark />, tmdbGenreId: 36 },
  { name: "Horror", gradient: "linear-gradient(135deg, #0a0000, #3a0000)", icon: <FaGhost />, tmdbGenreId: 27 },
  { name: "Music", gradient: "linear-gradient(135deg, #001a1a, #003a3a)", icon: <FaMusic />, tmdbGenreId: 10402 },
  { name: "Mystery", gradient: "linear-gradient(135deg, #080818, #18083a)", icon: <FaQuestionCircle />, tmdbGenreId: 9648 },
  { name: "Romance", gradient: "linear-gradient(135deg, #1a0010, #4a0028)", icon: <FaHeart />, tmdbGenreId: 10749 },
  { name: "Science Fiction", gradient: "linear-gradient(135deg, #000a1a, #001a3a)", icon: <FaRobot />, tmdbGenreId: 878 },
  { name: "Thriller", gradient: "linear-gradient(135deg, #050510, #100520)", icon: <FaBolt />, tmdbGenreId: 53 },
  { name: "War", gradient: "linear-gradient(135deg, #0a0a00, #1a1a00)", icon: <FaShieldAlt />, tmdbGenreId: 10752 },
  { name: "Western", gradient: "linear-gradient(135deg, #1a0800, #3a1800)", icon: <FaHatCowboy />, tmdbGenreId: 37 },
  { name: "Anime", gradient: "linear-gradient(135deg, #1a0010, #00103a)", icon: <FaDragon />, keywordQuery: "anime" },
  { name: "Superhero", gradient: "linear-gradient(135deg, #0a001a, #1a0000)", icon: <FaUserShield />, keywordQuery: "superhero" },
  { name: "Psychological", gradient: "linear-gradient(135deg, #050510, #200520)", icon: <FaBrain />, keywordQuery: "psychological" },
];

export const EXPLORE_COUNTRY_CARDS = [
  { name: "India", iso: "IN", gradient: "linear-gradient(135deg, #1A0D00, #4A2400)", icon: "🇮🇳" },
  { name: "United States", iso: "US", gradient: "linear-gradient(135deg, #00101A, #00284A)", icon: "🇺🇸" },
  { name: "South Korea", iso: "KR", gradient: "linear-gradient(135deg, #1A000A, #4A0020)", icon: "🇰🇷" },
  { name: "Japan", iso: "JP", gradient: "linear-gradient(135deg, #1A0505, #4A1010)", icon: "🇯🇵" },
  { name: "United Kingdom", iso: "GB", gradient: "linear-gradient(135deg, #050A1A, #10204A)", icon: "🇬🇧" },
  { name: "France", iso: "FR", gradient: "linear-gradient(135deg, #000A1A, #001A4A)", icon: "🇫🇷" },
  { name: "Germany", iso: "DE", gradient: "linear-gradient(135deg, #1A1A00, #4A4A00)", icon: "🇩🇪" },
  { name: "Canada", iso: "CA", gradient: "linear-gradient(135deg, #1A0000, #4A0000)", icon: "🇨🇦" },
  { name: "Spain", iso: "ES", gradient: "linear-gradient(135deg, #1A1500, #4A3A00)", icon: "🇪🇸" },
  { name: "Italy", iso: "IT", gradient: "linear-gradient(135deg, #001A0A, #004A20)", icon: "🇮🇹" },
  { name: "China", iso: "CN", gradient: "linear-gradient(135deg, #1A0000, #4D0000)", icon: "🇨🇳" },
  { name: "Brazil", iso: "BR", gradient: "linear-gradient(135deg, #0A1A05, #204A10)", icon: "🇧🇷" },
];

export const EXPLORE_LANGUAGE_CARDS = [
  { name: "Albanian", iso: "sq", gradient: "linear-gradient(135deg, #2c1c1c, #9d3f3f)", icon: "🇦🇱" },
  { name: "Arabic", iso: "ar", gradient: "linear-gradient(135deg, #1c2c1f, #3f9d5b)", icon: "🇸🇦" },
  { name: "Assamese", iso: "as", gradient: "linear-gradient(135deg, #2c221c, #ab8d6b)", icon: "🇮🇳" },
  { name: "Bengali", iso: "bn", gradient: "linear-gradient(135deg, #1c2c22, #3f9d70)", icon: "🇧🇩" },
  { name: "Cantonese", iso: "yue", gradient: "linear-gradient(135deg, #2c1c1c, #ab4d4d)", icon: "🇭🇰" },
  { name: "Danish", iso: "da", gradient: "linear-gradient(135deg, #2c1c22, #9d3f5b)", icon: "🇩🇰" },
  { name: "Dutch", iso: "nl", gradient: "linear-gradient(135deg, #2c221c, #ab8d4d)", icon: "🇳🇱" },
  { name: "English", iso: "en", gradient: "linear-gradient(135deg, #1f1c2c, #928dab)", icon: "🇺🇸" },
  { name: "Filipino", iso: "tl", gradient: "linear-gradient(135deg, #1c2c36, #3b749e)", icon: "🇵🇭" },
  { name: "Finnish", iso: "fi", gradient: "linear-gradient(135deg, #1f2a36, #4b6a9e)", icon: "🇫🇮" },
  { name: "Flemish", iso: "nl-be", gradient: "linear-gradient(135deg, #2c271c, #aba24d)", icon: "🇧🇪" },
  { name: "French", iso: "fr", gradient: "linear-gradient(135deg, #1c2c27, #8dab9b)", icon: "🇫🇷" },
  { name: "German", iso: "de", gradient: "linear-gradient(135deg, #2c271c, #ab9b8d)", icon: "🇩🇪" },
  { name: "Greek", iso: "el", gradient: "linear-gradient(135deg, #1f2636, #4b5a9e)", icon: "🇬🇷" },
  { name: "Gujarati", iso: "gu", gradient: "linear-gradient(135deg, #2c221c, #ab854d)", icon: "🇮🇳" },
  { name: "Hebrew", iso: "he", gradient: "linear-gradient(135deg, #1c2236, #3b5a9e)", icon: "🇮🇱" },
  { name: "Hindi", iso: "hi", gradient: "linear-gradient(135deg, #2c221c, #ab948d)", icon: "🇮🇳" },
  { name: "Hungarian", iso: "hu", gradient: "linear-gradient(135deg, #1c2c1f, #4dab6b)", icon: "🇭🇺" },
  { name: "Icelandic", iso: "is", gradient: "linear-gradient(135deg, #1f2236, #4b529e)", icon: "🇮🇸" },
  { name: "Indonesian", iso: "id", gradient: "linear-gradient(135deg, #2c1c1c, #ab4d4d)", icon: "🇮🇩" },
  { name: "Italian", iso: "it", gradient: "linear-gradient(135deg, #1c2c1f, #8dab8d)", icon: "🇮🇹" },
  { name: "Japanese", iso: "ja", gradient: "linear-gradient(135deg, #1c1f2c, #8d92ab)", icon: "🇯🇵" },
  { name: "Kannada", iso: "kn", gradient: "linear-gradient(135deg, #2c221c, #ab824d)", icon: "🇮🇳" },
  { name: "Korean", iso: "ko", gradient: "linear-gradient(135deg, #2c1c27, #ab8d9b)", icon: "🇰🇷" },
  { name: "Malay", iso: "ms", gradient: "linear-gradient(135deg, #2c271c, #aba94d)", icon: "🇲🇾" },
  { name: "Malayalam", iso: "ml", gradient: "linear-gradient(135deg, #2c221c, #aba04d)", icon: "🇮🇳" },
  { name: "Mandarin", iso: "zh", gradient: "linear-gradient(135deg, #2c1c1c, #ab3b3b)", icon: "🇨🇳" },
  { name: "Marathi", iso: "mr", gradient: "linear-gradient(135deg, #2c221c, #ab8f4d)", icon: "🇮🇳" },
  { name: "Norwegian", iso: "no", gradient: "linear-gradient(135deg, #2c1f2c, #ab4d6b)", icon: "🇳🇴" },
  { name: "Odia", iso: "or", gradient: "linear-gradient(135deg, #2c221c, #aba04d)", icon: "🇮🇳" },
  { name: "Persian", iso: "fa", gradient: "linear-gradient(135deg, #1c2c22, #4dab61)", icon: "🇮🇷" },
  { name: "Polish", iso: "pl", gradient: "linear-gradient(135deg, #2c1c22, #ab4d61)", icon: "🇵🇱" },
  { name: "Portuguese", iso: "pt", gradient: "linear-gradient(135deg, #1c2c1f, #4dab5b)", icon: "🇵🇹" },
  { name: "Punjabi", iso: "pa", gradient: "linear-gradient(135deg, #2c221c, #aba04d)", icon: "🇮🇳" },
  { name: "Russian", iso: "ru", gradient: "linear-gradient(135deg, #1f2c36, #4b6a9e)", icon: "🇷🇺" },
  { name: "Sinhala", iso: "si", gradient: "linear-gradient(135deg, #2c221c, #aba54d)", icon: "🇱🇰" },
  { name: "Spanish", iso: "es", gradient: "linear-gradient(135deg, #2c1c1c, #ab8d8d)", icon: "🇪🇸" },
  { name: "Swedish", iso: "sv", gradient: "linear-gradient(135deg, #1f2a36, #4b619e)", icon: "🇸🇪" },
  { name: "Tamil", iso: "ta", gradient: "linear-gradient(135deg, #2c221c, #aba04d)", icon: "🇮🇳" },
  { name: "Telugu", iso: "te", gradient: "linear-gradient(135deg, #2c221c, #aba04d)", icon: "🇮🇳" },
  { name: "Thai", iso: "th", gradient: "linear-gradient(135deg, #1f2c2a, #4b9e8b)", icon: "🇹🇭" },
  { name: "Turkish", iso: "tr", gradient: "linear-gradient(135deg, #2c1c1f, #ab4d5b)", icon: "🇹🇷" },
  { name: "Ukrainian", iso: "uk", gradient: "linear-gradient(135deg, #1f2636, #4b5a9e)", icon: "🇺🇦" },
];

export const EXPLORE_SUB_FAMILY_FRIENDLY = [
  { name: "Kids", gradient: "linear-gradient(135deg, #0a1a0f, #2e4a3a)", icon: "🧸" },
  { name: "Animation", gradient: "linear-gradient(135deg, #1a0a2e, #4a1a6e)", icon: "🎬" },
  { name: "Educational", gradient: "linear-gradient(135deg, #1a1a00, #4a4a00)", icon: "📘" },
  { name: "Fairy Tales", gradient: "linear-gradient(135deg, #2a0a1a, #5a1a3a)", icon: "🧚" },
];

export const EXPLORE_SUB_ANIME = [
  { name: "Shonen", gradient: "linear-gradient(135deg, #2c0a0a, #801a1a)", icon: "🔥" },
  { name: "Shojo", gradient: "linear-gradient(135deg, #2a0a2a, #6e1a6e)", icon: "🌸" },
  { name: "Seinen", gradient: "linear-gradient(135deg, #001a2a, #004a6e)", icon: "⚔️" },
  { name: "Mecha", gradient: "linear-gradient(135deg, #1a1a1a, #4a4a4a)", icon: "🤖" },
  { name: "Isekai", gradient: "linear-gradient(135deg, #0a2a1a, #1a6e3a)", icon: "🌀" },
];

export const EXPLORE_SUB_AWARD_WINNERS = [
  { name: "Oscars", gradient: "linear-gradient(135deg, #2a2000, #806000)", icon: "🏆" },
  { name: "Cannes", gradient: "linear-gradient(135deg, #0f1f2f, #2f5f8f)", icon: "🌿" },
  { name: "Golden Globe", gradient: "linear-gradient(135deg, #2f1f0f, #8f4f1f)", icon: "🌐" },
  { name: "Emmys", gradient: "linear-gradient(135deg, #1f0f2f, #4f1f8f)", icon: "🎭" },
];

export const EXPLORE_SUB_FRANCHISE = [
  { name: "Marvel", gradient: "linear-gradient(135deg, #300000, #900000)", icon: "🦸" },
  { name: "Star Wars", gradient: "linear-gradient(135deg, #001030, #003090)", icon: "⚔️" },
  { name: "Harry Potter", gradient: "linear-gradient(135deg, #102010, #306030)", icon: "⚡" },
  { name: "DC", gradient: "linear-gradient(135deg, #002040, #005080)", icon: "🦇" },
];

export const EXPLORE_SUB_EDITORS_PICK = [
  { name: "Masterpieces", gradient: "linear-gradient(135deg, #200010, #600030)", icon: "✨" },
  { name: "Hidden Gems", gradient: "linear-gradient(135deg, #002020, #006060)", icon: "💎" },
  { name: "Cult Classics", gradient: "linear-gradient(135deg, #201000, #603000)", icon: "📺" },
  { name: "Must Watch", gradient: "linear-gradient(135deg, #003000, #008000)", icon: "🎯" },
];

export function toGenreSlug(str) {
  return (str || "").toLowerCase().replace(/\s+/g, "-");
}

export function toCountrySlug(str) {
  return (str || "").toLowerCase().replace(/\s+/g, "-");
}

// ─── SETTINGS DEFAULTS ───────────────────────────────────────────────────────
export const DEFAULT_SETTINGS = {
  theme: "black", // ui theme: black, light, or neo (original)
  accentColor: "green",
  cardSize: "medium",
  showRatings: true,
  showOverviews: false,
  autoplay: true,
  language: "en",
  adultContent: false,
  animationsReduced: false,
  showStreaming: true,
  cinematicBg: true,
};
