import React from "react";

import {
  Coffee,
  PhoneCall,
  Mail,
  MapPin,
  Copyright,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-orange-200 text-black">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Coffee size={36} className="text-orange-600" />
              <h3 className="text-3xl font-bold">
                Chiya<span className="text-orange-600">Hub</span>
              </h3>
            </div>
            <p className="text-justify">
              At Chiya Hub, savor the soul-warming essence of authentic Nepali
              chiya, blended with love and paired with delightful traditional
              snacks in a cozy Himalayan haven.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-orange-600">
              QUICK LINKS
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="/" className="hover:underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-orange-600">SUPPORT</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="hover:underline">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Feedback
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-orange-600">CONTACT</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5" />
                <span>Sales: +977 980-0000000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span>sales@chiyahub.com</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5" />
                <span>Support: +977 981-1111111</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span>support@chiyahub.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1" />
                <span>Pokhara-04, Gairapatan</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-orange-600 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Copyright className="w-6 h-6" />
            <span>{currentYear} Chiya Hub. All Rights Reserved.</span>
          </div>

          <div className="flex gap-6">
            <a href="" aria-label="Facebook">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="" aria-label="Instagram">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="" aria-label="Youtube">
              <Youtube className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
