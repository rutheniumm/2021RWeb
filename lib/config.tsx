// src/lib/config.ts

interface BackendFlags {
    [key: string]: boolean; // Allows indexing by string
  }
  
  interface PublicRuntimeConfigBackend {
    apiFormat: string;
    baseUrl: string;
    proxyEnabled: boolean;
    flags: BackendFlags;
  }
  
  interface ServerRuntimeConfigBackend {
    authorization: string;
  }
  
  interface PublicRuntimeConfig {
    backend: PublicRuntimeConfigBackend;
  }
  
  interface ServerRuntimeConfig {
    backend: ServerRuntimeConfigBackend;
  }
  
  interface Config {
    publicRuntimeConfig: PublicRuntimeConfig;
    serverRuntimeConfig: ServerRuntimeConfig;
  }
  
  const config: Config = {
    publicRuntimeConfig: {
      backend: {
        apiFormat: Deno.env.get('BACKEND_API_FORMAT') || '',
        baseUrl: Deno.env.get('BACKEND_BASE_URL') || '',
        proxyEnabled: Deno.env.get('PROXY_ENABLED') === 'true',
        flags: {
          exampleFlag: true,
          // Add more flags here
        },
      }
    },
    serverRuntimeConfig: {
      backend: {
        authorization: Deno.env.get('AUTHORIZATION') || ''
      }
    }
  };
  
  export default config;
  