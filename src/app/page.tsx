"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isClicked, setIsClicked] = useState(false);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const fetchUserScore = async (username: string) => {
    try {
      const { data }: { data: { name: string; score: number }[] } = await axios.get("/api/leaderboard");
  
      const user = data.find((player) => player.name === username); 
      if (user) {
        setScore(user.score);
      } else {
        setScore(0);
      }
    } catch (error) {
      console.error("Error fetching user score:", error);
      setScore(0);
    }
  };
  
  

  const handleClick = async () => {
    if (!submitted) return alert("กรุณากรอกชื่อก่อนเล่น!");

    setIsClicked(true);
    setScore((prev) => prev + 1);
    setTimeout(() => setIsClicked(false), 200);

    const popSound = new Audio("/pop.mp3");
    popSound.play();

    await axios.post("/api/leaderboard", { name, score: score + 1 });
  };

  const handleStartGame = async () => {
    setSubmitted(true);
    await fetchUserScore(name);
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await axios.get("/api/leaderboard");
      setLeaderboard(data);
    };
    fetchLeaderboard();
  }, [score]);

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: `url(${isClicked ? "/pop2.jpeg" : "/pop1.jpeg"})`,
      }}
    >
      <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-orange-500 drop-shadow-lg">
        Moodeng<span className="text-white">POP</span>
      </p>
      <p className=" sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
        PopLab Games
      </p>
      <p className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold">{score}</p>

      {!submitted ? (
        <div className="grid grid-cols-1 gap-4 mt-10 w-full max-w-md bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="กรอกชื่อของคุณ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 h-12 sm:h-14 md:h-16 rounded text-black w-full"
          />
          <button
            onClick={handleStartGame}
            className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg text-lg"
          >
            เริ่มเล่น
          </button>
        </div>
      ) : (
        <>
          <div
            onClick={handleClick}
            className="cursor-pointer select-none transition-transform duration-75 active:scale-90 mt-[25px] w-full h-full max-w-lg"
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="fixed bottom-10 bg-white px-6 py-3 text-black font-bold rounded-lg shadow-lg"
          >
            🏆 ดูอันดับคะแนน
          </button>

          <AnimatePresence>
            {isLeaderboardOpen && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-10 transform -translate-x-1/2 w-full max-w-md bg-white/50 backdrop-blur-md rounded-xl shadow-lg p-5"
              >
                <h2 className="text-lg sm:text-xl font-bold text-center">🏆 อันดับคะแนน</h2>
                <ol className="mt-2 text-left text-sm sm:text-md">
                  {leaderboard.map((user, index) => (
                    <li key={index} className="text-md sm:text-lg">
                      {index + 1}. {user.name} - {user.score} คะแนน
                    </li>
                  ))}
                </ol>
                <button
                  onClick={() => setIsLeaderboardOpen(false)}
                  className="w-full mt-4 bg-orange-500 text-white py-2 rounded-lg"
                >
                  ปิด
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
    
  );
}
