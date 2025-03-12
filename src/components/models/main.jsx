import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import MarkdownIt from 'markdown-it';
import { FaCloudUploadAlt } from "react-icons/fa";

const GeminiImageText = () => {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [imagePreview, setImagePreview] = useState(null); 
  const fileInputRef = useRef(null);
  
  const API_KEY = 'YOUR_API_KEY';

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        setImagePreview(reader.result); 
      };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOutput('Generating...');

    try {
      const file = fileInputRef.current.files[0];

      if (!file) {
        setOutput('Please select an image.');
        return;
      }

      const imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
      });

      const contents = [
        {
          role: 'user',
          parts: [
            { inline_data: { mime_type: file.type, data: imageBase64 } },
            { text: prompt },
          ],
        },
      ];

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      });

   
      const result = await model.generateContentStream({ contents });

      let buffer = [];
      let md = new MarkdownIt();
      for await (let response of result.stream) {
        buffer.push(response.text());
        setOutput(md.render(buffer.join('')));
      }
    } catch (error) {
      setOutput((prevOutput) => prevOutput + '<hr>' + error.toString());
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex flex-wrap justify-center text-align gap-3 p-4">
      <h1 className="text-black text-3xl mb-8 font-bold leading-tight capitlize">
        Image Analysis
      </h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div 
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 h-40 cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Uploaded" 
              className="h-32 w-32 rounded-lg object-cover" 
            />
          ) : (
            <>
              <FaCloudUploadAlt className="text-4xl text-gray-500" />
              <span className="text-gray-700 text-lg font-semibold">
                Upload Image
              </span>
              <span className="text-sm text-gray-500">
                Choose an image from your device
              </span>
            </>
          )}


          <input
            type="file"
            id="fileInput"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
        >
          Generate
        </button>
        <input
          type="text"
          name="prompt"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full"
        />
      </form>
      <div
        className="output border border-gray-300 rounded-lg p-4 mt-4"
        dangerouslySetInnerHTML={{ __html: output }}
      />
    </div>
  );
};

export default GeminiImageText;
