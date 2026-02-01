import React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Zap, Users, Leaf, Sparkles, DollarSign, Truck, Shield, Star, ArrowRight, ShoppingCart, Check, AlertCircle, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useCartSidebar } from "../context/CartSidebarContext"
import { toast } from "react-toastify"
import HomePageWrapper from "./Homepagewrapper"

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Helper function to extract image URL from product
const getImageUrl = (imageData) => {
  if (!imageData) return null;
  if (typeof imageData === 'string') return imageData;
  if (typeof imageData === 'object' && imageData.url) return imageData.url;
  return null;
};

export default function Home() {
  const heroImages = [
    assets.img_1,
    assets.img_2,
  ]

  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { openCart } = useCartSidebar()

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [collections, setCollections] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState({})
  const [cartSuccess, setCartSuccess] = useState({})

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  // Fetch products and collections from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [colRes, prodRes] = await Promise.all([
          fetch(`${API_BASE}/collections/get-collections?limit=8`),
          fetch(`${API_BASE}/products/get-allproducts`),
        ])

        const colJson = await colRes.json()
        const prodJson = await prodRes.json()

        const productsData = (prodJson?.products || []).slice(0, 9);
        
        setCollections(colJson?.data || [])
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const features = [
    {
      icon: Shield,
      title: "Uncompromising Quality",
      description:
        "Every sofa is meticulously crafted using only the finest materials for lasting comfort and durability.",
    },
    {
      icon: Users,
      title: "Customer-Centric Approach",
      description: "Your satisfaction is our priority. We're dedicated to providing exceptional service and support.",
    },
    {
      icon: Leaf,
      title: "Sustainable Practices",
      description:
        "We are committed to eco-friendly manufacturing and sourcing, minimizing our environmental footprint.",
    },
    {
      icon: Sparkles,
      title: "Innovative Design",
      description: "Pushing boundaries with contemporary designs that blend aesthetics, comfort, and functionality.",
    },
    {
      icon: DollarSign,
      title: "Exceptional Value",
      description: "Offering premium quality sofas at fair prices, ensuring you get the best for your investment.",
    },
  ]

  const benefits = [
    { icon: Truck, title: "Free Shipping", description: "On all orders over £50" },
    { icon: Shield, title: "Secure Checkout", description: "100% safe transactions" },
    { icon: Zap, title: "Fast Delivery", description: "Usually within 2-3 days" },
  ]

  const handleAddToCart = async (productId, productName) => {
    if (!user) {
      toast.error('Please login to add items to cart', {
        position: 'top-right',
        autoClose: 3000,
      });
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));

    const result = await addToCart(productId, 1);

    if (result.success) {
      setCartSuccess(prev => ({ ...prev, [productId]: true }));
      
      toast.success(`${productName} added to cart!`, {
        position: 'top-right',
        autoClose: 2000,
      });

      setTimeout(() => {
        openCart();
      }, 300);

      setTimeout(() => {
        setCartSuccess(prev => ({ ...prev, [productId]: false }));
      }, 2000);
    } else {
      toast.error(result.error || 'Failed to add to cart', {
        position: 'top-right',
        autoClose: 3000,
      });
    }

    setAddingToCart(prev => ({ ...prev, [productId]: false }));
  };

  return (
    <HomePageWrapper>
    <div className="min-h-screen bg-background">
      {/* Hero Section with Animated Background */}
      <div className="relative h-screen w-full overflow-hidden pt-20">
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${img}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{
                opacity: index === currentHeroIndex ? 1 : 0,
                scale: index === currentHeroIndex ? 1 : 1.1,
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          ))}
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 ">
              ✨ Up to 40% Off
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-6">
              Transform Your Living Space
            </h1>
            <p className="text-lg sm:text-xl text-gray-100 drop-shadow-md mb-8 max-w-2xl mx-auto">
              Discover luxury comfort with our handcrafted sofas designed for modern living
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-white/70 hover:bg-white/90 text-accent-foreground px-8 py-3 rounded-full font-bold transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now
              </motion.button>
              <motion.button
                className="border border-black/80 bg-black/80  text-white px-8 py-3 rounded-full font-bold hover:bg-black/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Collection
              </motion.button>
            </div>
          </motion.div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 flex gap-2">
            {heroImages.map((_, index) => (
              <motion.button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentHeroIndex ? "bg-accent w-8" : "bg-white/50 hover:bg-white/70"
                }`}
                onClick={() => setCurrentHeroIndex(index)}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Collection Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Our Collections</h2>
            <p className="text-muted-foreground text-lg">Explore our premium collections</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((category, idx) => (
                <motion.div
                  key={category._id || idx}
                  className="group relative h-80 rounded-2xl overflow-hidden bg-card shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                  whileHover={{ y: -4 }}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 group-hover:scale-110 transition-transform duration-500 bg-gradient-to-br from-blue-400 to-purple-600"
                    style={{
                      backgroundImage: category.image?.url ? `url('${category.image.url}')` : 'none',
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  {/* Default state - show title and description */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{category.name}</h3>
                    <p className="text-gray-200 text-sm">{category.description || 'Explore this collection'}</p>
                  </div>

                  {/* Hover state - show centered content with button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
                      {category.name}
                    </h3>
                    <motion.button 
                      onClick={() => navigate(`/collections/${category._id}/products`)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center gap-2 bg-black/80 text-white font-bold py-3 px-8 rounded-full hover:bg-black/60  transition-all shadow-lg cursor-pointer"
                    >
                      Explore Now <ArrowRight size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our curated collection of premium and lifestyle products
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((product, index) => {
                const productId = product._id;
                const productName = product.title || product.name;
                const isAdding = addingToCart[productId];
                const showSuccess = cartSuccess[productId];

                return (
                  <motion.div
                    key={productId || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group flex flex-col bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Product Image Card */}
                    <div 
                      className="relative bg-gray-100 h-64 sm:h-72 overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/products/${productId}`)}
                    >
                      <motion.div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ 
                          backgroundImage: product.images && product.images.length > 0 && getImageUrl(product.images[0]) ? `url('${getImageUrl(product.images[0])}')` : 'none'
                        }}
                        whileHover={{ scale: 1.1 }}
                      />
                    </div>

                    {/* Product Info Card */}
                    <div className="flex-1 p-6 flex flex-col">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                        {productName}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 flex-1">
                        {product.description ? product.description.substring(0, 100) + '...' : 'Premium quality product'}
                      </p>

                      {/* Price and Rating */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                          £{product.price}
                        </span>
                        <motion.div
                          className="flex items-center gap-1"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="text-sm font-semibold text-foreground">4.5</span>
                        </motion.div>
                      </div>

                      <motion.button
                        onClick={() => handleAddToCart(productId, productName)}
                        disabled={isAdding || showSuccess}
                        whileHover={{ scale: isAdding || showSuccess ? 1 : 1.05 }}
                        whileTap={{ scale: isAdding || showSuccess ? 1 : 0.95 }}
                        className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer ${
                          showSuccess
                            ? 'bg-green-600 text-white'
                            : 'bg-black text-white hover:bg-gray-800'
                        }`}
                      >
                        {showSuccess ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added!</span>
                          </>
                        ) : isAdding ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Adding...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" /> 
                            <span>Add to Cart</span> 
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Image */}
            <motion.div
              className="relative h-96 sm:h-[500px] rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl sm:text-4xl font-bold mb-2">Crafted with Passion</h3>
                <p className="text-gray-200 text-sm sm:text-base">
                  Every piece tells a story of dedication, quality, and timeless design.
                </p>
              </div>
            </motion.div>

            {/* Right Side - Features List */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div key={index} className="flex gap-4" whileHover={{ x: 8 }} transition={{ duration: 0.3 }}>
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/10">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground mb-1">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-foreground text-background rounded-2xl p-8 md:p-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl  font-bold mb-4">Stay Updated</h2>
              <p className="text-background/80 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for exclusive deals, new arrivals, and style inspiration.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-background"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-black  text-white font-semibold rounded-full cursor-pointer hover:bg-muted transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
        </div>
      </section>

    </div>
    </HomePageWrapper>
  )
}