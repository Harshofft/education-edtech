import React, { use, useRef, version } from 'react'
import { useState ,useEffect} from 'react'
import { Editor } from '@monaco-editor/react'
import { executeCode } from './api'
import "./code.css"  
import { GoogleGenAI } from "@google/genai";  
// import { Configuration, OpenAIApi } from 'openai';
function CodeEditor() {
    const [value , setValue] = useState("")
    const [language, setLanguage] = useState("javascript")
    const  [outputx, setoutputx] = useState(null)
    const editorRef = useRef()
    const [aicoder, setAicoder] = useState("")
    const onMountFn = (edit) =>{
        editorRef.current =edit;
        edit.focus();

    }
    const coderRef = useRef()
      
    const LANGUAGE_VERSIONS = {
      javascript: "18.15.0",
      typescript: "5.0.3",
      python: "3.10.0",
      java: "15.0.2",
      csharp: "6.12.0",
      php: "8.2.3",
    };
    
    const CODE_SNIPPETS = {
      javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
      typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
      python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
      java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
      csharp:
        'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
      php: "<?php\n\n$name = 'Alex';\necho $name;\n",
    };

    

      const [selectedLanguage, setSelectedLanguage] = useState("");

      
        const handleClick = (lang) => {
          if (language === lang) {
            setLanguage(""); 
          } else {
            setLanguage(lang);
           
          }
          setSelectedLanguage(lang);
          console.log(lang);
          
          setValue(CODE_SNIPPETS[lang]);
        };
          
        const output =async()=>{
          const sourceCode = editorRef.current.getValue();
          if(!output){
            return;
          }
          try {
            const {run:result}= await executeCode(language, sourceCode);
            setoutputx(result.output);
          } catch (error) {
            
          }
        }
        // code for ai power code editor
       const handleCoder =(e)=>{
          e.preventDefault();
          const userMsg = coderRef.current.value.trim();
          if (!userMsg) {
            return;
          }
          else{
            console.log(userMsg);
          }    
          setAicoder(userMsg);  
       }
       const apiGencode = async ()=>{
         const ai = new GoogleGenAI({
          apiKey : "AIzaSyDqJIexS4paUSQX0Rk4Z3pcXrEi0y2trTk"
         })
         const response = await ai.models({
  "contents": [{
    "parts":[{"text": " Write the solution in code only. Do not add any explanation outside the code block.  Inside the code, explain everything in Hinglish using comments.  Avoid any extra outputs, just the code with comments.  No headings, no markdown, no descriptions—just the code. Problem: "+aicoder}],
    "role": "user"
    }]
   })
        const code = response.choices[0].message.content.parts[0].text;
        if(code){
          setValue(code);
          console.log(code);
        }
        
       }
  return (
    <>
      <div className="flex justify-around items-center mb-2 mt-2">
        {
          Object.keys(LANGUAGE_VERSIONS).map((lang) => (
            <button
              key={lang}
              onClick={() => {handleClick(lang)
                
              }}
              className={`px-2 py-2 rounded-lg ${
                language === lang ? "bg-blue-600 text-white " : "bg-gray-200 hover:bg-blue-900"
              }`}
            >
              {lang}
            </button>
          ))
        } 
      </div>
      <button onClick={output} className='bg-blue-600 hover:bg-blue-900 text-white px-2 py-2 rounded-lg'>Run</button>
    <div className="flex justify-around">
    <Editor
    height="75vh"
    width="49%"
    language={language}
    defaultValue={`\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`}
    theme='vs-dark'
    value={value}
    onChange={(value)=> setValue(value)}
    onMount={onMountFn}
    ></Editor>
    <div className='widthrunder bg-gray-900 text-white'>{outputx} </div>
    </div>
    <form className='aibhut flex justify-around items-center mb-2 mt-2 ' onSubmit={handleCoder} >
        <textarea className='textareacode bg-gray-950 rounded-lg text-white w-70 h-15 mb-1 mt-1 ' value={aicoder} onChange={(e)=>{
          setAicoder(e.target.value)
         }} ref={coderRef}></textarea>
        <button className='bg-blue-600 text-white px-2 py-2 rounded-lg hover:bg-blue-900' onClick={apiGencode}>Submit</button>
    </form>
    </>
  )
}

export default CodeEditor