import React, { useEffect, useState } from "react";
import "./App.css";
import Board from "./component/Board";

const CanvasDrawing = () => {
  const [brushColor, setBrushColor] = useState("black");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [isEraserMode, setIsEraserMode] = useState<boolean>(false);
  const [eraserSize, setEraserSize] = useState<number>(10);

  useEffect(() => {
    console.log("CanvasDrawing ", brushSize);
  }, [brushSize]);

  const toggleEraserMode = () => {
    setIsEraserMode(!isEraserMode);
  };

  const handleEraserSizeChange = (size: number) => {
    setEraserSize(size);
  };

  return (
    <div className="App">
      <h1>Collaborative Whiteboard</h1>
      <div style={{ display: "flex" }}>
        <div
          style={{
            border: "5px solid red",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <Board
            brushColor={brushColor}
            brushSize={isEraserMode ? eraserSize : brushSize}
            isEraserMode={isEraserMode}
            eraserSize={eraserSize}
          />
        </div>

        <div className="tools">
          <div>
            <span>Color: </span>
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
            />
          </div>
          {!isEraserMode && (
            <div>
              <span>Size: </span>
              <input
                type="range"
                color="#fac176"
                min="1"
                max="100"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
              />
              <span>{brushSize}</span>
            </div>
          )}
          <div>
            <button onClick={toggleEraserMode}>
              {isEraserMode ? "Disable Eraser Mode" : "Enable Eraser Mode"}
            </button>
            {isEraserMode && (
              <div>
                <span>Eraser Size: </span>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={eraserSize}
                  onChange={(e) =>
                    handleEraserSizeChange(Number(e.target.value))
                  }
                />
                <span>{eraserSize}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasDrawing;
