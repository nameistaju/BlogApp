import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AuthContext from '../../context/auth/authContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLogout = () => logout();

  const navLinkStyle = 'block text-gray-700 hover:text-blue-600 transition px-3 py-2';

  const authLinks = (
    <>
      <li><Link to="/my-blogs" className={navLinkStyle}>My Blogs</Link></li>
      <li><Link to="/create-blog" className={navLinkStyle}>Create Blog</Link></li>
      <li><button onClick={handleLogout} className={navLinkStyle}>Logout</button></li>
      <li className="text-sm px-3">
        <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 inline-block">
          Welcome, {user?.name}
        </span>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li><Link to="/login" className={navLinkStyle}>Login</Link></li>
      <li><Link to="/signup" className={navLinkStyle}>Sign Up</Link></li>
    </>
  );

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">BlogApp</Link>

        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <ul className={`flex flex-col md:flex-row md:items-center md:space-x-4 absolute md:static top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transition-all duration-300 ease-in-out z-40 ${isOpen ? 'block' : 'hidden md:flex'}`}>
          <li><Link to="/" className={navLinkStyle}>Home</Link></li>
          {isAuthenticated ? authLinks : guestLinks}
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;
