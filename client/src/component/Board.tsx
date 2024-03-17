import React, { useRef, useEffect } from "react";
import io, { Socket } from "socket.io-client";

interface MyBoard {
  brushColor: string;
  brushSize: number;
  isEraserMode: boolean;
  eraserSize: number;
}

const Board: React.FC<MyBoard> = (props) => {
  const { brushColor, brushSize, isEraserMode, eraserSize } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = React.useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect(); // Disconnect socket on unmount
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("canvasImage", (data: string) => {
        const image = new Image();
        image.src = data;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
          image.onload = () => {
            ctx.drawImage(image, 0, 0);
          };
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e: MouseEvent) => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = isEraserMode ? "white" : brushColor;
        ctx.lineWidth = isEraserMode ? eraserSize : brushSize;
        ctx.stroke();
      }

      [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    const endDrawing = () => {
      const canvas = canvasRef.current;
      const dataURL = canvas?.toDataURL();

      if (socket && dataURL) {
        socket.emit("canvasImage", dataURL);
      }
      isDrawing = false;
    };

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }

    canvas?.addEventListener("mousedown", startDrawing);
    canvas?.addEventListener("mousemove", draw);
    canvas?.addEventListener("mouseup", endDrawing);
    canvas?.addEventListener("mouseout", endDrawing);

    return () => {
      canvas?.removeEventListener("mousedown", startDrawing);
      canvas?.removeEventListener("mousemove", draw);
      canvas?.removeEventListener("mouseup", endDrawing);
      canvas?.removeEventListener("mouseout", endDrawing);
    };
  }, [brushColor, brushSize, eraserSize, isEraserMode, socket]);

  const [windowSize, setWindowSize] = React.useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={windowSize[0] > 600 ? 600 : 300}
      height={windowSize[1] > 400 ? 400 : 200}
      style={{ backgroundColor: "white" }}
    />
  );
};

export default Board;
