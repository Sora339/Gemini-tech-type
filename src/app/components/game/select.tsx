"use client";
import React, { Dispatch, SetStateAction } from "react";
const API_KEY = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY

import { Button } from "@/components/ui/button";

import AllTechsList from "./allTechListSection";

const Select = ({
  selectedTechs,
  setScene,
  setSelectedTechs,
  setWordList,
}: {
  selectedTechs: string[];
  setScene: Dispatch<SetStateAction<number>>;
  setSelectedTechs: Dispatch<SetStateAction<string[]>>;
  setWordList: Dispatch<SetStateAction<string[]>>;
}) => {
  const allSections = [
    {
      name: "フロントエンド",
      techs: [
        "HTML/CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Vue",
        "Nuxt.js",
      ],
    },
    {
      name: "バックエンド",
      techs: [
        "SQL",
        "Go",
        "Ruby",
        "PHP",
        "Laravel",
        "Node.js",
        "Nest.js",
        "C",
        "C++",
        "C#",
        "Python",
        "Rust",
        "Java",
      ],
    },
    { name: "インフラ", techs: ["Docker", "AWS", "Azure"] },
    { name: "その他", techs: ["Git", "Unity"] },
  ];

  const handleTechClick = (tech: string) => {
    setSelectedTechs((prevSelected) => {
      if (prevSelected.includes(tech)) {
        return prevSelected.filter((t) => t !== tech);
      } else if (prevSelected.length < 5) {
        return [...prevSelected, tech];
      } else {
        return prevSelected;
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
    
      if (!API_KEY) {
        throw new Error('API_KEY is not defined. Please set REACT_APP_GOOGLE_API_KEY in your .env file.');
      }
    
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
      const techText = selectedTechs.join("/");
      const prompt = `${techText}でよく使われる構文に関する単語を以下の形式でそれだけで出力してください。インライン表示は不要です。
      出力例
        "import",
        "export",
        "const",
        "let",
        "var",
        "function",
        "arrow function",
        "map",
        "filter",
        "reduce",
        "forEach",
        "spread operator",
        "destructuring",
        "template literals",
        "async/await",
        "Promise",
        "fetch",
        "useState",
        "useEffect",
        "useContext",
        "useReducer",
        "useMemo",
        "useCallback",
        "useRef",
        "props",
        "state",
        "render",
        "component",
        "JSX",
        "React Hooks",
        "React Router",
        "Next.js",
        "getStaticProps",
        "getServerSideProps",
        "getInitialProps",
        "dynamic import",
        "React.lazy",
        "Suspense",
        "ReactDOM.hydrate",
        "ReactDOM.render"`;
    
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      const generatedWords = await response.text();
      console.log(generatedWords);
      
      // ここで返ってきた文字列がJSONかどうかを確認
      try {
        const wordList = JSON.parse(generatedWords);
        setWordList(wordList);
      } catch (e) {
        console.error("Failed to parse JSON, handling as plain text array");
        // 必要であれば、文字列を手動で配列に変換
        const wordList = generatedWords.split(",").map(word => word.trim().replace(/["']/g, ""));
        setWordList(wordList);
      }
  
      console.log(wordList);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  
    // ゲーム画面に遷移する
    setScene(1);
  };
  

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mb-8 max-w-[600px] rounded-2xl bg-white p-4 shadow-md">
        <div className="flex justify-between">
          <h2 className="mb-4 text-2xl">
            好きな技術<span>(5つまで)</span>
          </h2>
          <div>
            <Button
              onClick={handleSubmit}
              className="w-[100px] rounded-xl bg-[#6AE88D] text-xl text-white shadow-md"
              disabled={selectedTechs.length == 0}
            >
              決定
            </Button>
          </div>
        </div>
        <AllTechsList
          allSections={allSections}
          onTechClick={handleTechClick}
          selectedTechs={selectedTechs}
        />
      </div>
    </div>
  );
};

export default Select;
