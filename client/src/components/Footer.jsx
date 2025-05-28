import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWarehouse,
  FaRocket,
  FaGlobe,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [showFooter, setShowFooter] = useState(true);
  const user = useSelector((state) => state.user);

  const socialIcons = [
    {
      icon: <FaFacebook />,
      color: "text-blue-500",
      name: "Facebook",
      url: "https://facebook.com",
    },
    {
      icon: <FaTwitter />,
      color: "text-sky-400",
      name: "Twitter",
      url: "https://twitter.com",
    },
    {
      icon: <FaInstagram />,
      color: "text-pink-500",
      name: "Instagram",
      url: "https://instagram.com",
    },
    {
      icon: <FaLinkedin />,
      color: "text-blue-400",
      name: "LinkedIn",
      url: "https://linkedin.com",
    },
  ];

  return (
    <>
      <footer className="relative bg-white text-white pt-10 border-gray-700 overflow-hidden z-0">
        {/* Toggle Button */}
        <div className="absolute top-0 right-4 z-20 ">
          <motion.button
            onClick={() => setShowFooter(!showFooter)}
            className="text-4xl bg-gradient-to-br rounded-full text-black p-2 shadow-md transition-transform bottom-8 border"
          >
            {showFooter ? "-" : "+"}
          </motion.button>
        </div>

        {/* Background Particles */}
        {/* <div className="absolute inset-0 pointer-events-none z-0 bg-blue-50 ">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: 0.2,
                scale: Math.random(),
              }}
              animate={{
                y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                opacity: [0.2, 0.4, 0.2],
                scale: [0.5, 1, 0.5],
                transition: {
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: "mirror",
                },
              }}
              className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full shadow-purple-500"
            />
          ))}
        </div> */}

        <div className=" px-0 relative z-10 rounded-xl bg-blue-50">
          <AnimatePresence>
            {showFooter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="backdrop-blur-sm bg-white/5 rounded-xl p-8 shadow-xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                  {/* Company Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <FaRocket className="text-3xl text-pink-500 animate-pulse" />
                      <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                        NexBasket Commerce
                      </h3>
                    </div>
                    <p className="text-black text-sm">
                      Revolutionizing e-commerce with quantum-speed deliveries
                      and AI-powered logistics.
                    </p>
                    <div className="flex items-center gap-2 text-black text-sm">
                      <FaGlobe className="text-purple-400" />
                      <span>Global Operations Since 2016</span>
                    </div>
                  </motion.div>

                  {/* Quick Links */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-pink-400">
                      Quantum Links
                    </h3>
                    <ul className="space-y-2">
                      {["About Our Technology", "Join Our Team", "Privacy Portal"].map((text, idx) => (
                        <li key={idx}>
                          <Link className="text-gray-700 hover:text-pink-400 transition-colors flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                            {text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Warehouse CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-purple-400">
                      Neural Network
                    </h3>
                    <p className="text-gray-900 text-sm">
                      Connect with our distributed warehouse intelligence
                      network.
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      {(user.role === "ADMIN" || user.role === "WAREHOUSE") && (
                        <Link
                          to="/warehouse-List"
                          className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm rounded-full shadow-lg hover:shadow-pink-500/50 transition-all"
                        >
                          <FaWarehouse className="mr-2 text-lg" />
                          Go to Warehouse Page
                        </Link>
                      )}
                    </motion.div>
                  </motion.div>
                </div>

                <div className="border-t border-gray-700/50 my-8"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center md:text-left text-gray-500 text-sm"
                  >
                    <p>&copy; Blink Commerce Private Limited, 2016-2025</p>
                    <p className="text-xs mt-1">
                      All rights reserved across all dimensions.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-6 text-2xl"
                  >
                    {socialIcons.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`relative ${social.color} hover:shadow-lg hover:shadow-${social.color}/50 transition-transform`}
                        onHoverStart={() => setHoveredIcon(index)}
                        onHoverEnd={() => setHoveredIcon(null)}
                        whileHover={{ y: -5, scale: 1.2 }}
                      >
                        {social.icon}
                        <AnimatePresence>
                          {hoveredIcon === index && (
                            <motion.span
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 px-2 py-1 rounded shadow-lg"
                            >
                              {social.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.a>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </footer>
    </>
  );
};

export default Footer;
