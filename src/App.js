import React, { useState, useEffect, useRef, useCallback } from "react";

import "./App.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEraser,
  faTrashAlt,
  faSave
} from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const canvasRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isPainting, setIsPainting] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(5);
  const [isEraserOn, setIsEraserOn] = useState(false);

  const startPaint = useCallback(e => {
    const coordinates = getCoordinates(e);
    if (coordinates) {
      setIsPainting(true);
      setMouse(coordinates);
    }
  });

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;

    canvas.addEventListener("mousedown", startPaint);
    return () => {
      canvas.removeEventListener("mousedown", startPaint);
    };
  }, [startPaint]);

  const paint = useCallback(
    e => {
      if (isPainting) {
        const newMouse = getCoordinates(e);
        if (mouse && newMouse) {
          drawLine(mouse, newMouse);
          setMouse(newMouse);
        }
      }
    },
    [isPainting, mouse]
  );

  const drawLine = (originalMouse, newMouse) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context) {
      context.strokeStyle = color;
      context.lineJoin = "round";
      context.lineWidth = lineWidth;

      context.beginPath();
      context.moveTo(originalMouse.x, originalMouse.y);
      context.lineTo(newMouse.x, newMouse.y);
      context.closePath();

      context.stroke();
    }
  };

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    canvas.addEventListener("mousemove", paint);
    return () => {
      canvas.removeEventListener("mousemove", paint);
    };
  }, [paint]);

  const exitPaint = useCallback(() => {
    setIsPainting(false);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    canvas.addEventListener("mouseup", exitPaint);
    canvas.addEventListener("mouseleave", exitPaint);
    return () => {
      canvas.removeEventListener("mouseup", exitPaint);
      canvas.removeEventListener("mouseleave", exitPaint);
    };
  }, [exitPaint]);

  const getCoordinates = e => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    return { x: e.pageX - canvas.offsetLeft, y: e.pageY - canvas.offsetTop };
  };

  const colorOnChange = e => {
    if (isEraserOn) {
      setIsEraserOn(false);
    }
    setColor(e.target.value);
  };

  const lineWidthOnChange = e => {
    const { value } = e.target;
    console.log(value);
    setLineWidth(parseInt(value, 10));
  };

  const eraserOnClick = () => {
    setColor("#ffffff");
    setIsEraserOn(true);
  };

  const clearOnClick = () => {
    const context = canvasRef.current.getContext("2d");

    context.clearRect(
      0,
      0,
      canvasRef.current.offsetWidth,
      canvasRef.current.offsetHeight
    );
  };

  const saveAsImageOnClick = () => {
    const link = document.createElement("a");
    link.download = "image.jpeg";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="app-container">
      <div className="tools">
        <label
          style={{ backgroundColor: color }}
          className="color-picker-label"
        >
          <input
            className="color-picker"
            onChange={colorOnChange}
            type="color"
            value={color}
          />
        </label>
        <div className="stroke-width-container">
          <label>Stroke</label>
          <select
            className="stroke-width"
            onChange={lineWidthOnChange}
            value={lineWidth}
          >
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <FontAwesomeIcon
          icon={faEraser}
          onClick={eraserOnClick}
          className="eraser-button"
        />
        <FontAwesomeIcon
          icon={faTrashAlt}
          onClick={clearOnClick}
          className="clear"
        />
        <FontAwesomeIcon
          className="save"
          onClick={saveAsImageOnClick}
          icon={faSave}
        />
      </div>
      <canvas
        className={`canvas ${isEraserOn ? "eraser" : "pencil"}`}
        ref={canvasRef}
        width={"1920px"}
        height={"1080px"}
      ></canvas>
    </div>
  );
};

export default App;
