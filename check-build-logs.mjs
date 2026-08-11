#!/usr/bin/env node
/**
 * check-build-logs.mjs - Check build logs
 */
import { spawn } from 'child_process';

const MCP_CMD = 'hostinger-hosting-mcp';

const child = spawn(MCP_CMD, [], { stdio: ['pipe', 'pipe', 'pipe'], shell: true });
let responseData = '';
child.stdout.on('data', (chunk) => { responseData += chunk.toString('utf8'); });
child.stderr.on('data', (chunk) => { responseData += chunk.toString('utf8'); });

const request = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/call',
  params: {
    name: 'hosting_getNodeJSBuildLogsV1',
    arguments: {
      username: 'u296385023',
      domain: 'olive-raven-766926.hostingersite.com',
      uuid: '019ff122-15e7-73b9-b9b5-81fac516a7d7'
    }
  }
};

child.stdin.write(JSON.stringify(request) + '\n');
child.stdin.end();

const timeout = setTimeout(() => {
  child.kill();
  console.log('Timeout');
  process.exit(1);
}, 60000);

const poll = setInterval(() => {
  const lastJson = responseData.lastIndexOf('{"jsonrpc"');
  if (lastJson >= 0) {
    clearTimeout(timeout);
    clearInterval(poll);
    try {
      const response = JSON.parse(responseData.slice(lastJson));
      if (response.error) {
        console.log('Error:', response.error.message);
      } else {
        const result = JSON.parse(response.result.content[0].text);
        console.log(result.logs || JSON.stringify(result, null, 2));
      }
    } catch (e) {
      console.log('Parse error:', e.message);
    }
    process.exit(0);
  }
}, 300);
