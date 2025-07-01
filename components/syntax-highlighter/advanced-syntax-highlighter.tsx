"use client"

import { useEffect, useState, useRef } from "react"

interface AdvancedSyntaxHighlighterProps {
  code: string
  language: string
  isTyping?: boolean
  typingSpeed?: number
  onTypingComplete?: () => void
}

export function AdvancedSyntaxHighlighter({
  code,
  language,
  isTyping = false,
  typingSpeed = 25,
  onTypingComplete,
}: AdvancedSyntaxHighlighterProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const codeLines = code.split("\n")

  useEffect(() => {
    if (!isTyping) {
      const highlighted = highlightCode(code, language)
      setDisplayedLines(highlighted.split("\n"))
      setIsComplete(true)
      return
    }

    // Reset state for new typing animation
    setDisplayedLines([])
    setCurrentLineIndex(0)
    setIsComplete(false)

    // Start line-by-line typing animation
    intervalRef.current = setInterval(() => {
      setCurrentLineIndex((prevIndex) => {
        if (prevIndex >= codeLines.length) {
          clearInterval(intervalRef.current!)
          setIsComplete(true)
          onTypingComplete?.()
          return prevIndex
        }

        const linesToHighlight = codeLines.slice(0, prevIndex + 1).join("\n")
        const highlighted = highlightCode(linesToHighlight, language)
        setDisplayedLines(highlighted.split("\n"))

        return prevIndex + 1
      })
    }, typingSpeed)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [code, language, isTyping, typingSpeed, onTypingComplete])

  const highlightCode = (code: string, lang: string) => {
    if (!code) return ""

    // Prevent re-highlighting already highlighted code
    if (code.includes("<span class=")) {
      return code
    }

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
      case "bash":
      case "shell":
      case "sh":
        return highlightBash(code)
      case "markdown":
      case "md":
        return highlightMarkdown(code)
      case "yaml":
      case "yml":
        return highlightYAML(code)
      case "c":
      case "cpp":
      case "c++":
        return highlightC(code)
      case "java":
        return highlightJava(code)
      case "php":
        return highlightPHP(code)
      case "rust":
      case "rs":
        return highlightRust(code)
      case "go":
        return highlightGo(code)
      default:
        return escapeHtml(code)
    }
  }

  const highlightJavaScript = (code: string) => {
    return (
      code
        // Keywords
        .replace(
          /\b(import|export|from|function|const|let|var|return|if|else|for|while|class|interface|type|extends|implements|async|await|try|catch|finally|throw|new|this|super|static|public|private|protected|readonly|abstract|default)\b/g,
          '<span class="text-blue-400 font-medium">$1</span>',
        )
        // Function names
        .replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="text-yellow-300 font-medium">$1</span>')
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
        .replace(/(<\/?[a-zA-Z][a-zA-Z0-9-]*)/g, '<span class="text-red-400">$1</span>')
        .replace(/(\/?>)/g, '<span class="text-red-400">$1</span>')
        // JSX attributes
        .replace(/\s([a-zA-Z-]+)=/g, ' <span class="text-blue-300">$1</span>=')
    )
  }

  const highlightTypeScript = (code: string) => {
    return highlightJavaScript(code).replace(
      /\b(string|number|boolean|object|any|void|never|unknown|Array|Promise)\b/g,
      '<span class="text-cyan-400">$1</span>',
    )
  }

  const highlightPython = (code: string) => {
    return code
      .replace(
        /\b(def|class|import|from|if|elif|else|for|while|try|except|finally|with|as|return|yield|lambda|and|or|not|in|is|True|False|None|pass|break|continue)\b/g,
        '<span class="text-blue-400 font-medium">$1</span>',
      )
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-400">$1$2$3</span>')
      .replace(/#.*$/gm, '<span class="text-gray-500 italic">$&</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>')
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="text-yellow-300">$1</span>')
  }

  const highlightBash = (code: string) => {
    return code
      .replace(
        /\b(echo|cd|ls|mkdir|rm|cp|mv|grep|find|sed|awk|cat|head|tail|sort|uniq|wc|chmod|chown|ps|kill|top|df|du|tar|zip|unzip|curl|wget|ssh|scp|rsync)\b/g,
        '<span class="text-blue-400 font-medium">$1</span>',
      )
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-400">$1$2$3</span>')
      .replace(/#.*$/gm, '<span class="text-gray-500 italic">$&</span>')
      .replace(/\$\{?([a-zA-Z_][a-zA-Z0-9_]*)\}?/g, '<span class="text-purple-400">$&</span>')
      .replace(/--?[a-zA-Z-]+/g, '<span class="text-cyan-400">$&</span>')
  }

  const highlightMarkdown = (code: string) => {
    return code
      .replace(
        /^(#{1,6})\s+(.*)$/gm,
        '<span class="text-blue-400 font-bold">$1</span> <span class="text-white font-bold">$2</span>',
      )
      .replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-bold">**$1**</span>')
      .replace(/\*(.*?)\*/g, '<span class="text-white italic">*$1*</span>')
      .replace(/`([^`]+)`/g, '<span class="text-green-400 bg-gray-800 px-1 rounded">$&</span>')
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<span class="text-blue-400">[$1]</span><span class="text-cyan-400">($2)</span>',
      )
  }

  const highlightYAML = (code: string) => {
    return code
      .replace(/^(\s*)([a-zA-Z_][a-zA-Z0-9_-]*)\s*:/gm, '$1<span class="text-blue-400">$2</span>:')
      .replace(/:\s*(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, ': <span class="text-green-400">$1$2$3</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-orange-400">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span class="text-purple-400">$1</span>')
      .replace(/#.*$/gm, '<span class="text-gray-500 italic">$&</span>')
  }

  const highlightC = (code: string) => {
    return code
      .replace(
        /\b(int|char|float|double|void|struct|enum|typedef|const|static|extern|auto|register|volatile|signed|unsigned|short|long|if|else|for|while|do|switch|case|default|break|continue|return|goto|sizeof)\b/g,
        '<span class="text-blue-400 font-medium">$1</span>',
      )
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="text-yellow-300">$1</span>')
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-400">$1$2$3</span>')
      .replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>')
      .replace(/#\w+/g, '<span class="text-purple-400">$&</span>')
  }

  const highlightJava = (code: string) => {
    return code
      .replace(
        /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|import|package|if|else|for|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|throws|new|this|super|void|int|char|float|double|boolean|byte|short|long|String)\b/g,
        '<span class="text-blue-400 font-medium">$1</span>',
      )
      .replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="text-cyan-400">$1</span>')
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="text-yellow-300">$1</span>')
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-400">$1$2$3</span>')
      .replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>')
  }

  const highlightPHP = (code: string) => {
    return code
      .replace(
        /\b(function|class|interface|trait|extends|implements|public|private|protected|static|final|abstract|const|var|if|else|elseif|for|foreach|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|new|clone|instanceof|echo|print|include|require|include_once|require_once)\b/g,
        '<span class="text-blue-400 font-medium">$1</span>',
      )
      .replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, '<span class="text-purple-400">$&</span>')
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="text-yellow-300">$1</span>')
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-400">$1$2$3</span>')
      .replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>')
      .replace(/<\?php|\?>/g, '<span class="text-red-400">$&</span>')
  }

  const highlightRust = (code: string) => {
    return code
      .replace(
        /\b(fn|let|mut|const|static|struct|enum|impl|trait|for|in|while|loop|if|else|match|return|break|continue|pub|mod|use|crate|super|self|where|async|await|move|ref|dyn|unsafe|extern)\b/g,
        '<span class="text-blue-400 font-medium">$1</span>',
      )
      .replace(
        /\b(i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str|String|Vec|Option|Result)\b/g,
        '<span class="text-cyan-400">$1</span>',
      )
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="text-yellow-300">$1</span>')
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-400">$1$2$3</span>')
      .replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>')
  }

  const highlightGo = (code: string) => {
    return code
      .replace(
        /\b(package|import|func|var|const|type|struct|interface|map|chan|go|defer|if|else|for|range|switch|case|default|break|continue|return|fallthrough|goto|select)\b/g,
        '<span class="text-blue-400 font-medium">$1</span>',
      )
      .replace(
        /\b(int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|uintptr|float32|float64|complex64|complex128|bool|byte|rune|string|error)\b/g,
        '<span class="text-cyan-400">$1</span>',
      )
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="text-yellow-300">$1</span>')
      .replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="text-green-400">$1$2$3</span>')
      .replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>')
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
      .replace(/(<\/?[a-zA-Z][a-zA-Z0-9-]*)/g, '<span class="text-red-400">$1</span>')
      .replace(/(\/?>)/g, '<span class="text-red-400">$1</span>')
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
    <div className="relative w-full">
      <pre className="text-sm text-white/90 font-mono leading-relaxed whitespace-pre overflow-x-auto min-w-max">
        <code className="block">
          {displayedLines.map((line, index) => (
            <div key={index} dangerouslySetInnerHTML={{ __html: line || "\u00A0" }} className="whitespace-nowrap" />
          ))}
          {isTyping && !isComplete && <span className="animate-pulse text-white">|</span>}
        </code>
      </pre>
    </div>
  )
}
