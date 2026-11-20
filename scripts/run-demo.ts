import { spawn } from 'child_process';
import path from 'path';

function runScript(scriptName: string): Promise<void> {
  return new Promise((resolve) => {
    const proc = spawn('npx', ['tsx', path.join(__dirname, scriptName)], {
      stdio: 'inherit',
      shell: true,
      env: process.env,
    });
    proc.on('close', () => resolve());
  });
}

async function main() {
  console.log('\n🚀 Starting TrustGate End-to-End Demo...');
  console.log('Testing 1 Gateway, 2 Agents (A: Verified, B: Unverified), and 1 Paid API.\n');

  console.log('>>> RUNNING TEST 1: Agent A (Verified & Paying)');
  await runScript('demo-agent-a.ts');

  console.log('\n----------------------------------------------------\n');
  console.log('>>> RUNNING TEST 2: Agent B (Unverified / Blocked)');
  await runScript('demo-agent-b.ts');

  console.log('\n✅ Demo simulation finished. Check dashboard at http://localhost:3000 to see real-time audit logs!\n');
}

main().catch(console.error);
