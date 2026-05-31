const fs = require('fs');
const path = require('path');

const file = 'c:/Users/Akshad/Projects/reellog/src/App.jsx';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const supaStart = lines.findIndex(l => l.includes('// ─── SUPABASE ──'));
const tmdbStart = lines.findIndex(l => l.includes('// ─── TMDB ──'));
const endConstants = lines.findIndex(l => l.includes('// ─── GLOBAL CSS ──'));

// Extract Supabase
const supabaseLines = lines.slice(supaStart, tmdbStart);
let supabaseFileLines = [
  'import { createClient } from "@supabase/supabase-js";',
  ''
];
for (let line of supabaseLines) {
  if (line.includes('const supabase = createClient(')) {
    supabaseFileLines.push(line.replace('const supabase', 'export const supabase'));
  } else {
    supabaseFileLines.push(line);
  }
}

// Extract Constants
const constantsLines = lines.slice(tmdbStart, endConstants);
let constFileLines = [
  'import {',
  '  FaArrowLeft, FaBolt, FaBookOpen, FaBrain, FaCheck, FaChevronLeft,',
  '  FaChevronRight, FaCog, FaCompass, FaDragon, FaEye, FaFire, FaFilm,',
  '  FaGhost, FaGift, FaHatCowboy, FaHeart, FaLandmark, FaLaugh, FaMagic,',
  '  FaMusic, FaPlay, FaPlus, FaQuestionCircle, FaRobot, FaSearch, FaShieldAlt,',
  '  FaStar, FaTheaterMasks, FaTimes, FaUserCircle, FaUserSecret, FaUserShield',
  '} from "react-icons/fa";',
  ''
];

for (let i = 0; i < constantsLines.length; i++) {
  let l = constantsLines[i];
  if (l.startsWith('const ') && !l.includes('const CSS =')) {
    constFileLines.push(l.replace('const ', 'export const '));
  } else if (l.startsWith('function ')) {
    constFileLines.push(l.replace('function ', 'export function '));
  } else {
    constFileLines.push(l);
  }
}

const libDir = 'c:/Users/Akshad/Projects/reellog/src/lib';
if (!fs.existsSync(libDir)) fs.mkdirSync(libDir);

fs.writeFileSync(path.join(libDir, 'supabase.js'), supabaseFileLines.join('\n'));
fs.writeFileSync(path.join(libDir, 'constants.jsx'), constFileLines.join('\n'));
console.log('Done organizing Phase 2 logic!');
