"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Plus, Minus, Maximize, RefreshCw } from "lucide-react"

interface Node {
  id: string
  name: string
  group?: number
  val?: number
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
  color?: string
  __bckgDimensions?: number[]
}

interface Link {
  source: string | Node
  target: string | Node
  relation: string
}

interface GraphData {
  nodes: Node[]
  links: Link[]
}

const nodeColorMap: { [key: number]: string } = {
  1: "#ff6b6b", // Nobility - Red
  2: "#4ecdc4", // Professionals - Teal
  3: "#7bed9f", // Regular People - Green
  4: "#fd9644", // Locations - Orange
  5: "#a55eea", // Objects - Purple
  6: "#fed330", // Others - Yellow
}

const groupNames: { [key: number]: string } = {
  1: "Nobility",
  2: "Professionals",
  3: "Regular People",
  4: "Locations",
  5: "Objects",
  6: "Others",
}

// Sample data to use as fallback if fetch fails
const sampleData: [string, string, string][] = [
  ["Lady Victoria Ravenswood", "is_married_to", "Lord Edgar Ravenswood"],
  ["Lord Edgar Ravenswood", "owns", "Ravenswood Manor"],
  ["Detective James Wilson", "investigates", "Lord Edgar Ravenswood"],
  ["Mrs. Eleanor Thompson", "works_for", "Lady Victoria Ravenswood"],
  ["East Wing", "is_part_of", "Ravenswood Manor"],
  ["Secret Letter", "belongs_to", "Lady Victoria Ravenswood"],
]

const Graph: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] })
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null)
  const [highlightedLink, setHighlightedLink] = useState<Link | null>(null)
  const [showLegend, setShowLegend] = useState(true)
  const [ForceGraph2D, setForceGraph2D] = useState<any>(null)
  const graphRef = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const processGraphData = (pairs: [string, string, string][]) => {
    const nodes: Node[] = []
    const links: Link[] = []
    const nodeMap = new Map<string, boolean>()

    pairs.forEach(([source, relation, target]) => {
      if (!nodeMap.has(source)) {
        nodeMap.set(source, true)
        nodes.push({
          id: source,
          name: source,
          group: getGroupForNode(source),
          val: getValueForNode(source),
        })
      }

      if (!nodeMap.has(target)) {
        nodeMap.set(target, true)
        nodes.push({
          id: target,
          name: target,
          group: getGroupForNode(target),
          val: getValueForNode(target),
        })
      }

      links.push({ source, target, relation })
    })

    return { nodes, links }
  }

  const getGroupForNode = (nodeName: string): number => {
    if (nodeName.includes("Lord") || nodeName.includes("Lady")) {
      return 1
    } else if (nodeName.includes("Dr.") || nodeName.includes("Detective")) {
      return 2
    } else if (nodeName.includes("Mrs.") || nodeName.includes("Miss") || nodeName.includes("Mr.")) {
      return 3
    } else if (nodeName.includes("Room") || nodeName.includes("Wing") || nodeName.includes("Manor")) {
      return 4
    } else if (
      nodeName.includes("Letter") ||
      nodeName.includes("Book") ||
      nodeName.includes("Key") ||
      nodeName.includes("Note")
    ) {
      return 5
    }
    return 6
  }

  const getValueForNode = (nodeName: string): number => {
    if (nodeName === "Lady Victoria Ravenswood" || nodeName === "Lord Edgar Ravenswood") {
      return 40 // Increased size for main characters
    } else if (
      nodeName.includes("Lord") ||
      nodeName.includes("Lady") ||
      nodeName.includes("Dr.") ||
      nodeName.includes("Detective")
    ) {
      return 35
    } else if (nodeName.includes("Mrs.") || nodeName.includes("Miss") || nodeName.includes("Mr.")) {
      return 30
    } else if (nodeName.includes("Room") || nodeName.includes("Wing") || nodeName.includes("Manor")) {
      return 25
    } else if (nodeName.includes("Letter") || nodeName.includes("Book") || nodeName.includes("Key")) {
      return 20
    }
    return 18 // Increased minimum size
  }

  const resetView = () => {
    if (graphRef.current) {
      graphRef.current.centerAt(0, 0, 1000)
      graphRef.current.zoom(1, 1000)
    }
  }

  const zoomIn = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom()
      graphRef.current.zoom(currentZoom * 1.2, 400)
    }
  }

  const zoomOut = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom()
      graphRef.current.zoom(currentZoom * 0.8, 400)
    }
  }

  const zoomToFit = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400, 60)
    }
  }

  const safeCoordinate = (value: number | undefined | null): number => {
    return typeof value === "number" && isFinite(value) ? value : 0
  }

  const formatRelation = (relation: string): string => {
    return relation
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load the ForceGraph2D component
        const module = await import("react-force-graph-2d")
        setForceGraph2D(() => module.default)

        // Load the story data
        try {
          const response = await fetch("/stored_story.json")
          if (!response.ok) {
            throw new Error(`Failed to fetch story data: ${response.status}`)
          }
          const storyData = await response.json()
          
          if (storyData && Array.isArray(storyData.pairs)) {
            const processedData = processGraphData(storyData.pairs)
            setGraphData(processedData)
          } else {
            throw new Error("Invalid story data format")
          }
        } catch (fetchError) {
          console.warn("Error loading story data, using sample data:", fetchError)
          // Use sample data as fallback
          const processedData = processGraphData(sampleData)
          setGraphData(processedData)
        }
        
        setLoading(false)
      } catch (error) {
        console.error("Error loading graph component:", error)
        setError("Failed to load graph visualization component")
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    // Auto-fit the graph when it's first loaded
    if (graphRef.current && graphData.nodes.length > 0) {
      setTimeout(() => {
        zoomToFit()
      }, 500)
    }
  }, [graphData])

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[85vh] bg-gradient-to-br from-[#10101e] to-[#2a2a4a] rounded-lg">
        <div className="text-white text-2xl font-bold flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
          <span className="animate-pulse">Loading graph visualization...</span>
        </div>
      </div>
    )
  }

  if (error || !ForceGraph2D) {
    return (
      <div className="flex items-center justify-center w-full h-[85vh] bg-gradient-to-br from-[#10101e] to-[#2a2a4a] rounded-lg">
        <div className="text-white text-xl font-medium flex flex-col items-center p-6 max-w-md text-center">
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-2xl mb-2">Failed to load graph</h3>
          <p className="mb-4">{error || "The graph visualization component could not be loaded. Please try refreshing the page."}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[85vh] bg-gradient-to-br from-[#10101e] to-[#2a2a4a] rounded-lg overflow-hidden shadow-xl border border-gray-800">
      <div className="graph-visualization w-full h-full">
        {graphData.nodes.length > 0 ? (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeLabel={(node) => `${(node as any).name}`}
            nodeColor={(node) => {
              const isHighlighted = highlightedNode === (node as any).id
              const baseColor = nodeColorMap[(node as any).group || 6]
              return isHighlighted ? "#ffffff" : baseColor
            }}
            nodeRelSize={8}
            linkLabel={(link) => formatRelation((link as any).relation)}
            linkColor={(link) => {
              const sourceId = typeof (link as any).source === "object" ? (link as any).source.id : (link as any).source
              const targetId = typeof (link as any).target === "object" ? (link as any).target.id : (link as any).target

              if (highlightedNode === sourceId || highlightedNode === targetId) {
                return "rgba(255, 255, 255, 0.9)"
              }

              if (highlightedLink === link) {
                return "rgba(255, 255, 255, 0.9)"
              }

              return "rgba(255, 255, 255, 0.4)"
            }}
            linkWidth={(link) => {
              const sourceId = typeof (link as any).source === "object" ? (link as any).source.id : (link as any).source
              const targetId = typeof (link as any).target === "object" ? (link as any).target.id : (link as any).target

              if (highlightedNode === sourceId || highlightedNode === targetId || highlightedLink === link) {
                return 3
              }
              return 1.5
            }}
            linkDirectionalParticles={4}
            linkDirectionalParticleWidth={(link) => {
              return highlightedLink === link ? 3 : 2
            }}
            linkDirectionalParticleSpeed={0.004}
            linkDirectionalParticleColor={() => "rgba(255, 255, 255, 0.7)"}
            backgroundColor="rgba(0,0,0,0)"
            linkDirectionalArrowLength={8}
            linkDirectionalArrowRelPos={0.8}
            linkCurvature={0.25}
            onNodeDragEnd={(node) => {
              // Make nodes stay where they're dragged to
              if (node) {
                node.fx = safeCoordinate(node.x)
                node.fy = safeCoordinate(node.y)
              }
            }}
            onNodeClick={(node) => {
              if (graphRef.current && node) {
                const x = safeCoordinate(node.x)
                const y = safeCoordinate(node.y)
                graphRef.current.centerAt(x, y, 800)
                graphRef.current.zoom(2.2, 800)
              }
            }}
            onNodeHover={(node) => {
              const nodeId = node ? (node as any).id : null
              setHighlightedNode(nodeId)
              document.body.style.cursor = node ? "pointer" : "default"
            }}
            onLinkHover={(link) => {
              setHighlightedLink(link as Link | null)
              document.body.style.cursor = link ? "pointer" : (highlightedNode ? "pointer" : "default")
            }}
            cooldownTicks={100}
            cooldownTime={3000}
            d3VelocityDecay={0.3}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = (node as any).name
              const nodeSize = (node as any).val || 15
              const isHighlighted = highlightedNode === (node as any).id
              const x = safeCoordinate(node.x)
              const y = safeCoordinate(node.y)

              if (!isFinite(x) || !isFinite(y)) return

              const nodeColor = isHighlighted ? "#ffffff" : nodeColorMap[(node as any).group || 6]

              // Improved font sizing with performance optimizations
              const fontSize = Math.max(12, Math.min(nodeSize * 0.7, 16)) * (globalScale > 1 ? 1 : globalScale)
              ctx.font = `${isHighlighted ? "600 " : ""}${fontSize}px Inter, system-ui, -apple-system, sans-serif`

              const textWidth = ctx.measureText(label).width
              const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.8)

              // Add glow effect for highlighted nodes
              if (isHighlighted) {
                ctx.shadowColor = nodeColor
                ctx.shadowBlur = 15
              }

              // Draw node with performance optimizations
              ctx.fillStyle = nodeColor
              ctx.beginPath()
              ctx.arc(x, y, nodeSize * (globalScale / 2), 0, 2 * Math.PI)
              ctx.fill()

              // Reset shadow
              ctx.shadowColor = "transparent"
              ctx.shadowBlur = 0

              // Draw node border
              ctx.strokeStyle = isHighlighted ? "#ffffff" : "rgba(255, 255, 255, 0.7)"
              ctx.lineWidth = isHighlighted ? 2 : 1.5
              ctx.beginPath()
              ctx.arc(x, y, nodeSize * (globalScale / 2), 0, 2 * Math.PI)
              ctx.stroke()

              // Draw node label with improved visibility and performance
              if (globalScale >= 0.45 || nodeSize > 18 || isHighlighted) {
                const textY = y + nodeSize * (globalScale / 2) + 2
                const cornerRadius = Math.max(4, fontSize * 0.2)

                // Background for text with better contrast
                ctx.fillStyle = isHighlighted ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.75)"

                const rectX = x - bckgDimensions[0] / 2
                const rectY = textY
                const rectWidth = bckgDimensions[0]
                const rectHeight = bckgDimensions[1]

                // Draw rounded rectangle for label background
                ctx.beginPath()
                ctx.moveTo(rectX + cornerRadius, rectY)
                ctx.lineTo(rectX + rectWidth - cornerRadius, rectY)
                ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius)
                ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius)
                ctx.quadraticCurveTo(
                  rectX + rectWidth,
                  rectY + rectHeight,
                  rectX + rectWidth - cornerRadius,
                  rectY + rectHeight,
                )
                ctx.lineTo(rectX + cornerRadius, rectY + rectHeight)
                ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + cornerRadius)
                ctx.lineTo(rectX, rectY + cornerRadius)
                ctx.quadraticCurveTo(rectX, rectY, rectX + cornerRadius, rectY)
                ctx.closePath()
                ctx.fill()

                // Draw text with improved visibility
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillStyle = isHighlighted ? "#ffffff" : "rgba(255, 255, 255, 0.95)"

                // Add text shadow for better readability
                if (isHighlighted) {
                  ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
                  ctx.shadowBlur = 2
                  ctx.shadowOffsetX = 1
                  ctx.shadowOffsetY = 1
                }

                ctx.fillText(label, x, textY + bckgDimensions[1] / 2)

                ctx.shadowColor = "transparent"
                ctx.shadowBlur = 0
                ctx.shadowOffsetX = 0
                ctx.shadowOffsetY = 0
              }
              // Store dimensions for potential use
              (node as any).__bckgDimensions = bckgDimensions
            }}
            // Link canvas object with performance optimizations
            linkCanvasObject={(link, ctx, globalScale) => {
              if (!link.source || !link.target) return

              const sourcePos = typeof link.source === "object" 
                ? { x: safeCoordinate(link.source.x), y: safeCoordinate(link.source.y) } 
                : { x: 0, y: 0 }

              const targetPos = typeof link.target === "object" 
                ? { x: safeCoordinate(link.target.x), y: safeCoordinate(link.target.y) } 
                : { x: 0, y: 0 }
              
              if (!isFinite(sourcePos.x) || !isFinite(sourcePos.y) || 
                  !isFinite(targetPos.x) || !isFinite(targetPos.y)) {
                return
              }

              // Only render relationship text if scale is sufficient or element is highlighted
              const sourceId = typeof link.source === "object" ? link.source.id : link.source
              const targetId = typeof link.target === "object" ? link.target.id : link.target
              
              const isHighlighted = highlightedLink === link || 
                                   highlightedNode === sourceId ||
                                   highlightedNode === targetId

              if (globalScale < 0.6 && !isHighlighted) {
                return
              }

              // Calculate midpoint
              const midX = (sourcePos.x + targetPos.x) / 2
              const midY = (sourcePos.y + targetPos.y) / 2

              // Calculate angle for text rotation
              const angle = Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x)

              // Prepare text
              const relation = formatRelation((link as any).relation)
              const fontSize = Math.max(12, Math.min(14 * globalScale, 16))
              ctx.font = `${isHighlighted ? "bold" : ""} ${fontSize}px Inter, system-ui, sans-serif`

              const textWidth = ctx.measureText(relation).width
              const padding = 4

              // Save context for rotation
              ctx.save()
              ctx.translate(midX, midY)

              // Adjust rotation to keep text readable
              if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
                ctx.rotate(angle + Math.PI)
              } else {
                ctx.rotate(angle)
              }

              // Draw background for text
              ctx.fillStyle = isHighlighted ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.7)"
              ctx.beginPath()
              
              // Use rounded rectangle if available, fallback to regular rect
              if (ctx.roundRect) {
                ctx.roundRect(
                  -textWidth / 2 - padding,
                  -fontSize / 2 - padding,
                  textWidth + padding * 2,
                  fontSize + padding * 2,
                  4
                )
              } else {
                ctx.rect(
                  -textWidth / 2 - padding,
                  -fontSize / 2 - padding,
                  textWidth + padding * 2,
                  fontSize + padding * 2
                )
              }
              ctx.fill()

              // Draw text
              ctx.textAlign = "center"
              ctx.textBaseline = "middle"
              ctx.fillStyle = isHighlighted ? "#ffffff" : "rgba(255, 255, 255, 0.9)"

              // Add shadow for better readability
              if (isHighlighted) {
                ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
                ctx.shadowBlur = 2
                ctx.shadowOffsetX = 1
                ctx.shadowOffsetY = 1
              }

              ctx.fillText(relation, 0, 0)

              // Restore context
              ctx.restore()
            }}
            nodePointerAreaPaint={(node, color, ctx) => {
              const x = safeCoordinate(node.x)
              const y = safeCoordinate(node.y)

              if (!isFinite(x) || !isFinite(y)) return

              ctx.fillStyle = color
              const nodeSize = ((node as any).val || 15) * 1.5
              ctx.beginPath()
              ctx.arc(x, y, nodeSize, 0, 2 * Math.PI)
              ctx.fill()
            }}
            d3Force="charge"
            d3ForceStrength={-450} // Adjusted for balance between spacing and performance
            enableNodeDrag={true}
            enableZoomInteraction={true}
            enablePanInteraction={true}
            minZoom={0.3}
            maxZoom={8}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-white text-xl">No graph data available. Please check your data source.</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg p-2 flex flex-col gap-2 shadow-lg border border-gray-700">
          <button
            onClick={zoomIn}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-700 transition-colors duration-200"
            title="Zoom in"
          >
            <Plus size={18} className="text-white" />
          </button>
          <button
            onClick={zoomOut}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-700 transition-colors duration-200"
            title="Zoom out"
          >
            <Minus size={18} className="text-white" />
          </button>
          <button
            onClick={zoomToFit}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-700 transition-colors duration-200"
            title="Fit graph to view"
          >
            <Maximize size={18} className="text-white" />
          </button>
          <hr className="border-gray-600" />
          <button
            onClick={resetView}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-700 transition-colors duration-200"
            title="Reset view"
          >
            <RefreshCw size={18} className="text-white" />
          </button>
        </div>
        <button
          className="bg-gray-800 bg-opacity-80 text-white px-3 py-1 rounded-md hover:bg-opacity-100 transition-all duration-300 text-sm flex items-center border border-gray-700"
          onClick={() => setShowLegend(!showLegend)}
        >
          {showLegend ? "Hide Legend" : "Show Legend"}
        </button>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-lg p-4 text-white shadow-lg z-10 max-w-xs border border-gray-700">
          <h3 className="text-sm font-semibold mb-2 border-b border-gray-700 pb-1">Character Types</h3>
          <div className="flex flex-col gap-2">
            {Object.entries(groupNames).map(([groupId, name]) => (
              <div
                key={groupId}
                className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-800 p-1 rounded transition-colors duration-200"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: nodeColorMap[Number.parseInt(groupId)] }}
                ></div>
                <span>{name}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-400">
            <p>• Drag nodes to reposition</p>
            <p>• Hover over nodes and links to highlight</p>
            <p>• Click a node to focus on it</p>
          </div>
        </div>
      )}

      {/* Instructions overlay - shown briefly on load */}
      <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20 pointer-events-none opacity-0 animate-fadeOut">
        <div className="text-white text-center max-w-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-3">Story Relationship Graph</h2>
          <p className="mb-4">
            Explore the connections between characters, objects, and locations in "The Shadow of Ravenswood Manor"
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-opacity-80 flex items-center justify-center mb-1 bg-gray-800">
                <Maximize size={20} className="text-white" />
              </div>
              <span>Zoom & Pan</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-opacity-80 flex items-center justify-center mb-1 bg-gray-800">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8L12 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 12L8 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <span>Drag Nodes</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add this style tag to fix the animation */}
      <style jsx>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-fadeOut {
          animation: fadeOut 3s forwards;
        }
      `}</style>
    </div>
  )
}

export default Graph