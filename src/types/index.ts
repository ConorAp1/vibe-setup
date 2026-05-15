export type Phase = 'interview' | 'generating' | 'explorer'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ProjectData {
  name: string
  description: string
  problem: string
  users: string
  features: string[]
  stack: string
  constraints: string
}

export interface FileGroup {
  id: string
  label: string
  files: string[]
}

export type GenerationStatus = 'waiting' | 'generating' | 'done' | 'error'

export interface GenerationLogItem {
  id: string
  label: string
  status: GenerationStatus
  fileCount?: number
}

export interface ChatRequest {
  messages: Message[]
}

export interface ChatResponse {
  text: string
  isComplete: boolean
  projectData?: ProjectData
}

export interface GenerateRequest {
  projectData: ProjectData
  groupId: string
}

export interface GenerateResponse {
  files: Record<string, string>
  groupId: string
}
