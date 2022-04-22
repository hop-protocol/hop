const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
}

const jsonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

export const jsonCorsHeaders = {
  ...corsHeaders,
  ...jsonHeaders,
}
