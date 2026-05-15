'use client'

import { useState } from 'react'
import FileTree from './FileTree'

interface Props {
  files: Record<string, string>
}

export default function ExplorerPhase({ files }: Props) {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const keys = Object.keys(files)
    return keys.length > 0 ? keys[0] : null
  })
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({})
  const [copyFileState, setCopyFileState] = useState<'idle' | 'copied'>('idle')
  const [copyAllState, setCopyAllState] = useState<'idle' | 'copied'>('idle')

  const toggleDir = (dir: string) => {
    setExpandedDirs(prev => ({ ...prev, [dir]: prev[dir] === false ? true : false }))
  }

  const copyFile = async () => {
    if (!selectedFile) return
    await navigator.clipboard.writeText(files[selectedFile])
    setCopyFileState('copied')
    setTimeout(() => setCopyFileState('idle'), 2000)
  }

  const copyAll = async () => {
    const allContent = Object.entries(files)
      .map(([path, content]) => `// ===== ${path} =====\n${content}`)
      .join('\n\n')
    await navigator.clipboard.writeText(allContent)
    setCopyAllState('copied')
    setTimeout(() => setCopyAllState('idle'), 2000)
  }

  const fileCount = Object.keys(files).length
  const content = selectedFile ? files[selectedFile] : null

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        {/* File tree sidebar */}
        <div className="w-56 flex-shrink-0 border-r border-[#21262d] bg-[#0d1117] overflow-hidden flex flex-col">
          <div className="px-3 py-3 border-b border-[#21262d]">
            <span className="text-xs text-[#8b949e] font-medium uppercase tracking-wider">Files</span>
          </div>
          <FileTree
            files={files}
            selectedFile={selectedFile}
            expandedDirs={expandedDirs}
            onSelectFile={setSelectedFile}
            onToggleDir={toggleDir}
          />
        </div>

        {/* File content viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedFile && content !== null ? (
            <>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#21262d] bg-[#161b22]">
                <span className="text-xs font-mono text-[#8b949e]">{selectedFile}</span>
                <button
                  onClick={copyFile}
                  className="text-xs px-3 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#e6edf3] rounded-md transition-colors"
                >
                  {copyFileState === 'copied' ? '✓ Copied' : 'Copy file'}
                </button>
              </div>
              <pre className="flex-1 overflow-auto p-4 text-xs leading-relaxed text-[#e6edf3] font-mono whitespace-pre-wrap">
                {content}
              </pre>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#8b949e] text-sm">
              Select a file to view its content
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#21262d] bg-[#161b22] px-4 py-3 flex items-center justify-between">
        <span className="text-xs text-[#8b949e]">{fileCount} files generated</span>
        <button
          onClick={copyAll}
          className="text-xs px-4 py-2 bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 text-green-400 rounded-lg transition-colors font-medium"
        >
          {copyAllState === 'copied' ? '✓ All copied!' : 'Copy all files'}
        </button>
      </div>
    </div>
  )
}
