import React from "react";
import { motion } from "framer-motion";
import { Coffee, Utensils, Mountain, Clock, Users, Heart } from "lucide-react";

const Home = () => {
  return (
    <div className="bg-orange-50 min-h-screen w-full overflow-hidden">
      <section className="relative h-screen flex items-center justify-center bg-[url(/assets/Background_Image.jpg)]">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-8"
          >
            Welcome to Chiya Hub
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="bg-white p-12 rounded-3xl shadow-2xl"
          >
            <p className="text-2xl md:text-4xl font-semibold text-orange-600">
              Enjoy authentic Nepali tea and snacks!
            </p>
            <p className="text-lg md:text-xl text-gray-600 mt-6 flex items-center justify-center gap-2">
              Fresh, hot, and made with
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            </p>
          </motion.div>
        </div>
      </section>
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-orange-700 mb-12"
          >
            Our Specialties
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-orange-50 rounded-3xl p-8 shadow-xl"
            >
              <Coffee className="w-16 h-16 text-orange-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-orange-700 mb-4">
                Masala Chiya
              </h3>
              <p className="text-gray-700">
                Rich, spiced Nepali milk tea brewed with cardamom, cinnamon,
                ginger, and cloves. The perfect warm hug in a cup.
              </p>
              <img
                src="https://www.thespicehouse.com/cdn/shop/articles/Chai_Masala_Tea_1200x1200.jpg?v=1606936195"
                alt="Masala Chiya"
                className="mt-6 rounded-xl shadow-md"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-orange-50 rounded-3xl p-8 shadow-xl"
            >
              <Utensils className="w-16 h-16 text-orange-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-orange-700 mb-4">
                Steamed Momos
              </h3>
              <p className="text-gray-700">
                Juicy dumplings filled with seasoned vegetables or meat, served
                with spicy tomato achar.
              </p>
              <img
                src="https://media.istockphoto.com/id/1439955062/photo/nepali-style-fried-tibetan-momo-dumplings.jpg?s=612x612&w=0&k=20&c=de6WTqj7PUV9aXuZlf0RYxetQ-ZhmY4H3ntgs4IMDWo="
                alt="Momos"
                className="mt-6 rounded-xl shadow-md"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-orange-50 rounded-3xl p-8 shadow-xl"
            >
              <Heart className="w-16 h-16 text-orange-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-orange-700 mb-4">
                Sel Roti & Snacks
              </h3>
              <p className="text-gray-700">
                Sel roti is a traditional Nepali sweet bread made and crispy
                ring-shaped rice doughnut and other traditional treats.
              </p>
              <img
                src="https://sewapoint.com/image-categories/image-1719823291207-1_HF_D_m5XwWDN-5nJGQBs2w.jpg"
                alt="Sel Roti"
                className="mt-6 rounded-xl shadow-md"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-orange-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-orange-700 mb-8">
              A Cozy Himalayan Escape
            </h2>
            <p className="text-xl text-gray-800 mb-6 sm:text-justify">
              Step into Chiya Hub and feel the warmth of a traditional Nepali
              tea house. Wooden interiors, soft lighting, and the aroma of fresh
              chiya create the perfect spot to relax.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="flex items-center gap-4">
                <Users className="w-10 h-10 text-orange-600" />
                <p className="text-lg">Friendly service</p>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="w-10 h-10 text-orange-600" />
                <p className="text-lg">Open daily 7AM - 10PM</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            <img
              src="https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img/https://embarkexplorationco.com/wp-content/uploads/2018/06/Nepal-Tea-Houses-3-400x300.jpg"
              alt="Cozy interior"
              className="rounded-2xl shadow-xl"
            />
            <img
              src="https://cdn.kimkim.com/files/a/content_articles/featured_photos/53f1f56d7a45889d2ed51a3812908f3bef1fbd89/big-249b416ebd13daa016cdcbd70283d712.jpg"
              alt="Tea house vibe"
              className="rounded-2xl shadow-xl"
            />
            <img
              src="https://us.images.westend61.de/0001038835j/hand-of-person-holding-tea-cup-group-of-people-sitting-at-a-camp-fire-KKAF01950.jpg"
              alt="Warm atmosphere"
              className="rounded-2xl shadow-xl"
            />
            <img
              src="https://static.wixstatic.com/media/55e9e2_fd096fa24baf4bddb22a7469e250c310~mv2.jpg/v1/fill/w_754,h_567,al_c,q_85,enc_avif,quality_auto/55e9e2_fd096fa24baf4bddb22a7469e250c310~mv2.jpg"
              alt="Traditional setting"
              className="rounded-2xl shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-linear-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-8"
          >
            Visit Us Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-12"
          >
            Experience the authentic taste of Nepal in every sip and bite.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-8"
          >
            <Mountain className="w-20 h-20" />
            <Coffee className="w-20 h-20" />
            <Heart className="w-20 h-20 fill-white" />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
