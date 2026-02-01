import React from "react"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Medicos
              </span>
          <p className="text-sm">
            Premium furniture crafted with elegance, comfort,
            and timeless design. Transform your space with us.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
            <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
            <Twitter className="w-5 h-5 hover:text-white cursor-pointer" />
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Living Room</li>
            <li className="hover:text-white cursor-pointer">Bedroom</li>
            <li className="hover:text-white cursor-pointer">Office Furniture</li>
            <li className="hover:text-white cursor-pointer">Outdoor</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Contact Us</li>
            <li className="hover:text-white cursor-pointer">Return Policy</li>
            <li className="hover:text-white cursor-pointer">FAQs</li>
            <li className="hover:text-white cursor-pointer">Shipping Info</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>

          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-5 h-5" />
            <p className="text-sm">123 Furniture Street, Karachi</p>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <Phone className="w-5 h-5" />
            <p className="text-sm">+92 300 123 4567</p>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5" />
            <p className="text-sm">support@furnistore.com</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-5 text-center text-sm">
        © {new Date().getFullYear()} MEDICOS — All Rights Reserved.
      </div>
    </footer>
  );
}
