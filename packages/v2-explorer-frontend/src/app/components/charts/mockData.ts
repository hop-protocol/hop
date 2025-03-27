// Mock data for Sankey chart
export const mockSankeyData = {
  nodes: [
    // Source chains
    { name: "Ethereum" },
    { name: "Arbitrum" },
    { name: "Optimism" },
    { name: "Base" },
    
    // Target chains
    { name: "Ethereum (dest)" },
    { name: "Arbitrum (dest)" },
    { name: "Optimism (dest)" },
    { name: "Base (dest)" },
    
    // Tokens
    { name: "ETH" },
    { name: "USDC" },
    { name: "DAI" },
    { name: "USDT" }
  ],
  links: [
    // Ethereum to other chains
    { source: 0, target: 5, value: 247, token: "ETH", amountDisplay: "247 ETH" },
    { source: 0, target: 6, value: 189, token: "ETH", amountDisplay: "189 ETH" },
    { source: 0, target: 7, value: 162, token: "ETH", amountDisplay: "162 ETH" },
    
    // Arbitrum to other chains
    { source: 1, target: 4, value: 203, token: "ETH", amountDisplay: "203 ETH" },
    { source: 1, target: 6, value: 179, token: "ETH", amountDisplay: "179 ETH" },
    { source: 1, target: 7, value: 145, token: "ETH", amountDisplay: "145 ETH" },
    
    // Optimism to other chains
    { source: 2, target: 4, value: 178, token: "ETH", amountDisplay: "178 ETH" },
    { source: 2, target: 5, value: 152, token: "ETH", amountDisplay: "152 ETH" },
    { source: 2, target: 7, value: 129, token: "ETH", amountDisplay: "129 ETH" },
    
    // Base to other chains
    { source: 3, target: 4, value: 165, token: "ETH", amountDisplay: "165 ETH" },
    { source: 3, target: 5, value: 139, token: "ETH", amountDisplay: "139 ETH" },
    { source: 3, target: 6, value: 119, token: "ETH", amountDisplay: "119 ETH" },
    
    // USDC transfers
    { source: 0, target: 5, value: 423, token: "USDC", amountDisplay: "423,000 USDC" },
    { source: 1, target: 4, value: 387, token: "USDC", amountDisplay: "387,000 USDC" },
    { source: 2, target: 7, value: 298, token: "USDC", amountDisplay: "298,000 USDC" },
    { source: 3, target: 6, value: 312, token: "USDC", amountDisplay: "312,000 USDC" },
    
    // DAI transfers
    { source: 0, target: 6, value: 176, token: "DAI", amountDisplay: "176,000 DAI" },
    { source: 1, target: 7, value: 143, token: "DAI", amountDisplay: "143,000 DAI" },
    { source: 2, target: 4, value: 157, token: "DAI", amountDisplay: "157,000 DAI" },
    { source: 3, target: 5, value: 165, token: "DAI", amountDisplay: "165,000 DAI" },
    
    // USDT transfers
    { source: 0, target: 7, value: 289, token: "USDT", amountDisplay: "289,000 USDT" },
    { source: 1, target: 6, value: 267, token: "USDT", amountDisplay: "267,000 USDT" },
    { source: 2, target: 5, value: 231, token: "USDT", amountDisplay: "231,000 USDT" },
    { source: 3, target: 4, value: 245, token: "USDT", amountDisplay: "245,000 USDT" }
  ]
};

// Color mapping for the chart
export const colorsMap: Record<string, string> = {
  // Updated network colors with more harmonious palette
  "Ethereum": "#6A79EB", // Softer blue
  "Arbitrum": "#48A8F3", // Cooler blue 
  "Optimism": "#F15A5A", // Softer red
  "Base": "#4D8FDF", // Coordinated blue
  "Ethereum (dest)": "#6A79EB",
  "Arbitrum (dest)": "#48A8F3",
  "Optimism (dest)": "#F15A5A", 
  "Base (dest)": "#4D8FDF",
  
  // Token colors with better contrast
  "ETH": "#9DACFF", // Lighter blue for ETH
  "USDC": "#5BBFDB", // Teal blue for USDC
  "DAI": "#DBAE5B", // Softer gold for DAI
  "USDT": "#66C29A", // Soft green for USDT
  
  "fallback": "#A8B1C5" // Neutral gray with slight blue tint
}; 