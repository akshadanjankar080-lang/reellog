import {
  FaArrowLeft, FaBolt, FaCheck, FaChevronLeft, FaChevronRight,
  FaCog, FaEye, FaFire, FaGift, FaPlay, FaPlus, FaSearch,
  FaStar, FaTimes, FaUserCircle,
} from "react-icons/fa";

export const Icon = ({ name, size = 16 }) => {
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

export const getStatusIcon = (status) => {
  const iconMap = {
    "Watched": "✓",
    "Watching": "▶",
    "Want to Watch": "○",
  };
  return iconMap[status] || status;
};
