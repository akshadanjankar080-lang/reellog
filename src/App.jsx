import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import {
  FaHome,
  FaList,
  FaCamera,
  FaArrowLeft,
  FaBolt,
  FaBookOpen,
  FaBrain,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaCompass,
  FaDragon,
  FaEye,
  FaFire,
  FaFilm,
  FaGhost,
  FaGift,
  FaHatCowboy,
  FaHeart,
  FaLandmark,
  FaLaugh,
  FaMagic,
  FaMusic,
  FaPlay,
  FaPlus,
  FaQuestionCircle,
  FaRobot,
  FaSearch,
  FaShieldAlt,
  FaStar,
  FaTheaterMasks,
  FaTimes,
  FaTv,
  FaUserCircle,
  FaUserSecret,
  FaUserShield,
} from "react-icons/fa";
import BrowseHub from "./components/BrowseHub";
import BrowseSectionPage from "./pages/BrowseSectionPage";
import BrowseItemPage from "./pages/BrowseItemPage";
import DetailPage from "./pages/DetailPage";
import HomePage from "./pages/HomePage";

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ SUPABASE ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
const supabase = createClient(
  "https://maoiguhrcvpxvmgztmqq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hb2lndWhyY3ZweHZtZ3p0bXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzE0NTcsImV4cCI6MjA4OTkwNzQ1N30.Jz1JhnSaTo1z0XYnb4rzbpmG90ceawHx6APkT0gNGI8"
);

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ TMDB ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
const TMDB_IMG   = "https://image.tmdb.org/t/p/w300";
const TMDB_W     = "https://image.tmdb.org/t/p/w780";
const TMDB_HERO  = "https://image.tmdb.org/t/p/w1280";
const TMDB_BASE  = "https://api.themoviedb.org/3";
const TMDB_KEY   = "dfb570e7a09aa4e72df7064fc4a703f0";

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ CONSTANTS ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
const STATUSES = ["Want to Watch", "Watching", "Watched", "Paused", "Dropped"];
const SCOLOR   = { Watched: "#b2f0c5", Watching: "#f4e08a", "Want to Watch": "#8ebbf5", Paused: "#b8b8b8", Dropped: "#f47070" };
const SICON    = { Watched: "\u2713", Watching: "\u25b6", "Want to Watch": "\u25cb", Paused: "II", Dropped: "X" };

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ OTT STREAMING PLATFORMS ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
const OTT = {
  nf:    { name:"Netflix",      short:"NF",   color:"#E50914", bg:"#141414", logo:"https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",                                            url:"https://www.netflix.com/search?q=" },
  prime: { name:"Prime Video",  short:"PV",   color:"#00A8E1", bg:"#0F171E", logo:"https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",                                                  url:"https://www.primevideo.com/search?phrase=" },
  hs:    { name:"JioHotstar",   short:"HS",   color:"#1a56db", bg:"#0D0D2B", logo:"https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg",                                       url:"https://www.hotstar.com/in/search?q=" },
  hbo:   { name:"Max",          short:"MAX",  color:"#7B2FBE", bg:"#0B0B1A", logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/HBO_Max_Logo.svg/512px-HBO_Max_Logo.svg.png",               url:"https://www.max.com/search?q=" },
  sony:  { name:"SonyLIV",      short:"SONY", color:"#003087", bg:"#001A4E", logo:"https://upload.wikimedia.org/wikipedia/commons/4/4a/SonyLIV_logo.svg",                                                 url:"https://www.sonyliv.com/search?keyword=" },
  zee5:  { name:"ZEE5",         short:"ZEE5", color:"#7B2D8B", bg:"#1A0030", logo:"https://upload.wikimedia.org/wikipedia/commons/7/7a/ZEE5_logo.svg",                                                   url:"https://www.zee5.com/search?q=" },
  atv:   { name:"Apple TV+",    short:"ATV",  color:"#888",    bg:"#1C1C1E", logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Apple_TV_Plus_Logo.svg/512px-Apple_TV_Plus_Logo.svg.png",   url:"https://tv.apple.com/search?term=" },
  cr:    { name:"Crunchyroll",  short:"CR",   color:"#F47521", bg:"#1A0800", logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Crunchyroll_icon_2024.svg/512px-Crunchyroll_icon_2024.svg.png", url:"https://www.crunchyroll.com/search?q=" },
};

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ STATIC CATALOG ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
const STATIC_ANIME = [
  { id:"a1",  tmdbId:1429,   tmdbType:"tv",    title:"Attack on Titan",                   year:2013, rating:9.1, type:"Anime",   poster:"/hTP1DtLGFAmna71pe5kzkm7zBCc.jpg",  streaming:["cr","nf"],    categories:["Action","Adventure","Animated"], overview:"Humanity battles giant humanoid Titans behind massive walls. When the walls are breached, young Eren Yeager vows revenge and changes the world." },
  { id:"a2",  tmdbId:85937,  tmdbType:"tv",    title:"Demon Slayer",                       year:2019, rating:8.7, type:"Anime",   poster:"/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",  streaming:["cr","nf"],    categories:["Action","Adventure","Anime"], overview:"A boy trains as a demon slayer to avenge his family and cure his sister who was turned into a demon." },
  { id:"a3",  tmdbId:95479,  tmdbType:"tv",    title:"Jujutsu Kaisen",                     year:2020, rating:8.6, type:"Anime",   poster:null,                                  streaming:["cr"],         categories:["Action","Anime","Animated"], overview:"A boy swallows a cursed object and must battle dangerous cursed spirits alongside Jujutsu sorcerers." },
  { id:"a4",  tmdbId:31911,  tmdbType:"tv",    title:"Fullmetal Alchemist: Brotherhood",   year:2009, rating:9.1, type:"Anime",   poster:"/9Yjx4OutGMrJNgLdmLLNLJaQBMX.jpg",  streaming:["cr","nf"],    categories:["Anime","Adventure","Anthology"], overview:"Two brothers search for the Philosopher's Stone after a failed alchemical ritual leaves them broken." },
  { id:"a5",  tmdbId:46298,  tmdbType:"tv",    title:"Hunter x Hunter",                    year:2011, rating:9.0, type:"Anime",   poster:"/gHuCPlS2bMbcuONEqRDvMV0AVgO.jpg",  streaming:["cr"],         categories:["Anime","Adventure","Action"], overview:"A boy follows his father's footsteps to become a legendary Hunter in a world of wonder and danger." },
  { id:"a6",  tmdbId:80777,  tmdbType:"tv",    title:"Vinland Saga",                       year:2019, rating:8.8, type:"Anime",   poster:"/4mFJHHlMoOWhEEqtFjVKv3CRbQr.jpg",  streaming:["cr","prime"], categories:["Anime","Adventure","Action","Animated"], overview:"A young Viking warrior seeks revenge in a brutal medieval world, eventually questioning the meaning of true strength." },
  { id:"a7",  tmdbId:64927,  tmdbType:"tv",    title:"Re:Zero",                            year:2016, rating:8.3, type:"Anime",   poster:"/aGrqIBHi09G2RPQHH79RGkJFYvB.jpg",  streaming:["cr"],         categories:["Anime","Adventure"], overview:"A boy transported to a fantasy world discovers he can reset time upon death - a power that becomes a curse." },
  { id:"a8",  tmdbId:120089, tmdbType:"tv",    title:"Spy x Family",                       year:2022, rating:8.5, type:"Anime",   poster:"/4SRTuMnT3XbMRAfAtBKlXKHoqkT.jpg",  streaming:["cr","nf"],    categories:["Anime","Action","Animated"], overview:"A spy assembles a fake family for a mission, unaware each member harbours a secret of their own." },
  { id:"a9",  tmdbId:114410, tmdbType:"tv",    title:"Chainsaw Man",                       year:2022, rating:8.5, type:"Anime",   poster:"/npdB6oBX4SHkH9LhEVrSYOHhDpd.jpg",  streaming:["cr"],         categories:["Anime","Action","Animated"], overview:"A destitute boy merges with his devil dog and becomes a Devil Hunter, craving the simplest things in life." },
  { id:"a10", tmdbId:65806,  tmdbType:"tv",    title:"Mob Psycho 100",                     year:2016, rating:8.5, type:"Anime",   poster:null,                                  streaming:["cr","nf"],    categories:["Anime","Animated"], overview:"A powerful esper boy tries to live a normal life, suppressing emotions that could level a city." },
  { id:"a11", tmdbId:209867, tmdbType:"tv",    title:"Frieren: Beyond Journey's End",      year:2023, rating:9.0, type:"Anime",   poster:"/9LDpSFAJQnrYQurFP4cFhNdIrNM.jpg",  streaming:["cr"],         categories:["Anime","Adventure","Animated"], overview:"An elf mage reflects on a completed journey years after defeating the Demon King, discovering what it means to connect." },
  { id:"a12", tmdbId:30984,  tmdbType:"tv",    title:"Bleach: Thousand-Year Blood War",    year:2022, rating:8.9, type:"Anime",   poster:"/2EewmxXe72ogD0EaWM8gqa0BPDR.jpg",  streaming:["cr","nf"],    categories:["Anime","Action","Animated"], overview:"Ichigo and Soul Society face their most powerful enemy in a war that will redefine what it means to be a Soul Reaper." },
];

const STATIC_MOVIES = [
  { id:"m1",  tmdbId:693134, tmdbType:"movie", title:"Dune: Part Two",                     year:2024, rating:8.5, type:"Movie",   poster:"/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",  streaming:["hs","hbo"],   categories:["Action","Adventure","Adaptation"], overview:"Paul Atreides unites with the Fremen while seeking revenge against the conspirators who destroyed his family." },
  { id:"m2",  tmdbId:872585, tmdbType:"movie", title:"Oppenheimer",                         year:2023, rating:8.9, type:"Movie",   poster:"/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",  streaming:["prime"],      categories:["Biography","Drama","Adaptation"], overview:"The story of J. Robert Oppenheimer and the development of the atomic bomb that changed warfare forever." },
  { id:"m3",  tmdbId:157336, tmdbType:"movie", title:"Interstellar",                        year:2014, rating:8.7, type:"Movie",   poster:"/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",  streaming:["nf","prime"], categories:["Adventure","Sci-Fi"], overview:"Explorers travel through a wormhole in space to ensure humanity's survival across galaxies." },
  { id:"m4",  tmdbId:27205,  tmdbType:"movie", title:"Inception",                           year:2010, rating:8.8, type:"Movie",   poster:"/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",  streaming:["nf","prime"], categories:["Action","Adventure","Adult Comedy"], overview:"A thief who steals corporate secrets through the art of dream-sharing is given one last impossible mission." },
  { id:"m5",  tmdbId:155,    tmdbType:"movie", title:"The Dark Knight",                     year:2008, rating:9.0, type:"Movie",   poster:"/qJ2tW6WMUDux911r6m7haRef0WH.jpg",  streaming:["hs","prime"], categories:["Action","Drama"], overview:"Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy." },
  { id:"m6",  tmdbId:129,    tmdbType:"movie", title:"Spirited Away",                       year:2001, rating:8.6, type:"Movie",   poster:"/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",  streaming:["nf"],         categories:["Animation","Adventure","Anime","Art House"], overview:"A girl enters the spirit world to rescue her parents turned into pigs - a breathtaking journey of growth." },
  { id:"m7",  tmdbId:372058, tmdbType:"movie", title:"Your Name",                           year:2016, rating:8.4, type:"Movie",   poster:"/q719jXXEzOoYaps6babgKnONONX.jpg",  streaming:["nf","prime"], categories:["Anime","Adventure","Anthology"], overview:"Two strangers find themselves inexplicably linked through body-swapping dreams that transcend time." },
  { id:"m8",  tmdbId:496243, tmdbType:"movie", title:"Parasite",                            year:2019, rating:8.5, type:"Movie",   poster:"/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",  streaming:["prime","hs"], categories:["Drama"], overview:"Greed and class discrimination threaten a symbiotic relationship between two families in modern Seoul." },
  { id:"m9",  tmdbId:545611, tmdbType:"movie", title:"Everything Everywhere All at Once",   year:2022, rating:7.8, type:"Movie",   poster:"/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",  streaming:["prime","hs"], categories:["Adventure","Comedy","Drama","Anthology"], overview:"A Chinese immigrant is swept up in an adventure across the multiverse to save the world." },
  { id:"m10", tmdbId:278,    tmdbType:"movie", title:"The Shawshank Redemption",            year:1994, rating:9.3, type:"Movie",   poster:"/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg",  streaming:["nf","prime"], categories:["Drama","Adaptation"], overview:"Two imprisoned men bond over decades, finding solace and eventual redemption through acts of decency." },
];

const STATIC_SERIES = [
  { id:"s1",  tmdbId:1396,   tmdbType:"tv",    title:"Breaking Bad",                        year:2008, rating:9.5, type:"TV Show", poster:"/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",   streaming:["nf"],         categories:["Drama"], overview:"A chemistry teacher turns to manufacturing meth to secure his family's financial future after a terminal diagnosis." },
  { id:"s2",  tmdbId:1438,   tmdbType:"tv",    title:"The Wire",                            year:2002, rating:9.3, type:"TV Show", poster:"/4lbclFySvugI51fwsyxBTOm4DqK.jpg",   streaming:["hbo"],        categories:["Drama"], overview:"The Baltimore drug scene, seen through the eyes of both drug dealers and law enforcement." },
  { id:"s3",  tmdbId:94605,  tmdbType:"tv",    title:"Arcane",                              year:2021, rating:9.0, type:"TV Show", poster:"/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",   streaming:["nf"],         categories:["Animation","Adventure"], overview:"Two sisters on opposite sides of a conflict born in the utopian region of Piltover and its oppressed undercity." },
  { id:"s4",  tmdbId:95396,  tmdbType:"tv",    title:"Severance",                           year:2022, rating:8.7, type:"TV Show", poster:"/tE3zEVeNaxD2aJMXnFfPHpQxOhJ.jpg",   streaming:["atv"],        categories:["Drama","Sci-Fi"], overview:"Workers have their work and personal memories surgically separated, creating a haunting corporate dystopia." },
  { id:"s5",  tmdbId:100088, tmdbType:"tv",    title:"The Last of Us",                      year:2023, rating:8.8, type:"TV Show", poster:"/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",   streaming:["hbo","hs"],   categories:["Action","Adventure"], overview:"A hardened smuggler and a teenage girl traverse a post-apocalyptic United States filled with infected and factions." },
  { id:"s6",  tmdbId:94997,  tmdbType:"tv",    title:"House of the Dragon",                 year:2022, rating:8.5, type:"TV Show", poster:"/z2yahl2uefxDCl0nogcRBstwruJ.jpg",   streaming:["hbo","hs"],   categories:["Action","Adventure","Drama"], overview:"The internal succession war of House Targaryen, set 200 years before the events of Game of Thrones." },
  { id:"s7",  tmdbId:63351,  tmdbType:"tv",    title:"Succession",                          year:2018, rating:8.9, type:"TV Show", poster:"/e2X8fBflR3zqzWNBlHFzSAE5Jah.jpg",   streaming:["hbo"],        categories:["Drama"], overview:"The Roy family controls one of the biggest media empires in the world - and tears itself apart fighting for it." },
  { id:"s8",  tmdbId:70523,  tmdbType:"tv",    title:"Dark",                                year:2017, rating:8.8, type:"TV Show", poster:"/apbrbWs5M0SUFOSnPKzFm8Jj3jv.jpg",   streaming:["nf"],         categories:["Drama","Sci-Fi"], overview:"A mind-bending family saga involving four interdependent families in a German town across different time periods." },
  { id:"s9",  tmdbId:95557,  tmdbType:"tv",    title:"Invincible",                          year:2021, rating:8.7, type:"TV Show", poster:"/yDWJYRAwMNKa767NIf0q8jk6r7i.jpg",   streaming:["prime"],      categories:["Action","Adventure","Animation"], overview:"A teenage boy discovers his father is the most powerful superhero on the planet - and something far darker." },
  { id:"s10", tmdbId:136315, tmdbType:"tv",    title:"The Bear",                            year:2022, rating:8.8, type:"TV Show", poster:null,                                   streaming:["hs","atv"],   categories:["Comedy","Drama"], overview:"A James Beard-nominated chef returns to Chicago to run his family's chaotic sandwich shop after a family tragedy." },
];

const HERO_ITEMS = [
  { title:"Attack on Titan", tmdbId:1429, tmdbType:"tv",    poster:"/hTP1DtLGFAmna71pe5kzkm7zBCc.jpg", backdrop:"/d8duYyyC9J5T825Hg7grmaabfxQ.jpg", rating:"9.1", type:"Anime",   year:2013, streaming:["cr","nf"],    overview:"Humanity's last survivors fight giant humanoid Titans behind colossal walls. When the walls are breached, young Eren Yeager vows revenge that will change the world." },
  { title:"Dune: Part Two",  tmdbId:693134,tmdbType:"movie", poster:"/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", backdrop:"/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg", rating:"8.5", type:"Movie",   year:2024, streaming:["hs","hbo"],   overview:"Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family." },
  { title:"Arcane",          tmdbId:94605, tmdbType:"tv",    poster:"/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg", backdrop:"/sPUBwJ2TxJAKcVaA6axzBVi6UKN.jpg", rating:"9.0", type:"TV Show", year:2021, streaming:["nf"],         overview:"Set in the utopian region of Piltover and the oppressed underground of Zaun, two sisters champion different sides of a brewing conflict." },
  { title:"Frieren",         tmdbId:209867,tmdbType:"tv",    poster:"/9LDpSFAJQnrYQurFP4cFhNdIrNM.jpg", backdrop:"/yDWJYRAwMNKa767NIf0q8jk6r7i.jpg", rating:"9.0", type:"Anime",   year:2023, streaming:["cr"],         overview:"After the party's victory, elf mage Frieren sets out on a journey of reflection, exploring what it means to truly live and connect with others." },
];

const EXPLORE_CATEGORY_GROUPS = {
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

const EXPLORE_GENRE_CARDS = [
  { name:"Action",          gradient:"linear-gradient(135deg, #1a0a0a, #8B0000)", icon:<FaFire />,           tmdbGenreId:28 },
  { name:"Adventure",       gradient:"linear-gradient(135deg, #0a1628, #1a4a2e)", icon:<FaCompass />,        tmdbGenreId:12 },
  { name:"Animation",       gradient:"linear-gradient(135deg, #1a0a2e, #4a1a6e)", icon:<FaFilm />,           tmdbGenreId:16 },
  { name:"Comedy",          gradient:"linear-gradient(135deg, #1a1200, #5a4a00)", icon:<FaLaugh />,          tmdbGenreId:35 },
  { name:"Crime",           gradient:"linear-gradient(135deg, #0a0a0a, #2a1a00)", icon:<FaUserSecret />,     tmdbGenreId:80 },
  { name:"Documentary",     gradient:"linear-gradient(135deg, #0a1a1a, #003333)", icon:<FaBookOpen />,       tmdbGenreId:99 },
  { name:"Drama",           gradient:"linear-gradient(135deg, #1a0a1a, #3a003a)", icon:<FaTheaterMasks />,   tmdbGenreId:18 },
  { name:"Fantasy",         gradient:"linear-gradient(135deg, #0a0a2a, #1a003a)", icon:<FaMagic />,          tmdbGenreId:14 },
  { name:"History",         gradient:"linear-gradient(135deg, #1a1000, #3a2800)", icon:<FaLandmark />,       tmdbGenreId:36 },
  { name:"Horror",          gradient:"linear-gradient(135deg, #0a0000, #3a0000)", icon:<FaGhost />,          tmdbGenreId:27 },
  { name:"Music",           gradient:"linear-gradient(135deg, #001a1a, #003a3a)", icon:<FaMusic />,          tmdbGenreId:10402 },
  { name:"Mystery",         gradient:"linear-gradient(135deg, #080818, #18083a)", icon:<FaQuestionCircle />, tmdbGenreId:9648 },
  { name:"Romance",         gradient:"linear-gradient(135deg, #1a0010, #4a0028)", icon:<FaHeart />,          tmdbGenreId:10749 },
  { name:"Science Fiction", gradient:"linear-gradient(135deg, #000a1a, #001a3a)", icon:<FaRobot />,          tmdbGenreId:878 },
  { name:"Thriller",        gradient:"linear-gradient(135deg, #050510, #100520)", icon:<FaBolt />,           tmdbGenreId:53 },
  { name:"War",             gradient:"linear-gradient(135deg, #0a0a00, #1a1a00)", icon:<FaShieldAlt />,      tmdbGenreId:10752 },
  { name:"Western",         gradient:"linear-gradient(135deg, #1a0800, #3a1800)", icon:<FaHatCowboy />,      tmdbGenreId:37 },
  { name:"Anime",           gradient:"linear-gradient(135deg, #1a0010, #00103a)", icon:<FaDragon />,         keywordQuery:"anime" },
  { name:"Superhero",       gradient:"linear-gradient(135deg, #0a001a, #1a0000)", icon:<FaUserShield />,     keywordQuery:"superhero" },
  { name:"Psychological",   gradient:"linear-gradient(135deg, #050510, #200520)", icon:<FaBrain />,          keywordQuery:"psychological" },
];

function toGenreSlug(str) {
  return (str || "").toLowerCase().replace(/\s+/g, "-");
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ SETTINGS DEFAULTS ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
const DEFAULT_SETTINGS = {
  theme:       "black", // ui theme: black, light, or neo (original)
  accentColor: "green",
  cardSize:    "medium",
  showRatings:  true,
  showOverviews: false,
  autoplay:     true,
  language:     "en",
  adultContent: false,
  animationsReduced: false,
  showStreaming: true,
  cinematicBg:  true,
};

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ GLOBAL CSS ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Serif+Display:ital@0;1&display=swap');

*,*::before,*::after{
  box-sizing:border-box;margin:0;padding:0;
  backface-visibility:hidden;-webkit-font-smoothing:antialiased;
}

:root{
  /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ CORE PALETTE (dark with green tint) ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
  --bk:#07100a;
  --c1:#0e1812;
  --c2:#162019;
  --c3:#1d2b21;

  /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ ACCENT: Pastel Green default ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
  --acc:#b2f0c5; 
  --acc-d:#6dbe8c;
  --acc-glow:rgba(178,240,197,.22);
  --acc-dim:rgba(178,240,197,.08);
  --acc-border:rgba(178,240,197,.22);

  /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ YELLOWS & GREYS ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
  --gold:#f0d878;
  --gold-dim:rgba(240,216,120,.12);
  --grey1:#899e8d;
  --grey2:#4a5e50;
  --grey3:#253028;
  --grey4:#192218;

  /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ TEXT ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
  --tx:#e8f2ea;
  --txm:#899e8d;
  --txd:#4a5e50;

  /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ DANGER ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
  --red:#f47070;
  --red-dim:rgba(244,112,112,.1);
}

/* Accent overrides */
.acc-yellow{ --acc:#f4d06f; --acc-d:#d4a30a; --acc-glow:rgba(244,208,111,.18); --acc-dim:rgba(244,208,111,.08); --acc-border:rgba(244,208,111,.2); }
.acc-blue  { --acc:#8ebbf5; --acc-d:#3b82f6; --acc-glow:rgba(142,187,245,.18); --acc-dim:rgba(142,187,245,.08); --acc-border:rgba(142,187,245,.2); }
.acc-red   { --acc:#f47070; --acc-d:#e53535; --acc-glow:rgba(244,112,112,.18); --acc-dim:rgba(244,112,112,.08); --acc-border:rgba(244,112,112,.2); }
.acc-white { --acc:#ffffff; --acc-d:#f5f5f5; --acc-glow:rgba(255,255,255,.22); --acc-dim:rgba(255,255,255,.08); --acc-border:rgba(255,255,255,.22); }

/* Theme overrides */
:root.theme-black{
  --bk:#000;
  --c1:#040404;
  --c2:#0a0a0a;
  --c3:#101010;
  --grey1:#b8b8b8;
  --grey2:#6b6b6b;
  --grey3:#2a2a2a;
  --grey4:#151515;
  --tx:#f5f5f5;
  --txm:#b8b8b8;
  --txd:#7a7a7a;
}
:root.theme-light{
  --bk:#f8fafc;
  --c1:#f1f5f9;
  --c2:#e2e8f0;
  --c3:#cbd5e1;
  --grey1:#475569;
  --grey2:#cbd5e1;
  --grey3:#e2e8f0;
  --grey4:#f8fafc;
  --tx:#0f172a;
  --txm:#334155;
  --txd:#64748b;
  --red:#ef4444;
  --red-dim:rgba(239,68,68,.12);
}

html{scroll-behavior:smooth;}

body{
  background:var(--bk);
  background-image:
    radial-gradient(ellipse 120% 60% at 50% -10%,rgba(178,240,197,.045) 0%,transparent 70%),
    radial-gradient(ellipse 60% 40% at 0% 100%,rgba(100,200,130,.025) 0%,transparent 60%),
    radial-gradient(ellipse 80% 50% at 100% 50%,rgba(80,160,110,.018) 0%,transparent 60%);
  color:var(--tx);
  font-family:'DM Sans',sans-serif;
  min-height:100vh;
  overflow-x:hidden;
}

.theme-black body{
  background:#000;
  background-image:none;
}
.theme-light body{
  background:var(--bk);
  background-image:none;
  color:var(--tx);
}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:var(--grey2);border-radius:4px;}
::-webkit-scrollbar-track{background:transparent;}
button{cursor:pointer;font-family:'DM Sans',sans-serif;}
input,select,textarea{font-family:'DM Sans',sans-serif;}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ GRAIN OVERLAY ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.grain-svg{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9998;opacity:.038;}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ NAV ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:200;overflow:hidden;
  height:66px;display:flex;align-items:center;gap:24px;
  padding:0 48px;
  background:linear-gradient(to bottom,rgba(7,16,10,.92),rgba(7,16,10,.78),rgba(7,16,10,.65));
  backdrop-filter:blur(12px);
  border-bottom:1px solid rgba(178,240,197,.12);
  box-shadow:0 8px 32px rgba(0,0,0,.3), 0 0 20px rgba(178,240,197,.08);
  transition:all .3s ease;
  will-change:backdrop-filter,transform;transform:translateZ(0);contain:layout style paint;
}
.nav-scrolled{background:rgba(7,16,10,.95)!important;box-shadow:0 12px 40px rgba(0,0,0,.4), 0 0 25px rgba(178,240,197,.1)!important;}
.nav-logo{
  font-family:'Bebas Neue',sans-serif;font-size:29px;letter-spacing:4px;
  color:var(--acc);display:flex;align-items:center;gap:8px;cursor:pointer;
  text-shadow:0 0 0px rgba(178,240,197,0.5), 0 0 2px var(--acc-glow), 0 0 5px rgba(178,240,197,0.2);
  transition:all 0.3s ease;
}
.nav-logo:hover{
  transform:scale(1.05);
  text-shadow:0 0 10px rgba(178,240,197,0.7), 0 0 10px var(--acc-glow), 0 0 30px rgba(178,240,197,0.3);
}
.nav-logo span{color:var(--tx);}
.nav-dot{width:7px;height:7px;border-radius:50%;background:var(--acc);flex-shrink:0;box-shadow:0 0 10px var(--acc-glow);}
.nav-links{display:flex;align-items:center;gap:2px;}
.nav-link{
  padding:8px 16px;font-size:13px;font-weight:600;color:var(--txm);
  background:none;border:none;border-radius:8px;
  transition:all 0.25s ease;letter-spacing:.3px;position:relative;
}
.nav-link::after{content:'';position:absolute;bottom:4px;left:50%;transform:translateX(-50%) scaleX(0);width:16px;height:3px;background:var(--acc);border-radius:2px;transition:transform 0.25s ease;box-shadow:0 0 12px rgba(178,240,197,0.4);}
.nav-link:hover{color:var(--acc);transform:translateY(-2px);}
.nav-link.active{color:var(--acc);text-shadow:0 0 16px rgba(178,240,197,0.4);}
.nav-link.active::after{transform:translateX(-50%) scaleX(1);}
.nav-right{display:flex;align-items:center;gap:10px;margin-left:auto;}
.nav-user{font-size:12px;color:var(--txm);letter-spacing:.5px;padding:0 4px;}
.btn-sm{padding:8px 18px;font-size:12px;font-weight:500;border:none;border-radius:7px;transition:all .2s;letter-spacing:.3px;}
.btn-outline{background:none;border:1px solid var(--grey3);color:var(--txm);}
.btn-outline:hover{border-color:var(--acc-border);color:var(--acc);}
.btn-acc{background:var(--acc);color:#07100a;font-weight:600;}
.btn-acc:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 6px 20px var(--acc-glow);}
.btn-icon{
  width:38px;height:38px;display:flex;align-items:center;justify-content:center;
  background:rgba(255,255,255,0.08);border:1px solid var(--grey3);
  border-radius:9px;color:var(--txm);font-size:16px;transition:all 0.25s ease;
  position:relative;box-shadow:0 0 10px rgba(178,240,197,0.15);
  padding:0;line-height:1;will-change:transform;transform:translateZ(0);contain:layout style paint;
}
.btn-icon svg, .btn-icon > * {
  display:flex;align-items:center;justify-content:center;
  width:18px;height:18px;flex-shrink:0;
}
.theme-black .nav{background:linear-gradient(to bottom,rgba(0,0,0,.92),rgba(0,0,0,.78),rgba(0,0,0,.65));border-bottom:1px solid rgba(255,255,255,.12);box-shadow:0 8px 32px rgba(0,0,0,.4), 0 0 20px rgba(255,255,255,.08);}
.theme-black .nav-scrolled{background:rgba(0,0,0,.95)!important;box-shadow:0 12px 40px rgba(0,0,0,.5), 0 0 25px rgba(255,255,255,.1)!important;}
.theme-light .nav{background:linear-gradient(to bottom,rgba(248,250,252,.94),rgba(248,250,252,.88),rgba(248,250,252,.80));border-bottom:1px solid rgba(30,41,59,.15);box-shadow:0 8px 32px rgba(0,0,0,.12), 0 0 20px rgba(30,41,59,.08);}
.theme-light .nav-scrolled{background:rgba(248,250,252,.96)!important;box-shadow:0 12px 40px rgba(0,0,0,.15), 0 0 25px rgba(30,41,59,.1)!important;}
.theme-light .nav-link{color:#475569;}
.theme-light .nav-link:hover{color:#0f172a;transform:translateY(-2px);}
.theme-light .nav-logo span{color:#0f172a;}
.theme-light .btn-outline{border-color:#e2e8f0;color:#475569;}
.theme-light .btn-icon{background:rgba(15,23,42,.04);border-color:#e2e8f0;color:#475569;}
.btn-icon:hover{border-color:var(--acc-border);color:var(--acc);background:rgba(178,240,197,0.12);transform:scale(1.08);box-shadow:0 0 20px rgba(178,240,197,0.3);}
.btn-icon:active{transform:scale(0.95);box-shadow:0 0 8px rgba(178,240,197,0.2);}
.settings-gear{font-size:17px;line-height:1;}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ NAV DROPDOWN ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.nav-dropdown-wrapper{position:relative;display:inline-block;}
.nav-dropdown-menu{
  position:absolute;top:66px;left:0;z-index:199;
  background:rgba(7,16,10,.98);backdrop-filter:blur(12px);
  border:1px solid rgba(178,240,197,.1);border-radius:12px;
  padding:28px 32px;min-width:520px;
  box-shadow:0 20px 60px rgba(0,0,0,.4);
  animation:slideDown .2s ease;
  will-change:backdrop-filter;
}
@keyframes slideDown{from{opacity:0;transform:translateY(-10px);}to{opacity:1;transform:translateY(0);}}

.nav-dropdown-title{
  font-size:18px;font-weight:700;color:var(--tx);
  letter-spacing:.5px;margin-bottom:20px;
  padding-bottom:12px;border-bottom:1px solid rgba(178,240,197,.1);
}

.browse-grid{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:16px;
}

.browse-item{
  padding:20px;border:1px solid rgba(178,240,197,.15);
  border-radius:12px;background:rgba(178,240,197,.04);
  transition:all .2s;cursor:pointer;
  display:flex;align-items:center;gap:14px;
}

.browse-item:hover{
  background:rgba(178,240,197,.12);
  border-color:rgba(178,240,197,.28);
  transform:translateY(-2px);
}

.browse-icon{
  font-size:24px;min-width:28px;
}

.browse-icon-svg{
  width:24px;height:24px;min-width:24px;
  stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;
}

.browse-label{
  font-size:14px;font-weight:600;color:var(--tx);
  letter-spacing:.3px;
}

.theme-black .nav-dropdown-menu{
  background:rgba(0,0,0,.98);
  border-color:rgba(255,255,255,.08);
}
.theme-black .nav-dropdown-title{
  border-color:rgba(255,255,255,.08);
}
.theme-black .browse-item{
  border-color:rgba(255,255,255,.12);
  background:rgba(255,255,255,.04);
}
.theme-black .browse-item:hover{
  background:rgba(255,255,255,.08);
  border-color:rgba(255,255,255,.2);
}
.theme-light .nav-dropdown-menu{
  background:rgba(248,250,252,.98);
  border-color:rgba(15,23,42,.1);
}
.theme-light .nav-dropdown-title{
  color:#0f172a;
  border-color:rgba(15,23,42,.1);
}
.theme-light .browse-item{
  border-color:rgba(15,23,42,.12);
  background:rgba(15,23,42,.04);
}
.theme-light .browse-item:hover{
  background:rgba(15,23,42,.08);
  border-color:rgba(15,23,42,.2);
}
.theme-light .browse-label{
  color:#0f172a;
}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ HERO CAROUSEL ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.hero-wrap{position:relative;height:100vh;min-height:600px;max-height:840px;overflow:hidden;margin-top:-66px;}
.hero-bg-img{
  position:absolute;inset:0;
  background-size:cover;background-position:center top;
  transition:opacity .4s ease;
  will-change:opacity,transform;transform:translateZ(0);
}
.hero-bg-img.enter{opacity:0;}
.hero-bg-img.active{opacity:1;}
.hero-overlay{
  position:absolute;inset:0;
  background:
    linear-gradient(to top,var(--bk) 0%,rgba(7,16,10,.55) 36%,rgba(7,16,10,.12) 64%,rgba(7,16,10,.32) 100%),
    linear-gradient(to right,rgba(7,16,10,.78) 0%,rgba(7,16,10,.38) 52%,transparent 100%);
}
.hero-content{
  position:absolute;bottom:10%;left:20px;max-width:580px;
  animation:heroUp .65s ease both;
  padding-bottom:70px; /* leaves room for thumbnail strip */
}
@keyframes heroUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
.hero-badge{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(178,240,197,.08);border:1px solid rgba(178,240,197,.2);
  padding:5px 14px;border-radius:20px;margin-bottom:18px;
  font-size:11px;color:var(--acc);letter-spacing:3px;text-transform:uppercase;
}
.hero-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--acc);animation:pulse 2s infinite;box-shadow:0 0 8px var(--acc);}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
.hero-title{
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(32px,6vw,72px);line-height:.9;
  letter-spacing:2px;margin-bottom:14px;
  max-width:min(92vw,640px);
  overflow-wrap:anywhere;
  text-shadow:0 2px 40px rgba(0,0,0,.5);
}
.hero-meta{display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap;}
.hero-type-tag{font-size:11px;padding:4px 12px;border-radius:6px;border:1px solid var(--grey2);color:var(--txm);letter-spacing:1.5px;text-transform:uppercase;}
.hero-year{font-size:13px;color:var(--txm);}
.hero-overview{
  font-size:14.5px;color:rgba(232,242,234,.76);
  line-height:1.78;max-width:470px;margin-bottom:26px;font-weight:300;
  display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;
}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap;align-items:center;}
.btn-hero-play{
  display:flex;align-items:center;gap:8px;
  background:var(--tx);color:var(--bk);
  padding:13px 30px;font-size:14px;font-weight:700;
  border:none;border-radius:9px;
  transition:all .2s;letter-spacing:.3px;
}
.btn-hero-play:hover{background:#fff;transform:translateY(-2px);box-shadow:0 10px 32px rgba(255,255,255,.18);}
.btn-hero-add{
  display:flex;align-items:center;gap:8px;
  background:rgba(255,255,255,.15);color:var(--tx);
  padding:13px 26px;font-size:14px;font-weight:500;
  border:1px solid rgba(255,255,255,.2);border-radius:9px;
  transition:all .2s;
}
.btn-hero-add:hover{background:rgba(255,255,255,.18);transform:translateY(-2px);}
.card-add-btn{
  background:#9FE8C3;
  color:#000;
  padding:10px 18px;
  border-radius:999px;
  font-weight:700;
  border:none;
  cursor:pointer;
  transition:.2s ease;
}
.card-add-btn:hover{filter:brightness(1.06);}
.hero-dots{
  position:absolute;bottom:30px;left:50%;transform:translateX(-50%);
  display:flex;gap:8px;
}
.hero-dot{width:28px;height:3px;border-radius:2px;background:rgba(255,255,255,.2);transition:all .35s;cursor:pointer;}
.hero-dot.on{background:var(--acc);width:46px;box-shadow:0 0 10px var(--acc-glow);}
.hero-thumbs-wrap{
  position:absolute;left:40px;right:52px;bottom:28px;
  display:flex;align-items:center;gap:10px;
  z-index:4;
  padding-top:10px;
}
.hero-thumb-arrow{
  width:40px;height:64px;border-radius:10px;
  border:1px solid rgba(255,255,255,.16);
  background:rgba(7,16,10,.72);
  color:var(--tx);font-size:20px;font-weight:700;
  display:flex;align-items:center;justify-content:center;
  transition:all .2s;cursor:pointer;
  transform:translateZ(0);
}
.hero-thumb-arrow:hover{border-color:var(--acc-border);color:var(--acc);}
.hero-thumbs{
  display:flex;gap:10px;
  overflow-x:auto;scroll-behavior:smooth;
  padding:6px 4px;
  scrollbar-width:none;flex:1;
  contain:layout style paint;
  will-change:scroll-position;
  transform:translateZ(0);
}
.hero-thumbs::-webkit-scrollbar{display:none;}
.hero-thumb{
  width:132px;height:72px;flex:0 0 auto;
  border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,.14);
  background:var(--c2);padding:0;
  cursor:pointer;transition:transform .22s ease, box-shadow .22s ease, border-color .22s ease;
}
.hero-thumb img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(1.05);transition:transform .22s ease;}
.hero-thumb .hero-thumb-fallback{
  width:100%;height:100%;display:flex;align-items:center;justify-content:center;
  font-size:11px;color:var(--txm);padding:8px;text-align:center;
}
.hero-thumb:hover{
  transform:translateY(-4px) scale(1.05);
  box-shadow:0 12px 22px rgba(0,0,0,.36);
}
.hero-thumb.active{
  transform:translateY(-4px) scale(1.05);
  border:1.5px solid rgba(178,240,197,.45);
  box-shadow:0 14px 28px rgba(0,0,0,.42), inset 0 0 12px rgba(178,240,197,.08);
}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ ROW SECTIONS ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.catalog-section{padding:0;}
.row-section{
  position:relative;
  padding:20px 0;
  isolation:isolate;
  background:transparent;
}
.row-section::before{
  content:"";
  position:absolute;
  inset:0;
  background:linear-gradient(to bottom,rgba(0,0,0,.2),transparent,rgba(0,0,0,.25));
  opacity:.3;
  pointer-events:none;
  z-index:0;
}
.row-section > *{position:relative;z-index:1;}
.sec-header{display:flex;align-items:baseline;justify-content:space-between;padding:0 52px 16px;}
.sec-title{font-family:'DM Serif Display',serif;font-size:23px;display:flex;align-items:center;gap:10px;}
.sec-emoji{font-size:20px;}
.sec-count{font-size:12px;color:var(--txm);font-family:'DM Sans',sans-serif;font-weight:400;}
.sec-see-all{
  font-size:12px;color:var(--acc);background:none;border:none;
  letter-spacing:.5px;padding:6px 14px;cursor:pointer;
  border:1px solid var(--acc-border);border-radius:20px;
  transition:all .2s;
}
.sec-see-all:hover{background:var(--acc-dim);transform:translateX(2px);}

/* Row with scroll arrows */
.row-section-wrap{position:relative;}
.row-arrow{
  position:absolute;top:50%;transform:translateY(-50%);
  width:44px;height:80px;
  display:flex;align-items:center;justify-content:center;
  background:linear-gradient(to right,rgba(7,16,10,.92),rgba(7,16,10,.7));
  border:none;color:var(--tx);font-size:22px;
  cursor:pointer;z-index:10;
  transition:all .2s;
  opacity:0;
}
.row-section-wrap:hover .row-arrow{opacity:1;}
.row-arrow:hover{color:var(--acc);}
.row-arrow-left{left:0;border-radius:0 8px 8px 0;padding-left:8px;background:linear-gradient(to right,rgba(7,16,10,.95),rgba(7,16,10,.5));}
.row-arrow-right{right:0;border-radius:8px 0 0 8px;padding-right:8px;background:linear-gradient(to left,rgba(7,16,10,.95),rgba(7,16,10,.5));}

.row-scroll{
  display:flex;gap:14px;
  padding:4px 52px 16px;
  overflow-x:auto;scrollbar-width:none;
  scroll-behavior:smooth;
  contain:layout style paint;
  will-change:scroll-position;
  transform:translateZ(0);
}
.row-scroll::-webkit-scrollbar{display:none;}

.row-card{
  flex-shrink:0;width:154px;
  border-radius:14px;overflow:hidden;cursor:pointer;position:relative;
  background:var(--c2);
  border:1px solid rgba(255,255,255,.06);
  transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  will-change:transform;
  contain:layout style paint;
  transform:translateZ(0);
}
.row-card::before{
  content:'';position:absolute;inset:0;z-index:1;pointer-events:none;
  background:linear-gradient(135deg,rgba(255,255,255,.04) 0%,transparent 60%);
  border-radius:14px;
}
.row-card:hover{
  transform:scale(1.05);
  border-color:var(--acc-border);
  box-shadow:0 10px 30px rgba(0,0,0,.5),0 0 0 1px var(--acc-border);
}
.row-card-img-box{position:relative;aspect-ratio:2/3;overflow:hidden;}
.row-card-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s;}
.row-card:hover .row-card-img{transform:scale(1.07);}
.row-card-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(7,16,10,1) 0%,rgba(7,16,10,.45) 45%,transparent 100%);}
.row-card-rank{
  position:absolute;bottom:6px;left:8px;
  font-family:'Bebas Neue',sans-serif;font-size:42px;line-height:1;
  color:rgba(255,255,255,.88);text-shadow:0 2px 8px rgba(0,0,0,.8);
  -webkit-text-stroke:1px rgba(255,255,255,.18);
}
.type-badge{
  position:absolute;top:10px;left:10px;
  font-size:11px;padding:4px 10px;border-radius:999px;
  background:rgba(255,255,255,.12);
  cursor:pointer;
  color:var(--tx);
  border:1px solid rgba(255,255,255,.1);
  text-transform:uppercase;
  letter-spacing:1px;
  z-index:3;
}
.row-card-body{padding:10px;}
.row-card-title{font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px;}
.row-card-meta{display:flex;align-items:center;gap:10px;}
.row-card-year{font-size:10px;color:var(--txd);letter-spacing:.3px;}

/* Hover overlay on cards */
.row-card-hover{
  position:absolute;inset:0;
  background:rgba(0,0,0,.75);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;
  opacity:0;transition:opacity .3s ease;
  padding:12px;
  color:var(--tx);
  z-index:2;
}
.row-card:hover .row-card-hover{opacity:1;}
.row-card-hover-title{font-size:11px;font-weight:600;text-align:center;color:var(--tx);line-height:1.3;margin-bottom:2px;text-shadow:0 2px 10px rgba(0,0,0,.45);}
.row-card-hover-btn{
  display:flex;align-items:center;gap:5px;
  padding:10px 18px;font-size:11px;font-weight:700;
  background:#9FE8C3;color:#000;border:none;border-radius:999px;
  transition:all .15s;cursor:pointer;justify-content:center;
}
.row-card-hover-btn:hover{filter:brightness(1.1);}

.no-img-box{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--txd);gap:5px;font-size:10px;background:var(--c3);}
.no-img-icon{font-size:28px;opacity:.25;}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ SEE-ALL MODAL ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.see-all-backdrop{
  position:fixed;inset:0;z-index:600;overflow:hidden;
  background:rgba(0,0,0,.88);backdrop-filter:blur(8px);
  animation:bkin .2s ease;
  overflow-y:auto;
  padding:20px;
  will-change:backdrop-filter;
  transform:translateZ(0);
  contain:layout style paint;
}
.see-all-panel{
  background:var(--c1);border:1px solid var(--grey3);border-radius:20px;
  width:100%;max-width:1100px;margin:0 auto;
  animation:mkin .3s cubic-bezier(.34,1.56,.64,1);
  min-height:80vh;
}
.see-all-head{
  padding:28px 32px 20px;display:flex;align-items:center;justify-content:space-between;
  border-bottom:1px solid var(--grey3);
  position:sticky;top:0;background:var(--c1);border-radius:20px 20px 0 0;z-index:2;
}
.see-all-title{font-family:'DM Serif Display',serif;font-size:26px;display:flex;align-items:center;gap:12px;}
.see-all-search{
  padding:16px 32px;
  border-bottom:1px solid rgba(255,255,255,.04);
}
.see-all-inp{
  width:100%;max-width:420px;
  background:var(--bk);border:1px solid var(--grey3);
  color:var(--tx);padding:11px 16px;font-size:13px;
  outline:none;border-radius:10px;transition:all .2s;
}
.see-all-inp:focus{border-color:var(--acc-border);box-shadow:0 0 0 3px var(--acc-dim);}
.see-all-inp::placeholder{color:var(--txd);}
.see-all-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(148px,1fr));
  gap:16px;
  padding:20px 32px 32px;
}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ MAIN GRID (watchlist) ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.page-header{padding:104px 52px 32px;}
.page-eyebrow{font-size:11px;letter-spacing:3.5px;color:var(--txd);text-transform:uppercase;margin-bottom:8px;}
.page-h1{font-family:'DM Serif Display',serif;font-size:clamp(32px,4vw,56px);line-height:1.1;}
.page-h1 em{color:var(--acc);font-style:italic;}
.page-count{font-size:13px;color:var(--txm);margin-top:8px;}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ CATEGORIES A-Z ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.category-letter{
  font-family:'Bebas Neue',sans-serif;
  font-size:48px;
  font-weight:700;
  color:var(--tx);
  line-height:1;
}
.category-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:8px;
}
.category-item{
  padding:8px 14px;
  background:var(--c2);
  border:1px solid var(--grey3);
  border-radius:8px;
  font-size:12px;
  font-weight:600;
  color:var(--txm);
  transition:all .18s ease;
  cursor:pointer;
  text-align:center;
}
.category-item:hover{
  border-color:var(--acc-border);
  color:var(--acc);
}
.genre-card-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
  gap:16px;
  padding:0 52px 80px;
}
.genre-card{
  height:100px;
  border-radius:14px;
  overflow:hidden;
  cursor:pointer;
  position:relative;
  border:1px solid rgba(255,255,255,.08);
  transition:transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s cubic-bezier(.34,1.56,.64,1);
}
.genre-card-emoji{
  font-size:46px;
  opacity:.15;
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%); 
  pointer-events:none;
  text-shadow:0 0 30px rgba(178,240,197,0.3), 0 0 60px rgba(178,240,197,0.15);
  transition:transform 0.35s cubic-bezier(.34,1.56,.64,1);
  filter:drop-shadow(0 0 8px rgba(178,240,197,0.2));
}
.genre-card:hover .genre-card-emoji{
  transform:translate(-50%,-50%) scale(1.12) translateY(-8px);
}
.genre-card-overlay{
  position:absolute;
  inset:0;
  background:linear-gradient(to top,rgba(0,0,0,.85) 0%, transparent 60%);
}
.genre-card-title{
  position:absolute;
  bottom:14px;
  left:16px;
  font-size:16px;
  font-weight:700;
  color:var(--tx);
}
.genre-card:hover{
  transform:scale(1.04) translateY(-4px);
  box-shadow:0 16px 40px rgba(0,0,0,.6), 0 0 0 1px var(--acc-border);
}
.theme-black .category-item{
  background:var(--c2);
}
.theme-light .category-item{
  background:var(--c2);
  color:#0f172a;
}
.theme-light .category-item:hover{
  color:var(--acc);
}

.stats-strip{
  display:flex;margin:0 52px 4px;
  border:1px solid var(--grey3);border-radius:14px;overflow:hidden;
  background:var(--c1);
}
.stat-chip{
  flex:1;padding:18px 20px;cursor:pointer;transition:background .2s;
  border-right:1px solid var(--grey3);position:relative;overflow:hidden;
}
.stat-chip:last-child{border-right:none;}
.stat-chip:hover{background:rgba(178,240,197,.03);}
.stat-chip.on{background:rgba(178,240,197,.04);}
.stat-chip.on::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:var(--acc);}
.stat-n{font-family:'DM Serif Display',serif;font-size:32px;line-height:1;}
.stat-l{font-size:10px;color:var(--txd);letter-spacing:2.5px;text-transform:uppercase;margin-top:4px;}

.toolbar{padding:20px 52px 0;display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
.search-wrap{position:relative;flex:1;max-width:560px;}
.search-inp{
  width:100%;background:var(--c1);border:1px solid var(--grey3);
  color:var(--tx);padding:12px 18px 12px 46px;font-size:13px;
  outline:none;border-radius:10px;transition:all .2s;
}
.search-inp:focus{border-color:var(--acc-border);box-shadow:0 0 0 3px var(--acc-dim);}
.search-inp::placeholder{color:var(--txd);}
.search-ico{position:absolute;left:15px;top:50%;transform:translateY(-50%);color:var(--txd);font-size:16px;pointer-events:none;}
.spin-ico{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:var(--acc);animation:spin 1s linear infinite;}
@keyframes spin{to{transform:translateY(-50%) rotate(360deg)}}

.drop{
  position:absolute;top:calc(100% + 6px);left:0;right:0;
  background:var(--c2);border:1px solid var(--grey3);border-radius:14px;
  overflow:hidden;box-shadow:0 12px 32px rgba(0,0,0,.5);
  max-height:400px;overflow-y:auto;z-index:300;
  animation:dropIn .15s ease;
}
@keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.drop-row{
  display:flex;align-items:center;gap:12px;padding:10px 14px;
  cursor:pointer;transition:background .15s;
  border-bottom:1px solid rgba(255,255,255,.03);
}
.drop-row:last-child{border-bottom:none;}
.drop-row:hover{background:rgba(178,240,197,.04);}
.drop-img{width:38px;height:54px;object-fit:cover;border-radius:6px;background:var(--c3);flex-shrink:0;}
.drop-ti{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.drop-me{font-size:11px;color:var(--txd);margin-top:2px;}
.drop-tag{font-size:10px;padding:2px 8px;background:var(--acc-dim);color:var(--acc);border:1px solid var(--acc-border);border-radius:4px;text-transform:uppercase;letter-spacing:1px;flex-shrink:0;}

.fil-row{display:flex;gap:6px;flex-wrap:wrap;}
.fil-btn{background:var(--c1);border:1px solid var(--grey3);color:var(--txm);padding:8px 16px;font-size:12px;border-radius:22px;transition:all .15s;letter-spacing:.2px;font-weight:500;}
.fil-btn:hover{border-color:var(--grey2);color:var(--tx);}
.fil-btn.on{background:var(--acc);color:#07100a;border-color:var(--acc);font-weight:600;}
.sort-sel{background:var(--c1);border:1px solid var(--grey3);color:var(--txm);padding:9px 12px;font-size:12px;outline:none;border-radius:8px;margin-left:auto;cursor:pointer;}
.sort-sel:focus{border-color:var(--acc-border);}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ GRID CARDS ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.grid-wrap{padding:22px 52px 100px;}
.grid{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(172px,1fr));gap:18px;
  contain:layout style paint;
  will-change:transform;
}
.grid.small{
  grid-template-columns:repeat(auto-fill,minmax(142px,1fr));gap:14px;
  contain:layout style paint;
}
.grid.large{
  grid-template-columns:repeat(auto-fill,minmax(214px,1fr));gap:22px;
  contain:layout style paint;
}

.card{
  background:var(--c1);border:1px solid rgba(255,255,255,.06);border-radius:16px;
  overflow:hidden;cursor:pointer;position:relative;
  transition:all .3s cubic-bezier(.34,1.56,.64,1);
  animation:cardIn .4s ease both;
  contain:layout style paint;
  will-change:transform,box-shadow;
  transform:translateZ(0);
}
@keyframes cardIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.card::before{
  content:'';position:absolute;inset:0;z-index:1;pointer-events:none;
  background:linear-gradient(135deg,rgba(255,255,255,.04) 0%,transparent 55%);
  border-radius:16px;
}
.card:hover{
  transform:translateY(-6px) scale(1.05);
  border-color:var(--acc-border);
  box-shadow:0 12px 32px rgba(0,0,0,.45),0 0 0 1px var(--acc-border);
}
.card-img-box{position:relative;aspect-ratio:2/3;overflow:hidden;background:var(--c2);}
.card-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease;}
.card:hover .card-img{transform:scale(1.06);}
.card-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(7,16,10,.97) 0%,rgba(7,16,10,.25) 50%,transparent 100%);}
.card-status-tag{
  position:absolute;top:8px;right:8px;
  font-size:9px;letter-spacing:1px;padding:3px 9px;border-radius:20px;
  background:rgba(7,16,10,.92);border:1px solid rgba(178,240,197,.25);
  text-transform:uppercase;font-weight:500;transform:translateZ(0);
}
.card-owner{position:absolute;bottom:8px;left:8px;font-size:10px;color:rgba(255,255,255,.3);letter-spacing:.5px;}
.card-btns{position:absolute;top:8px;left:8px;display:flex;gap:5px;opacity:0;transition:opacity .2s;}
.card:hover .card-btns{opacity:1;}
.card-btn{
  width:28px;height:28px;background:rgba(7,16,10,.88);
  border:1px solid var(--grey3);border-radius:6px;color:var(--tx);font-size:12px;
  display:flex;align-items:center;justify-content:center;transition:all .15s;transform:translateZ(0);
}
.card-btn:hover{background:var(--acc-dim);border-color:var(--acc-border);color:var(--acc);}
.card-body{padding:12px;}
.card-title{font-size:13px;font-weight:500;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px;}
.card-meta-row{display:flex;align-items:center;justify-content:space-between;}
.card-type{font-size:10px;color:var(--txd);letter-spacing:1px;text-transform:uppercase;}
.card-year{font-size:11px;color:var(--txd);}
.card-stars{display:flex;gap:2px;margin-top:6px;}
.s{font-size:11px;color:var(--grey3);}
.s.on{color:var(--gold);}
.card-overview{font-size:11px;color:var(--txm);margin-top:6px;line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
.card-ott-strip{display:flex;gap:4px;flex-wrap:wrap;margin-top:7px;}
.card-ott-dot{
  width:7px;height:7px;border-radius:50%;flex-shrink:0;
  box-shadow:0 0 6px currentColor;
}
.card-ott-label{
  font-size:8px;font-weight:800;padding:2px 7px;border-radius:20px;
  letter-spacing:.6px;color:#fff;
  box-shadow:0 2px 8px rgba(0,0,0,.3);
  border:1px solid rgba(255,255,255,.12);
}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ EMPTY STATE ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.empty-state{grid-column:1/-1;display:flex;flex-direction:column;align-items:center;padding:80px 20px;gap:14px;}
.empty-icon{font-size:52px;opacity:.15;}
.empty-title{font-size:16px;color:var(--txm);font-weight:500;}
.empty-sub{font-size:13px;color:var(--txd);}

.library-shell{padding-top:78px;}
.library-hero{
  margin:0 52px 22px;padding:32px;border-radius:24px;
  background:linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.025)),var(--c1);
  border:1px solid rgba(255,255,255,.1);
  box-shadow:0 24px 70px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.05);
  display:flex;align-items:flex-end;justify-content:space-between;gap:24px;
}
.library-eyebrow{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--txd);margin-bottom:10px;}
.library-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(46px,6vw,78px);line-height:.9;letter-spacing:2px;text-shadow:0 2px 36px rgba(0,0,0,.45);}
.library-subtitle{font-size:15px;color:var(--txm);line-height:1.7;margin-top:12px;max-width:520px;}
.library-total-pill{
  border-radius:999px;padding:10px 16px;border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.06);color:var(--txm);font-size:12px;white-space:nowrap;
  backdrop-filter:blur(10px);
}
.library-dashboard{padding:0 52px 80px;}
.dash-stats{
  display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px;margin-bottom:28px;
}
.dash-stat{
  text-align:left;border-radius:18px;padding:18px;cursor:pointer;
  background:linear-gradient(180deg,rgba(255,255,255,.065),rgba(255,255,255,.025)),var(--c1);
  border:1px solid rgba(255,255,255,.09);color:var(--tx);
  transition:all .2s ease;position:relative;overflow:hidden;
}
.dash-stat::after{content:'';position:absolute;inset:auto 16px 0;height:2px;background:var(--acc);opacity:0;transition:opacity .2s;}
.dash-stat:hover,.dash-stat.on{transform:translateY(-4px);border-color:var(--acc-border);box-shadow:0 16px 42px rgba(0,0,0,.35),0 0 22px var(--acc-glow);}
.dash-stat.on::after{opacity:1;}
.dash-stat-icon{width:34px;height:34px;border-radius:12px;display:grid;place-items:center;background:var(--acc-dim);color:var(--acc);margin-bottom:18px;}
.dash-stat-num{font-family:'DM Serif Display',serif;font-size:34px;line-height:1;color:var(--tx);}
.dash-stat-label{font-size:10px;color:var(--txd);letter-spacing:2px;text-transform:uppercase;margin-top:6px;}
.library-section{margin-top:30px;}
.library-section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:14px;}
.library-section-title{font-family:'DM Serif Display',serif;font-size:24px;color:var(--tx);}
.library-section-count{font-size:11px;color:var(--txd);letter-spacing:2px;text-transform:uppercase;}
.library-rail{display:flex;gap:16px;overflow-x:auto;padding:4px 2px 12px;scroll-behavior:smooth;}
.library-rail-card{
  width:170px;flex:0 0 170px;border-radius:18px;overflow:hidden;cursor:pointer;
  background:var(--c1);border:1px solid rgba(255,255,255,.08);transition:all .2s ease;
}
.library-rail-card:hover{transform:translateY(-5px);border-color:var(--acc-border);box-shadow:0 16px 36px rgba(0,0,0,.38);}
.library-rail-poster{position:relative;aspect-ratio:2/3;background:var(--c2);overflow:hidden;}
.library-rail-poster img{width:100%;height:100%;object-fit:cover;display:block;}
.library-rail-body{padding:12px;}
.library-rail-title{font-size:13px;font-weight:700;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.library-rail-meta{font-size:11px;color:var(--txd);margin-top:5px;display:flex;justify-content:space-between;gap:8px;}
.library-toolbar{
  position:sticky;top:66px;z-index:20;margin:26px 0 6px;padding:14px;
  border-radius:18px;background:rgba(10,17,13,.8);border:1px solid rgba(255,255,255,.09);
  backdrop-filter:blur(16px);box-shadow:0 18px 44px rgba(0,0,0,.25);
}
.library-grid-wrap{padding:18px 0 40px;}
.library-grid-title{font-family:'DM Serif Display',serif;font-size:24px;margin-bottom:14px;color:var(--tx);}
.card-overlay{
  position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;
  background:linear-gradient(to top,rgba(7,16,10,.94),rgba(7,16,10,.35));
  opacity:0;transition:opacity .2s ease;padding:14px;
}
.card:hover .card-overlay{opacity:1;}
.card-action{
  width:100%;border:none;border-radius:999px;padding:9px 12px;font-size:11px;font-weight:800;
  color:var(--bk);background:var(--acc);cursor:pointer;transition:all .15s;
}
.card-action.secondary{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);color:var(--tx);}
.card-action.danger{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:var(--txm);}
.card-action:hover{transform:translateY(-1px);}
.library-empty{
  grid-column:1/-1;display:flex;flex-direction:column;align-items:center;text-align:center;
  padding:84px 24px;border-radius:24px;border:1px solid rgba(255,255,255,.09);
  background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02)),var(--c1);
}
.library-empty-icon{width:76px;height:76px;border-radius:24px;display:grid;place-items:center;background:var(--acc-dim);color:var(--acc);font-size:30px;margin-bottom:20px;}
.library-empty-title{font-family:'DM Serif Display',serif;font-size:30px;color:var(--tx);margin-bottom:8px;}
.library-empty-sub{font-size:14px;color:var(--txm);line-height:1.7;max-width:440px;margin-bottom:22px;}
.insights-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;}
.insight-card{
  border-radius:18px;padding:18px;background:var(--c1);border:1px solid rgba(255,255,255,.08);
}
.insight-value{font-family:'DM Serif Display',serif;font-size:28px;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.insight-label{font-size:10px;color:var(--txd);letter-spacing:2px;text-transform:uppercase;margin-top:8px;}
.profile-page,.list-page{padding:96px 52px 90px;max-width:1440px;margin:0 auto;}
.profile-hero,.list-hero{
  border-radius:28px;padding:34px;background:linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.025)),var(--c1);
  border:1px solid rgba(255,255,255,.1);box-shadow:0 24px 70px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.05);
  display:grid;grid-template-columns:auto 1fr auto;gap:26px;align-items:center;margin-bottom:28px;
}
.profile-avatar{width:118px;height:118px;border-radius:28px;object-fit:cover;background:var(--c2);border:1px solid rgba(255,255,255,.14);display:grid;place-items:center;color:var(--acc);font-size:42px;overflow:hidden;}
.profile-avatar img{width:100%;height:100%;object-fit:cover;display:block;}
.profile-name,.list-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(46px,6vw,78px);line-height:.9;letter-spacing:2px;color:var(--tx);}
.profile-bio,.list-desc{font-size:14px;color:var(--txm);line-height:1.75;max-width:680px;margin-top:10px;}
.profile-meta,.list-meta{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;color:var(--txd);font-size:11px;letter-spacing:1px;text-transform:uppercase;}
.profile-actions{display:flex;gap:10px;align-self:end;flex-wrap:wrap;justify-content:flex-end;}
.premium-btn{border:none;border-radius:999px;padding:11px 18px;background:var(--acc);color:var(--bk);font-weight:800;font-size:12px;transition:all .18s;}
.premium-btn:hover{transform:translateY(-1px);box-shadow:0 10px 24px var(--acc-glow);}
.premium-btn.ghost{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:var(--tx);}
.premium-btn.danger{background:var(--red-dim);border:1px solid rgba(244,112,112,.25);color:var(--red);}
.profile-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:22px;}
.premium-panel{border-radius:22px;padding:22px;background:var(--c1);border:1px solid rgba(255,255,255,.08);box-shadow:0 18px 52px rgba(0,0,0,.24);}
.premium-panel-title{font-family:'DM Serif Display',serif;font-size:24px;margin-bottom:16px;color:var(--tx);}
.profile-stat-grid,.list-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;}
.profile-stat,.list-stat{border-radius:18px;padding:16px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.08);}
.profile-stat-num,.list-stat-num{font-family:'DM Serif Display',serif;font-size:30px;color:var(--tx);}
.profile-stat-label,.list-stat-label{font-size:10px;color:var(--txd);letter-spacing:2px;text-transform:uppercase;margin-top:6px;}
.genre-pill-row{display:flex;gap:8px;flex-wrap:wrap;}
.genre-pill{border-radius:999px;padding:7px 12px;background:var(--acc-dim);border:1px solid var(--acc-border);color:var(--acc);font-size:11px;font-weight:700;}
.activity-list{display:flex;flex-direction:column;gap:10px;}
.activity-item{padding:12px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px;color:var(--txm);}
.activity-item strong{color:var(--tx);}
.custom-list-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;}
.custom-list-card{border-radius:20px;overflow:hidden;background:var(--c1);border:1px solid rgba(255,255,255,.08);cursor:pointer;transition:all .2s;}
.custom-list-card:hover{transform:translateY(-4px);border-color:var(--acc-border);box-shadow:0 16px 38px rgba(0,0,0,.32);}
.custom-list-cover{aspect-ratio:16/9;background:var(--c2);position:relative;overflow:hidden;}
.custom-list-cover img{width:100%;height:100%;object-fit:cover;display:block;}
.custom-list-cover::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.55),transparent);}
.custom-list-body{padding:14px;}
.custom-list-title{font-weight:800;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.custom-list-desc{font-size:12px;color:var(--txm);line-height:1.55;margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.visibility-badge{display:inline-flex;border-radius:999px;padding:4px 9px;font-size:9px;letter-spacing:1px;text-transform:uppercase;border:1px solid rgba(255,255,255,.14);color:var(--txm);background:rgba(255,255,255,.06);}
.visibility-badge.public{color:var(--acc);border-color:var(--acc-border);background:var(--acc-dim);}
.list-item-tools{position:absolute;left:8px;right:8px;bottom:8px;display:flex;gap:6px;z-index:4;opacity:0;transition:opacity .18s;}
.card:hover .list-item-tools{opacity:1;}
.tiny-tool{flex:1;border:none;border-radius:999px;padding:7px 8px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.16);color:var(--tx);font-size:10px;font-weight:800;}
.list-controls{display:grid;grid-template-columns:1fr auto;gap:10px;margin-bottom:18px;}
.list-select{background:var(--bk);border:1px solid var(--grey3);color:var(--tx);border-radius:999px;padding:11px 14px;outline:none;}
.modal-wide{max-width:620px;}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.avatar-upload-row{display:flex;gap:14px;align-items:center;margin-bottom:16px;}
.avatar-preview{width:76px;height:76px;border-radius:20px;background:var(--c2);display:grid;place-items:center;overflow:hidden;border:1px solid var(--grey3);}
.avatar-preview img{width:100%;height:100%;object-fit:cover;}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ LOADER ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.loader{display:flex;align-items:center;justify-content:center;padding:80px;gap:10px;}
.ldot{width:9px;height:9px;border-radius:50%;background:var(--acc);animation:ld 1.3s ease infinite;box-shadow:0 0 12px var(--acc-glow);}
.ldot:nth-child(2){animation-delay:.18s;}
.ldot:nth-child(3){animation-delay:.36s;}
@keyframes ld{0%,80%,100%{transform:scale(.55);opacity:.25}40%{transform:scale(1);opacity:1}}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ MODAL ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.backdrop{
  position:fixed;inset:0;z-index:400;overflow:hidden;
  background:rgba(0,0,0,.88);backdrop-filter:blur(8px);
  display:flex;align-items:center;justify-content:center;padding:20px;
  animation:bkin .2s ease;
  will-change:backdrop-filter;
  transform:translateZ(0);
  contain:layout style paint;
}
@keyframes bkin{from{opacity:0}to{opacity:1}}
.modal{
  background:var(--c1);border:1px solid var(--grey3);border-radius:20px;
  width:100%;max-width:490px;max-height:92vh;overflow-y:auto;
  animation:mkin .28s cubic-bezier(.34,1.56,.64,1);
  box-shadow:0 16px 40px rgba(0,0,0,.5);
}
@keyframes mkin{from{opacity:0;transform:scale(.92) translateY(16px)}to{opacity:1;transform:none}}
.modal-head{padding:24px 24px 0;display:flex;align-items:flex-start;gap:16px;}
.modal-poster{width:72px;height:104px;object-fit:cover;border-radius:9px;background:var(--c2);flex-shrink:0;}
.modal-ti{font-family:'DM Serif Display',serif;font-size:22px;line-height:1.2;margin-bottom:4px;}
.modal-sub{font-size:12px;color:var(--txd);}
.modal-ov{font-size:12px;color:var(--txm);margin-top:6px;line-height:1.65;font-style:italic;}
.modal-body{padding:22px 24px;}
.field{margin-bottom:18px;}
.flbl{font-size:10px;letter-spacing:2.5px;color:var(--txd);text-transform:uppercase;margin-bottom:8px;display:block;}
.finp,.fsel,.fta{
  width:100%;background:var(--bk);border:1px solid var(--grey3);
  color:var(--tx);padding:10px 14px;font-size:13px;
  outline:none;border-radius:9px;transition:border-color .2s;
}
.finp:focus,.fsel:focus,.fta:focus{border-color:var(--acc-border);box-shadow:0 0 0 3px var(--acc-dim);}
.finp::placeholder,.fta::placeholder{color:var(--txd);}
.fta{resize:vertical;min-height:76px;}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.pills{display:flex;gap:7px;flex-wrap:wrap;}
.pill{padding:8px 14px;border-radius:20px;font-size:12px;border:1px solid var(--grey3);color:var(--txd);background:var(--bk);transition:all .15s;font-weight:500;}
.pill.on{font-weight:600;}
.str-row{display:flex;gap:6px;}
.str{font-size:28px;color:var(--grey3);transition:color .15s;cursor:pointer;}
.str:hover,.str.on{color:var(--gold);}
.modal-foot{padding:0 24px 24px;display:flex;gap:8px;}
.btn-add{flex:1;background:var(--acc);color:#07100a;border:none;padding:13px;font-size:13px;font-weight:700;border-radius:9px;transition:all .2s;}
.btn-add:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 8px 24px var(--acc-glow);}
.btn-add:disabled{opacity:.5;cursor:not-allowed;}
.btn-cxl{background:none;color:var(--txm);border:1px solid var(--grey3);padding:13px 18px;font-size:13px;border-radius:9px;transition:all .15s;}
.btn-cxl:hover{border-color:var(--grey2);color:var(--tx);}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ AUTH MODAL ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.auth-modal{
  background:var(--c1);border:1px solid var(--grey3);border-radius:22px;
  width:100%;max-width:420px;padding:42px;
  animation:mkin .28s cubic-bezier(.34,1.56,.64,1);
  box-shadow:0 16px 40px rgba(0,0,0,.5);
}
.auth-logo{font-family:'Bebas Neue',sans-serif;font-size:38px;color:var(--acc);letter-spacing:3px;margin-bottom:4px;text-align:center;text-shadow:0 0 36px var(--acc-glow);}
.auth-logo span{color:var(--tx);}
.auth-sub{font-size:13px;color:var(--txd);text-align:center;margin-bottom:30px;}
.auth-tabs{display:flex;border:1px solid var(--grey3);border-radius:9px;overflow:hidden;margin-bottom:24px;background:var(--bk);}
.auth-tab{flex:1;padding:11px;font-size:13px;background:none;border:none;color:var(--txm);transition:all .15s;font-weight:500;}
.auth-tab.on{background:var(--acc-dim);color:var(--acc);}
.auth-inp{width:100%;background:var(--bk);border:1px solid var(--grey3);color:var(--tx);padding:12px 14px;font-size:13px;outline:none;border-radius:9px;margin-bottom:10px;transition:all .2s;}
.auth-inp:focus{border-color:var(--acc-border);box-shadow:0 0 0 3px var(--acc-dim);}
.auth-inp::placeholder{color:var(--txd);}
.auth-btn{width:100%;background:var(--acc);color:#07100a;border:none;padding:13px;font-size:14px;font-weight:700;border-radius:9px;transition:all .2s;margin-top:6px;}
.auth-btn:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 8px 24px var(--acc-glow);}
.auth-btn:disabled{opacity:.5;cursor:not-allowed;}
.auth-err{font-size:12px;color:var(--red);margin-bottom:10px;padding:10px 14px;background:var(--red-dim);border:1px solid rgba(244,112,112,.2);border-radius:7px;}
.auth-msg{font-size:12px;color:var(--acc);margin-bottom:10px;padding:10px 14px;background:var(--acc-dim);border:1px solid var(--acc-border);border-radius:7px;text-align:center;}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ SETTINGS PANEL ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.settings-panel{
  position:fixed;top:0;right:0;bottom:0;width:min(440px,100vw);z-index:500;
  background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.025)),rgba(7,16,10,.88);
  border-left:1px solid rgba(255,255,255,.14);
  box-shadow:-34px 0 90px rgba(0,0,0,.7);
  backdrop-filter:blur(22px) saturate(135%);
  animation:slideIn .28s cubic-bezier(.34,1.56,.64,1);
  overflow-y:auto;
  color:var(--tx);
}
@keyframes slideIn{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:none}}
.settings-head{
  padding:26px 28px 22px;display:flex;align-items:flex-start;justify-content:space-between;gap:18px;
  border-bottom:1px solid rgba(255,255,255,.08);position:sticky;top:0;
  background:linear-gradient(180deg,rgba(10,17,13,.96),rgba(10,17,13,.78));
  backdrop-filter:blur(18px);z-index:1;
}
.settings-title{font-family:'DM Serif Display',serif;font-size:26px;line-height:1;display:flex;align-items:center;gap:11px;}
.settings-title svg{color:var(--acc);}
.settings-subtitle{font-size:12px;color:var(--txd);margin-top:8px;line-height:1.55;}
.settings-close{width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:50%;color:var(--txm);font-size:15px;transition:all .18s;flex-shrink:0;backdrop-filter:blur(10px);}
.settings-close:hover{border-color:rgba(244,112,112,.45);color:var(--red);background:rgba(244,112,112,.12);transform:translateY(-1px);}
.settings-body{padding:22px 22px 28px;}
.sett-section{
  margin-bottom:16px;padding:18px;border-radius:18px;
  background:linear-gradient(180deg,rgba(255,255,255,.065),rgba(255,255,255,.025));
  border:1px solid rgba(255,255,255,.1);
  box-shadow:0 18px 48px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.05);
}
.sett-section-title{font-size:10px;letter-spacing:3px;color:var(--txd);text-transform:uppercase;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.07);}
.sett-row{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.045);}
.sett-row:last-child{border-bottom:none;}
.sett-label{font-size:13px;color:var(--tx);font-weight:700;letter-spacing:.2px;}
.sett-desc{font-size:11px;color:var(--txd);margin-top:4px;line-height:1.45;max-width:220px;}
.sett-control{margin-top:14px;}
.sett-control-head{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:10px;}
.sett-control-title{font-size:12px;color:var(--tx);font-weight:700;}
.sett-control-hint{font-size:10px;color:var(--txd);letter-spacing:1px;text-transform:uppercase;}
.toggle{
  width:48px;height:27px;border-radius:999px;border:1px solid rgba(255,255,255,.12);position:relative;cursor:pointer;
  background:rgba(255,255,255,.1);transition:all .2s;flex-shrink:0;
}
.toggle.on{background:var(--acc);border-color:transparent;box-shadow:0 0 20px var(--acc-glow);}
.toggle::after{
  content:'';position:absolute;top:3px;left:3px;
  width:19px;height:19px;border-radius:50%;background:#fff;
  transition:transform .2s;box-shadow:0 1px 4px rgba(0,0,0,.3);
}
.toggle.on::after{transform:translateX(21px);background:#07100a;}
.color-swatches{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:10px;}
.swatch{
  width:100%;height:38px;border-radius:12px;cursor:pointer;border:1px solid rgba(255,255,255,.16);
  transition:all .18s;flex-shrink:0;box-shadow:inset 0 1px 0 rgba(255,255,255,.28);
}
.swatch:hover{transform:translateY(-2px);}
.swatch.on{border-color:var(--tx);transform:translateY(-2px);box-shadow:0 0 0 3px rgba(255,255,255,.1),0 12px 22px rgba(0,0,0,.32);}
.card-size-btns{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:8px;}
.size-btn{padding:10px 8px;font-size:11px;font-weight:800;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:var(--txm);border-radius:999px;letter-spacing:.5px;transition:all .15s;}
.size-btn.on{background:var(--acc);border-color:var(--acc);color:#07100a;box-shadow:0 10px 22px var(--acc-glow);}
.theme-pills{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;align-items:center;}
.theme-pill{padding:10px 12px;font-size:11px;font-weight:800;border-radius:999px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);color:var(--txm);cursor:pointer;transition:all .15s;letter-spacing:.4px;}
.theme-pill.on{background:var(--acc);border-color:var(--acc);color:#07100a;box-shadow:0 10px 22px var(--acc-glow);}
.theme-pill:hover,.size-btn:hover{border-color:var(--acc-border);color:var(--acc);}
.theme-pill.on:hover,.size-btn.on:hover{color:#07100a;}
.sett-export-btn{
  width:100%;padding:12px 14px;font-size:12px;font-weight:800;
  background:rgba(255,255,255,.075);border:1px solid rgba(255,255,255,.12);
  color:var(--tx);border-radius:999px;cursor:pointer;
  transition:all .15s;letter-spacing:.3px;margin-top:8px;
}
.sett-export-btn:hover{border-color:var(--acc-border);color:#07100a;background:var(--acc);transform:translateY(-1px);box-shadow:0 10px 24px var(--acc-glow);}
.sett-danger-btn{
  width:100%;padding:12px 14px;font-size:12px;font-weight:800;
  background:rgba(244,112,112,.1);border:1px solid rgba(244,112,112,.24);
  color:var(--red);border-radius:999px;cursor:pointer;
  transition:all .15s;letter-spacing:.3px;margin-top:6px;
}
.sett-danger-btn:hover{background:var(--red-dim);transform:translateY(-1px);}
.sett-note{font-size:11px;color:var(--txd);margin-top:14px;line-height:1.65;}
.sett-about-brand{font-family:'Bebas Neue',sans-serif;letter-spacing:2px;font-size:24px;line-height:1;color:var(--tx);}
.sett-about-brand span{color:var(--acc);}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ TOAST ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.toast{
  position:fixed;bottom:28px;right:28px;z-index:999;
  background:rgba(20,25,30,.95);border:1px solid var(--grey3);border-radius:14px;
  padding:14px 20px;font-size:13px;font-weight:500;
  box-shadow:0 8px 20px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.04);
  display:flex;align-items:center;gap:10px;
  animation:toastIn .32s cubic-bezier(.34,1.56,.64,1);
  will-change:transform;
  transform:translateZ(0);
}
@keyframes toastIn{from{opacity:0;transform:translateY(24px) scale(.93)}to{opacity:1;transform:none}}
.toast-dot{width:8px;height:8px;border-radius:50%;background:var(--acc);flex-shrink:0;box-shadow:0 0 10px var(--acc);}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ SECTION DIVIDER ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.divider{height:1px;background:linear-gradient(to right,transparent,var(--grey3),transparent);margin:4px 52px;}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ TMDB-STYLE SECTIONS ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.tmdb-section{padding:0;}
.main-content{
  margin-top:-40px;
  padding-top:40px;
}
.tmdb-sec-head{
  display:flex;align-items:center;justify-content:space-between;
  padding:0 52px 18px;
}
.tmdb-sec-title-wrap{display:flex;align-items:center;gap:0;}
.tmdb-sec-title{
  font-family:'DM Serif Display',serif;font-size:22px;
  display:flex;align-items:center;gap:10px;cursor:pointer;
  padding-right:16px;
  border-right:1px solid var(--grey3);
  margin-right:0;
}
.tmdb-tabs{display:flex;gap:2px;margin-left:0;}
.tmdb-tab{
  padding:7px 16px;font-size:12px;font-weight:500;
  background:none;border:1px solid transparent;
  border-radius:20px;color:var(--txd);
  transition:all .18s;letter-spacing:.2px;cursor:pointer;
}
.tmdb-tab.on{
  background:var(--acc);color:#07100a;
  font-weight:700;border-color:transparent;
}
.tmdb-tab:hover:not(.on){color:var(--tx);border-color:var(--grey3);}

/* TMDB poster card */
.tmdb-card{
  flex-shrink:0;width:150px;cursor:pointer;
  transition:transform .25s ease, box-shadow .25s ease;
  will-change:transform;
}
.tmdb-card:hover{transform:scale(1.05);}
.tmdb-card-poster{
  position:relative;aspect-ratio:2/3;border-radius:14px;overflow:hidden;
  background:var(--c2);border:1px solid rgba(255,255,255,.06);
  box-shadow:0 4px 16px rgba(0,0,0,.4);
  transition:box-shadow .25s;
}
.tmdb-card:hover .tmdb-card-poster{box-shadow:0 10px 30px rgba(0,0,0,.5),0 0 0 1px var(--acc-border);}
.tmdb-card-poster img{width:100%;height:100%;object-fit:cover;display:block;}
.tmdb-card-poster .card-overlay{
  position:absolute;inset:0;
  background:rgba(0,0,0,.75);
  display:flex;align-items:center;justify-content:center;
  opacity:0;transition:.3s ease;
  z-index:2;transform:translateZ(0);
}
.tmdb-card:hover .card-overlay{opacity:1;}
.tmdb-card-info{padding:20px 4px 8px;}
.tmdb-card-date{font-size:10px;color:var(--txd);margin-bottom:3px;}
.tmdb-card-name{font-size:12px;font-weight:600;line-height:1.35;color:var(--tx);}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ OTT IN MODAL ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
.ott-section{margin-top:4px;padding-top:16px;border-top:1px solid var(--grey3);}
.ott-section-label{
  font-size:10px;letter-spacing:2.5px;color:var(--txd);text-transform:uppercase;margin-bottom:12px;display:block;
}
.ott-logos{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
.ott-logo-link{
  display:flex;align-items:center;justify-content:center;
  padding:8px 14px;border-radius:9px;
  border:1px solid var(--grey3);background:var(--bk);
  transition:all .2s;text-decoration:none;
  min-width:72px;
}
.ott-logo-link:hover{border-color:var(--acc-border);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.4);}
.ott-logo-link img{height:20px;width:auto;object-fit:contain;filter:brightness(1);opacity:.85;transition:opacity .2s;}
.ott-logo-link:hover img{opacity:1;}
.ott-none{font-size:12px;color:var(--txd);font-style:italic;}

@media(max-width:768px){
  .tmdb-sec-head{padding:0 18px 14px;}
  .tmdb-tabs{flex-wrap:wrap;}
}

/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ RESPONSIVE ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
@media(max-width:768px){
  .nav{padding:0 18px;}
  .hero-content{left:18px;right:18px;max-width:none;}
  .sec-header{padding:0 18px 12px;}
  .row-scroll{padding:4px 18px 12px;}
  .stats-strip{margin:0 18px 4px;}
  .toolbar{padding:16px 18px 0;}
  .grid-wrap{padding:18px 18px 80px;}
  .page-header{padding:80px 18px 24px;}
  .divider{margin:4px 18px;}
  .settings-panel{width:100%;}
  .see-all-grid{grid-template-columns:repeat(auto-fill,minmax(130px,1fr));padding:16px 20px 24px;}
  .library-shell{padding-top:72px;}
  .library-hero{margin:0 18px 18px;padding:22px;flex-direction:column;align-items:flex-start;border-radius:20px;}
  .library-title{font-size:52px;}
  .library-dashboard{padding:0 18px 64px;}
  .dash-stats{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
  .dash-stat{padding:15px;}
  .library-toolbar{top:58px;margin-top:18px;padding:12px;}
  .library-toolbar .toolbar{padding:0;}
  .library-toolbar .search-wrap{max-width:none;flex-basis:100%;}
  .sort-sel{margin-left:0;width:100%;}
  .library-rail-card{width:138px;flex-basis:138px;}
  .insights-grid{grid-template-columns:1fr;}
  .profile-page,.list-page{padding:82px 18px 70px;}
  .profile-hero,.list-hero{grid-template-columns:1fr;padding:22px;border-radius:22px;}
  .profile-avatar{width:96px;height:96px;border-radius:22px;}
  .profile-actions{justify-content:flex-start;}
  .profile-grid{grid-template-columns:1fr;}
  .profile-stat-grid,.list-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
  .custom-list-grid{grid-template-columns:1fr;}
  .form-grid,.list-controls{grid-template-columns:1fr;}
}

@media(min-width:769px) and (max-width:1180px){
  .dash-stats{grid-template-columns:repeat(3,minmax(0,1fr));}
  .insights-grid{grid-template-columns:repeat(2,minmax(0,1fr));}
}
`;

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ ICON COMPONENT ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
const Icon = ({ name, size = 16 }) => {
  const icons = {
    left: <FaChevronLeft size={size} />,
    right: <FaChevronRight size={size} />,
    user: <FaUserCircle size={size} />,
    settings: <FaCog size={size} />,
    add: <FaPlus size={size} />,
    search: <FaSearch size={size} />,
    back: <FaArrowLeft size={size} />,
    close: <FaTimes size={size} />,
    star: <FaStar size={size} />,
    check: <FaCheck size={size} />,
    play: <FaPlay size={size} />,
    fire: <FaFire size={size} />,
    eye: <FaEye size={size} />,
    gift: <FaGift size={size} />,
  };
  return icons[name] || null;
};

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ STATUS ICON HELPER ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
const getStatusIcon = (status) => {
  const iconMap = {
    "Watched": "\u2713",
    "Watching": "\u25b6",
    "Want to Watch": "\u25cb",
    "Paused": "II",
    "Dropped": "X",
  };
  return iconMap[status] || status;
};

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ POSTER IMAGE (fetches from TMDB by ID if hardcoded path fails or is null) ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function PosterImage({ item, className, style, alt }) {
  const [src, setSrc] = useState(
    item.poster
      ? `${TMDB_IMG}${item.poster}`
      : item.poster_path
        ? `${TMDB_IMG}${item.poster_path}`
        : item.backdrop_path
          ? `${TMDB_IMG}${item.backdrop_path}`
          : "https://dummyimage.com/300x450/1a1a1a/ffffff&text=No+Image"
  );
  const fetchingRef = useRef(false);

  const fetchByTmdbId = useCallback(async () => {
    if (fetchingRef.current || !item.tmdbId) return;
    fetchingRef.current = true;
    try {
      const type = item.tmdbType || (item.type === "Movie" ? "movie" : "tv");
      const r = await fetch(`${TMDB_BASE}/${type}/${item.tmdbId}?api_key=${TMDB_KEY}`);
      const d = await r.json();
      if (d.poster_path) setSrc(`${TMDB_IMG}${d.poster_path}`);
      else setSrc(null);
    } catch { setSrc(null); }
  }, [item]);

  useEffect(() => {
    if (src || !item.tmdbId) return;
    queueMicrotask(() => {
      fetchByTmdbId();
    });
  }, [fetchByTmdbId, item.tmdbId, src]);

  const handleError = () => {
    if (!fetchingRef.current) fetchByTmdbId();
    else setSrc(null);
  };

  if (!src) {
    const fallbackIcon = item.type === "Anime"
      ? <FaDragon aria-hidden="true" />
      : item.type === "Movie"
        ? <FaFilm aria-hidden="true" />
        : <FaTv aria-hidden="true" />;

    return (
      <div className={className || "no-img-box"} style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"var(--txd)", gap:5, fontSize:10, background:"var(--c3)", ...style }}>
        <div style={{ fontSize:28, opacity:.22 }}>
          {fallbackIcon}
        </div>
        <span style={{ fontSize:9, letterSpacing:1 }}>{item.type}</span>
      </div>
    );
  }

  return <img className={className} style={style} src={src} alt={alt || item.title} loading="lazy" onError={handleError} />;
}

// TMDB SECTION (Trending / What's Popular / Free) 
function TmdbSection({ title, tabs = [], activeTab, onTabChange, items, onSelect, onTypeNav, onSeeAll }) {
  const scrollRef = useRef(null);
  const scroll = dir => scrollRef.current?.scrollBy({ left: dir * 480, behavior:"smooth" });
  const hasTabs = tabs.length > 0;

  return (
    <div className="tmdb-section row-section">
      <div className="tmdb-sec-head">
        <div className="tmdb-sec-title-wrap">
          <div className="tmdb-sec-title">{title}</div>
          {hasTabs && (
            <div className="tmdb-tabs" style={{ marginLeft:16 }}>
              {tabs.map(t => (
                <button key={t.key}
                  className={`tmdb-tab${activeTab === t.key ? " on" : ""}`}
                  onClick={() => onTabChange(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {onSeeAll && (
            <button className="sec-see-all" onClick={onSeeAll}>See all <FaChevronRight size={12} aria-hidden="true" /></button>
          )}
          <div style={{ display:"flex", gap:6 }}>
            <button className="row-arrow-btn" onClick={() => scroll(-1)} style={{ width:32, height:32, borderRadius:50, border:"1px solid var(--grey3)", background:"none", color:"var(--txm)", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }} onMouseOver={e=>e.currentTarget.style.borderColor="var(--acc-border)"} onMouseOut={e=>e.currentTarget.style.borderColor="var(--grey3)"}><FaChevronLeft /></button>
            <button className="row-arrow-btn" onClick={() => scroll(1)}  style={{ width:32, height:32, borderRadius:50, border:"1px solid var(--grey3)", background:"none", color:"var(--txm)", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }} onMouseOver={e=>e.currentTarget.style.borderColor="var(--acc-border)"} onMouseOut={e=>e.currentTarget.style.borderColor="var(--grey3)"}><FaChevronRight /></button>
          </div>
        </div>
      </div>
      <div ref={scrollRef} style={{ display:"flex", gap:16, padding:"16px 52px 28px", overflowX:"auto", scrollBehavior:"smooth", scrollbarWidth:"none" }}>
        {items.map((item, i) => {
          const date = item.year || (item.release_date||item.first_air_date||"").slice(0,10);
          return (
            <div key={item.id || i} className="tmdb-card" onClick={() => onSelect && onSelect(item)}>
              <div className="tmdb-card-poster">
                <PosterImage item={item} className="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                {item.type && (
                  <div
                    className="type-badge"
                    onClick={e => { e.stopPropagation(); onTypeNav && onTypeNav(item.type); }}
                  >
                    {item.type}
                  </div>
                )}
                <div className="card-overlay">
                  <button
                    className="card-add-btn"
                    onClick={e => { e.stopPropagation(); onSelect && onSelect(item); }}
                  >
                    + Add to List
                  </button>
                </div>
              </div>
              <div className="tmdb-card-info">
                <div className="tmdb-card-date">{date}</div>
                <div className="tmdb-card-name">{item.title}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

//  HERO CAROUSEL
function HeroCarousel({ items, onAdd, session, setShowAuth, autoplay = true }) {
  const [fallbackSlides, setFallbackSlides] = useState(HERO_ITEMS);
  const slides = items?.length ? items : fallbackSlides;
  const [idx, setIdx]             = useState(0);
  const [transitioning, setTrans] = useState(false);
  const intervalRef               = useRef(null);

  useEffect(() => {
    if (items?.length) return;
    let cancelled = false;
    const loadTrending = async () => {
      try {
        const r = await fetch(`${TMDB_BASE}/trending/all/week?api_key=${TMDB_KEY}`);
        const d = await r.json();
        const mapped = (d.results || [])
          .filter(r => r.backdrop_path)
          .slice(0, 20)
          .map(r => {
            const isMovie = r.media_type === "movie";
            const year = (r.release_date || r.first_air_date || "").split("-")[0];
            return {
              id: `tr-${r.id}`,
              tmdbId: r.id,
              tmdbType: isMovie ? "movie" : "tv",
              title: r.title || r.name || "Untitled",
              year,
              rating: r.vote_average ? r.vote_average.toFixed(1) : "N/A",
              type: isMovie ? "Movie" : "TV Show",
              poster: r.poster_path,
              backdrop: r.backdrop_path,
              streaming: [],
              overview: r.overview,
            };
          });
        if (!cancelled && mapped.length) setFallbackSlides(mapped);
      } catch {
        /* ignore */
      }
    };
    loadTrending();
    return () => { cancelled = true; };
  }, [items]);

  const goTo = (i) => {
    if (i === idx || transitioning || !slides.length) return;
    setTrans(true);
    setTimeout(() => { setIdx(i); setTrans(false); }, 400);
  };

  useEffect(() => {
    if (!autoplay || slides.length < 2) return;
    intervalRef.current = setInterval(() => {
      setTrans(true);
      setTimeout(() => { setIdx(p => (p + 1) % slides.length); setTrans(false); }, 400);
    }, 6500);
    return () => clearInterval(intervalRef.current);
  }, [autoplay, slides.length]);

  const activeIdx = slides.length ? Math.min(idx, slides.length - 1) : 0;
  const item = slides[activeIdx] || slides[0];
  if (!item) return null;

  return (
    <div className="hero-wrap">
      {slides.map((h, i) => (
        <div key={i}
          className={`hero-bg-img ${i === activeIdx && !transitioning ? "active" : "enter"}`}
          style={{ backgroundImage:`url(${TMDB_HERO}${h.backdrop})`, zIndex: i === activeIdx ? 1 : 0 }}
        />
      ))}
      <div className="hero-overlay" style={{ zIndex:2 }} />
      <div className="hero-content" style={{ zIndex:3 }}>
        <div className="hero-badge"><Icon name="fire" size={14} /> TRENDING NOW</div>
        <div className="hero-title">{item.title}</div>
        <div className="hero-meta">
          <div className="hero-type-tag">{item.type}</div>
          <div className="hero-year">{item.year}</div>
        </div>
        <p className="hero-overview">{item.overview}</p>
        <div className="hero-actions">
          <button className="btn-hero-play" onClick={() => session ? onAdd(item) : setShowAuth(true)}>
            <FaPlus aria-hidden="true" style={{ marginRight: 8 }} />
            Add to List
          </button>
          {item.streaming?.length > 0 && (
            <button className="btn-hero-add" onClick={() => {
              const ottKey = item.streaming[0];
              const ottData = OTT[ottKey];
              if (ottData) {
                window.open(ottData.url + encodeURIComponent(item.title), '_blank');
              }
            }} title="Open in streaming app">
              <FaPlay aria-hidden="true" style={{ marginRight: 8 }} />
              Watch Now
            </button>
          )}
          <button className="btn-hero-add" onClick={() => session ? onAdd(item) : setShowAuth(true)}>
            <FaEye aria-hidden="true" style={{ marginRight: 8 }} />
            More Info
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => goTo((activeIdx - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        style={{
          position: "absolute",
          bottom: "15px",
          left: "20px",
          zIndex: 3,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "white",
          fontSize: "18px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(0,0,0,0.5)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }}
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => goTo((activeIdx + 1) % slides.length)}
        aria-label="Next slide"
        style={{
          position: "absolute",
          bottom: "10px",
          right: "20px",
          zIndex: 2,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "white",
          fontSize: "18px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(0,0,0,0.5)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }}
      >
        ›
      </button>
    </div>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ SEE ALL MODAL ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function SeeAllModal({ title, emoji, items, onClose, onSelect, onTypeNav }) {
  const [q, setQ] = useState("");
  const [headOpacity, setHeadOpacity] = useState(1);
  const backdropRef = useRef(null);
  const filtered  = items.filter(it => it.title.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const handleBackdropScroll = (e) => {
      const scrollY = e.target.scrollTop;
      const opacity = Math.max(0, 1 - scrollY / 120);
      setHeadOpacity(opacity);
    };
    const backdrop = backdropRef.current;
    if (backdrop) {
      backdrop.addEventListener("scroll", handleBackdropScroll, { passive: true });
      return () => backdrop.removeEventListener("scroll", handleBackdropScroll);
    }
  }, []);

  return (
    <div className="see-all-backdrop" ref={backdropRef} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="see-all-panel">
        <div className="see-all-head" style={{ opacity: headOpacity, transition: "opacity 0.1s ease" }}>
          <div className="see-all-title">
            {emoji && <span style={{ marginRight: 8, display: "inline-block", verticalAlign: "middle" }}><Icon name={emoji} size={20} /></span>}
            {title}
            <span style={{ fontSize:12, color:"var(--txm)", fontFamily:"'DM Sans',sans-serif", fontWeight:400, marginLeft:4 }}>{items.length} titles</span>
          </div>
          <button className="settings-close" onClick={onClose}><FaTimes /></button>
        </div>
        <div className="see-all-search">
          <input className="see-all-inp"
            placeholder={`Search in ${title.toLowerCase()}...`}
            value={q} onChange={e => setQ(e.target.value)} autoFocus />
        </div>
        <div className="see-all-grid">
          {filtered.map((item, i) => (
            <div key={item.id} className="row-card" style={{ width:"100%", animationDelay:`${i*.03}s` }}
              onClick={() => { onSelect(item); onClose(); }}>
              <div className="row-card-img-box">
                <PosterImage item={item} className="row-card-img" />
                <div className="row-card-grad" />
                <div
                  className="type-badge"
                  onClick={e => { e.stopPropagation(); onTypeNav && onTypeNav(item.type); }}
                >
                  {item.type}
                </div>
                <div className="row-card-hover">
                  <div className="row-card-hover-title">{item.title}</div>
                  <button
                    className="row-card-hover-btn"
                    onClick={e => { e.stopPropagation(); onSelect && onSelect(item); }}
                  >
                    + Add to List
                  </button>
                </div>
              </div>
              <div className="row-card-body">
                <div className="row-card-title">{item.title}</div>
                <div className="row-card-meta">
                  <div className="row-card-year">{item.year}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ ROW SECTION ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function RowSection({ title, emoji, items, showRank, showOverview, onSelect, onSeeAll, onTypeNav }) {
  const scrollRef      = useRef(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkArrows, { passive:true });
    checkArrows();
    return () => el.removeEventListener("scroll", checkArrows);
  }, [items]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior:"smooth" });
  };

  return (
    <div className="catalog-section row-section">
      <div className="sec-header">
        <div className="sec-title">
          {emoji && <Icon name={emoji} size={20} />}
          {title}
          <span className="sec-count">{items.length}</span>
        </div>
        <button className="sec-see-all" onClick={() => onSeeAll && onSeeAll()}>See all <FaChevronRight size={12} aria-hidden="true" /></button>
      </div>
      <div className="row-section-wrap">
        {canLeft  && <button className="row-arrow row-arrow-left"  onClick={() => scroll(-1)}><FaChevronLeft /></button>}
        {canRight && <button className="row-arrow row-arrow-right" onClick={() => scroll(1)}><FaChevronRight /></button>}
        <div className="row-scroll" ref={scrollRef}>
          {items.map((item, i) => (
            <div key={item.id} className="row-card" onClick={() => onSelect(item)}
              style={{ animationDelay:`${i * 0.04}s` }}>
              <div className="row-card-img-box">
                <PosterImage item={item} className="row-card-img" />
                <div className="row-card-grad" />
                {showRank && <div className="row-card-rank">{i + 1}</div>}
                <div
                  className="type-badge"
                  onClick={e => { e.stopPropagation(); onTypeNav && onTypeNav(item.type); }}
                >
                  {item.type}
                </div>
                {/* Hover overlay */}
                <div className="row-card-hover">
                  <div className="row-card-hover-title">{item.title}</div>
                  <button
                    className="row-card-hover-btn"
                    onClick={e => {
                      e.stopPropagation();
                      onSelect && onSelect(item);
                    }}
                  >
                    + Add to List
                  </button>
                </div>
              </div>
              <div className="row-card-body">
                <div className="row-card-title">{item.title}</div>
                <div className="row-card-meta">
                  <div className="row-card-year">{item.year}</div>
                </div>
                {showOverview && item.overview && (
                  <div style={{ fontSize:10, color:"var(--txd)", marginTop:5, lineHeight:1.5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                    {item.overview}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ SETTINGS PANEL ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function SettingsPanel({ settings, onChange, onClose, onExport, onClearCache, session, onSignOut }) {
  const SWATCHES = [
    { key:"green",  color:"#b2f0c5", label:"Jade"   },
    { key:"yellow", color:"#f4d06f", label:"Gold"   },
    { key:"blue",   color:"#8ebbf5", label:"Cobalt" },
    { key:"red",    color:"#f47070", label:"Ember"  },
    { key:"white",  color:"#ffffff", label:"White"  },
  ];

  return (
    <div className="settings-panel">
      <div className="settings-head">
        <div>
          <div className="settings-title">
            <Icon name="settings" size={20} />
            Settings
          </div>
          <div className="settings-subtitle">
            Tune the way ReelLog looks, moves, and surfaces your library.
          </div>
        </div>
        <button className="settings-close" onClick={onClose} aria-label="Close settings"><FaTimes /></button>
      </div>
      <div className="settings-body">

        <div className="sett-section">
          <div className="sett-section-title">Appearance</div>
          <div className="sett-control" style={{ marginTop:0 }}>
            <div className="sett-control-head">
              <div>
                <div className="sett-control-title">Theme</div>
                <div className="sett-desc">Choose the base atmosphere.</div>
              </div>
              <div className="sett-control-hint">{settings.theme || "black"}</div>
            </div>
            <div className="theme-pills">
              {[
                { key:"black", label:"Black" },
                { key:"light", label:"Light" },
                { key:"neo",   label:"Neo" },
              ].map(t => (
                <button key={t.key}
                  className={`theme-pill${settings.theme === t.key ? " on" : ""}`}
                  onClick={() => onChange("theme", t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="sett-control">
            <div className="sett-control-head">
              <div>
                <div className="sett-control-title">Accent Color</div>
                <div className="sett-desc">Sets buttons, highlights, and focus glow.</div>
              </div>
              <div className="sett-control-hint">{settings.accentColor || "green"}</div>
            </div>
            <div className="color-swatches">
              {SWATCHES.map(s => (
                <div key={s.key} title={s.label}
                  className={`swatch${settings.accentColor === s.key ? " on" : ""}`}
                  style={{ background: s.color }}
                  onClick={() => onChange("accentColor", s.key)}
                />
              ))}
            </div>
          </div>

          <div className="sett-control">
            <div className="sett-control-head">
              <div>
                <div className="sett-control-title">Card Size</div>
                <div className="sett-desc">Adjust browsing density.</div>
              </div>
              <div className="sett-control-hint">{settings.cardSize || "medium"}</div>
            </div>
            <div className="card-size-btns">
              {["small","medium","large"].map(s => (
                <button key={s} className={`size-btn${settings.cardSize === s ? " on" : ""}`}
                  onClick={() => onChange("cardSize", s)}>
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="sett-row" style={{ marginTop:14, paddingBottom:0 }}>
            <div>
              <div className="sett-label">Cinematic Background</div>
              <div className="sett-desc">Film grain & gradient overlay</div>
            </div>
            <button className={`toggle${settings.cinematicBg ? " on" : ""}`}
              onClick={() => onChange("cinematicBg", !settings.cinematicBg)} />
          </div>
        </div>

        <div className="sett-section">
          <div className="sett-section-title">Display</div>
          {[
            { key:"showRatings",       label:"Show Ratings",       desc:"Show IMDb-style star ratings on cards" },
            { key:"showOverviews",     label:"Show Overviews",     desc:"Show plot summary under card title" },
            { key:"showStreaming",     label:"Show Streaming",     desc:"Show OTT platform badges on card hover" },
            { key:"animationsReduced", label:"Reduce Motion",      desc:"Minimize card hover & page animations" },
          ].map(opt => (
            <div key={opt.key} className="sett-row">
              <div>
                <div className="sett-label">{opt.label}</div>
                <div className="sett-desc">{opt.desc}</div>
              </div>
              <button className={`toggle${settings[opt.key] ? " on" : ""}`}
                onClick={() => onChange(opt.key, !settings[opt.key])} />
            </div>
          ))}
        </div>

        <div className="sett-section">
          <div className="sett-section-title">Discovery</div>
          {[
            { key:"autoplay",     label:"Hero Autoplay",   desc:"Auto-rotate the hero banner carousel" },
            { key:"adultContent", label:"Mature Content",  desc:"Include adult-rated titles in search" },
          ].map(opt => (
            <div key={opt.key} className="sett-row">
              <div>
                <div className="sett-label">{opt.label}</div>
                <div className="sett-desc">{opt.desc}</div>
              </div>
              <button className={`toggle${settings[opt.key] ? " on" : ""}`}
                onClick={() => onChange(opt.key, !settings[opt.key])} />
            </div>
          ))}
        </div>

        <div className="sett-section">
          <div className="sett-section-title">Region</div>
          <div className="sett-row">
            <div>
              <div className="sett-label">UI Language</div>
              <div className="sett-desc">Interface language preference</div>
            </div>
            <select className="fsel" style={{ width:"auto" }}
              value={settings.language}
              onChange={e => onChange("language", e.target.value)}>
              <option value="en">English</option>
              <option value="ja">Japanese</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>

        <div className="sett-section">
          <div className="sett-section-title">Data</div>
          <button className="sett-export-btn" onClick={onExport}>Export Catalog JSON</button>
          <button className="sett-export-btn" onClick={onClearCache}>Clear Image Cache</button>
          <div className="sett-note">
            Your data is stored in Supabase and is private to your account. Export creates a JSON backup.
          </div>
        </div>

        {session && (
          <div className="sett-section">
            <div className="sett-section-title">Account</div>
            <div className="sett-row" style={{ paddingTop:0 }}>
              <div>
                <div className="sett-label">Signed in</div>
                <div className="sett-desc">{session?.user?.email || "Your ReelLog account"}</div>
              </div>
            </div>
            <button className="sett-danger-btn" onClick={onSignOut}>Sign Out</button>
          </div>
        )}

        <div className="sett-section">
          <div className="sett-section-title">About</div>
          <div style={{ fontSize:12, color:"var(--txd)", lineHeight:1.8 }}>
            <div className="sett-about-brand" style={{ marginBottom:8 }}>
              <span>Reel</span>log
            </div>
            Powered by TMDB | Built with Supabase<br />
            Streaming data for informational use only.<br />
            Track every film, show &amp; anime you love.
          </div>
        </div>

      </div>
    </div>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ AUTH MODAL ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function ProfilePage({ session, profile, entries, customLists, onEditProfile, onCreateList, onEditList, onDeleteList, onOpenList, onRequireAuth }) {
  if (!session) {
    return (
      <div className="profile-page">
        <div className="library-empty">
          <div className="library-empty-icon"><FaUserCircle /></div>
          <div className="library-empty-title">Your profile is waiting.</div>
          <div className="library-empty-sub">Sign in to build your cinematic profile, lists, and watch history.</div>
          <button className="premium-btn" onClick={onRequireAuth}>Sign In</button>
        </div>
      </div>
    );
  }

  const watched = entries.filter(e => e.status === "Watched");
  const stats = [
    { label:"Movies Watched", value:watched.filter(e => e.type === "Movie").length },
    { label:"TV Shows Watched", value:watched.filter(e => e.type === "TV Show").length },
    { label:"Anime Watched", value:watched.filter(e => e.type === "Anime").length },
    { label:"Total Entries", value:entries.length },
  ];
  const activity = [
    ...entries.slice(0, 4).map(e => `${e.status === "Watched" ? "Watched" : "Added"} ${e.title}`),
    ...customLists.slice(0, 3).map(l => `Created list "${l.title}"`),
  ].slice(0, 6);

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-avatar">{profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.username} /> : <FaUserCircle />}</div>
        <div>
          <div className="library-eyebrow">ReelLog profile</div>
          <div className="profile-name">{profile.username}</div>
          <div className="profile-bio">{profile.bio || "A quiet corner for everything worth watching."}</div>
          <div className="profile-meta"><span>Joined {profile.joinedDate}</span><span>{entries.length} entries</span><span>{customLists.length} lists</span></div>
        </div>
        <div className="profile-actions">
          <button className="premium-btn ghost" onClick={onCreateList}>New List</button>
          <button className="premium-btn" onClick={onEditProfile}>Edit Profile</button>
        </div>
      </section>

      <div className="profile-grid">
        <div className="premium-panel">
          <div className="premium-panel-title">Watched Statistics</div>
          <div className="profile-stat-grid">
            {stats.map(stat => <div key={stat.label} className="profile-stat"><div className="profile-stat-num">{stat.value}</div><div className="profile-stat-label">{stat.label}</div></div>)}
          </div>
        </div>
        <div className="premium-panel">
          <div className="premium-panel-title">Favorite Genres</div>
          <div className="genre-pill-row">
            {(profile.favoriteGenres?.length ? profile.favoriteGenres : ["Drama", "Sci-Fi", "Anime"]).map(g => <span key={g} className="genre-pill">{g}</span>)}
          </div>
        </div>
      </div>

      <section className="library-section">
        <div className="library-section-head"><div className="library-section-title">Custom Lists</div><button className="premium-btn ghost" onClick={onCreateList}>Create List</button></div>
        <div className="custom-list-grid">
          {customLists.map(list => (
            <div key={list.id} className="custom-list-card">
              <div onClick={() => onOpenList(list.id)}>
                <div className="custom-list-cover">{list.cover ? <img src={list.cover} alt={list.title} /> : null}</div>
                <div className="custom-list-body">
                  <span className={`visibility-badge ${list.visibility === "public" ? "public" : ""}`}>{list.visibility}</span>
                  <div className="custom-list-title" style={{ marginTop:8 }}>{list.title}</div>
                  <div className="custom-list-desc">{list.description || "No description yet."}</div>
                  <div className="library-section-count" style={{ marginTop:10 }}>{list.items?.length || 0} titles</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, padding:"0 14px 14px" }}>
                <button className="premium-btn ghost" style={{ flex:1 }} onClick={() => onEditList(list)}>Edit</button>
                <button className="premium-btn danger" style={{ flex:1 }} onClick={() => onDeleteList(list.id)}>Delete</button>
              </div>
            </div>
          ))}
          {customLists.length === 0 && <div className="library-empty"><div className="library-empty-icon"><FaList /></div><div className="library-empty-title">No lists yet.</div><div className="library-empty-sub">Create themed collections like Best Sci-Fi Movies, Comfort Anime, or a 2026 Watchlist.</div><button className="premium-btn" onClick={onCreateList}>Create Your First List</button></div>}
        </div>
      </section>

      <section className="library-section">
        <div className="library-section-head"><div className="library-section-title">Recent Activity</div><div className="library-section-count">Latest updates</div></div>
        <div className="premium-panel"><div className="activity-list">{(activity.length ? activity : ["Started building a ReelLog profile"]).map((item, idx) => <div key={`${item}-${idx}`} className="activity-item"><strong>{item}</strong></div>)}</div></div>
      </section>
    </div>
  );
}

function ListDetailPage({ session, customLists, entries, onOpenEntry, onEditList, onDeleteList, onAddItem, onRemoveItem, onMoveItem, onRequireAuth }) {
  const { id } = useParams();
  const list = customLists.find(l => String(l.id) === String(id));
  if (!list || (list.visibility !== "public" && (!session || list.ownerId !== session.user.id))) {
    return <div className="list-page"><div className="library-empty"><div className="library-empty-icon"><FaShieldAlt /></div><div className="library-empty-title">List unavailable.</div><div className="library-empty-sub">This list is private or no longer exists.</div>{!session && <button className="premium-btn" onClick={onRequireAuth}>Sign In</button>}</div></div>;
  }
  const listItems = (list.items || []).map(itemId => entries.find(e => String(e.id) === String(itemId))).filter(Boolean);
  const isOwner = session && list.ownerId === session.user.id;
  return (
    <div className="list-page">
      <section className="list-hero">
        <div className="custom-list-cover" style={{ width:220, borderRadius:20 }}>{list.cover ? <img src={list.cover} alt={list.title} /> : null}</div>
        <div>
          <span className={`visibility-badge ${list.visibility === "public" ? "public" : ""}`}>{list.visibility}</span>
          <div className="list-title" style={{ marginTop:12 }}>{list.title}</div>
          <div className="list-desc">{list.description || "A curated ReelLog list."}</div>
          <div className="list-meta"><span>By {list.ownerName || "ReelLog user"}</span><span>{listItems.length} titles</span></div>
        </div>
        {isOwner && <div className="profile-actions"><button className="premium-btn ghost" onClick={() => onEditList(list)}>Edit List</button><button className="premium-btn danger" onClick={() => onDeleteList(list.id)}>Delete</button></div>}
      </section>
      {isOwner && <div className="premium-panel" style={{ marginBottom:22 }}><div className="premium-panel-title">Add Titles</div><div className="list-controls"><select className="list-select" onChange={e => e.target.value && onAddItem(list.id, e.target.value)} defaultValue=""><option value="">Choose from your library...</option>{entries.map(entry => <option key={entry.id} value={entry.id}>{entry.title}</option>)}</select><button className="premium-btn ghost" onClick={() => onEditList(list)}>Edit Details</button></div></div>}
      <div className="grid">
        {listItems.length === 0 && <div className="library-empty"><div className="library-empty-icon"><FaFilm /></div><div className="library-empty-title">This list is empty.</div><div className="library-empty-sub">Add titles from your library to start shaping the collection.</div></div>}
        {listItems.map((entry, index) => (
          <div key={entry.id} className="card" onClick={() => onOpenEntry(entry)}>
            <div className="card-img-box">
              {entry.poster ? <img className="card-img" src={`${TMDB_IMG}${entry.poster}`} alt={entry.title} loading="lazy" onError={e => { e.currentTarget.style.display="none"; }} /> : <div className="no-img-box"><div className="no-img-icon">{entry.type === "Movie" ? "M" : entry.type === "Anime" ? "A" : "TV"}</div><span>{entry.type}</span></div>}
              <div className="card-grad" />
              <div className="card-status-tag" style={{ color:SCOLOR[entry.status], borderColor:SCOLOR[entry.status]+"44" }}>{getStatusIcon(entry.status)} {entry.status}</div>
              {isOwner && <div className="list-item-tools" onClick={e => e.stopPropagation()}><button className="tiny-tool" onClick={() => onMoveItem(list.id, index, -1)}>Up</button><button className="tiny-tool" onClick={() => onMoveItem(list.id, index, 1)}>Down</button><button className="tiny-tool" onClick={() => onRemoveItem(list.id, entry.id)}>Remove</button></div>}
            </div>
            <div className="card-body"><div className="card-title">{entry.title}</div><div className="card-meta-row"><span className="card-type">{entry.type}</span><span className="card-year">{entry.year}</span></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthModal({ onClose }) {
  const [tab, setTab]         = useState("signin");
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");
  const [msg, setMsg]         = useState("");
  const [googleHover, setGoogleHover] = useState(false);

  async function handleAuth() {
    setErr(""); setMsg(""); setLoading(true);
    try {
      if (tab === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password: pass, options:{ data:{ name } } });
        if (error) throw error;
        setMsg("Check your email to confirm your account!");
      }
    } catch (e) { setErr(e.message); }
    setLoading(false);
  }

  return (
    <div className="backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <div className="auth-logo">Reel<span>log</span></div>
        <div className="auth-sub">{tab === "signin" ? "Welcome back!" : "Create your free account"}</div>
        <div className="auth-tabs">
          <button className={`auth-tab${tab === "signin" ? " on" : ""}`}
            onClick={() => { setTab("signin"); setErr(""); setMsg(""); }}>Sign in</button>
          <button className={`auth-tab${tab === "signup" ? " on" : ""}`}
            onClick={() => { setTab("signup"); setErr(""); setMsg(""); }}>Sign up</button>
        </div>
        {err && <div className="auth-err">{err}</div>}
        {msg && <div className="auth-msg">{msg}</div>}
        {tab === "signup" && (
          <input className="auth-inp" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        )}
        <button
          type="button"
          onClick={async () => {
            setErr(""); setMsg(""); setLoading(true);
            try {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: window.location.origin },
              });
              if (error) throw error;
            } catch (e) {
              setErr(e.message);
            }
            setLoading(false);
          }}
          onMouseEnter={() => setGoogleHover(true)}
          onMouseLeave={() => setGoogleHover(false)}
          disabled={loading}
          style={{
            background: "var(--c2)",
            border: `1px solid ${googleHover ? "var(--acc-border)" : "var(--grey3)"}`,
            color: googleHover ? "var(--acc)" : "var(--tx)",
            padding: "12px",
            borderRadius: "9px",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            cursor: "pointer",
            transition: "all .2s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272.1v95.6h147.4c-6.4 34.6-25.1 63.9-53.5 83.5v69.6h86.4c50.7-46.7 80-115.4 80-198.3z" />
            <path fill="#34A853" d="M272.1 544.3c72.6 0 133.7-24.2 178.3-65.7l-86.4-69.6c-24.1 16.1-55 25.6-91.9 25.6-70.7 0-130.7-47.7-152.1-111.7H33.1v70.2c44.4 87.9 136.7 151.2 239 151.2z" />
            <path fill="#FBBC05" d="M120 323.9c-10.6-31.6-10.6-65.8 0-97.4V156.3H33.1c-39.2 78.6-39.2 171.3 0 249.8l86.9-82.2z" />
            <path fill="#EA4335" d="M272.1 107.7c39.6 0 75.3 13.6 103.4 40.3l77.5-77.5C401.2 24.2 341.5 0 272.1 0 169.8 0 77.5 63.3 33.1 151.2l86.9 70.2c21.4-64 81.4-111.7 152.1-111.7z" />
          </svg>
          Continue with Google
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "16px 0" }}>
          <span style={{ flex: 1, height: "1px", background: "var(--grey3)" }} />
          <span style={{ color: "var(--txd)", fontSize: "11px", letterSpacing: "1px" }}>or</span>
          <span style={{ flex: 1, height: "1px", background: "var(--grey3)" }} />
        </div>
        <input className="auth-inp" placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="auth-inp" placeholder="Password" type="password" value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAuth()} />
        <button className="auth-btn" onClick={handleAuth} disabled={loading}>
          {loading ? "Loading..." : tab === "signin" ? "Sign in ->" : "Create account ->"}
        </button>
      </div>
    </div>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ CATEGORY PAGE ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function CategoryPage({ allItems, onSelect, PosterImageComponent, onTypeNav }) {
  const navigate = useNavigate();

  // Read :type param from the URL via react-router
  const pathParts = window.location.pathname.split("/category/");
  const rawType   = pathParts[1] ? decodeURIComponent(pathParts[1]) : "";

  const baseLabel =
    rawType === "movie"   ? "Movie"   :
    rawType === "tv-show" ? "TV Show" :
    rawType === "anime"   ? "Anime"   :
    rawType === "categories" ? "Categories" : "";

  const isCategoryView = rawType === "categories";
  const [q, setQ] = useState("");
  const [showCategoryPanel, setShowCategoryPanel] = useState(isCategoryView);

  const slugify = useCallback((str) => (
    (str || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  ), []);

  const categoryGroups = useMemo(() => ({
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
  }), []);

  const filteredCategoryGroups = useMemo(() => {
    const search = q.trim().toLowerCase();
    const next = {};
    Object.entries(categoryGroups).forEach(([letter, list]) => {
      const filteredList = search ? list.filter(name => name.toLowerCase().includes(search)) : list;
      if (filteredList.length) next[letter] = filteredList;
    });
    return next;
  }, [categoryGroups, q]);

  const orderedLetters = useMemo(() => Object.keys(categoryGroups), [categoryGroups]);
  const visibleLetters = orderedLetters.filter(l => filteredCategoryGroups[l]?.length);

  const activeCategorySlug = (!["movie","tv-show","anime","categories"].includes(rawType) && rawType) ? rawType : null;
  const label = activeCategorySlug
    ? activeCategorySlug.split("-").map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(" ")
    : baseLabel;

  const items = useMemo(() => {
    const baseItems = baseLabel
      ? (allItems || []).filter(i => (i.type || "").toLowerCase() === baseLabel.toLowerCase())
      : (allItems || []);
    if (activeCategorySlug) {
      return baseItems.filter(item =>
        (item.categories || []).some(cat => slugify(cat) === activeCategorySlug)
      );
    }
    return baseItems;
  }, [allItems, baseLabel, activeCategorySlug, slugify]);

  const filtered = useMemo(() =>
    items.filter(i => i.title?.toLowerCase().includes(q.toLowerCase()))
  , [items, q]);

  if (isCategoryView) {
    return (
      <div style={{ paddingTop:86, minHeight:"100vh", background:"var(--bk)" }}>
        <div style={{ padding:"48px 52px 72px" }}>
          <div style={{ marginBottom:22 }}>
            <div className="browse-grid">
              <div className="browse-item" onClick={() => setShowCategoryPanel(true)}>
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span className="browse-label">Category</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="6" cy="12" r="2"></circle>
                  <circle cx="18" cy="12" r="2"></circle>
                  <path d="M8 12h8"></path>
                </svg>
                <span className="browse-label">Genre</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 3v18M3 12h18"></path>
                </svg>
                <span className="browse-label">Country</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v20M2 8h20M2 12h20M2 16h20"></path>
                </svg>
                <span className="browse-label">Language</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="7" r="2.5"></circle>
                  <circle cx="15" cy="7" r="2.5"></circle>
                  <path d="M9 11v2c0 1-1 2-2 2H3v-2c0-2 2-4 6-4s6 2 6 4v2h-4c-1 0-2-1-2-2v-2"></path>
                  <circle cx="15" cy="14" r="2.5"></circle>
                  <path d="M18 19v-2c0-1.5-1.5-3-3-3h-2v-2"></path>
                </svg>
                <span className="browse-label">Family Friendly</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2l3.5 8h8.5l-6.5 5 2.5 8-7-5-7 5 2.5-8L0 10h8.5L12 2z"></path>
                </svg>
                <span className="browse-label">Award Winners</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-5-6.5 5 2-7L2 9h7l3-7z"></path>
                </svg>
                <span className="browse-label">Moctale Select</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2C6 2 6 5 6 8v4h12V8c0-3 0-6-6-6z"></path>
                  <path d="M6 12v2h12v-2M8 16h8v4H8z"></path>
                  <circle cx="10" cy="18" r="0.5" fill="currentColor"></circle>
                  <circle cx="14" cy="18" r="0.5" fill="currentColor"></circle>
                </svg>
                <span className="browse-label">Anime</span>
              </div>
              <div className="browse-item">
                <svg className="browse-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 5h4v14H4zM10 5h4v14h-4zM16 5h4v14h-4z"></path>
                </svg>
                <span className="browse-label">Franchise</span>
              </div>
            </div>
          </div>

          {showCategoryPanel && (
            <div style={{ marginTop:28 }}>
              <div className="divider" style={{ marginBottom:22 }} />
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:18, marginBottom:18 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                  <button
                    className="btn-outline"
                    style={{ borderRadius:9999, padding:"10px 14px", background:"var(--c2)", color:"var(--tx)" }}
                    onClick={() => setShowCategoryPanel(false)}
                  >
                    {"< Back"}
                  </button>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"var(--tx)", lineHeight:1 }}>Categories</div>
                </div>
                <input
                  className="search-inp"
                  style={{ maxWidth:320, borderRadius:9999, background:"var(--c1)" }}
                  placeholder="Search category"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                />
              </div>

              {visibleLetters.map((letter, idx) => (
                <div key={letter}>
                  {idx > 0 && <div className="divider" style={{ margin:"14px 0" }} />}
                  <div style={{ display:"grid", gridTemplateColumns:"72px 1fr", gap:"18px", alignItems:"flex-start", padding:"6px 0" }}>
                    <div className="category-letter">{letter}</div>
                    <div className="category-grid">
                      {filteredCategoryGroups[letter].map(cat => (
                        <button
                          key={`${letter}-${cat}`}
                          className="category-item"
                          onClick={() => navigate(`/category/${slugify(cat)}`)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop:86, minHeight:"100vh" }}>
      <div className="page-header">
        <div className="page-eyebrow">Browse</div>
        <div className="page-h1">{label || "All"} <em>Titles</em></div>
        <div className="page-count">{filtered.length} titles</div>
      </div>
      <div style={{ padding:"0 52px 16px" }}>
        <input
          className="see-all-inp"
          style={{ maxWidth:420 }}
          placeholder={`Search ${label || "all"}...`}
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>
      <div className="see-all-grid" style={{ padding:"8px 52px 80px" }}>
        {filtered.map((item, i) => (
          <div key={item.id || i} className="row-card" style={{ width:"100%", animationDelay:`${i*.03}s` }}
            onClick={() => onSelect && onSelect(item)}>
            <div className="row-card-img-box">
              {PosterImageComponent
                ? <PosterImageComponent item={item} className="row-card-img" />
                : item.poster
                  ? <img className="row-card-img" src={`https://image.tmdb.org/t/p/w300${item.poster}`} alt={item.title} loading="lazy" />
                  : <div className="no-img-box"><span style={{ fontSize:28, opacity:.22 }}><FaFilm aria-hidden="true" /></span></div>}
              <div className="row-card-grad" />
              <div
                className="type-badge"
                onClick={e => { e.stopPropagation(); onTypeNav && onTypeNav(item.type); }}
              >
                {item.type}
              </div>
              <div className="row-card-hover">
                <div className="row-card-hover-title">{item.title}</div>
                <button
                  className="row-card-hover-btn"
                  onClick={e => { e.stopPropagation(); onSelect && onSelect(item); }}
                >
                  + Add to List
                </button>
              </div>
            </div>
            <div className="row-card-body">
              <div className="row-card-title">{item.title}</div>
              <div className="row-card-meta">
                <div className="row-card-year">{item.year}</div>
                {item.rating > 0 && (
                  <div className="row-card-rating" style={{ display:"inline-flex", alignItems:"center", gap:4 }}>
                    <FaStar size={11} aria-hidden="true" />
                    {parseFloat(item.rating).toFixed(1)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenrePage({ onSelect, PosterImageComponent, onTypeNav }) {
  const navigate = useNavigate();
  const { slug = "" } = useParams();
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const activeGenre = useMemo(
    () => EXPLORE_GENRE_CARDS.find(g => toGenreSlug(g.name) === slug.toLowerCase()),
    [slug]
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!activeGenre) {
        setItems([]);
        setLoading(false);
        setErr("Genre not found.");
        return;
      }
      setLoading(true);
      setErr("");
      try {
        let discoverParam = "";
        if (activeGenre.tmdbGenreId) {
          discoverParam = `with_genres=${activeGenre.tmdbGenreId}`;
        } else if (activeGenre.keywordQuery) {
          const kwUrl = `${TMDB_BASE}/search/keyword?api_key=${TMDB_KEY}&query=${encodeURIComponent(activeGenre.keywordQuery)}`;
          const kwRes = await fetch(kwUrl).then(r => r.json()).catch(() => null);
          const keywordId = kwRes?.results?.[0]?.id;
          if (!keywordId) {
            if (!cancelled) {
              setItems([]);
              setErr(`No TMDB keyword found for ${activeGenre.name}.`);
              setLoading(false);
            }
            return;
          }
          discoverParam = `with_keywords=${keywordId}`;
        }

        const movieUrl = `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&${discoverParam}`;
        const tvUrl = `${TMDB_BASE}/discover/tv?api_key=${TMDB_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&${discoverParam}`;

        const [movieRes, tvRes] = await Promise.all([
          fetch(movieUrl).then(r => r.json()).catch(() => null),
          fetch(tvUrl).then(r => r.json()).catch(() => null),
        ]);

        const toCard = (r, tmdbType) => ({
          id: `${tmdbType}-${r.id}`,
          tmdbId: r.id,
          tmdbType,
          title: r.title || r.name || "",
          year: (r.release_date || r.first_air_date || "").slice(0, 4),
          rating: r.vote_average || 0,
          type: tmdbType === "movie" ? "Movie" : "TV Show",
          poster: r.poster_path,
          backdrop: r.backdrop_path,
          overview: r.overview || "",
          streaming: [],
          categories: [activeGenre.name],
        });

        const merged = [
          ...(movieRes?.results || []).map(r => toCard(r, "movie")),
          ...(tvRes?.results || []).map(r => toCard(r, "tv")),
        ].filter(item => item.title);

        if (!cancelled) {
          setItems(merged);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e?.message || "Failed to load genre titles.");
          setLoading(false);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [activeGenre]);

  const filtered = useMemo(
    () => items.filter(i => i.title.toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );

  if (!activeGenre) {
    return (
      <div style={{ paddingTop:86, minHeight:"100vh" }}>
        <div className="page-header">
          <div className="page-eyebrow">Browse</div>
          <div className="page-h1">Genre <em>Not Found</em></div>
          <div className="page-count">0 titles</div>
        </div>
        <div style={{ padding:"0 52px 40px" }}>
          <button className="btn-outline" onClick={() => navigate("/")} style={{ padding:"10px 16px", borderRadius:10 }}>
            {"? Back"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop:86, minHeight:"100vh" }}>
      <div className="page-header">
        <div className="page-eyebrow">Genre</div>
        <div className="page-h1">{activeGenre.name} <em>Titles</em></div>
        <div className="page-count">{loading ? "Loading..." : `${filtered.length} titles`}</div>
      </div>
      <div style={{ padding:"0 52px 16px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
        <button className="btn-outline" onClick={() => navigate("/")} style={{ padding:"10px 14px", borderRadius:9999 }}>
          {"? Back"}
        </button>
        <input
          className="see-all-inp"
          style={{ maxWidth:420 }}
          placeholder="Search genre titles..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {err && <div style={{ padding:"0 52px 18px", color:"var(--red)" }}>{err}</div>}

      <div className="see-all-grid" style={{ padding:"8px 52px 80px" }}>
        {!loading && filtered.map((item, i) => (
          <div key={item.id || i} className="row-card" style={{ width:"100%", animationDelay:`${i*.03}s` }}
            onClick={() => onSelect && onSelect(item)}>
            <div className="row-card-img-box">
              {PosterImageComponent ? (  
                <PosterImageComponent item={item} className="row-card-img" />
              ) : item.poster ? (
                <img 
                  className="row-card-img" 
                  src={`https://image.tmdb.org/t/p/w300${item.poster}`} 
                  alt={item.title} 
                      loading="lazy" 
                    />
              ) : null}     
              <div className="row-card-grad" />
              <div
                className="type-badge"
                onClick={e => { e.stopPropagation(); onTypeNav && onTypeNav(item.type); }}
              >
                {item.type}
              </div>
              <div className="row-card-hover">
                <div className="row-card-hover-title">{item.title}</div>
                <button
                  className="row-card-hover-btn"
                  onClick={e => { e.stopPropagation(); onSelect && onSelect(item); }}
                >
                  + Add to List
                </button>
              </div>
            </div>
            <div className="row-card-body">
              <div className="row-card-title">{item.title}</div>
              <div className="row-card-meta">
                <div className="row-card-year">{item.year}</div>
                {item.rating > 0 && (
                  <div className="row-card-rating" style={{ display:"inline-flex", alignItems:"center", gap:4 }}>
                    <FaStar size={11} aria-hidden="true" />
                    {parseFloat(item.rating).toFixed(1)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ MAIN APP ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
export default function App() {
  const [allEntries, setAllEntries] = useState([]);
  const [myEntries,  setMyEntries]  = useState([]);
  const [loading, setLoading]       = useState(true);

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ settings ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  const [settings, setSettings] = useState(() => {
    try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("rl_settings") || "{}") }; }
    catch { return DEFAULT_SETTINGS; }
  });
  const scrollRef = useRef(0);
  const initialMountRef = useRef(true);
  const [showSettings, setShowSettings] = useState(false);
  const [heroItems, setHeroItems] = useState(HERO_ITEMS);
  const [homeAnime, setHomeAnime] = useState(STATIC_ANIME);
  const [homeMovies, setHomeMovies] = useState(STATIC_MOVIES);
  const [homeSeries, setHomeSeries] = useState(STATIC_SERIES);
  const [homeTrending, setHomeTrending] = useState([]);
  const [homePopular, setHomePopular] = useState([]);
  const [homeFree, setHomeFree] = useState([]);
  const [trendMode, setTrendMode] = useState("day");
  const [popularMode, setPopularMode] = useState("streaming");
  const [freeMode, setFreeMode] = useState("movies");

  function changeSetting(key, val) {
    setSettings(p => {
      const next = { ...p, [key]: val };
      localStorage.setItem("rl_settings", JSON.stringify(next));
      return next;
    });
  }

  const accentClass =
    settings.accentColor === "yellow" ? "acc-yellow" :
    settings.accentColor === "blue"   ? "acc-blue"   :
    settings.accentColor === "red"    ? "acc-red"    :
    settings.accentColor === "white"  ? "acc-white"  : "";

  const navigate = useNavigate();

  const handleTypeNav = (type) => {
    const slug = (type || "").toLowerCase().replace(/\s+/g, "-");
    navigate(`/category/${slug}`);
  };

  useEffect(() => {
    const saveScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", saveScroll);
    return () => window.removeEventListener("scroll", saveScroll);
  }, []);

  const updateListIfChanged = useCallback((setter, next) => {
    if (!Array.isArray(next)) return;
    setter(prev => {
      const prevLen = prev?.length || 0;
      const nextLen = next.length;
      const prevFirst = prevLen ? prev[0]?.id : null;
      const nextFirst = nextLen ? next[0]?.id : null;
      return (prevLen !== nextLen || prevFirst !== nextFirst) ? next : prev;
    });
  }, []);

  const fetchTrendingByMode = useCallback(async (mode) => {
    const lang = settings.language || "en";
    const res = await fetch(`${TMDB_BASE}/trending/all/${mode}?api_key=${TMDB_KEY}&language=${lang}`).then(r => r.json()).catch(() => null);
    if (res?.results?.length) {
      const mapR = r => {
        const title = r.title || r.name || "";
        const mediaType = r.media_type || "movie";
        return { id:r.id, tmdbId:r.id, tmdbType:mediaType, title, year:(r.release_date||r.first_air_date||"").slice(0,4), rating:r.vote_average, type:mediaType==="movie"?"Movie":"TV Show", poster:r.poster_path, backdrop:r.backdrop_path, overview:r.overview, streaming:[], _rawId:r.id, _type:mediaType };
      };
      updateListIfChanged(setHomeTrending, res.results.slice(0,20).map(mapR));
    }
  }, [settings.language, updateListIfChanged]);

  const fetchPopularByMode = useCallback(async (mode) => {
    const lang = settings.language || "en";
    const POPULAR_ENDPOINTS = {
      streaming: `${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}&language=${lang}&region=IN`,
      tv:        `${TMDB_BASE}/tv/popular?api_key=${TMDB_KEY}&language=${lang}`,
      rent:      `${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&language=${lang}&with_watch_monetization_types=rent&watch_region=IN&sort_by=popularity.desc`,
      theaters:  `${TMDB_BASE}/movie/now_playing?api_key=${TMDB_KEY}&language=${lang}&region=IN`,
    };
    const res = await fetch(POPULAR_ENDPOINTS[mode] || POPULAR_ENDPOINTS.streaming).then(r => r.json()).catch(() => null);
    if (res?.results?.length) {
      const typeLabel = mode === "tv" ? "TV Show" : "Movie";
      const mapR = r => ({ id:r.id, tmdbId:r.id, tmdbType:mode==="tv"?"tv":"movie", title:r.title||r.name||"", year:(r.release_date||r.first_air_date||"").slice(0,4), rating:r.vote_average, type:typeLabel, poster:r.poster_path, backdrop:r.backdrop_path, overview:r.overview, streaming:[], _rawId:r.id, _type:mode==="tv"?"tv":"movie" });
      updateListIfChanged(setHomePopular, res.results.slice(0,20).map(mapR));
    }
  }, [settings.language, updateListIfChanged]);

  const fetchFreeByMode = useCallback(async (mode) => {
    const lang = settings.language || "en";
    const freeType = mode === "movies" ? "movie" : "tv";
    const res = await fetch(`${TMDB_BASE}/discover/${freeType}?api_key=${TMDB_KEY}&language=${lang}&with_watch_monetization_types=free&watch_region=IN&sort_by=popularity.desc`).then(r => r.json()).catch(() => null);
    if (res?.results?.length) {
      const typeLabel = mode === "movies" ? "Movie" : "TV Show";
      const mapR = r => ({ id:r.id, tmdbId:r.id, tmdbType:freeType, title:r.title||r.name||"", year:(r.release_date||r.first_air_date||"").slice(0,4), rating:r.vote_average, type:typeLabel, poster:r.poster_path, backdrop:r.backdrop_path, overview:r.overview, streaming:[], _rawId:r.id, _type:freeType });
      updateListIfChanged(setHomeFree, res.results.slice(0,20).map(mapR));
    }
  }, [settings.language, updateListIfChanged]);

  const handleTrendTab = useCallback((mode) => {
    setTrendMode(mode);
    fetchTrendingByMode(mode);
  }, [fetchTrendingByMode]);

  const handlePopularTab = useCallback((mode) => {
    setPopularMode(mode);
    fetchPopularByMode(mode);
  }, [fetchPopularByMode]);

  const handleFreeTab = useCallback((mode) => {
    setFreeMode(mode);
    fetchFreeByMode(mode);
  }, [fetchFreeByMode]);

  // Sync theme to <html> so CSS variables cascade everywhere
  useEffect(() => {
    const root = document.documentElement;
    const cls  = `theme-${settings.theme || "black"}`;
    root.classList.remove("theme-black", "theme-light", "theme-neo");
    root.classList.add(cls);
  }, [settings.theme]);

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ auth ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  const [session, setSession] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const defaultProfile = useCallback((s = session) => ({
    username: s?.user?.user_metadata?.name || s?.user?.email?.split("@")[0] || "ReelLog User",
    bio: "Tracking the stories that stay with me.",
    joinedDate: s?.user?.created_at ? new Date(s.user.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
    favoriteGenres: ["Drama", "Sci-Fi", "Anime"],
    avatarUrl: s?.user?.user_metadata?.avatar_url || "",
  }), [session]);
  const [profile, setProfile] = useState(defaultProfile());
  const [profileDraft, setProfileDraft] = useState(defaultProfile());
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [customLists, setCustomLists] = useState([]);
  const [listDraft, setListDraft] = useState({ title:"", description:"", cover:"", visibility:"public", items:[] });
  const [editingListId, setEditingListId] = useState(null);
  const [showListModal, setShowListModal] = useState(false);
  const [addToListEntry, setAddToListEntry] = useState(null);

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ page ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  const [page, setPage] = useState("home");

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ home content ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ TMDB-style section data ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬

  const allContent = useMemo(() => {
    const buckets = [heroItems, homeAnime, homeMovies, homeSeries, homeTrending, homePopular, homeFree, allEntries, myEntries];
    const map = new Map();
    buckets.forEach(list => list?.forEach(item => {
      const key = `${item.tmdbId || item.tmdb_id || item.id || item.title}-${item.type}`;
      if (!map.has(key)) map.set(key, item);
    }));
    return Array.from(map.values());
  }, [heroItems, homeAnime, homeMovies, homeSeries, homeTrending, homePopular, homeFree, allEntries, myEntries]);

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ section tab states ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬

  
  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ filters ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  const [filterType,   setFilterType]   = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy,       setSortBy]       = useState("added");

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ search ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  const [search,    setSearch]    = useState("");
  const [results,   setResults]   = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDrop,  setShowDrop]  = useState(false);
  const searchRef = useRef(null);
  const debRef    = useRef(null);

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ modal ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [editId,    setEditId]    = useState(null);
  const [form,      setForm]      = useState({ status:"Want to Watch", rating:null, notes:"" });
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState(null);

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ see-all modal ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  const [seeAll, setSeeAll] = useState(null); // { title, emoji, items }

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ nav scroll ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  const location = useLocation();
  const [navScrolled, setNavScrolled] = useState(false);
  useEffect(() => {
    const h = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ nav dropdown ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  const [, setNavDropdown] = useState(null);
  const navDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target)) {
        setNavDropdown(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (
      location.pathname.startsWith("/explore") ||
      location.pathname.startsWith("/genre/") ||
      location.pathname.startsWith("/category/")
    ) {
      setPage("explore");
    } else if (location.pathname === "/" && page === "explore") {
      setPage("home");
    }
  }, [location.pathname, page]);

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Load live catalog / hero from TMDB ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Layer 1: TMDB provider name ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ OTT key ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  const PROVIDER_MAP = {
    "Netflix":                  "nf",
    "Amazon Prime Video":       "prime",
    "Disney Plus Hotstar":      "hs",
    "Hotstar":                  "hs",
    "JioHotstar":               "hs",
    "Disney+ Hotstar":          "hs",
    "SonyLIV":                  "sony",
    "SonyLiv":                  "sony",
    "ZEE5":                     "zee5",
    "Zee5":                     "zee5",
    "Apple TV+":                "atv",
    "Apple TV Plus":            "atv",
    "Crunchyroll":              "cr",
    "Max":                      "hbo",
    "HBO Max":                  "hbo",
  };

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Layer 2a: Manual overrides by TMDB ID ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  const MANUAL_BY_ID = {
    // Format: tmdbId: ["ott_key", ...]
    // Example: 1396: ["nf"]  (Breaking Bad)
  };

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Layer 2b: Manual overrides by title ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  const MANUAL_BY_TITLE = {
    "The Mandalorian":              ["hs"],
    "Obi-Wan Kenobi":               ["hs"],
    "The Last of Us":               ["hs"],
    "House of the Dragon":          ["hs"],
    "Succession":                   ["hs"],
    "The Wire":                     ["hs"],
    "Peaky Blinders":               ["nf"],
    "Squid Game":                   ["nf"],
    "Wednesday":                    ["nf"],
    "Stranger Things":              ["nf"],
    "Arcane":                       ["nf"],
    "Dark":                         ["nf"],
    "Invincible":                   ["prime"],
    "The Boys":                     ["prime"],
    "Reacher":                      ["prime"],
    "Fallout":                      ["prime"],
  };

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Layer 3: Keyword-based smart fallback ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  const KEYWORD_MAP = [
    { match: ["Marvel", "Disney", "Star Wars", "Pixar", "National Geographic"], ott: ["hs"] },
    { match: ["HBO", "Warner", "Max Original", "DC"],                           ott: ["hs"] },
    { match: ["Amazon", "Prime Original", "Amazon Studios"],                    ott: ["prime"] },
    { match: ["Netflix", "Netflix Original"],                                   ott: ["nf"] },
    { match: ["Sony", "Sony Pictures"],                                         ott: ["sony"] },
    { match: ["ZEE", "Zee Studios"],                                            ott: ["zee5"] },
    { match: ["Apple", "A24"],                                                  ott: ["atv"] },
  ];

  async function getOTT(id, type, title = "") {
    if (MANUAL_BY_ID[id]) return MANUAL_BY_ID[id];
    if (title && MANUAL_BY_TITLE[title]) return MANUAL_BY_TITLE[title];
    try {
      const res  = await fetch(`${TMDB_BASE}/${type}/${id}/watch/providers?api_key=${TMDB_KEY}`);
      const data = await res.json();
      const flatrate = data.results?.IN?.flatrate || [];
      const mapped = [...new Set(
        flatrate.map(p => PROVIDER_MAP[p.provider_name]).filter(Boolean)
      )];
      if (mapped.length) return mapped;
    } catch { /* fall through */ }
    if (title) {
      for (const { match, ott } of KEYWORD_MAP) {
        if (match.some(kw => title.includes(kw))) return ott;
      }
    }
    return [];
  }

  useEffect(() => {
    const abort = new AbortController();
    const lang  = settings.language || "en";
    const adult = settings.adultContent ? "true" : "false";
    const mapItem = (r, typeLabel) => {
      const title     = r.title || r.name || "";
      const year      = (r.release_date || r.first_air_date || "").slice(0, 4);
      const mediaType = r.media_type || (typeLabel === "Movie" ? "movie" : "tv");
      const resolvedType = typeLabel || (mediaType === "movie" ? "Movie" : "TV Show");

      return {
        
        id: r.id,
        tmdbId: r.id,
        tmdbType: mediaType,
        title,
        year,
        rating: r.vote_average,
        type: resolvedType,
        poster: r.poster_path,
        backdrop: r.backdrop_path,
        overview: r.overview,   

        ott: null,
        streaming: [],

        _rawId: r.id,
        _type: mediaType,
      };
    };

    async function attachOTT(list) {
      return await Promise.all(
        list.map(async (item) => {
          const streaming = await getOTT(item._rawId, item._type, item.title || "");
          return {
            ...item,
            streaming,
            ott: streaming[0] || null,
          };
        })
      );
    }

    async function loadHome() {
      try {
        const [trendAll, trendAllIN, trendMovies, trendTv, anime] = await Promise.all([
          fetch(`${TMDB_BASE}/trending/all/week?api_key=${TMDB_KEY}&language=${lang}&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
          fetch(`${TMDB_BASE}/trending/all/week?api_key=${TMDB_KEY}&language=-IN&region=IN&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
          fetch(`${TMDB_BASE}/trending/movie/week?api_key=${TMDB_KEY}&language=${lang}&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
          fetch(`${TMDB_BASE}/trending/tv/week?api_key=${TMDB_KEY}&language=${lang}&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
          fetch(`${TMDB_BASE}/discover/tv?api_key=${TMDB_KEY}&language=${lang}&with_genres=16&sort_by=popularity.desc&include_adult=${adult}`, { signal: abort.signal }).then(r => r.json()).catch(() => null),
        ]);

        const valid = r =>
          (r.media_type === "movie" || r.media_type === "tv") &&
          r.backdrop_path && r.poster_path;

        const globalList = (trendAll?.results || []).filter(valid);
        const indiaList  = (trendAllIN?.results || []).filter(valid);

        const heroCombined = [];
        const seen = new Set();
        const pushList = (list) => {
          for (const r of list) {
            if (heroCombined.length >= 20) break;
            if (seen.has(r.id)) continue;
            heroCombined.push(r);
            seen.add(r.id);
          }
        };

        pushList(indiaList.slice(0, 6));
        pushList(globalList);
        pushList(indiaList.slice(6));

        if (heroCombined.length) {
          const mapped = heroCombined.slice(0, 20).map(r => mapItem(r));
          const withOTT = await attachOTT(mapped);
          setHeroItems(withOTT);
        }
        if (trendMovies?.results?.length) {
          const mapped = trendMovies.results.slice(0, 20).map(r => mapItem(r, "Movie"));
          const withOTT = await attachOTT(mapped);
          setHomeMovies(withOTT);
        }
        if (trendTv?.results?.length) {
          const mapped = trendTv.results.slice(0, 20).map(r => mapItem(r, "TV Show"));
          const withOTT = await attachOTT(mapped);
          setHomeSeries(withOTT);
        }
        if (anime?.results?.length) {
          const mapped = anime.results.slice(0, 20).map(r => mapItem(r, "Anime"));
          const withOTT = await attachOTT(mapped);
          setHomeAnime(withOTT);
        }

        // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Trending section (day) ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
        const trendDay = await fetch(`${TMDB_BASE}/trending/all/day?api_key=${TMDB_KEY}&language=${lang}`, { signal: abort.signal }).then(r => r.json()).catch(() => null);
        if (trendDay?.results?.length) {
          const mapped = trendDay.results.slice(0, 20).map(r => mapItem(r));
          updateListIfChanged(setHomeTrending, mapped);
        }

        // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ What's Popular ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â streaming ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
        const popStream = await fetch(`${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}&language=${lang}&region=IN`, { signal: abort.signal }).then(r => r.json()).catch(() => null);
        if (popStream?.results?.length) {
          const mapped = popStream.results.slice(0, 20).map(r => mapItem(r, "Movie"));
          updateListIfChanged(setHomePopular, mapped);
        }

        // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Free to watch ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â movies ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
        const freeMovies = await fetch(`${TMDB_BASE}/discover/movie?api_key=${TMDB_KEY}&language=${lang}&with_watch_monetization_types=free&watch_region=IN&sort_by=popularity.desc`, { signal: abort.signal }).then(r => r.json()).catch(() => null);
        if (freeMovies?.results?.length) {
          const mapped = freeMovies.results.slice(0, 20).map(r => mapItem(r, "Movie"));
          updateListIfChanged(setHomeFree, mapped);
        }

      } catch {
        /* ignore home feed bootstrap failures */
      }
    }

    loadHome();
    return () => abort.abort();
  }, []);

  useEffect(() => {
    if (initialMountRef.current) {
      initialMountRef.current = false;
      window.scrollTo({
        top: scrollRef.current,
        behavior: "instant"
      });
    }
  }, []);

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Auth listener ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) {
        setShowAuth(false);
        setPage("home");
      } else {
        // Logged out ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â clear all user data immediately
        setAllEntries([]);
        setMyEntries([]);
        setPage("home");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setProfile(defaultProfile(null));
      setProfileDraft(defaultProfile(null));
      setCustomLists([]);
      return;
    }
    const profileKey = `reellog-profile-${session.user.id}`;
    const listsKey = `reellog-lists-${session.user.id}`;
    const savedProfile = JSON.parse(localStorage.getItem(profileKey) || "null");
    const savedLists = JSON.parse(localStorage.getItem(listsKey) || "[]");
    const nextProfile = { ...defaultProfile(session), ...(savedProfile || {}) };
    setProfile(nextProfile);
    setProfileDraft(nextProfile);
    setCustomLists(Array.isArray(savedLists) ? savedLists : []);
  }, [session, defaultProfile]);

  useEffect(() => {
    if (!session?.user?.id) return;
    localStorage.setItem(`reellog-profile-${session.user.id}`, JSON.stringify(profile));
  }, [profile, session]);

  useEffect(() => {
    if (!session?.user?.id) return;
    localStorage.setItem(`reellog-lists-${session.user.id}`, JSON.stringify(customLists));
  }, [customLists, session]);

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Load entries (only when signed in) ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  useEffect(() => {
    if (!session) {
      setAllEntries([]);
      setMyEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase.from("entries")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const rows = data || [];
        setMyEntries(rows);
        setAllEntries(rows);
      })
      .finally(() => setLoading(false));
  }, [session]);

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ TMDB search ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  useEffect(() => {
    if (!search.trim()) { setResults([]); setShowDrop(false); return; }
    clearTimeout(debRef.current);
    debRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await fetch(`${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(search)}`);
        const d = await r.json();
        const f = (d.results || []).filter(x => x.media_type === "movie" || x.media_type === "tv").slice(0, 8);
        setResults(f); setShowDrop(f.length > 0);
      } catch {
        /* ignore transient search failures */
      }
      setSearching(false);
    }, 380);
  }, [search]);

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Close dropdown on outside click ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  useEffect(() => {
    const h = e => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowDrop(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function showT(msg) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  function getType(r) {
    if (r.media_type === "movie") return "Movie";
    if ((r.genre_ids || []).includes(16)) return "Anime";
    return "TV Show";
  }

  async function selectResult(r) {
    const type = getType(r);
    const year = (r.release_date || r.first_air_date || "").split("-")[0];
    const tmdbType = r.media_type || (type === "Movie" ? "movie" : "tv");
    
    // Fetch OTT data
    const streaming = await getOTT(r.id, tmdbType, r.title || r.name || "");
    
    setModalData({ 
      title:r.title||r.name, 
      type, 
      year, 
      poster:r.poster_path, 
      tmdb_id:r.id, 
      tmdbId: r.id,
      tmdbType,
      overview:r.overview,
      streaming: streaming || []
    });
    setForm({ status:"Want to Watch", rating:null, notes:"" });
    setEditId(null); setShowDrop(false); setSearch(""); setShowModal(true);
  }

  function openFromCard(item) {
    const tmdbId = item.tmdbId || item.tmdb_id;
    const tmdbType = item.tmdbType || (item.type === "Movie" ? "movie" : "tv");
    if (tmdbId) {
      navigate(`/detail/${tmdbType}/${tmdbId}`);
      return;
    }
    setModalData({ title:item.title, type:item.type, year:item.year, poster:item.poster, tmdb_id:item.tmdb_id, tmdbId:item.tmdbId, tmdbType:item.tmdbType, overview:item.overview, streaming:item.streaming||[] });
    setForm({ status:"Want to Watch", rating:null, notes:"" });
    setEditId(null);
    setShowModal(true);
  }

  function openManual() {
    if (!session) { setShowAuth(true); return; }
    setModalData({ title:"", type:"Movie", year:"", poster:null, manual:true });
    setForm({ status:"Want to Watch", rating:null, notes:"" });
    setEditId(null); setShowModal(true);
  }

  function openEdit(entry) {
    setModalData({ title:entry.title, type:entry.type, year:entry.year, poster:entry.poster, tmdb_id:entry.tmdb_id });
    setForm({ status:entry.status, rating:entry.rating, notes:entry.notes||"" });
    setEditId(entry.id); setShowModal(true);
  }

  async function handleSave() {
    const title = modalData.manual ? (modalData.manualTitle||"").trim() : modalData.title;
    if (!title) return;
    if (!session) { setShowAuth(true); return; }
    setSaving(true);
    try {
      const row = {
        title, type:modalData.type, year:modalData.year,
        poster:modalData.poster, tmdb_id:modalData.tmdb_id,
        user_id:session.user.id,
        user_name:session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
        ...form
      };
      if (editId !== null) {
        const { data } = await supabase.from("entries").update(row).eq("id", editId).select();
        const updated = data[0];
        setAllEntries(p => p.map(e => e.id === editId ? updated : e));
        setMyEntries(p  => p.map(e => e.id === editId ? updated : e));
        showT("Updated!");
      } else {
        const { data } = await supabase.from("entries").insert(row).select();
        const newRow = data[0];
        setAllEntries(p => [newRow, ...p]);
        setMyEntries(p  => [newRow, ...p]);
        showT("Added to catalog!");
      }
      setShowModal(false);
    } catch { showT("Something went wrong."); }
    setSaving(false);
  }

  async function handleDelete(id) {
    await supabase.from("entries").delete().eq("id", id);
    setAllEntries(p => p.filter(e => e.id !== id));
    setMyEntries(p  => p.filter(e => e.id !== id));
    showT("Removed.");
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleAvatarUpload(file) {
    if (!file || !session) return;
    try {
      const path = `${session.user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (!error) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        setProfileDraft(p => ({ ...p, avatarUrl: data.publicUrl }));
        return;
      }
    } catch {
      /* Fall back to local preview if Storage is not configured. */
    }
    const dataUrl = await fileToDataUrl(file);
    setProfileDraft(p => ({ ...p, avatarUrl: dataUrl }));
  }

  function saveProfile() {
    setProfile({
      ...profileDraft,
      favoriteGenres: Array.isArray(profileDraft.favoriteGenres)
        ? profileDraft.favoriteGenres
        : String(profileDraft.favoriteGenres || "").split(",").map(g => g.trim()).filter(Boolean),
    });
    setShowProfileEdit(false);
    showT("Profile updated!");
  }

  function openCreateList() {
    if (!session) { setShowAuth(true); return; }
    setEditingListId(null);
    setListDraft({ title:"", description:"", cover:"", visibility:"public", items:[] });
    setShowListModal(true);
  }

  function openEditList(list) {
    setEditingListId(list.id);
    setListDraft({ ...list, items:[...(list.items || [])] });
    setShowListModal(true);
  }

  function saveCustomList() {
    if (!session || !listDraft.title.trim()) return;
    if (editingListId) {
      setCustomLists(p => p.map(l => l.id === editingListId ? { ...l, ...listDraft, title:listDraft.title.trim(), updatedAt:new Date().toISOString() } : l));
      showT("List updated!");
    } else {
      const list = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        title:listDraft.title.trim(),
        description:listDraft.description,
        cover:listDraft.cover,
        visibility:listDraft.visibility || "public",
        items:listDraft.items || [],
        ownerId:session.user.id,
        ownerName:profile.username,
        createdAt:new Date().toISOString(),
        updatedAt:new Date().toISOString(),
      };
      setCustomLists(p => [list, ...p]);
      showT(`Created list "${list.title}"`);
    }
    setShowListModal(false);
  }

  function deleteCustomList(id) {
    setCustomLists(p => p.filter(l => l.id !== id));
    showT("List deleted.");
    if (location.pathname === `/list/${id}`) navigate("/profile");
  }

  function addEntryToList(listId, entryId) {
    setCustomLists(p => p.map(l => {
      if (String(l.id) !== String(listId) || l.items?.some(id => String(id) === String(entryId))) return l;
      return { ...l, items:[...(l.items || []), entryId], updatedAt:new Date().toISOString() };
    }));
    showT("Added to list.");
  }

  function removeEntryFromList(listId, entryId) {
    setCustomLists(p => p.map(l => String(l.id) === String(listId) ? { ...l, items:(l.items || []).filter(id => String(id) !== String(entryId)), updatedAt:new Date().toISOString() } : l));
  }

  function moveListItem(listId, index, direction) {
    setCustomLists(p => p.map(l => {
      if (String(l.id) !== String(listId)) return l;
      const items = [...(l.items || [])];
      const next = index + direction;
      if (next < 0 || next >= items.length) return l;
      [items[index], items[next]] = [items[next], items[index]];
      return { ...l, items, updatedAt:new Date().toISOString() };
    }));
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(myEntries, null, 2)], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `reellog-export-${new Date().toISOString().slice(0,10)}.json`;
    a.click(); URL.revokeObjectURL(url);
    showT("Catalog exported!");
  }

  function handleClearCache() {
    // Clear any local state that acts as cache
    showT("Cache cleared!");
  }

  // ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ filters ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
  const source = page === "mylist" ? myEntries : allEntries;
  const libraryQuery = search.trim().toLowerCase();
  const filtered = source
    .filter(e => !libraryQuery || [e.title, e.type, e.year, e.status].some(v => String(v || "").toLowerCase().includes(libraryQuery)))
    .filter(e => filterType   === "All" || e.type   === filterType)
    .filter(e => filterStatus === "All" || e.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "title")  return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "titleDesc") return (b.title || "").localeCompare(a.title || "");
      if (sortBy === "rating") return (b.rating||0) - (a.rating||0);
      if (sortBy === "year")   return (b.year||"0").localeCompare(a.year||"0");
      if (sortBy === "yearAsc") return (a.year||"0").localeCompare(b.year||"0");
      return 0;
    });

  const counts = STATUSES.reduce((acc, status) => {
    acc[status] = source.filter(e => e.status === status).length;
    return acc;
  }, {});

  const typeCounts = {
    Movie: source.filter(e => e.type === "Movie").length,
    "TV Show": source.filter(e => e.type === "TV Show").length,
    Anime: source.filter(e => e.type === "Anime").length,
  };
  const continueWatching = source.filter(e => e.status === "Watching");
  const recentlyAdded = source.slice(0, 10);
  const ratedEntries = source.filter(e => Number(e.rating) > 0);
  const averageUserRating = ratedEntries.length
    ? (ratedEntries.reduce((sum, e) => sum + Number(e.rating || 0), 0) / ratedEntries.length).toFixed(1)
    : "N/A";
  const genreCounts = source.reduce((acc, e) => {
    const genres = Array.isArray(e.genres) ? e.genres : Array.isArray(e.categories) ? e.categories : [];
    genres.forEach(g => {
      if (g) acc[g] = (acc[g] || 0) + 1;
    });
    return acc;
  }, {});
  const mostCommonGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Not tracked";
  const mostRecentEntry = source[0]?.title || "None yet";

  const renderLibrary = (mode) => {
    const isExploreMode = mode === "explore";

    if (isExploreMode) {
      return (
        <div className="explore-container">
          <BrowseHub
            allContent={allContent}
            session={session}
            onSelectItem={openFromCard}
            onRequireAuth={() => setShowAuth(true)}
          />
        </div>
      );
    }

    return (
      <>
        {!session && (
          <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
            <div style={{ textAlign:"center", maxWidth:430 }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:50, color:"var(--acc)", letterSpacing:3, textShadow:"0 0 36px var(--acc-glow)", marginBottom:8 }}>
                Reel<span style={{ color:"var(--tx)" }}>log</span>
              </div>
              <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, marginBottom:12, lineHeight:1.2 }}>
                Your list is  <em style={{ color:"var(--acc)", fontStyle:"italic" }}>private</em>
              </div>
              <p style={{ fontSize:14, color:"var(--txm)", lineHeight:1.85, marginBottom:30 }}>
                Sign in to build your personal catalog of movies, shows and anime. Rate them, track your status and never lose track of what to watch next.
              </p>
              <button className="btn-acc btn-sm"
                style={{ padding:"14px 38px", fontSize:14, fontWeight:700, borderRadius:9 }}
                onClick={() => setShowAuth(true)}>
                Sign in to view your list -&gt;
              </button>
              <div style={{ marginTop:16, fontSize:12, color:"var(--txd)" }}>
                No account?&nbsp;
                <span style={{ color:"var(--acc)", cursor:"pointer" }} onClick={() => setShowAuth(true)}>Join free</span>
              </div>
            </div>
          </div>
        )}

        {session && (
          <div className="library-shell">
            <div className="library-hero">
              <div>
                <div className="library-eyebrow">Personal dashboard</div>
                <div className="library-title">My Library</div>
                <div className="library-subtitle">Track every movie, show and anime in one place.</div>
              </div>
              <div className="library-total-pill">{source.length} titles saved</div>
            </div>

            <div className="library-dashboard">
              <div className="dash-stats">
                {[
                  { key:"Movie", label:"Movies", value:typeCounts.Movie, icon:<FaFilm />, active:filterType === "Movie", onClick:() => { setFilterType(filterType === "Movie" ? "All" : "Movie"); setFilterStatus("All"); } },
                  { key:"TV Show", label:"TV Shows", value:typeCounts["TV Show"], icon:<FaTv />, active:filterType === "TV Show", onClick:() => { setFilterType(filterType === "TV Show" ? "All" : "TV Show"); setFilterStatus("All"); } },
                  { key:"Anime", label:"Anime", value:typeCounts.Anime, icon:<FaDragon />, active:filterType === "Anime", onClick:() => { setFilterType(filterType === "Anime" ? "All" : "Anime"); setFilterStatus("All"); } },
                  { key:"Watched", label:"Watched", value:counts.Watched, icon:<FaCheck />, active:filterStatus === "Watched", onClick:() => { setFilterStatus(filterStatus === "Watched" ? "All" : "Watched"); setFilterType("All"); } },
                  { key:"Watching", label:"Watching", value:counts.Watching, icon:<FaPlay />, active:filterStatus === "Watching", onClick:() => { setFilterStatus(filterStatus === "Watching" ? "All" : "Watching"); setFilterType("All"); } },
                  { key:"Want to Watch", label:"Want to Watch", value:counts["Want to Watch"], icon:<FaList />, active:filterStatus === "Want to Watch", onClick:() => { setFilterStatus(filterStatus === "Want to Watch" ? "All" : "Want to Watch"); setFilterType("All"); } },
                ].map(stat => (
                  <button key={stat.key} className={`dash-stat${stat.active ? " on" : ""}`} onClick={stat.onClick}>
                    <div className="dash-stat-icon">{stat.icon}</div>
                    <div className="dash-stat-num">{stat.value}</div>
                    <div className="dash-stat-label">{stat.label}</div>
                  </button>
                ))}
              </div>

              {continueWatching.length > 0 && (
                <section className="library-section">
                  <div className="library-section-head">
                    <div className="library-section-title">Continue Watching</div>
                    <div className="library-section-count">{continueWatching.length} active</div>
                  </div>
                  <div className="library-rail">
                    {continueWatching.map(entry => (
                      <div key={entry.id} className="library-rail-card" onClick={() => openFromCard(entry)}>
                        <div className="library-rail-poster">
                          {entry.poster
                            ? <img src={`${TMDB_IMG}${entry.poster}`} alt={entry.title} loading="lazy" onError={e => { e.currentTarget.style.display="none"; }} />
                            : <div className="no-img-box"><div className="no-img-icon">{entry.type === "Movie" ? "M" : entry.type === "Anime" ? "A" : "TV"}</div><span>{entry.type}</span></div>}
                          <div className="card-grad" />
                          <div className="card-status-tag" style={{ color:SCOLOR[entry.status], borderColor:SCOLOR[entry.status]+"44" }}>
                            {getStatusIcon(entry.status)} {entry.status}
                          </div>
                        </div>
                        <div className="library-rail-body">
                          <div className="library-rail-title">{entry.title}</div>
                          <div className="library-rail-meta"><span>{entry.year || "N/A"}</span><span>{entry.type}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {recentlyAdded.length > 0 && (
                <section className="library-section">
                  <div className="library-section-head">
                    <div className="library-section-title">Recently Added</div>
                    <div className="library-section-count">Latest 10</div>
                  </div>
                  <div className="library-rail">
                    {recentlyAdded.map(entry => (
                      <div key={entry.id} className="library-rail-card" onClick={() => openFromCard(entry)}>
                        <div className="library-rail-poster">
                          {entry.poster
                            ? <img src={`${TMDB_IMG}${entry.poster}`} alt={entry.title} loading="lazy" onError={e => { e.currentTarget.style.display="none"; }} />
                            : <div className="no-img-box"><div className="no-img-icon">{entry.type === "Movie" ? "M" : entry.type === "Anime" ? "A" : "TV"}</div><span>{entry.type}</span></div>}
                          <div className="card-grad" />
                        </div>
                        <div className="library-rail-body">
                          <div className="library-rail-title">{entry.title}</div>
                          <div className="library-rail-meta"><span>{entry.year || "N/A"}</span><span>{entry.status}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="library-toolbar">
                <div className="toolbar">
                  <div className="search-wrap" ref={searchRef}>
                    <FaSearch className="search-ico" />
                    <input
                      className="search-inp"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      onFocus={() => results.length > 0 && setShowDrop(true)}
                      placeholder="Search your library..."
                    />
                    {searching && <span className="spin-ico">?</span>}
                    {showDrop && (
                      <div className="drop">
                        {results.map(r => (
                          <div key={r.id} className="drop-row" onClick={() => selectResult(r)}>
                            {r.poster_path
                              ? <img className="drop-img" src={`${TMDB_IMG}${r.poster_path}`} alt="" />
                              : <div className="drop-img" style={{ display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>?</div>}
                            <div style={{ flex:1, minWidth:0 }}>
                              <div className="drop-ti">{r.title || r.name}</div>
                              <div className="drop-me">{(r.release_date||r.first_air_date||"").split("-")[0]}</div>
                            </div>
                            <div className="drop-tag">{getType(r)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="fil-row">
                    {[
                      { key:"All", label:"All" },
                      { key:"Movie", label:"Movies" },
                      { key:"TV Show", label:"TV Shows" },
                      { key:"Anime", label:"Anime" },
                    ].map(f => (
                      <button key={f.key} className={`fil-btn${filterType === f.key ? " on" : ""}`} onClick={() => setFilterType(f.key)}>{f.label}</button>
                    ))}
                  </div>
                  <div className="fil-row">
                    {["All", ...STATUSES].map(s => (
                      <button key={s} className={`fil-btn${filterStatus === s ? " on" : ""}`} onClick={() => setFilterStatus(s)}>{s}</button>
                    ))}
                  </div>
                  <select className="sort-sel" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="added">Recently Added</option>
                    <option value="title">Title A-Z</option>
                    <option value="titleDesc">Title Z-A</option>
                    <option value="rating">Highest Rated</option>
                    <option value="year">Newest Release</option>
                    <option value="yearAsc">Oldest Release</option>
                  </select>
                </div>
              </div>

              <div className="library-grid-wrap">
                <div className="library-grid-title">Collection</div>
                {loading ? (
                  <div className="loader"><div className="ldot"/><div className="ldot"/><div className="ldot"/></div>
                ) : (
                  <div className={`grid${settings.cardSize === "small" ? " small" : settings.cardSize === "large" ? " large" : ""}`}>
                    {filtered.length === 0 && (
                      <div className="library-empty">
                        <div className="library-empty-icon"><FaFilm /></div>
                        <div className="library-empty-title">Your library is waiting.</div>
                        <div className="library-empty-sub">Start building your personal collection of movies, shows and anime.</div>
                        <button className="btn-acc btn-sm" onClick={() => { setPage("explore"); navigate("/explore"); }}>Explore Titles</button>
                      </div>
                    )}
                    {filtered.map((entry, i) => (
                      <div key={entry.id} className="card" style={{ animationDelay:`${Math.min(i*.04,.4)}s` }} onClick={() => openFromCard(entry)}>
                        <div className="card-img-box">
                          {entry.poster
                            ? <img className="card-img" src={`${TMDB_IMG}${entry.poster}`} alt={entry.title} loading="lazy"
                                onError={e => { e.currentTarget.style.display="none"; }} />
                            : <div className="no-img-box">
                                <div className="no-img-icon">{entry.type === "Movie" ? "M" : entry.type === "Anime" ? "A" : "TV"}</div>
                                <span>{entry.type}</span>
                              </div>}
                          <div
                            className="type-badge"
                            onClick={e => { e.stopPropagation(); handleTypeNav(entry.type); }}
                          >
                            {entry.type}
                          </div>
                          <div className="card-grad" />
                          <div className="card-status-tag" style={{ color:SCOLOR[entry.status], borderColor:SCOLOR[entry.status]+"44" }}>
                            {getStatusIcon(entry.status)} {entry.status}
                          </div>
                          <div className="card-overlay">
                            <button className="card-action" onClick={e => { e.stopPropagation(); openFromCard(entry); }}>View Details</button>
                            {session && entry.user_id === session.user.id && (
                              <>
                                <button className="card-action secondary" onClick={e => { e.stopPropagation(); setAddToListEntry(entry); }}>Add to List</button>
                                <button className="card-action secondary" onClick={e => { e.stopPropagation(); openEdit(entry); }}>Edit Entry</button>
                                <button className="card-action danger" onClick={e => { e.stopPropagation(); handleDelete(entry.id); }}>Remove Entry</button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="card-title">{entry.title}</div>
                          <div className="card-meta-row">
                            <span className="card-type">{entry.type}</span>
                            <span className="card-year">{entry.year}</span>
                          </div>
                          {settings.showRatings && entry.rating > 0 && (
                            <div className="card-stars">
                              {[1,2,3,4,5].map(s => <FaStar key={s} className={`s${entry.rating>=s?" on":""}`} aria-hidden="true" />)}
                            </div>
                          )}
                          {settings.showStreaming && entry.streaming?.length > 0 && (
                            <div className="card-ott-strip">
                              {entry.streaming.slice(0,3).map(k => OTT[k] && (
                                <span key={k} className="card-ott-label"
                                  style={{ background: OTT[k].color }}>
                                  {OTT[k].short}
                                </span>
                              ))}
                            </div>
                          )}
                          {settings.showOverviews && entry.notes && (
                            <div className="card-overview">{entry.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {source.length > 0 && (
                <section className="library-section">
                  <div className="library-section-head">
                    <div className="library-section-title">Collection Insights</div>
                    <div className="library-section-count">At a glance</div>
                  </div>
                  <div className="insights-grid">
                    {[
                      { label:"Total Library Size", value:source.length },
                      { label:"Most Common Genre", value:mostCommonGenre },
                      { label:"Average User Rating", value:averageUserRating },
                      { label:"Most Recent Entry", value:mostRecentEntry },
                    ].map(item => (
                      <div key={item.label} className="insight-card">
                        <div className="insight-value">{item.value}</div>
                        <div className="insight-label">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </>
    );
  };
  //RENDER 
  return (
    <div className={accentClass}>
      <style>{CSS}</style>

      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Cinematic grain overlay ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
      {settings.cinematicBg && (
        <svg className="grain-svg" aria-hidden="true">
          <filter id="grain-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-noise)" />
        </svg>
      )}

      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ NAV ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
      <nav className={`nav${navScrolled ? " nav-scrolled" : ""}`} ref={navDropdownRef}>
        <div className="nav-logo" onClick={() => { setPage("home"); navigate("/"); setNavDropdown(null); }}>
          <div className="nav-dot" />
          Reel<span>log</span>
        </div>
        <div className="nav-links">
          <button className={`nav-link${page === "home" && location.pathname === "/" ? " active" : ""}`} onClick={() => { setPage("home"); navigate("/"); setNavDropdown(null); }}>
            Home
          </button>
          <div className="nav-dropdown-wrapper">
            <button className={`nav-link${page === "explore" ? " active" : ""}`} onClick={() => { setPage("explore"); navigate("/explore"); setNavDropdown(null); }}>
              Explore
            </button>

          </div>
          <button className={`nav-link${page === "mylist" && location.pathname === "/" ? " active" : ""}`} onClick={() => { setPage("mylist"); navigate("/"); setNavDropdown(null); }}>
            My List
          </button>
          <button className={`nav-link${location.pathname === "/profile" ? " active" : ""}`} onClick={() => { navigate("/profile"); setNavDropdown(null); }}>
            Profile
          </button>
        </div>
        <div className="nav-right">
          <button className="btn-icon" onClick={() => {
            if (session) { navigate("/profile"); setNavDropdown(null); }
            else setShowAuth(true);
          }} title={session ? "Profile" : "Sign in / Join"}>
            <Icon name="user" size={17} />
          </button>
          <button className="btn-icon" onClick={() => { setShowSettings(s => !s); setNavDropdown(null); }} title="Settings">
            <Icon name="settings" size={17} />
          </button>
        </div>
      </nav>

      <Routes>
        <Route path="/detail/:type/:id" element={<DetailPage session={session} onRequireAuth={() => setShowAuth(true)} onSelect={openFromCard} />} />
        <Route
          path="/profile"
          element={
            <ProfilePage
              session={session}
              profile={profile}
              entries={myEntries}
              customLists={customLists}
              onEditProfile={() => { setProfileDraft(profile); setShowProfileEdit(true); }}
              onCreateList={openCreateList}
              onEditList={openEditList}
              onDeleteList={deleteCustomList}
              onOpenList={(listId) => navigate(`/list/${listId}`)}
              onRequireAuth={() => setShowAuth(true)}
            />
          }
        />
        <Route
          path="/list/:id"
          element={
            <ListDetailPage
              session={session}
              customLists={customLists}
              entries={myEntries}
              onOpenEntry={openFromCard}
              onEditList={openEditList}
              onDeleteList={deleteCustomList}
              onAddItem={addEntryToList}
              onRemoveItem={removeEntryFromList}
              onMoveItem={moveListItem}
              onRequireAuth={() => setShowAuth(true)}
            />
          }
        />
        <Route path="/explore/:section/:item" element={<BrowseItemPage />} />
        <Route path="/explore/:section" element={<BrowseSectionPage />} />
        <Route path="/explore" element={renderLibrary("explore")} />
        <Route
          path="/genre/:slug"
          element={
            <GenrePage
              onSelect={openFromCard}
              PosterImageComponent={PosterImage}
              onTypeNav={handleTypeNav}
            />
          }
        />
        <Route
          path="/category/:type"
          element={
            <CategoryPage
              key={location.pathname}
              allItems={allContent}
              onSelect={openFromCard}
              PosterImageComponent={PosterImage}
              onTypeNav={handleTypeNav}
            />
          }
        />
        <Route
          path="/*"
          element={
            <>
      {/*  HOME PAGE  */}
      {page === "home" && (
        <HomePage
          heroItems={heroItems}
          autoplay={settings.autoplay}
          onAdd={openFromCard}
          session={session}
          setShowAuth={setShowAuth}
          HeroCarousel={HeroCarousel}
          TmdbSection={TmdbSection}
          homeTrending={homeTrending}
          trendMode={trendMode}
          onTrendTabChange={handleTrendTab}
          homePopular={homePopular}
          popularMode={popularMode}
          onPopularTabChange={handlePopularTab}
          homeFree={homeFree}
          freeMode={freeMode}
          onFreeTabChange={handleFreeTab}
          homeSeries={homeSeries}
          onSelect={openFromCard}
          onTypeNav={handleTypeNav}
          onSeeAll={setSeeAll}
        />
      )}

      {/*  EXPLORE / MY LIST */}
      {page === "explore" && renderLibrary("explore")}

      {page === "mylist" && renderLibrary("mylist")}
            </>
          }
        />
      </Routes>

      {/* ADD / EDIT MODAL */}
      {showModal && modalData && (
        <div className="backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-head">
              {modalData.poster
                ? <img className="modal-poster" src={`${TMDB_IMG}${modalData.poster}`} alt=""
                    onError={e => e.currentTarget.style.display="none"} />
                : modalData.tmdbId
                  ? <PosterImage item={{ poster:null, tmdbId:modalData.tmdbId, tmdbType:modalData.tmdbType||"movie", type:modalData.type||"Movie" }}
                      style={{ width:72, height:104, borderRadius:9, flexShrink:0 }} />
                  : <div className="modal-poster" style={{ display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, color:"var(--txd)" }}></div>}
              <div style={{ flex:1 }}>
                {modalData.manual
                  ? <input className="finp" placeholder="Enter title..." value={modalData.manualTitle||""} onChange={e=>setModalData(d=>({...d,manualTitle:e.target.value}))} style={{ marginBottom:6 }} />
                  : <div className="modal-ti">{modalData.title}</div>}
                <div className="modal-sub">{modalData.type}{modalData.year ? ` | ${modalData.year}` : ""}</div>
                {modalData.overview && <div className="modal-ov">"{modalData.overview.slice(0,110)}"</div>}
              </div>
            </div>
            <div className="modal-body">
              {modalData.streaming?.length > 0 && (
                <div className="ott-section">
                  <span className="ott-section-label"> Available On</span>
                  <div className="ott-logos">
                    {modalData.streaming.map(k => OTT[k] && (
                      <a key={k} className="ott-logo-link"
                        href={OTT[k].url + encodeURIComponent(modalData.title || "")}
                        target="_blank" rel="noopener noreferrer"
                        title={`Watch on ${OTT[k].name}`}>
                        <img
                          src={OTT[k].logo}
                          alt={OTT[k].name}
                          onError={e => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling.style.display = "inline";
                          }}
                        />
                        <span style={{ display:"none", fontSize:10, fontWeight:700, color:"var(--tx)", letterSpacing:.5 }}>{OTT[k].short}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {session ? (
                <>
                  {modalData.manual && (
                    <div className="frow" style={{ marginBottom:14 }}>
                      <div className="field">
                        <label className="flbl">Type</label>
                        <select className="fsel" value={modalData.type} onChange={e=>setModalData(d=>({...d,type:e.target.value}))}>
                          {["Movie","Anime","TV Show"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label className="flbl">Year</label>
                        <input className="finp" placeholder="2024" value={modalData.year||""} onChange={e=>setModalData(d=>({...d,year:e.target.value}))} />
                      </div>
                    </div>
                  )}
                  <div className="field">
                    <label className="flbl">Status</label>
                    <div className="pills">
                      {STATUSES.map(s => (
                        <button key={s} className={`pill${form.status===s?" on":""}`}
                          style={form.status===s?{background:SCOLOR[s]+"22",borderColor:SCOLOR[s],color:SCOLOR[s]}:{}}
                          onClick={() => setForm(f=>({...f,status:s}))}>
                          {getStatusIcon(s)} {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <label className="flbl">Rating</label>
                    <div className="str-row">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`str${form.rating>=s?" on":""}`}
                          onClick={() => setForm(f=>({...f,rating:f.rating===s?null:s}))}><FaStar aria-hidden="true" /></span>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <label className="flbl">Notes</label>
                    <textarea className="fta" placeholder="Your thoughts..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
                  </div>
                </>
              ) : (
                <div className="field">
                  <label className="flbl">About This Title</label>
                  <div className="explore-modal-note">
                    Sign in to add this title to your catalog, rate it, and save notes.
                  </div>
                </div>
              )}
            </div>
            <div className="modal-foot">
              {session ? (
                <button className="btn-add" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving" : editId !== null ? "Save Changes" : "+ Add to List"}
                </button>
              ) : (
                <button className="btn-add" onClick={() => setShowAuth(true)}>
                  Sign In to Add
                </button>
              )}
              <button className="btn-cxl" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showProfileEdit && (
        <div className="backdrop" onClick={e => e.target === e.currentTarget && setShowProfileEdit(false)}>
          <div className="modal modal-wide">
            <div className="modal-head">
              <div style={{ flex:1 }}>
                <div className="modal-ti">Edit Profile</div>
                <div className="modal-sub">Customize your ReelLog identity.</div>
              </div>
              <button className="settings-close" onClick={() => setShowProfileEdit(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="avatar-upload-row">
                <div className="avatar-preview">{profileDraft.avatarUrl ? <img src={profileDraft.avatarUrl} alt="Avatar preview" /> : <FaUserCircle />}</div>
                <div>
                  <label className="flbl">Avatar Upload</label>
                  <input className="finp" type="file" accept="image/*" onChange={e => handleAvatarUpload(e.target.files?.[0])} />
                </div>
              </div>
              <div className="field">
                <label className="flbl">Username</label>
                <input className="finp" value={profileDraft.username || ""} onChange={e => setProfileDraft(p => ({ ...p, username:e.target.value }))} />
              </div>
              <div className="field">
                <label className="flbl">Bio</label>
                <textarea className="fta" value={profileDraft.bio || ""} onChange={e => setProfileDraft(p => ({ ...p, bio:e.target.value }))} />
              </div>
              <div className="field">
                <label className="flbl">Favorite Genres</label>
                <input className="finp" value={Array.isArray(profileDraft.favoriteGenres) ? profileDraft.favoriteGenres.join(", ") : profileDraft.favoriteGenres || ""} onChange={e => setProfileDraft(p => ({ ...p, favoriteGenres:e.target.value }))} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn-add" onClick={saveProfile}>Save Profile</button>
              <button className="btn-cxl" onClick={() => setShowProfileEdit(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showListModal && (
        <div className="backdrop" onClick={e => e.target === e.currentTarget && setShowListModal(false)}>
          <div className="modal modal-wide">
            <div className="modal-head">
              <div style={{ flex:1 }}>
                <div className="modal-ti">{editingListId ? "Edit List" : "Create List"}</div>
                <div className="modal-sub">Curate titles into a cinematic collection.</div>
              </div>
              <button className="settings-close" onClick={() => setShowListModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label className="flbl">Title</label>
                <input className="finp" placeholder="Best Sci-Fi Movies" value={listDraft.title || ""} onChange={e => setListDraft(p => ({ ...p, title:e.target.value }))} />
              </div>
              <div className="field">
                <label className="flbl">Description</label>
                <textarea className="fta" placeholder="Why this list matters..." value={listDraft.description || ""} onChange={e => setListDraft(p => ({ ...p, description:e.target.value }))} />
              </div>
              <div className="form-grid">
                <div className="field">
                  <label className="flbl">Cover Image</label>
                  <input className="finp" type="file" accept="image/*" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const cover = await fileToDataUrl(file);
                      setListDraft(p => ({ ...p, cover }));
                    }
                  }} />
                </div>
                <div className="field">
                  <label className="flbl">Visibility</label>
                  <select className="fsel" value={listDraft.visibility || "public"} onChange={e => setListDraft(p => ({ ...p, visibility:e.target.value }))}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn-add" onClick={saveCustomList}>{editingListId ? "Save List" : "Create List"}</button>
              <button className="btn-cxl" onClick={() => setShowListModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {addToListEntry && (
        <div className="backdrop" onClick={e => e.target === e.currentTarget && setAddToListEntry(null)}>
          <div className="modal">
            <div className="modal-head">
              <div style={{ flex:1 }}>
                <div className="modal-ti">Add to Custom List</div>
                <div className="modal-sub">{addToListEntry.title}</div>
              </div>
              <button className="settings-close" onClick={() => setAddToListEntry(null)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              {customLists.length === 0 ? (
                <div className="library-empty" style={{ padding:30 }}>
                  <div className="library-empty-title">No custom lists yet.</div>
                  <div className="library-empty-sub">Create a list first, then add this title.</div>
                  <button className="premium-btn" onClick={() => { setAddToListEntry(null); openCreateList(); }}>Create List</button>
                </div>
              ) : (
                <div className="activity-list">
                  {customLists.map(list => (
                    <button key={list.id} className="sett-export-btn" onClick={() => { addEntryToList(list.id, addToListEntry.id); setAddToListEntry(null); }}>
                      {list.title} · {list.visibility}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ SEE ALL MODAL ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
      {seeAll && (
        <SeeAllModal
          title={seeAll.title}
          emoji={seeAll.emoji}
          items={seeAll.items}
          onClose={() => setSeeAll(null)}
          onSelect={openFromCard}
          onTypeNav={handleTypeNav}
        />
      )}

      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ SETTINGS PANEL ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
      {showSettings && (
        <>
          <div className="backdrop" style={{ zIndex:499 }} onClick={() => setShowSettings(false)} />
          <SettingsPanel
            settings={settings}
            onChange={changeSetting}
            onClose={() => setShowSettings(false)}
            onExport={handleExport}
            onClearCache={handleClearCache}
            session={session}
            onSignOut={() => { supabase.auth.signOut(); setShowSettings(false); }}
          />
        </>
      )}

      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ AUTH MODAL ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ TOAST ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */}
      {toast && <div className="toast"><div className="toast-dot"/>{toast}</div>}
    </div>
  );
}


