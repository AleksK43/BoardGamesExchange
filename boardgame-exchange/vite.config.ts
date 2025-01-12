import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_APP_API_URL || 'http://127.0.0.1:8080'
  
  console.log('Vite config mode:', mode)
  console.log('API Target:', apiTarget)

  return defineConfig({
    plugins: [react()],
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },

    server: {
      port: 3000,
      proxy: {
        '/api/v1': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.error('Proxy error:', err)
            })

            proxy.on('proxyReq', (proxyReq, req) => {
              proxyReq.setHeader('origin', apiTarget)
              console.log(`[Proxy] ${req.method} ${req.url} -> ${apiTarget}`)
            })

            proxy.on('proxyRes', (proxyRes, req) => {
              console.log(`[Proxy] Response: ${proxyRes.statusCode} ${req.url}`)
            })
          },
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
          }
        }
      }
    }
  })
}