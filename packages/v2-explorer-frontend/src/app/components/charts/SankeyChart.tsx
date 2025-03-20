'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Box, Paper, Typography, CircularProgress, useTheme, Alert } from '@mui/material'
import { mockSankeyData, colorsMap } from './mockData'
import AccountTreeIcon from '@mui/icons-material/AccountTree'

interface SankeyChartProps {
  data?: typeof mockSankeyData;
  title?: string;
  subtitle?: string;
}

export const SankeyChart: React.FC<SankeyChartProps> = ({
  data = mockSankeyData,
  title = 'Network Transfer Flow',
  subtitle = 'Visualization of token transfers between networks'
}) => {
  console.log('[SankeyChart] Component rendering with data:', data.nodes.length, 'nodes,', data.links.length, 'links')
  
  const theme = useTheme()
  const chartRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chartSelection, setChartSelection] = useState('')
  const [scriptError, setScriptError] = useState<string | null>(null)
  const [debug, setDebug] = useState<string>('')
  const [isClient, setIsClient] = useState(false)
  const [scriptStatus, setScriptStatus] = useState<{d3: boolean, sankey: boolean}>({
    d3: false,
    sankey: false
  })

  // Set isClient to true when component mounts on client
  useEffect(() => {
    console.log('[SankeyChart] Component mounted')
    setIsClient(true)
    
    // Log the chartRef current value
    console.log('[SankeyChart] chartRef.current:', chartRef.current)
    
    // Check if window and document are available
    console.log('[SankeyChart] window available:', typeof window !== 'undefined')
    console.log('[SankeyChart] document available:', typeof document !== 'undefined')
    
    return () => {
      console.log('[SankeyChart] Component unmounting')
    }
  }, [])

  // Add the debug info - only in development
  const addDebugInfo = (message: string) => {
    console.log(`[Sankey Debug] ${message}`)
    setDebug(prev => `${prev}\n${message}`)
  }

  // Load D3.js and the D3-Sankey plugin
  useEffect(() => {
    console.log('[SankeyChart] Script loading effect triggered')
    
    const loadScripts = async () => {
      console.log('[SankeyChart] Starting to load scripts')
      try {
        setIsLoading(true)
        addDebugInfo('Starting to load scripts')
        
        // Check if D3 is already loaded
        if (typeof window !== 'undefined' && (window as any).d3) {
          console.log('[SankeyChart] D3 already loaded, version:', (window as any).d3.version)
          setScriptStatus(prev => ({...prev, d3: true}))
        } else {
          // Load D3.js v7 (more stable)
          console.log('[SankeyChart] Loading D3.js v7')
          await loadScript('https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js')
          console.log('[SankeyChart] D3.js loaded, version:', typeof window !== 'undefined' ? ((window as any).d3?.version || 'unknown') : 'unknown')
          setScriptStatus(prev => ({...prev, d3: true}))
          addDebugInfo('Loaded D3.js v7')
        }
        
        // Check if D3 is loaded correctly
        if (!(window as any).d3) {
          throw new Error('D3 failed to initialize properly')
        }
        
        // Try to load d3-sankey from different sources
        console.log('[SankeyChart] Loading d3-sankey plugin')
        
        try {
          // First try jsdelivr (more reliable CDN)
          console.log('[SankeyChart] Trying jsdelivr for d3-sankey')
          await loadScript('https://cdn.jsdelivr.net/npm/d3-sankey@0.12.3/dist/d3-sankey.min.js')
          console.log('[SankeyChart] Checked jsdelivr d3-sankey, d3.sankey available:', typeof (window as any).d3.sankey !== 'undefined')
        } catch (error) {
          console.warn('[SankeyChart] jsdelivr failed, trying unpkg for d3-sankey:', error)
          // Fallback to unpkg
          await loadScript('https://unpkg.com/d3-sankey@0.12.3/dist/d3-sankey.min.js')
          console.log('[SankeyChart] Checked unpkg d3-sankey, d3.sankey available:', typeof (window as any).d3.sankey !== 'undefined')
        }
        
        // Verify if sankey plugin is available
        if (!(window as any).d3.sankey) {
          console.warn('[SankeyChart] d3.sankey not available after loading plugin, trying to define manually')
          
          // Try one more source with a different version
          await loadScript('https://cdn.jsdelivr.net/npm/d3-sankey@0.10.0/dist/d3-sankey.min.js')
          console.log('[SankeyChart] Checked v0.10.0 d3-sankey, d3.sankey available:', typeof (window as any).d3.sankey !== 'undefined')
        }

        // Final check for sankey availability
        const sankey = (window as any).d3.sankey;
        if (!sankey) {
          console.error('[SankeyChart] d3.sankey still not available after multiple attempts')
          addDebugInfo('Failed to load d3-sankey plugin after multiple attempts')
        } else {
          console.log('[SankeyChart] d3.sankey successfully loaded')
          setScriptStatus(prev => ({...prev, sankey: true}))
          addDebugInfo('Loaded d3-sankey plugin')
        }
        
        // Give a little time for libraries to initialize
        console.log('[SankeyChart] Waiting before rendering chart')
        setTimeout(() => {
          console.log('[SankeyChart] Timeout complete, rendering chart')
          console.log('[SankeyChart] Final check: d3 available:', !!(window as any).d3)
          console.log('[SankeyChart] Final check: d3.sankey available:', !!(window as any).d3?.sankey)
          addDebugInfo('Rendering chart after delay')
          
          if ((window as any).d3 && (window as any).d3.sankey) {
            console.log('[SankeyChart] All dependencies loaded correctly, proceeding with render')
          } else {
            console.warn('[SankeyChart] Some dependencies missing, may use fallback visualization')
          }
          
          renderChart()
          setIsLoading(false)
        }, 1000) // Increased timeout for better script loading
      } catch (error) {
        console.error('[SankeyChart] Failed to load scripts:', error)
        console.log('[SankeyChart] Navigator details:', navigator.userAgent)
        addDebugInfo(`Error loading scripts: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setScriptError(`Failed to load required libraries: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setIsLoading(false)
      }
    }

    // Only run in browser environment
    if (typeof window !== 'undefined') {
      loadScripts()
      
      // Add resize event listener
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    } else {
      console.log('[SankeyChart] Not in browser environment, skipping script loading')
    }
  }, [])

  // Helper function to load scripts
  const loadScript = (src: string): Promise<void> => {
    console.log(`[SankeyChart] Loading script: ${src}`)
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.async = true
      
      // Set a timeout to catch hanging script loads
      const timeoutId = setTimeout(() => {
        console.error(`[SankeyChart] Script load timeout for ${src}`)
        reject(new Error(`Script load timed out for ${src}`))
      }, 10000) // 10 second timeout
      
      script.onload = () => {
        console.log(`[SankeyChart] Script loaded successfully: ${src}`)
        clearTimeout(timeoutId)
        resolve()
      }
      script.onerror = (e) => {
        console.error(`[SankeyChart] Script load error for ${src}:`, e)
        clearTimeout(timeoutId)
        reject(new Error(`Script load error for ${src}`))
      }
      document.head.appendChild(script)
    })
  }

  // Handle window resize
  const handleResize = () => {
    console.log('[SankeyChart] Window resize detected')
    if (!isLoading && chartRef.current) {
      console.log('[SankeyChart] Re-rendering chart on resize')
      renderChart()
    }
  }

  // Render the Sankey chart
  const renderChart = () => {
    if (!chartRef.current || !(window as any).d3) {
      console.log("[Sankey Debug] Cannot render chart: ", {
        chartRefExists: !!chartRef.current,
        d3Exists: !!(window as any).d3
      });
      return;
    }

    console.log("[Sankey Debug] Starting chart render");
    try {
      const d3 = (window as any).d3;
      console.log("[Sankey Debug] Using D3 version:", d3.version);
      
      // Check if sankey plugin is available
      if (!d3.sankey) {
        console.error("[Sankey Debug] D3 sankey plugin not available");
        setScriptError("D3 Sankey plugin failed to load properly");
        renderFallbackVisualization(d3);
        return;
      }
      
      console.log("[Sankey Debug] Data for chart:", data);
      
      // Clear any existing chart
      d3.select(chartRef.current).select("svg").remove();
      console.log("[Sankey Debug] Cleared existing chart");

      // Set dimensions
      const width = chartRef.current.clientWidth;
      const height = Math.max(500, chartRef.current.clientHeight);
      console.log("[Sankey Debug] Chart dimensions:", { width, height });

      // Create SVG
      const svg = d3.select(chartRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width * 0.05},${height * 0.05})`);
      
      console.log("[Sankey Debug] Created SVG element");

      // Adjust the dimensions for the graph
      const innerWidth = width * 0.9;
      const innerHeight = height * 0.9;

      // Initialize the Sankey generator
      console.log("[Sankey Debug] Initializing Sankey generator");
      const sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([innerWidth, innerHeight]);
      
      // Make sure we have the right methods for this version of d3-sankey
      if (typeof sankey.nodeId !== 'function') {
        console.warn("[Sankey Debug] sankey.nodeId method missing, defining it");
        sankey.nodeId = function(d: any) { return d.name; };
      }

      // Format the data for Sankey
      console.log("[Sankey Debug] Formatting data for Sankey");
      
      // Prepare a clean copy of the nodes and links with proper format
      const nodes = data.nodes.map((node, i) => ({
        ...node,
        name: node.name || `Node ${i}`,  // Ensure name exists
        id: i  // Add numeric ID for reference
      }));
      
      const links = data.links.map((link, i) => {
        // Ensure source and target are proper indices or objects
        let source = typeof link.source === 'number' ? link.source : 
                     nodes.findIndex(n => n.name === link.source);
        let target = typeof link.target === 'number' ? link.target : 
                     nodes.findIndex(n => n.name === link.target);
        
        // Default to 0 if not found
        if (source < 0) {
          console.warn(`[Sankey Debug] Source node not found for link ${i}, defaulting to 0`);
          source = 0;
        }
        if (target < 0) {
          console.warn(`[Sankey Debug] Target node not found for link ${i}, defaulting to 0`);
          target = 0;
        }
        
        return {
          source,
          target,
          value: link.value || 1,  // Ensure value exists
          token: link.token,
          amountDisplay: link.amountDisplay
        };
      });
      
      console.log("[Sankey Debug] Formatted data:", { 
        nodes: nodes.length, 
        links: links.length 
      });
      
      const graph = {
        nodes,
        links
      };

      try {
        console.log("[Sankey Debug] Running Sankey algorithm on data");
        
        // Run the Sankey algorithm
        // Wrap in a try catch to handle potential errors in the algorithm
        let sankeyData: any;
        try {
          sankeyData = sankey(graph);
          console.log("[Sankey Debug] Sankey data computed successfully");
        } catch (sankeyErr) {
          console.error("[Sankey Debug] Error in sankey algorithm:", sankeyErr);
          // Try with a simplified version of the data
          console.log("[Sankey Debug] Trying with simplified data");
          
          // Create a minimal viable dataset
          const simpleNodes = nodes.slice(0, Math.min(nodes.length, 10));
          const simpleLinks = links
            .filter(l => {
              // Check if source and target are valid indices
              const sourceIdx = typeof l.source === 'number' ? l.source : -1;
              const targetIdx = typeof l.target === 'number' ? l.target : -1;
              return sourceIdx >= 0 && sourceIdx < simpleNodes.length &&
                     targetIdx >= 0 && targetIdx < simpleNodes.length;
            })
            .slice(0, Math.min(links.length, 15));
            
          console.log("[Sankey Debug] Simplified data:", {
            nodes: simpleNodes.length,
            links: simpleLinks.length
          });
          
          sankeyData = sankey({nodes: simpleNodes, links: simpleLinks});
        }
        
        console.log("[Sankey Debug] Sankey data computed:", { 
          nodeCount: sankeyData.nodes?.length,
          linkCount: sankeyData.links?.length 
        });

        // Draw the links
        console.log("[Sankey Debug] Drawing links");
        const link = svg.append("g")
          .selectAll(".link")
          .data(sankeyData.links)
          .enter()
          .append("path")
          .attr("class", "link")
          .attr("d", d3.sankeyLinkHorizontal())
          .attr("fill", "none")
          .attr("stroke", (d: any) => {
            // Create more cohesive colors by using a blend of source, target and token colors
            const sourceColor = colorsMap[d.source.name] || "#6A79EB";
            const targetColor = colorsMap[d.target.name] || "#48A8F3";
            const tokenColor = colorsMap[d.token] || colorsMap.fallback;
            
            // Use token color as the primary indicator, but adjust it
            return tokenColor;
          })
          .attr("stroke-opacity", 0.65) // Increased opacity for better visibility
          .attr("stroke-width", (d: any) => Math.max(1, d.width))
          .style("cursor", "pointer");
        
        // Create gradient definitions for links
        const defs = svg.append("defs");
        
        // Create unique gradients for each link
        sankeyData.links.forEach((d: any, i: number) => {
          const sourceColor = colorsMap[d.source.name] || "#6A79EB";
          const tokenColor = colorsMap[d.token] || colorsMap.fallback;
          const targetColor = colorsMap[d.target.name] || "#48A8F3";
          
          const gradientId = `link-gradient-${i}`;
          const gradient = defs.append("linearGradient")
            .attr("id", gradientId)
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", d.source.x1)
            .attr("x2", d.target.x0);
          
          // Start with source network color
          gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", sourceColor)
            .attr("stop-opacity", 0.7);
          
          // Middle with token color
          gradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", tokenColor)
            .attr("stop-opacity", 0.8);
          
          // End with target network color
          gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", targetColor)
            .attr("stop-opacity", 0.7);
        });
        
        // Apply gradients to links
        link.attr("stroke", (d: any, i: number) => `url(#link-gradient-${i})`)
            .attr("stroke-linecap", "round");
        
        console.log("[Sankey Debug] Links drawn:", link.size());

        // Add hover interactions to links
        link.on("mouseover", function(this: SVGPathElement, event: any, d: any) {
          console.log("[Sankey Debug] Link hover event:", d);
          d3.select(this)
            .attr("stroke-opacity", 0.8)
            .attr("stroke-width", (d: any) => Math.max(1, d.width) + 2);
          
          // Show tooltip
          const tooltip = d3.select(chartRef.current)
            .append("div")
            .attr("class", "sankey-tooltip")
            .style("position", "absolute")
            .style("background", theme.palette.background.paper)
            .style("color", theme.palette.text.primary)
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("box-shadow", "0 2px 5px rgba(0,0,0,0.2)")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("z-index", 1000);
          
          tooltip.html(`
            <div>
              <div><strong>From:</strong> ${d.source.name}</div>
              <div><strong>To:</strong> ${d.target.name}</div>
              <div><strong>Token:</strong> ${d.token || "Unknown"}</div>
              <div><strong>Amount:</strong> ${d.amountDisplay || d.value}</div>
            </div>
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        })
        .on("mouseout", function(this: SVGPathElement) {
          console.log("[Sankey Debug] Link mouseout event");
          d3.select(this)
            .attr("stroke-opacity", 0.5)
            .attr("stroke-width", (d: any) => Math.max(1, d.width));
          
          // Remove tooltip
          d3.select(".sankey-tooltip").remove();
        });

        // Draw the nodes
        console.log("[Sankey Debug] Drawing nodes");
        const node = svg.append("g")
          .selectAll(".node")
          .data(sankeyData.nodes)
          .enter()
          .append("g")
          .attr("class", "node")
          .attr("transform", (d: any) => `translate(${d.x0},${d.y0})`);
        
        console.log("[Sankey Debug] Nodes drawn:", node.size());

        // Add rectangles for nodes
        node.append("rect")
          .attr("height", (d: any) => d.y1 - d.y0)
          .attr("width", sankey.nodeWidth())
          .attr("fill", (d: any) => colorsMap[d.name] || colorsMap.fallback)
          .attr("stroke", "#000");
        
        // Add labels for nodes
        node.append("text")
          .attr("x", (d: any) => (d.x0 < innerWidth / 2) ? sankey.nodeWidth() + 6 : -6)
          .attr("y", (d: any) => (d.y1 - d.y0) / 2)
          .attr("dy", ".35em")
          .attr("text-anchor", (d: any) => (d.x0 < innerWidth / 2) ? "start" : "end")
          .text((d: any) => d.name)
          .style("fill", theme.palette.text.primary)
          .style("font-size", "10px");
        
        console.log("[Sankey Debug] Chart rendering complete");
      } catch (err) {
        console.error("[Sankey Debug] Error in Sankey algorithm:", err);
        setScriptError(`Error in Sankey algorithm: ${err instanceof Error ? err.message : String(err)}`);
        renderFallbackVisualization(d3);
      }
    } catch (err) {
      console.error("[Sankey Debug] Error in renderChart:", err);
      setScriptError(`Error rendering chart: ${err instanceof Error ? err.message : String(err)}`);
      if ((window as any).d3) {
        renderFallbackVisualization((window as any).d3);
      }
    }
  }
  
  // Simple fallback visualization when Sankey fails
  const renderFallbackVisualization = (d3: any) => {
    console.log('[SankeyChart] renderFallbackVisualization called')
    if (!chartRef.current) {
      console.log('[SankeyChart] Aborting fallback - chart ref not available')
      return
    }
    
    try {
      const width = chartRef.current.clientWidth
      const height = 500
      const margin = { top: 20, right: 20, bottom: 30, left: 40 }
      const innerWidth = width - margin.left - margin.right
      const innerHeight = height - margin.top - margin.bottom
      
      console.log('[SankeyChart] Fallback dimensions', 'width:', width, 'height:', height)
      
      const svg = d3.select(chartRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
      
      console.log('[SankeyChart] Created fallback SVG')
      
      // Use Array.from instead of [...new Set()] to avoid iteration issues
      const sourceNames = Array.from(new Set(data.nodes.slice(0, 4).map(node => node.name)))
      const targetNames = Array.from(new Set(data.nodes.slice(4, 8).map(node => node.name)))
      const tokenNames = Array.from(new Set(data.nodes.slice(8).map(node => node.name)))
      
      console.log('[SankeyChart] Extracted node names', 
                  'sources:', sourceNames.length, 
                  'targets:', targetNames.length, 
                  'tokens:', tokenNames.length)
      
      const x = d3.scaleBand()
        .domain(['Source', 'Target'])
        .range([0, innerWidth])
        .padding(0.1)
      
      const y = d3.scaleLinear()
        .domain([0, 1000])
        .range([innerHeight, 0])
      
      // Draw columns
      svg.append('g')
        .selectAll('rect')
        .data(['Source', 'Target'])
        .join('rect')
        .attr('x', (d: string) => x(d)!)
        .attr('y', 0)
        .attr('width', x.bandwidth())
        .attr('height', innerHeight)
        .attr('fill', '#f5f5f5')
        .attr('opacity', 0.5)
      
      // Draw source nodes
      const sourceY = d3.scaleBand()
        .domain(sourceNames)
        .range([0, innerHeight])
        .padding(0.1)
      
      svg.append('g')
        .selectAll('rect')
        .data(sourceNames)
        .join('rect')
        .attr('x', x('Source')!)
        .attr('y', (d: string) => sourceY(d)!)
        .attr('width', x.bandwidth())
        .attr('height', sourceY.bandwidth())
        .attr('fill', (d: string) => colorsMap[d] || colorsMap.fallback)
      
      svg.append('g')
        .selectAll('text')
        .data(sourceNames)
        .join('text')
        .attr('x', x('Source')! + x.bandwidth() / 2)
        .attr('y', (d: string) => sourceY(d)! + sourceY.bandwidth() / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text((d: string) => d)
        .attr('fill', 'white')
        .attr('font-size', '10px')
      
      // Draw target nodes
      const targetY = d3.scaleBand()
        .domain(targetNames)
        .range([0, innerHeight])
        .padding(0.1)
      
      svg.append('g')
        .selectAll('rect')
        .data(targetNames)
        .join('rect')
        .attr('x', x('Target')!)
        .attr('y', (d: string) => targetY(d)!)
        .attr('width', x.bandwidth())
        .attr('height', targetY.bandwidth())
        .attr('fill', (d: string) => colorsMap[d] || colorsMap.fallback)
      
      svg.append('g')
        .selectAll('text')
        .data(targetNames)
        .join('text')
        .attr('x', x('Target')! + x.bandwidth() / 2)
        .attr('y', (d: string) => targetY(d)! + targetY.bandwidth() / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text((d: string) => d)
        .attr('fill', 'white')
        .attr('font-size', '10px')
      
      // Draw lines
      const sourcePositions: Record<string, number> = {}
      sourceNames.forEach(name => {
        sourcePositions[name] = sourceY(name)! + sourceY.bandwidth() / 2
      })
      
      const targetPositions: Record<string, number> = {}
      targetNames.forEach(name => {
        targetPositions[name] = targetY(name)! + targetY.bandwidth() / 2
      })
      
      // Draw some representative flows
      const flows = data.links.slice(0, 20)
      
      svg.append('g')
        .selectAll('path')
        .data(flows)
        .join('path')
        .attr('d', (d: any) => {
          const sourceNode = data.nodes[d.source]
          const targetNode = data.nodes[d.target]
          
          const sourceX = x('Source')! + x.bandwidth()
          const sourceY = sourcePositions[sourceNode.name] || innerHeight / 2
          
          const targetX = x('Target')!
          const targetY = targetPositions[targetNode.name] || innerHeight / 2
          
          return `M${sourceX},${sourceY} C${(sourceX + targetX) / 2},${sourceY} ${(sourceX + targetX) / 2},${targetY} ${targetX},${targetY}`
        })
        .attr('stroke', (d: any, i: number) => {
          // Use a more harmonious coloring approach for fallback
          const sourceNode = data.nodes[d.source]
          const targetNode = data.nodes[d.target]
          const tokenColor = colorsMap[d.token] || colorsMap.fallback
          
          // Create fallback gradients
          const gradientId = `fallback-gradient-${i}`
          const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', gradientId)
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', x('Source')! + x.bandwidth())
            .attr('x2', x('Target')!)
          
          gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', colorsMap[sourceNode.name] || colorsMap.fallback)
          
          gradient.append('stop')
            .attr('offset', '50%')
            .attr('stop-color', tokenColor)
          
          gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', colorsMap[targetNode.name] || colorsMap.fallback)
          
          return `url(#${gradientId})`
        })
        .attr('stroke-width', (d: any) => Math.sqrt(d.value) / 1.5)
        .attr('fill', 'none')
        .attr('opacity', 0.7)
        .attr('stroke-linecap', 'round')
      
      // Add title
      svg.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .text('Simplified Transfer Flow Visualization')
        .attr('font-size', '12px')
        .attr('fill', theme.palette.text.primary)
    } catch (error) {
      console.error('Fallback visualization failed:', error)
      addDebugInfo(`Fallback visualization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <Paper 
      elevation={theme.palette.mode === 'dark' ? 3 : 1}
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        mb: 4,
        position: 'relative'
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 3
        }}
      >
        <Box>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              whiteSpace: 'nowrap',
              mb: 1
            }}
          >
            <AccountTreeIcon 
              sx={{ 
                fontSize: '2.2rem',
                color: theme.palette.primary.main,
                mr: 1
              }} 
            />
            <Typography 
              variant="h4" 
              component="h2" 
              fontWeight="bold" 
              color="text.primary"
            >
              {title}
            </Typography>
          </Box>
          <Typography variant="subtitle1" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
        
        {/* Chart Selection Display */}
        {chartSelection && (
          <Box 
            sx={{
              bgcolor: 'background.paper',
              p: 1,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              mt: { xs: 2, md: 0 }
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              {chartSelection}
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Chart Content */}
      <Box sx={{ position: 'relative', height: 500, width: '100%' }}>
        {isLoading && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              bgcolor: 'rgba(0,0,0,0.02)'
            }}
          >
            <CircularProgress />
          </Box>
        )}
        
        {scriptError && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              bgcolor: 'rgba(255,0,0,0.05)',
              p: 3,
              textAlign: 'center'
            }}
          >
            <Typography color="error" gutterBottom>
              {scriptError}
            </Typography>
            
            {/* Only render debug panel on client-side to prevent hydration mismatch */}
            {isClient && debug && (
              <Alert severity="info" sx={{ mt: 2, maxWidth: '100%', maxHeight: '200px', overflow: 'auto' }}>
                <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {debug}
                </Typography>
              </Alert>
            )}
          </Box>
        )}
        
        <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
      </Box>
    </Paper>
  )
} 