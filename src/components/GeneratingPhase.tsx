'use client'

import { useEffect, useRef } from 'react'
import type { ProjectData, GenerationLogItem, GenerationStatus } from '@/types'
import { FILE_GROUPS } from '@/lib/fileGroups'

interface Props {
  projectData: ProjectData
  log: GenerationLogItem[]
  onFilesBatch: (files: Record<string, string>) => void
  onComplete: () => void
}

function StatusIcon({ status }: { status: GenerationStatus }) {
  if (status === 'waiting') return <span className="text-[#8b949e] text-lg">·</span>
  if (status === 'done') return <span className="text-green-400 text-sm">✓</span>
  if (status === 'error') return <span className="text-red-400 text-sm">✕</span>
  return (
    <svg className="w-4 h-4 text-green-400 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function GeneratingPhase({ projectData, log, onFilesBatch, onComplete }: Props) {
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    async function runGeneration() {
      for (const group of FILE_GROUPS) {
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectData, groupId: group.id }),
          })

          const data = await res.json() as { files?: Record<string, string>; error?: string }

          if (!res.ok || !data.files) {
            onFilesBatch({})
          } else {
            onFilesBatch(data.files)
          }
        } catch {
          onFilesBatch({})
        }
      }

      onComplete()
    }

    runGeneration()
  }, [projectData, onFilesBatch, onComplete])

  const totalFiles = log.reduce((sum, item) => sum + (item.fileCount ?? 0), 0)
  const doneCount = log.filter(item => item.status === 'done').length

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto w-full px-4">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-semibold text-[#e6edf3] mb-1">Generating your scaffold</h2>
          <p className="text-sm text-[#8b949e]">{projectData.name}</p>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] rounded-xl overflow-hidden">
          {log.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-5 py-4 ${i < log.length - 1 ? 'border-b border-[#21262d]' : ''}`}
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <StatusIcon status={item.status} />
              </div>
              <span className={`text-sm flex-1 ${item.status === 'waiting' ? 'text-[#8b949e]' : 'text-[#e6edf3]'}`}>
                {item.label}
              </span>
              {item.status === 'done' && item.fileCount !== undefined && (
                <span className="text-xs text-[#8b949e]">{item.fileCount} {item.fileCount === 1 ? 'file' : 'files'}</span>
              )}
            </div>
          ))}
        </div>

        {totalFiles > 0 && (
          <p className="text-center text-xs text-[#8b949e] mt-4">
            {totalFiles} files generated · {doneCount}/{FILE_GROUPS.length} groups complete
          </p>
        )}
      </div>
    </div>
  )
}
