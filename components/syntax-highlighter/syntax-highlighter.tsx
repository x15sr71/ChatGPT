"use client"

import { useEffect, useState } from "react"

interface SyntaxHighlighterProps {
  code: string
  language: string
  isTyping?: boolean
}

export function SyntaxHighlighter({ code, language, isTyping = false }: SyntaxHighlighterProps) {
  const [highlightedCode, setHighlightedCode] = useState("")

  useEffect(() => {
    const highlighted = highlightCode(code, language)
    setHighlightedCode(highlighted)
  }, [code, language])

  const highlightCode = (code: string, lang: string) => {
    if (!code) return ""

    switch (lang.toLowerCase()) {
      case "tsx":
      case "jsx":
      case "javascript":
      case "js":
        return highlightJavaScript(code)
      case "typescript":
      case "ts":
        return highlightTypeScript(code)
      case "python":
      case "py":
        return highlightPython(code)
      case "css":
        return highlightCSS(code)
      case "html":
        return highlightHTML(code)
      case "json":
        return highlightJSON(code)
      default:
        return escapeHtml(code)
    }
  }

  const highlightJavaScript = (code: string) => {
    return (
      code
        // Keywords
        .replace(
          /\b(import|export|from|function|const|let|var|return|if|else|for|while|class|interface|type|extends|implements|async|await|try|catch|finally|throw|new|this|super|static|public|private|protected|readonly|abstract)\b/g,
          '<span class="text-blue-400 font-medium">$1</span>',
        )
        // Function names and properties
        .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="text-yellow-300">$1</span>')
        // Object properties and methods
        .replace(/\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g, '.<span class="text-blue-300">$1</span>')
        // Strings
        .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-400">$1$2$3</span>')
        // Numbers
        .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>')
        // Boolean and null values
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-purple-400">$1</span>')
        // Comments
        .replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>')
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>')
        // JSX tags
        .replace(/(<\/?[a-zA-Z][a-zA-Z0-9]*)/g, '<span class="text-red-400">$1</span>')
        .replace(/(>)/g, '<span class="text-red-400">$1</span>')
        // JSX attributes
        .replace(/\s([a-zA-Z-]+)=/g, ' <span class="text-blue-300">$1</span>=')
    )
  }

  const highlightTypeScript = (code: string) => {
    return highlightJavaScript(code).replace(
      /\b(string|number|boolean|object|any|void|never|unknown)\b/g,
      '<span class="text-cyan-400">$1</span>',
    )
  }

  const highlightPython = (code: string) => {
    return code
      .replace(
        /\b(def|class|import|from|if|elif|else|for|while|try|except|finally|with|as|return|yield|lambda|and|or|not|in|is|True|False|None)\b/g,
        '<span class="text-blue-400 font-medium">$1</span>',
      )
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-400">$1$2$3</span>')
      .replace(/#.*$/gm, '<span class="text-gray-500 italic">$&</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>')
  }

  const highlightCSS = (code: string) => {
    return code
      .replace(/([.#][a-zA-Z-_][a-zA-Z0-9-_]*)/g, '<span class="text-yellow-300">$1</span>')
      .replace(/([a-zA-Z-]+)(?=\s*:)/g, '<span class="text-blue-300">$1</span>')
      .replace(/:\s*([^;]+)/g, ': <span class="text-green-400">$1</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>')
  }

  const highlightHTML = (code: string) => {
    return code
      .replace(/(<\/?[a-zA-Z][a-zA-Z0-9]*)/g, '<span class="text-red-400">$1</span>')
      .replace(/(>)/g, '<span class="text-red-400">$1</span>')
      .replace(/\s([a-zA-Z-]+)=/g, ' <span class="text-blue-300">$1</span>=')
      .replace(/=(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '=<span class="text-green-400">$1$2$3</span>')
  }

  const highlightJSON = (code: string) => {
    return code
      .replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span class="text-blue-300">$1</span>:')
      .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="text-green-400">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-orange-400">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span class="text-purple-400">$1</span>')
  }

  const escapeHtml = (text: string) => {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  return (
    <pre className="text-sm text-white/90 font-mono leading-relaxed whitespace-pre-wrap">
      <code
        dangerouslySetInnerHTML={{
          __html: highlightedCode + (isTyping ? '<span class="animate-pulse text-white">|</span>' : ""),
        }}
      />
    </pre>
  )
}
