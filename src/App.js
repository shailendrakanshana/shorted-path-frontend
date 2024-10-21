import React, { useState } from "react";

const Grid = () => {
  // State to store selected start and end tiles
  const [startTile, setStartTile] = useState(null);
  const [endTile, setEndTile] = useState(null);
  const [path, setPath] = useState([]);

  // Function to handle tile click
  const handleTileClick = (row, col) => {
    if (!startTile) {
      setStartTile([row, col]);
    } else if (!endTile) {
      setEndTile([row, col]);
      // Trigger API call after selecting the end tile
      console.log("This is the data : ", startTile[0], startTile[1], row, col);
      findPath([startTile[0], startTile[1]], [row, col]);
    }
  };

  // Function to fetch path from backend
  const findPath = async (start, end) => {
    try {
      const response = await fetch("http://localhost:8080/find-path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ start, end }),
      });
      const data = await response.json();
      console.log("Received path data:", data);
      setPath(data.path); // Assuming backend returns an array of coordinates
    } catch (error) {
      console.error("Error fetching path:", error);
    }
  };

  // Helper function to render each tile
  const renderTile = (row, col) => {
    const isStart = startTile && startTile[0] === row && startTile[1] === col;
    const isEnd = endTile && endTile[0] === row && endTile[1] === col;
    const isPath = path.some(([pRow, pCol]) => pRow === row && pCol === col);
  
    let bgColor = "bg-gray-100";
    if (isStart) bgColor = "bg-green-500";
    if (isEnd) bgColor = "bg-red-500";
    if (isPath) bgColor = "bg-blue-500";
  
    return (
      <div
        key={`${row}-${col}`}
        className={`w-[30px] h-[30px] border border-black ${bgColor} cursor-pointer rounded hover:border-green-500 hover:greay`}
        onClick={() => handleTileClick(row, col)}
      />
    );
  };

  return (
    <div>
      <button className="bg-white border border-black px-4 py-1 rounded-xl hover:py-2 hover:px-6 " onClick={() => {setEndTile(null); setStartTile(null);setPath([]);}}>
        Reset
      </button>
      <div className="grid grid-cols-20 gap-1 w-[900px] h-auto p-4">
        {Array.from({ length: 20 }).map((_, row) => (
          <div key={row} className="flex">
            {Array.from({ length: 20 }).map((_, col) => (
              <div key={col} className="w-full h-full">
                {renderTile(row, col)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

  );
};

const App = () => (
  <div className="flex justify-center items-center h-screen bg-purple-400">
    <Grid />
  </div>
);

export default App;
