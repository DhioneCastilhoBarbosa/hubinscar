import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
//import md from "../../../content/politica-de-privacidade.md"

export default function PoliticaDePrivacidade() {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch("/politica-de-privacidade-eletrihub.md")
      .then((res) => res.text())
      .then(setMarkdown);
  }, []);

  return (
      <div className="w-[80%] mx-auto px-4 py-8 text-gray-800 mt-16">
        <article className="prose prose-gray prose-h1:text-black prose-h2:text-gray-700 prose-p:text-gray-700 prose-h3:text-gray-700 bg-gray-300/90 p-8 rounded-lg w-full max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    );
    
}
