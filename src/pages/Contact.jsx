import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900">Get in Touch</h1>
        <p className="text-gray-600 mt-3 text-lg">
          We're here to help and answer any questions you might have.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
        
        {/* Left Section - Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white shadow-xl rounded-2xl p-8"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Send a Message</h2>

          <form className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/80"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/80"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Message</label>
              <textarea
                rows="5"
                placeholder="Write your message..."
                className="w-full p-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-black/80"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 bg-black text-white rounded-xl shadow-md hover:bg-gray-900 transition"
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>

        {/* Right Section - Contact Info + Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Contact Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg flex items-start gap-4"
            >
              <Mail className="w-8 h-8 text-black" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                <p className="text-gray-600 mt-1">support@myecommerce.com</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg flex items-start gap-4"
            >
              <Phone className="w-8 h-8 text-black" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                <p className="text-gray-600 mt-1">+92 321 1234567</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg flex items-start gap-4 sm:col-span-2"
            >
              <MapPin className="w-8 h-8 text-black" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Location</h3>
                <p className="text-gray-600 mt-1">Lahore, Pakistan</p>
              </div>
            </motion.div>
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <iframe
              title="map"
              className="w-full h-64 rounded-xl"
              src="https://maps.google.com/maps?q=lahore&t=&z=13&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
            ></iframe>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
