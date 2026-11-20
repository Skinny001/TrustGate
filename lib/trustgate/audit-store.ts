import fs from 'fs';
import path from 'path';
import { AuditRecord, GatewayStats } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const AUDIT_FILE = path.join(DATA_DIR, 'audit_log.json');

// Ensure storage directory and clean initial state
function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(AUDIT_FILE)) {
    // Clean empty store: ONLY real live events are recorded
    fs.writeFileSync(AUDIT_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

export function getAllRecords(): AuditRecord[] {
  ensureStorage();
  try {
    const raw = fs.readFileSync(AUDIT_FILE, 'utf8');
    return JSON.parse(raw) as AuditRecord[];
  } catch (error) {
    console.error('Error reading audit log file:', error);
    return [];
  }
}

export function addAuditRecord(record: Omit<AuditRecord, 'id' | 'timestamp'>): AuditRecord {
  ensureStorage();
  const records = getAllRecords();
  const newRecord: AuditRecord = {
    id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...record,
  };

  records.unshift(newRecord); // newest first
  const trimmed = records.slice(0, 1000);

  try {
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to audit log file:', err);
  }

  return newRecord;
}

export function getStats(): GatewayStats {
  const records = getAllRecords();
  const activeAgentSet = new Set<string>();
  let allowed = 0;
  let blocked = 0;
  let settledTotal = 0;

  for (const r of records) {
    if (r.decision === 'ALLOWED') {
      allowed++;
      activeAgentSet.add(r.agentId);
      if (r.payment && r.payment.settled) {
        settledTotal += parseFloat(r.payment.amount) || 0;
      }
    } else {
      blocked++;
    }
  }

  return {
    activeAgents: activeAgentSet.size,
    requestsTotal: records.length,
    requestsAllowed: allowed,
    requestsBlocked: blocked,
    totalSettledAmount: Number(settledTotal.toFixed(4)),
    lastUpdated: new Date().toISOString(),
  };
}
