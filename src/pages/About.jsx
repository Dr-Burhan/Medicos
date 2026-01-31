import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Our Store
          </h1>
          <p className="text-lg text-gray-300">
            Premium products. Exceptional quality. Unmatched experience.
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 leading-7">
            We started with a simple mission — to bring premium, high-quality,
            affordable products to customers worldwide. What began as a small
            online store has grown into a trusted ecommerce brand serving
            thousands of happy customers.
          </p>

          <p className="mt-4 text-gray-600 leading-7">
            Our goal is to redefine the online shopping experience by offering
            beautifully designed products, transparent pricing, easy returns,
            and world-class customer support.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img
            src={assets.img_2}
            alt="Our Store"
            className="rounded-2xl shadow-xl"
          />
        </motion.div>
      </section>

      {/* Mission + Vision */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-100 p-8 rounded-2xl shadow-sm"
          >
            <h3 className="text-2xl font-semibold mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-7">
              To make modern, durable, and stylish products accessible to
              everyone — without compromising on quality or sustainability.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-100 p-8 rounded-2xl shadow-sm"
          >
            <h3 className="text-2xl font-semibold mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-7">
              To become a global leader in ecommerce by building trust,
              delivering exceptional value, and enhancing digital shopping
              experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Our Values</h2>

          <div className="grid md:grid-cols-3 gap-8">
            
            {[
              {
                title: "Quality",
                text: "We source products with the highest standards and attention to detail."
              },
              {
                title: "Customer First",
                text: "Your satisfaction is our priority — always."
              },
              {
                title: "Innovation",
                text: "We evolve continuously to bring you modern and innovative solutions."
              }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.text}</p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-14 px-6 bg-white text-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          {[
            { number: "10,000+", label: "Happy Customers" },
            { number: "1,200+", label: "Premium Products" },
            { number: "35+", label: "Countries Served" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <h3 className="text-4xl font-bold text-black">{stat.number}</h3>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </motion.div>
          ))}

        </div>
      </section>
      
    </div>
  );
};

export default About;
