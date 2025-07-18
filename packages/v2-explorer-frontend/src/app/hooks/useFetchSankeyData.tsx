import { useQuery } from 'react-query'
import { apiUrl } from '@/app/config'
import { mockSankeyData } from '../components/charts/mockData'

type SankeyDataProps = {
  days?: number
  sourceChainId?: string
  destinationChainId?: string
  tokenSymbol?: string
}

type SankeyData = {
  nodes: Array<{
    name: string
  }>
  links: Array<{
    source: number
    target: number
    value: number
    token: string
    amountDisplay: string
  }>
}

// Output format that mimics mockSankeyData structure
type SankeyDataResponse = {
  data: SankeyData | null
  lastUpdated: string
}

const fetchSankeyData = async (options: SankeyDataProps = {}): Promise<SankeyDataResponse> => {
  try {
    // Build query params
    const queryParams = new URLSearchParams();
    if (options.days) queryParams.append('days', options.days.toString());
    if (options.sourceChainId) queryParams.append('sourceChainId', options.sourceChainId);
    if (options.destinationChainId) queryParams.append('destinationChainId', options.destinationChainId);
    if (options.tokenSymbol) queryParams.append('tokenSymbol', options.tokenSymbol);

    const queryString = queryParams.toString();
    const endpoint = `${apiUrl}/v1/stats/flow${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(endpoint);
    
    if (!response.ok) {
      return {
        data: null,
        lastUpdated: new Date().toISOString()
      };
    }
    
    const rawData = await response.json();
    
    // Process the data into the format required by the Sankey chart
    return {
      data: processApiResponse(rawData),
      lastUpdated: rawData.lastUpdated || new Date().toISOString()
    };
  } catch (error) {
    return {
      data: null,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Helper function to process API response into Sankey format
function processApiResponse(apiData: any): SankeyData | null {
  // If the API isn't implemented yet or returns no data, return null
  if (!apiData || !apiData.transferFlows || apiData.transferFlows.length === 0) {
    return null;
  }
  
  try {
    // Create sets to track unique nodes
    const sourceChains = new Set<string>();
    const destChains = new Set<string>();
    const tokens = new Set<string>();
    
    // First pass - collect unique values
    apiData.transferFlows.forEach((flow: any) => {
      sourceChains.add(flow.sourceChainName);
      destChains.add(`${flow.destinationChainName} (dest)`);
      tokens.add(flow.tokenSymbol);
    });

    // If no flows were processed (all amounts too small), return null
    if (sourceChains.size === 0 || destChains.size === 0 || tokens.size === 0) {
      return null;
    }
    
    // Create nodes array
    const nodes = [
      // Source chains
      ...Array.from(sourceChains).map(name => ({ name })),
      // Tokens (in the middle)
      ...Array.from(tokens).map(name => ({ name })),
      // Destination chains
      ...Array.from(destChains).map(name => ({ name }))
    ];
    
    // Create a mapping of node names to indices
    const nodeIndices: Record<string, number> = {};
    nodes.forEach((node, index) => {
      nodeIndices[node.name] = index;
    });
    
    // Create links array - for each flow create two links:
    // 1. Source chain -> Token
    // 2. Token -> Destination chain
    const links: Array<{
      source: number;
      target: number;
      value: number;
      token: string;
      amountDisplay: string;
    }> = [];
    
    apiData.transferFlows.forEach((flow: any) => {
      const sourceChain = flow.sourceChainName;
      const destChain = `${flow.destinationChainName} (dest)`;
      const token = flow.tokenSymbol;
      
      // Parse the amount and scale it for visualization
      const amount = parseFloat(flow.formattedAmount);
      
      // Skip if amount is too small or invalid
      if (isNaN(amount) || amount < 0.0001) return;
      
      // Scale the value logarithmically to make the visualization more balanced
      // Avoids extremely thin or thick lines when values vary greatly
      const value = Math.max(1, Math.log(amount + 1) * 10);
      
      // Add link from source chain to token
      links.push({
        source: nodeIndices[sourceChain],
        target: nodeIndices[token],
        value,
        token,
        amountDisplay: `${flow.formattedAmount} ${token}`
      });
      
      // Add link from token to destination chain
      links.push({
        source: nodeIndices[token],
        target: nodeIndices[destChain],
        value,
        token,
        amountDisplay: `${flow.formattedAmount} ${token}`
      });
    });

    // If no valid links were created, return null
    if (links.length === 0) {
      return null;
    }
    
    return { nodes, links };
  } catch (error) {
    // Return null instead of mock data
    return null;
  }
}

export const useFetchSankeyData = (options: SankeyDataProps = {}): { 
  sankeyData: SankeyData | null, 
  loading: boolean, 
  error: string | null,
  lastUpdated: string | null
} => {
  const { data, isLoading, error } = useQuery<SankeyDataResponse, Error>(
    ['sankeyData', options.days, options.sourceChainId, options.destinationChainId, options.tokenSymbol], 
    () => fetchSankeyData(options), 
    {
      refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
      staleTime: 3 * 60 * 1000,       // Consider data fresh for 3 minutes
      retry: 2
    }
  );

  return {
    sankeyData: data?.data || null,
    loading: isLoading,
    error: error ? error.message : null,
    lastUpdated: data?.lastUpdated || null
  }
} 