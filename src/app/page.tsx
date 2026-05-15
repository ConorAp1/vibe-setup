'use client'

import { useState, useCallback } from 'react'
import type { Phase, ProjectData, GenerationLogItem } from '@/types'
import { FILE_GROUPS } from '@/lib/fileGroups'
import InterviewPhase from '@/components/InterviewPhase'
import GeneratingPhase from '@/components/GeneratingPhase'
import ExplorerPhase from '@/components/ExplorerPhase'

function initLog(): GenerationLogItem[] {
  return FILE_GROUPS.map(g => ({ id: g.id, label: g.label, status: 'waiting' }))
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>('interview')
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [generatedFiles, setGeneratedFiles] = useState<Record<string, string>>({})
  const [generationLog, setGenerationLog] = useState<GenerationLogItem[]>(initLog)
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)

  const handleInterviewComplete = useCallback((data: ProjectData) => {
    setProjectData(data)
    setGenerationLog(initLog())
    setCurrentGroupIndex(0)
    setGeneratedFiles({})
    setPhase('generating')
  }, [])

  const handleFilesBatch = useCallback((files: Record<string, string>) => {
    setCurrentGroupIndex(prev => {
      const idx = prev
      const fileCount = Object.keys(files).length
      setGenerationLog(log =>
        log.map((item, i) => {
          if (i === idx) {
            return { ...item, status: fileCount > 0 ? 'done' : 'error', fileCount }
          }
          if (i === idx + 1 && idx + 1 < FILE_GROUPS.length) {
            return { ...item, status: 'generating' }
          }
          return item
        })
      )
      if (fileCount > 0) {
        setGeneratedFiles(prev => ({ ...prev, ...files }))
      }
      return prev + 1
    })
  }, [])

  const handleGenerationComplete = useCallback(() => {
    setPhase('explorer')
  }, [])

  const generationLogWithActive = generationLog.map((item, i) => {
    if (item.status === 'waiting' && i === currentGroupIndex && phase === 'generating') {
      return { ...item, status: 'generating' as const }
    }
    return item
  })

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-[#21262d] bg-[#161b22]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-green-400/10 border border-green-400/30 flex items-center justify-center">
              <span className="text-green-400 text-xs font-bold">V</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[#e6edf3]">Vibe Code Setup</h1>
              <p className="text-xs text-[#8b949e]">Project scaffold generator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(['interview', 'generating', 'explorer'] as Phase[]).map((p, i) => {
              const labels = ['Interview', 'Generating', 'Explorer']
              const phases: Phase[] = ['interview', 'generating', 'explorer']
              const isDone = phases.indexOf(phase) > i
              const isCurrent = phase === p
              return (
                <div key={p} className="flex items-center gap-2">
                  {i > 0 && <div className="w-8 h-px bg-[#21262d]" />}
                  <div className={`flex items-center gap-1.5 text-xs ${
                    isCurrent ? 'text-green-400' : isDone ? 'text-[#8b949e]' : 'text-[#30363d]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isCurrent ? 'bg-green-400' : isDone ? 'bg-[#8b949e]' : 'bg-[#30363d]'
                    }`} />
                    {labels[i]}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {phase === 'interview' && (
          <div className="phase-enter h-full">
            <InterviewPhase onComplete={handleInterviewComplete} />
          </div>
        )}

        {phase === 'generating' && projectData && (
          <div className="phase-enter h-full">
            <GeneratingPhase
              projectData={projectData}
              log={generationLogWithActive}
              onFilesBatch={handleFilesBatch}
              onComplete={handleGenerationComplete}
            />
          </div>
        )}

        {phase === 'explorer' && (
          <div className="phase-enter h-full">
            <ExplorerPhase files={generatedFiles} />
          </div>
        )}
      </main>
    </div>
  )
}
