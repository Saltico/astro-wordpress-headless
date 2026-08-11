#!/usr/bin/env node
/**
 * deploy-ssr.mjs - Deploy SSR con dist pre-compilado
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOMAIN = 'orangered-deer-742907.hostingersite.com';
const ARCHIVE = path.join(__dirname, 'dist_nodejs_deploy.zip');
const MCP_CMD = 'hostinger-hosting-mcp';

console.log('🚀 Deploy SSR con dist pre-compilado...\n');

const child = spawn(MCP_CMD, [], { stdio: ['pipe', 'pipe', 'pipe'], shell: true });
let responseData = '';
child.stdout.on('data', (chunk) => { responseData += chunk.toString('utf8'); });
child.stderr.on('data', (chunk) => { responseData += chunk.toString('utf8'); });

const request = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/call',
  params: {
    name: 'hosting_deployJsApplication',
    arguments: { domain: DOMAIN, archivePath: ARCHIVE }
  }
};

child.stdin.write(JSON.stringify(request) + '\n');
child.stdin.end();

const timeout = setTimeout(() => {
  child.kill();
  console.log('⏰ Timeout - Respuesta parcial:');
  console.log(responseData.slice(-2000));
  process.exit(1);
}, 300000);

const poll = setInterval(() => {
  const lastJson = responseData.lastIndexOf('{"jsonrpc"');
  if (lastJson >= 0) {
    clearTimeout(timeout);
    clearInterval(poll);
    try {
      const response = JSON.parse(responseData.slice(lastJson));
      if (response.error) {
        console.log('❌ Error:', response.error.message);
      } else {
        const result = JSON.parse(response.result.content[0].text);
        console.log('✅ Upload:', result.upload?.status);
        console.log('📋 Resolve:', result.resolveSettings?.status);
        if (result.resolveSettings?.data) {
          console.log('   App type:', result.resolveSettings.data.app_type);
          console.log('   Node version:', result.resolveSettings.data.node_version);
          console.log('   Build script:', result.resolveSettings.data.build_script);
          console.log('   Entry file:', result.resolveSettings.data.entry_file);
          console.log('   Output dir:', result.resolveSettings.data.output_directory);
        }
        console.log('🔨 Build:', result.build?.status, result.build?.data?.uuid || '');
        if (result.build?.data?.options) {
          console.log('   Build options:', JSON.stringify(result.build.data.options, null, 2));
        }
      }
    } catch (e) {
      console.log('⚠️ Parse error:', e.message);
      console.log('Response:', responseData.slice(-500));
    }
    process.exit(0);
  }
}, 500);
