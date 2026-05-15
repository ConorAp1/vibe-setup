'use client'

interface Props {
  files: Record<string, string>
  selectedFile: string | null
  expandedDirs: Record<string, boolean>
  onSelectFile: (path: string) => void
  onToggleDir: (dir: string) => void
}

interface TreeNode {
  type: 'file' | 'dir'
  name: string
  path: string
  children?: TreeNode[]
}


function buildFlatTree(filePaths: string[]): TreeNode[] {
  const dirMap: Map<string, TreeNode> = new Map()
  const fileNodes: TreeNode[] = []

  for (const filePath of filePaths) {
    const parts = filePath.split('/')
    if (parts.length === 1) {
      fileNodes.push({ type: 'file', name: parts[0], path: filePath })
    } else {
      const dir = parts.slice(0, -1).join('/')
      if (!dirMap.has(dir)) {
        dirMap.set(dir, {
          type: 'dir',
          name: dir,
          path: dir,
          children: [],
        })
      }
      dirMap.get(dir)!.children!.push({
        type: 'file',
        name: parts[parts.length - 1],
        path: filePath,
      })
    }
  }

  const dirs = Array.from(dirMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  const rootFiles = fileNodes.sort((a, b) => a.name.localeCompare(b.name))

  return [...dirs, ...rootFiles]
}

interface NodeProps {
  node: TreeNode
  selectedFile: string | null
  expandedDirs: Record<string, boolean>
  onSelectFile: (path: string) => void
  onToggleDir: (dir: string) => void
  depth?: number
}

function TreeNodeRow({ node, selectedFile, expandedDirs, onSelectFile, onToggleDir, depth = 0 }: NodeProps) {
  const isExpanded = expandedDirs[node.path] !== false

  if (node.type === 'dir') {
    return (
      <div>
        <button
          onClick={() => onToggleDir(node.path)}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-[#21262d]/50 transition-colors"
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          <span className="text-[#8b949e] text-xs">{isExpanded ? '▾' : '▸'}</span>
          <span className="text-[#8b949e] text-xs font-mono">{node.name}/</span>
        </button>
        {isExpanded && node.children && (
          <div>
            {node.children
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(child => (
                <TreeNodeRow
                  key={child.path}
                  node={child}
                  selectedFile={selectedFile}
                  expandedDirs={expandedDirs}
                  onSelectFile={onSelectFile}
                  onToggleDir={onToggleDir}
                  depth={depth + 1}
                />
              ))}
          </div>
        )}
      </div>
    )
  }

  const isSelected = selectedFile === node.path
  return (
    <button
      onClick={() => onSelectFile(node.path)}
      className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors ${
        isSelected ? 'bg-green-400/10 text-green-400' : 'text-[#8b949e] hover:bg-[#21262d]/50 hover:text-[#e6edf3]'
      }`}
      style={{ paddingLeft: `${12 + depth * 16}px` }}
    >
      <span className="text-xs">·</span>
      <span className="text-xs font-mono truncate">{node.name}</span>
    </button>
  )
}

export default function FileTree({ files, selectedFile, expandedDirs, onSelectFile, onToggleDir }: Props) {
  const filePaths = Object.keys(files).sort()
  const nodes = buildFlatTree(filePaths)

  return (
    <div className="h-full overflow-y-auto py-2">
      {nodes.map(node => (
        <TreeNodeRow
          key={node.path}
          node={node}
          selectedFile={selectedFile}
          expandedDirs={expandedDirs}
          onSelectFile={onSelectFile}
          onToggleDir={onToggleDir}
        />
      ))}
    </div>
  )
}
