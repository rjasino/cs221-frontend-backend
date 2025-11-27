import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Navigation Bar */}
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">
                <span className="text-red-500">DB</span>{" "}
                <span className="text-white">Quantum</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 hidden sm:block">
                Welcome,{" "}
                <span className="font-semibold text-white">
                  {user?.username}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg shadow-red-500/50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Dive Into The <span className="text-red-500">Future of Gaming</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Unleash unparalleled power and experience cinematic adventures with
            our cutting-edge selection.
          </p>
        </div>

        {/* User Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.first_name?.[0]?.toUpperCase() ||
                user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="ml-6">
              <h3 className="text-2xl font-bold text-white">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-gray-400">@{user?.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <p className="text-gray-400 text-sm mb-1">Email</p>
              <p className="text-white font-semibold">{user?.email}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <p className="text-gray-400 text-sm mb-1">Member Since</p>
              <p className="text-white font-semibold">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Gaming Categories */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white mb-6">
            Quantum Hub: Browse by Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* PlayStation Card */}
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-700/30 border border-blue-700/50 rounded-lg p-6 hover:scale-105 transition duration-300 cursor-pointer shadow-lg">
              <div className="text-center">
                <div className="text-4xl mb-4">🎮</div>
                <h4 className="text-xl font-bold text-white mb-2">
                  PlayStation 5
                </h4>
                <p className="text-blue-300 text-sm">Discover more →</p>
              </div>
            </div>

            {/* Nintendo Card */}
            <div className="bg-gradient-to-br from-red-900/50 to-red-700/30 border border-red-700/50 rounded-lg p-6 hover:scale-105 transition duration-300 cursor-pointer shadow-lg">
              <div className="text-center">
                <div className="text-4xl mb-4">🕹️</div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Nintendo Switch
                </h4>
                <p className="text-red-300 text-sm">Discover more →</p>
              </div>
            </div>

            {/* Xbox Card */}
            <div className="bg-gradient-to-br from-green-900/50 to-green-700/30 border border-green-700/50 rounded-lg p-6 hover:scale-105 transition duration-300 cursor-pointer shadow-lg">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-xl font-bold text-white mb-2">
                  XBOX Series X
                </h4>
                <p className="text-green-300 text-sm">Discover more →</p>
              </div>
            </div>

            {/* PC Card */}
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-700/30 border border-purple-700/50 rounded-lg p-6 hover:scale-105 transition duration-300 cursor-pointer shadow-lg">
              <div className="text-center">
                <div className="text-4xl mb-4">💻</div>
                <h4 className="text-xl font-bold text-white mb-2">PC & Mac</h4>
                <p className="text-purple-300 text-sm">Discover more →</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trusted Quality */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h4 className="text-xl font-bold text-white mb-2">
              Trusted Quality
            </h4>
            <p className="text-gray-400 text-sm">
              100% Brand New & Original. Shop with confidence.
            </p>
          </div>

          {/* Fast Shipping */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h4 className="text-xl font-bold text-white mb-2">
              Fast & Reliable Shipping
            </h4>
            <p className="text-gray-400 text-sm">
              Ships in 24 hours, express delivery available.
            </p>
          </div>

          {/* Loyalty Rewards */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">💎</div>
            <h4 className="text-xl font-bold text-white mb-2">
              Loyalty Rewards
            </h4>
            <p className="text-gray-400 text-sm">
              Sign in and earn points on every purchase.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            © 2025 Quantum Realm. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
