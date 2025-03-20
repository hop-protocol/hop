'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Box, Paper, Typography, CircularProgress, useTheme, Alert } from '@mui/material'
import { mockSankeyData, colorsMap } from './mockData'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import Skeleton from '@mui/material/Skeleton'

// Defining the type for our chart data
export type SankeyChartData = {
  nodes: Array<{
    name: string
  }>
  links: Array<{
    source: number
    target: number
    value: number
    token: string
    amountDisplay?: string
  }>
}

type SankeyChartProps = {
  data?: SankeyChartData
  title?: string
  subtitle?: string
  height?: number
}

const SankeyChart = ({ data, title, subtitle, height = 500 }: SankeyChartProps) => {
  const theme = useTheme()
  const chartRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [d3Loaded, setD3Loaded] = useState(false)

  // Load D3.js and related libraries
  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadD3 = async () => {
      try {
        // Check if D3 is already loaded
        if ((window as any).d3) {
          setD3Loaded(true)
          return
        }

        console.log('[SankeyChart] Loading D3.js and related libraries...')
        
        // Load D3.js v7
        const d3Script = document.createElement('script')
        d3Script.src = 'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js'
        d3Script.async = true
        
        // Load d3-sankey
        const sankeyScript = document.createElement('script')
        sankeyScript.src = 'https://cdn.jsdelivr.net/npm/d3-sankey@0.12.3/dist/d3-sankey.min.js'
        sankeyScript.async = true
        
        // Append scripts to document
        document.head.appendChild(d3Script)
        
        // Wait for D3 to load before loading Sankey
        d3Script.onload = () => {
          document.head.appendChild(sankeyScript)
          
          sankeyScript.onload = () => {
            console.log('[SankeyChart] D3 libraries loaded successfully')
            setD3Loaded(true)
          }
          
          sankeyScript.onerror = () => {
            console.error('[SankeyChart] Failed to load Sankey script')
            setError('Failed to load required visualization libraries')
            setIsLoading(false)
          }
        }
        
        d3Script.onerror = () => {
          console.error('[SankeyChart] Failed to load D3 script')
          setError('Failed to load required visualization libraries')
          setIsLoading(false)
        }
      } catch (err) {
        console.error('[SankeyChart] Error loading D3:', err)
        setError('Failed to load required visualization libraries')
        setIsLoading(false)
      }
    }

    loadD3()
    
    // Cleanup function
    return () => {
      console.log('[SankeyChart] Component unmounting, cleanup')
    }
  }, [])

  // Render the chart when data and D3 are available
  useEffect(() => {
    if (!d3Loaded || !data || !chartRef.current) {
      return
    }

    try {
      const d3 = (window as any).d3
      
      if (!d3) {
        console.error('[SankeyChart] D3 is not available')
        setError('Visualization library not available')
        setIsLoading(false)
        return
      }
      
      console.log('[SankeyChart] Rendering chart with data:', data)
      setIsLoading(true)
      
      // Clear previous chart
      d3.select(chartRef.current).selectAll('*').remove()

      // Chart dimensions and margins
      const margin = { top: 10, right: 30, bottom: 10, left: 30 }
      const width = chartRef.current.clientWidth - margin.left - margin.right
      const chartHeight = height - margin.top - margin.bottom
      
      // Create SVG
      const svg = d3.select(chartRef.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', chartHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

      // Network colors
      const networkColors: Record<string, string> = {
        'Ethereum': '#627EEA',
        'Optimism': '#FF0420',
        'Arbitrum': '#28A0F0',
        'Base': '#0052FF',
        'Polygon': '#8247E5',
        'Gnosis': '#48A9A6',
      }
      
      // Token colors
      const tokenColors: Record<string, string> = {
        'ETH': '#627EEA',
        'USDC': '#2775CA',
        'USDT': '#50AF95',
        'DAI': '#F5AC37',
        'HOP': '#C084FC',
        'SNX': '#5FCB9F',
        'MATIC': '#8247E5',
        'rETH': '#F6C343',
      }
      
      // Get color for a node based on its name
      const getNodeColor = (name: string): string => {
        // Check if it's a token
        for (const token in tokenColors) {
          if (name === token) return tokenColors[token]
        }
        
        // Check if it's a network (source or destination)
        for (const network in networkColors) {
          if (name.includes(network)) return networkColors[network]
        }
        
        // Default colors based on node position/type
        if (name.includes('(dest)')) return theme.palette.primary.light
        return theme.palette.secondary.main
      }

      // Create node and link arrays (deep copy to avoid modifying original data)
      const nodes = JSON.parse(JSON.stringify(data.nodes))
      const links = JSON.parse(JSON.stringify(data.links))

      // Prepare data for sankey layout - convert object format to array format
      // This ensures consistent handling regardless of how d3-sankey decides to interpret the data
      const sankeyData = {
        nodes: nodes.map((node: any, i: number) => ({ 
          name: node.name,
          id: i  // Ensure each node has an explicit id
        })),
        links: links.map((link: any) => {
          // Make sure source and target are numbers
          const source = typeof link.source === 'number' ? link.source : 0
          const target = typeof link.target === 'number' ? link.target : 0
          
          // Validate indices to prevent errors
          const validSource = Math.min(Math.max(0, source), nodes.length - 1)
          const validTarget = Math.min(Math.max(0, target), nodes.length - 1)
          
          return {
            source: validSource,
            target: validTarget,
            value: Math.max(1, link.value || 1), // Ensure positive value
            token: link.token,
            amountDisplay: link.amountDisplay
          }
        })
      }
      
      console.log('[SankeyChart] Prepared sankey data:', sankeyData)
    
      // Create the sankey generator
      const sankey = d3.sankey()
        .nodeId((d: any) => d.id || d.index)
        .nodeWidth(20)
        .nodePadding(10)
        .extent([[0, 0], [width, chartHeight]])
      
      // Generate the sankey layout
      // We need to convert the node references in links to actual node objects
      // d3-sankey may need this depending on the version
      const sankeyNodes = sankey(sankeyData).nodes
      const sankeyLinks = sankey(sankeyData).links

      console.log('[SankeyChart] Sankey layout computed:', { nodes: sankeyNodes.length, links: sankeyLinks.length })
      
      // Define gradients for links
      const defs = svg.append('defs')
      
      // Create a gradient for each link
      sankeyLinks.forEach((link: any, i: number) => {
        const sourceNode = link.source
        const targetNode = link.target
        
        const sourceColor = getNodeColor(sourceNode.name)
        const targetColor = getNodeColor(targetNode.name)
        const tokenColor = tokenColors[link.token] || theme.palette.primary.main
        
        // Create unique gradient ID
        const gradientId = `link-gradient-${i}`
        
        // Define the gradient
        const gradient = defs.append('linearGradient')
          .attr('id', gradientId)
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', sourceNode.x1)
          .attr('y1', sourceNode.y0 + (sourceNode.y1 - sourceNode.y0) / 2)
          .attr('x2', targetNode.x0)
          .attr('y2', targetNode.y0 + (targetNode.y1 - targetNode.y0) / 2)
        
        // Add color stops
        gradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', sourceColor)
        
        gradient.append('stop')
          .attr('offset', '50%')
          .attr('stop-color', tokenColor)
          
        gradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', targetColor)
          
        // Store the gradient ID with the link
        link.gradientId = gradientId
      })
      
      // Function to generate the SVG path for a link
      const linkPath = d3.sankeyLinkHorizontal()

      // Add links
      const link = svg.append('g')
        .selectAll('.link')
        .data(sankeyLinks)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', linkPath)
        .attr('stroke', (d: any) => `url(#${d.gradientId})`)
        .attr('stroke-width', (d: any) => Math.max(1, d.width))
        .attr('stroke-opacity', 0.6)
        .attr('fill', 'none')
        .attr('stroke-linecap', 'round')
        .style('cursor', 'pointer')
      
      // Add hover effects to links
      link
        .on('mouseover', function(this: SVGPathElement, event: any, d: any) {
          d3.select(this)
            .attr('stroke-opacity', 0.9)
            .attr('stroke-width', (d: any) => Math.max(1, d.width + 1))
          
          // Show tooltip
          tooltip
            .style('opacity', 1)
            .html(`
              <div style="font-weight: bold; margin-bottom: 4px; color: ${theme.palette.primary.main}">
                ${d.source.name} → ${d.target.name}
              </div>
              <div>Token: ${d.token}</div>
              <div>Amount: ${d.amountDisplay || d.value}</div>
            `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px')
        })
        .on('mouseout', function(this: SVGPathElement) {
          d3.select(this)
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', (d: any) => Math.max(1, d.width))
          
          // Hide tooltip
          tooltip.style('opacity', 0)
        })
      
      // Add nodes
      const node = svg.append('g')
        .selectAll('.node')
        .data(sankeyNodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`)
      
      // Add node rectangles
      node.append('rect')
        .attr('height', (d: any) => d.y1 - d.y0)
        .attr('width', (d: any) => d.x1 - d.x0)
        .attr('fill', (d: any) => getNodeColor(d.name))
        .attr('stroke', (d: any) => d3.rgb(getNodeColor(d.name)).darker(0.5))
        .attr('rx', 4)
        .attr('ry', 4)
      
      // Add node titles
      node.append('text')
        .attr('x', (d: any) => (d.x0 < width / 2) ? (d.x1 - d.x0 + 6) : -6)
        .attr('y', (d: any) => (d.y1 - d.y0) / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', (d: any) => (d.x0 < width / 2) ? 'start' : 'end')
        .text((d: any) => d.name.replace(' (dest)', ''))
        .style('fill', theme.palette.text.primary)
        .style('font-size', '12px')
        .style('pointer-events', 'none')
      
      // Add a tooltip
      const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'sankey-tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background-color', theme.palette.background.paper)
        .style('color', theme.palette.text.primary)
        .style('padding', '8px 12px')
        .style('border-radius', '4px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('box-shadow', '0 0 10px rgba(0,0,0,0.1)')
        .style('z-index', 1000)
      
      setIsLoading(false)
      
      // Cleanup function to remove tooltip when component unmounts
      return () => {
        d3.select('.sankey-tooltip').remove()
      }
      
    } catch (err) {
      console.error('[SankeyChart] Error rendering chart:', err)
      setError(`Error rendering chart: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setIsLoading(false)
    }
  }, [d3Loaded, data, height, theme])

  // If no data is provided, show a fallback visualization
  useEffect(() => {
    if (!d3Loaded || !chartRef.current || data) {
      return // Only render fallback if no data is provided
    }
    
    try {
      const d3 = (window as any).d3
      if (!d3) return
      
      console.log('[SankeyChart] Rendering fallback visualization')
      
      // Clear previous chart
      d3.select(chartRef.current).selectAll('*').remove()
      
      // Chart dimensions and margins
      const margin = { top: 10, right: 30, bottom: 10, left: 30 }
      const width = chartRef.current.clientWidth - margin.left - margin.right
      const chartHeight = height - margin.top - margin.bottom
      
      // Create SVG
      const svg = d3.select(chartRef.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', chartHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
      
      // Create a simple fallback visualization
      const defs = svg.append('defs')
      
      // Sample data for the fallback
      const sampleNodes = [
        { name: 'Ethereum', x0: 0, y0: 50, x1: 20, y1: 150 },
        { name: 'Optimism', x0: 0, y0: 200, x1: 20, y1: 300 },
        { name: 'Token', x0: width/2 - 10, y0: 125, x1: width/2 + 10, y1: 225 },
        { name: 'Arbitrum (dest)', x0: width - 20, y0: 150, x1: width, y1: 250 }
      ]
      
      const sampleLinks = [
        { source: sampleNodes[0], target: sampleNodes[2], token: 'ETH', width: 15, gradientId: '' },
        { source: sampleNodes[1], target: sampleNodes[2], token: 'ETH', width: 10, gradientId: '' },
        { source: sampleNodes[2], target: sampleNodes[3], token: 'ETH', width: 20, gradientId: '' }
      ]
      
      // Network colors
      const networkColors: Record<string, string> = {
        'Ethereum': '#627EEA',
        'Optimism': '#FF0420',
        'Arbitrum': '#28A0F0',
      }
      
      // Token colors
      const tokenColors: Record<string, string> = {
        'ETH': '#627EEA'
      }
      
      // Get color for a node based on its name
      const getNodeColor = (name: string): string => {
        // Check if it's a token
        for (const token in tokenColors) {
          if (name === token) return tokenColors[token]
        }
        
        // Check if it's a network (source or destination)
        for (const network in networkColors) {
          if (name.includes(network)) return networkColors[network]
        }
        
        // Default colors based on node position/type
        if (name.includes('(dest)')) return theme.palette.primary.light
        return theme.palette.secondary.main
      }
      
      // Create gradients for fallback links
      sampleLinks.forEach((link: any, i) => {
        const sourceColor = getNodeColor(link.source.name)
        const targetColor = getNodeColor(link.target.name)
        const tokenColor = tokenColors[link.token] || theme.palette.primary.main
        
        // Create unique gradient ID
        const gradientId = `fallback-link-gradient-${i}`
        
        // Define the gradient
        const gradient = defs.append('linearGradient')
          .attr('id', gradientId)
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', link.source.x0)
          .attr('y1', (link.source.y0 + link.source.y1) / 2)
          .attr('x2', link.target.x1)
          .attr('y2', (link.target.y0 + link.target.y1) / 2)
        
        // Add color stops
        gradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', sourceColor)
        
        gradient.append('stop')
          .attr('offset', '50%')
          .attr('stop-color', tokenColor)
          
        gradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', targetColor)
          
        // Store the gradient ID with the link
        link.gradientId = gradientId
      })
      
      // Draw fallback nodes
      sampleNodes.forEach(node => {
        svg.append('rect')
          .attr('x', node.x0)
          .attr('y', node.y0)
          .attr('width', node.x1 - node.x0)
          .attr('height', node.y1 - node.y0)
          .attr('fill', getNodeColor(node.name))
          .attr('stroke', d3.rgb(getNodeColor(node.name)).darker(0.5))
          .attr('rx', 4)
          .attr('ry', 4)
        
        svg.append('text')
          .attr('x', node.name.includes('dest') ? node.x0 - 6 : node.x1 + 6)
          .attr('y', (node.y0 + node.y1) / 2)
          .attr('dy', '.35em')
          .attr('text-anchor', node.name.includes('dest') ? 'end' : 'start')
          .text(node.name.replace(' (dest)', ''))
          .style('fill', theme.palette.text.primary)
          .style('font-size', '12px')
      })
      
      // Draw fallback links
      sampleLinks.forEach((link: any) => {
        // Define path for the link
        const path = d3.linkHorizontal()
          .source((d: any) => [(d.source.x1), (d.source.y0 + d.source.y1) / 2])
          .target((d: any) => [(d.target.x0), (d.target.y0 + d.target.y1) / 2])
        
        svg.append('path')
          .attr('d', path(link as any))
          .attr('stroke', () => `url(#${link.gradientId})`)
          .attr('stroke-width', link.width)
          .attr('stroke-opacity', 0.6)
          .attr('fill', 'none')
          .attr('stroke-linecap', 'round')
      })
      
      setIsLoading(false)
      
    } catch (err) {
      console.error('[SankeyChart] Error rendering fallback:', err)
    }
  }, [d3Loaded, data, height, theme])

  return (
    <Box sx={{ width: '100%', height: height + 'px', position: 'relative' }}>
      {title && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" component="h3">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      
      {isLoading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height="100%" 
            animation="wave"
          />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      <div 
        ref={chartRef} 
        style={{ width: '100%', height: '100%', visibility: isLoading ? 'hidden' : 'visible' }}
      />
    </Box>
  )
}

export default SankeyChart 