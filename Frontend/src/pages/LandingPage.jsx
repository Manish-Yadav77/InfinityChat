import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Zap, Shield, Code } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/60 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <img src="/InfinityChat.png" className="text-blue-500 h-8 w-9 bg-black rounded-full" alt="logo"/>
            <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              InfinityChat
            </h1>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-gray-400 hover:text-white transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold transition"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="flex sm:hidden">
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition"
            >
              Join
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center px-6 pt-32 sm:pt-40 pb-16 sm:pb-24">
        <h2 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
          Your Free, <span className="text-blue-500">Unlimited</span> <br />
          AI Chat Assistant
        </h2>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-8">
          Chat seamlessly with Google’s Gemini-powered AI — fast, private, and
          completely free. Perfect for learning, coding, and productivity.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="px-8 py-4 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl text-lg font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105"
        >
          Get Started — It's Free 🚀
        </button>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: <Zap size={26} />,
            title: "Lightning Fast",
            desc: "Instant responses powered by cutting-edge AI models.",
          },
          {
            icon: <Shield size={26} />,
            title: "Private & Secure",
            desc: "All conversations are encrypted and stored safely.",
          },
          {
            icon: <Code size={26} />,
            title: "Code Assistant",
            desc: "Get help with debugging, code explanations, and snippets.",
          },
          {
            icon: <MessageCircle size={26} />,
            title: "Chat History",
            desc: "Access, manage, and continue your past conversations anytime.",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-linear-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-md shadow-blue-500/30">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-8 text-center text-gray-400 text-sm relative overflow-hidden">
        {/* Gradient Glow */}
        <div className="absolute inset-0 bg-linear-to-r from-purple-600/10 via-blue-500/5 to-cyan-400/10 blur-3xl opacity-40 pointer-events-none"></div>

        <p className="relative z-10 mb-2 text-gray-300">
          © {new Date().getFullYear()} <span className="font-semibold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-cyan-300">InfinityChat</span> —
          Built with 💙 using React.js & Google AI Studio.
        </p>

        <p className="relative z-10 text-gray-500 mt-1">
          Crafted by{" "}
          <a
            href="https://www.linkedin.com/in/manish-yadav-fullstack-mern/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-cyan-300 hover:brightness-125 transition-all"
          >
            Manish Kumar Yadav
          </a>
        </p>
      </footer>

    </div>
  );
}
