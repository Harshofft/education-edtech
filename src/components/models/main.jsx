import React, { useState, useRef } from "react";
import {
  FaCloudUploadAlt,
  FaCamera,
  FaPaperPlane,
  FaVideo,
  FaVideoSlash,
  FaTrash,
} from "react-icons/fa";
import Webcam from "react-webcam";
import { GoogleGenerativeAI } from "@google/generative-ai";

const CameraComponent = ({ setImage, setImagePreview, onImagePresent }) => {
  const webcamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(true);

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImage(imageSrc);
        setImagePreview(imageSrc);
        onImagePresent(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-xl shadow-2xl bg-white w-full md:w-1/2">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Camera Input</h3>
      {cameraActive ? (
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-xl w-full max-w-xs h-48 shadow-lg"
        />
      ) : (
        <div className="rounded-xl w-full max-w-xs h-48 bg-gray-200 flex items-center justify-center shadow-lg text-sm text-gray-600">
          Camera Off
        </div>
      )}
      <div className="flex gap-2 mt-3">
        <button
          onClick={capture}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 shadow-md"
        >
          <FaCamera className="text-xl" />
        </button>
        <button
          onClick={() => setCameraActive(!cameraActive)}
          className="bg-gray-400 text-white p-3 rounded-full hover:bg-gray-500 shadow-md"
        >
          {cameraActive ? <FaVideoSlash className="text-xl" /> : <FaVideo className="text-xl" />}
        </button>
      </div>
    </div>
  );
};

const GeminiImageText = () => {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [cameraImage, setCameraImage] = useState(null);
  const [showOutput, setShowOutput] = useState(false);
  const fileInputRef = useRef(null);
  const [isImagePresent, setIsImagePresent] = useState(false);
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setCameraImage(null);
        setIsImagePresent(true);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setIsImagePresent(false);
      setCameraImage(null);
    }
  };

  const handleImagePresent = (isPresent) => {
    setIsImagePresent(isPresent);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOutput("Generating...");
    setShowOutput(true);

    if (!imagePreview && !cameraImage) {
      setOutput("Please select or capture an image.");
      return;
    }

    try {
      let imageDataUrl = cameraImage || imagePreview;

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const contents = [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: imageDataUrl.startsWith("data:image/jpeg") ? "image/jpeg" : "image/png",
                data: imageDataUrl.split(",")[1],
              },
            },
          ],
        },
      ];

      const result = await model.generateContentStream({ contents });

      let buffer = [];
      for await (let response of result.stream) {
        buffer.push(response.text());
        setOutput(buffer.join(""));
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 bg-gray-100 rounded-2xl shadow-xl transition-all duration-700">
      {showOutput ? (
        <div className="w-full bg-white p-4 rounded-xl shadow-md mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">AI Generated Output</h2>
            <button
              onClick={() => setShowOutput(false)}
              className="bg-red-500 text-white px-3 py-2 mb-3 rounded-full text-sm hover:bg-red-600"
            >
              Close
            </button>
          </div>
          <div className="max-h-[250px] overflow-y-auto bg-gray-50 p-3 rounded text-gray-700 text-sm text-justify">
            {output}
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-black text-3xl mb-6 font-bold text-center capitalize">
            Image Analysis
          </h1>

          <div className="flex flex-col md:flex-row items-start justify-center gap-6">
            <div
              className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-400 rounded-xl p-6 w-full md:w-1/2 bg-white shadow-2xl hover:border-blue-500 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Upload Image</h3>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Uploaded"
                    className="rounded-xl w-full max-w-xs h-48 object-cover shadow-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setCameraImage(null);
                      setIsImagePresent(false);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              ) : (
                <>
                  <FaCloudUploadAlt className="text-6xl text-gray-500" />
                  <span className="text-gray-700 text-sm font-semibold text-center">Select an Image</span>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <CameraComponent
              setImage={setCameraImage}
              setImagePreview={setImagePreview}
              onImagePresent={handleImagePresent}
            />
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <input
              type="text"
              name="prompt"
              placeholder="Enter your prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 w-full text-sm"
            />
            <button
              type="submit"
              className={`bg-blue-600 text-white p-3 rounded-xl flex items-center justify-center w-full mt-4 hover:bg-blue-700 transition-colors text-sm font-semibold ${
                !isImagePresent ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!isImagePresent}
            >
              <FaPaperPlane className="mr-2" />
              Generate Analysis
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default GeminiImageText;