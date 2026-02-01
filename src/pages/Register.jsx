import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/register`, formData);
      
      console.log("Registration successful:", response.data);
      
      // Redirect to login page - token is in httpOnly cookie
      navigate("/login");
    } catch (err) {
      if (err.response) {
        // Server responded with error
        setError(err.response.data.message || "Registration failed. Please try again.");
      } else if (err.request) {
        // Request made but no response
        setError("Network error. Please check your connection.");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white text-gray-900">
      {/* Left side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gray-900 text-yellow-400 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 border border-yellow-400 rounded-full" />
          <div className="absolute bottom-20 left-20 w-48 h-48 border border-yellow-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-yellow-400 rounded-full" />
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/20 px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4" />
              Start Your Journey
            </div>
            <h2 className="text-4xl font-bold tracking-tight">
              Create your account in seconds
            </h2>
            <p className="text-yellow-400/80 text-lg leading-relaxed">
              Get started today and unlock powerful features designed to help you succeed. No
              credit card required.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-400/10 border border-yellow-400/20 backdrop-blur rounded-lg">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center shrink-0">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <p className="font-medium text-yellow-400">Free Forever Plan</p>
                    <p className="text-sm text-yellow-400/70">Start with generous free tier</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-400/10 border border-yellow-400/20 backdrop-blur rounded-lg">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center shrink-0">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div>
                    <p className="font-medium text-yellow-400">No Setup Required</p>
                    <p className="text-sm text-yellow-400/70">Get started in less than 60 seconds</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-400/10 border border-yellow-400/20 backdrop-blur rounded-lg">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center shrink-0">
                    <span className="text-2xl">💎</span>
                  </div>
                  <div>
                    <p className="font-medium text-yellow-400">Premium Support</p>
                    <p className="text-sm text-yellow-400/70">24/7 assistance from our team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {/* Brand Name */}
              <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Medicos
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-gray-600">Get started with your free account today</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-none mt-1"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-gray-900 hover:underline">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-gray-900 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Google Login Button */}
            <button
              type="button"
              className="w-full cursor-pointer border border-gray-300 bg-white py-2.5 px-4 rounded-md hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-gray-700 hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </button>

            {/* GitHub Login Button */}
            <button
              type="button"
              className="w-full border cursor-pointer border-gray-800 bg-gray-900 text-white py-2.5 px-4 rounded-md hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium hover:shadow-md"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-900 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}