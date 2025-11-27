import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold">
              <span className="text-red-500">DB</span>{" "}
              <span className="text-white">Quantum</span>
            </h1>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:text-red-400 font-semibold transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fadeIn">
            Dive Into The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600">
              Future of Gaming
            </span>
          </h2>
          <p className="text-gray-400 text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Unleash unparalleled power and experience cinematic adventures with
            our cutting-edge selection.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg shadow-red-500/50 text-lg"
            >
              {user ? "Go to Dashboard" : "Get Started"}
            </Link>
            <Link
              to="#categories"
              className="border-2 border-white/30 hover:border-red-500 text-white font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105 text-lg"
            >
              Explore Now
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div
          id="features"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:scale-105 transition duration-300">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Trusted Quality
            </h3>
            <p className="text-gray-400 text-sm">
              100% Brand New & Original. Shop with confidence.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:scale-105 transition duration-300">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Fast & Reliable Shipping
            </h3>
            <p className="text-gray-400 text-sm">
              Ships in 24 hours, express delivery available.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:scale-105 transition duration-300">
            <div className="text-5xl mb-4">💎</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Loyalty Rewards
            </h3>
            <p className="text-gray-400 text-sm">
              Sign in and earn points on every purchase.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center hover:scale-105 transition duration-300">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Secure Transactions
            </h3>
            <p className="text-gray-400 text-sm">
              Your data is protected with state-of-the-art encryption.
            </p>
          </div>
        </div>

        {/* Gaming Categories */}
        <div id="categories" className="mb-20">
          <h3 className="text-4xl font-bold text-white text-center mb-10">
            Quantum Hub: Browse by Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-700/30 border border-blue-700/50 rounded-lg p-8 hover:scale-105 transition duration-300 cursor-pointer shadow-xl">
              <div className="text-center">
                <div className="text-6xl mb-6">🎮</div>
                <h4 className="text-2xl font-bold text-white mb-3">
                  PlayStation 5
                </h4>
                <p className="text-blue-300 font-semibold">Discover more →</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-900/50 to-red-700/30 border border-red-700/50 rounded-lg p-8 hover:scale-105 transition duration-300 cursor-pointer shadow-xl">
              <div className="text-center">
                <div className="text-6xl mb-6">🕹️</div>
                <h4 className="text-2xl font-bold text-white mb-3">
                  Nintendo Switch
                </h4>
                <p className="text-red-300 font-semibold">Discover more →</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/50 to-green-700/30 border border-green-700/50 rounded-lg p-8 hover:scale-105 transition duration-300 cursor-pointer shadow-xl">
              <div className="text-center">
                <div className="text-6xl mb-6">🎯</div>
                <h4 className="text-2xl font-bold text-white mb-3">
                  XBOX Series X
                </h4>
                <p className="text-green-300 font-semibold">Discover more →</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-purple-700/30 border border-purple-700/50 rounded-lg p-8 hover:scale-105 transition duration-300 cursor-pointer shadow-xl">
              <div className="text-center">
                <div className="text-6xl mb-6">💻</div>
                <h4 className="text-2xl font-bold text-white mb-3">PC & Mac</h4>
                <p className="text-purple-300 font-semibold">Discover more →</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-600/20 border border-red-500/50 rounded-2xl p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Join the Quantum Community
            </h3>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive updates, new product
              launches, and special promotions!
            </p>
            <Link
              to="/register"
              className="inline-block bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-4 px-10 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg shadow-red-500/50 text-lg"
            >
              Create Your Account
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-4">
                Quantum Realm
              </h4>
              <p className="text-gray-400 text-sm">
                Your universe for cutting-edge gaming and multimedia technology.
                Experience the future of entertainment.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Gaming</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-red-400 cursor-pointer transition">
                  PlayStation 5
                </li>
                <li className="hover:text-red-400 cursor-pointer transition">
                  Nintendo Switch
                </li>
                <li className="hover:text-red-400 cursor-pointer transition">
                  Xbox Series X
                </li>
                <li className="hover:text-red-400 cursor-pointer transition">
                  PC Gaming
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-red-400 cursor-pointer transition">
                  FAQs
                </li>
                <li className="hover:text-red-400 cursor-pointer transition">
                  Shipping & Returns
                </li>
                <li className="hover:text-red-400 cursor-pointer transition">
                  Privacy Policy
                </li>
                <li className="hover:text-red-400 cursor-pointer transition">
                  Terms of Service
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-4">About</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-red-400 cursor-pointer transition">
                  Our Story
                </li>
                <li className="hover:text-red-400 cursor-pointer transition">
                  Careers
                </li>
                <li className="hover:text-red-400 cursor-pointer transition">
                  Contact Us
                </li>
                <li className="hover:text-red-400 cursor-pointer transition">
                  Store Locations
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-gray-500 text-sm">
            © 2025 Quantum Realm. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
