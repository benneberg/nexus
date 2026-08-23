import { CCCObject, CCCIR } from '../types';

export type Operator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'matches';

export interface QueryCondition {
  field: string;
  operator: Operator;
  value: any;
}

export interface ConditionGroup {
  logicalOp: 'AND' | 'OR';
  conditions: (QueryCondition | ConditionGroup)[];
}

export interface CCCAggregateResult {
  totalNodes: number;
  byType: Record<string, number>;
  avgConnections: number;
  maxConnections: { id: string; name: string; count: number } | null;
  criticalHubsCount: number;
  orphanNodesCount: number;
  totalLinesOfCode: number;
  dependencyDensityRatio: number;
}

export interface CCCPresetQuery {
  id: string;
  name: string;
  description: string;
  dsl: string;
  conditionGroup: ConditionGroup;
}

/**
 * Extract field value from a CCCObject, supporting nested metadata properties and special properties.
 */
export function getFieldValue(node: CCCObject, field: string): any {
  if (!field) return undefined;
  
  const normalizedField = field.trim().toLowerCase();

  if (normalizedField === 'type') return node.type;
  if (normalizedField === 'name') return node.name;
  if (normalizedField === 'id') return node.id;
  if (normalizedField === 'connections' || normalizedField === 'connections.length') {
    return node.connections ? node.connections.length : 0;
  }
  if (normalizedField === 'connection_ids' || normalizedField === 'connections_list') {
    return node.connections || [];
  }

  // Handle metadata.x or direct metadata field access
  if (normalizedField.startsWith('metadata.')) {
    const metaKey = field.trim().slice(9);
    return extractMetadataValue(node.metadata, metaKey);
  }

  // Try direct metadata lookup
  if (node.metadata && node.metadata[field]) {
    return extractMetadataValue(node.metadata, field);
  }

  return undefined;
}

function extractMetadataValue(metadata: Record<string, any> | undefined, key: string): any {
  if (!metadata) return undefined;
  const raw = metadata[key];
  if (raw === undefined) return undefined;

  // Handle line strings like "140 loc" or "2.5kb"
  if (typeof raw === 'string') {
    if (key === 'lines' || raw.includes('loc')) {
      const parsed = parseInt(raw.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed)) return parsed;
    }
    if (key === 'size' || raw.includes('kb')) {
      const parsed = parseFloat(raw.replace(/[^0-9.]/g, ''));
      if (!isNaN(parsed)) return parsed;
    }
  }
  return raw;
}

/**
 * Evaluate a single condition against a CCC node.
 */
export function evaluateCondition(node: CCCObject, cond: QueryCondition): boolean {
  const nodeVal = getFieldValue(node, cond.field);
  const targetVal = cond.value;

  if (nodeVal === undefined) {
    if (cond.operator === '!=') return true;
    return false;
  }

  const op = cond.operator;

  // Numeric comparisons
  const nodeNum = Number(nodeVal);
  const targetNum = Number(targetVal);

  if (!isNaN(nodeNum) && !isNaN(targetNum) && typeof nodeVal !== 'boolean' && typeof targetVal !== 'boolean') {
    switch (op) {
      case '=': return nodeNum === targetNum;
      case '!=': return nodeNum !== targetNum;
      case '>': return nodeNum > targetNum;
      case '<': return nodeNum < targetNum;
      case '>=': return nodeNum >= targetNum;
      case '<=': return nodeNum <= targetNum;
    }
  }

  // Array / connection checking
  if (Array.isArray(nodeVal)) {
    if (op === 'contains' || op === '=') {
      return nodeVal.some(item => String(item).toLowerCase().includes(String(targetVal).toLowerCase()));
    }
  }

  // String comparisons
  const nodeStr = String(nodeVal).toLowerCase();
  const targetStr = String(targetVal).toLowerCase();

  switch (op) {
    case '=':
      return nodeStr === targetStr;
    case '!=':
      return nodeStr !== targetStr;
    case 'contains':
      return nodeStr.includes(targetStr);
    case 'startsWith':
      return nodeStr.startsWith(targetStr);
    case 'endsWith':
      return nodeStr.endsWith(targetStr);
    case 'in':
      const list = Array.isArray(targetVal) ? targetVal : String(targetVal).split(',').map(s => s.trim().toLowerCase());
      return list.includes(nodeStr);
    case 'matches':
      try {
        const regex = new RegExp(String(targetVal), 'i');
        return regex.test(nodeStr);
      } catch (e) {
        return nodeStr.includes(targetStr);
      }
    default:
      return nodeStr === targetStr;
  }
}

/**
 * Evaluate nested condition groups.
 */
export function evaluateConditionGroup(node: CCCObject, group: ConditionGroup): boolean {
  if (!group || !group.conditions || group.conditions.length === 0) return true;

  if (group.logicalOp === 'AND') {
    return group.conditions.every(c => {
      if ('logicalOp' in c) {
        return evaluateConditionGroup(node, c as ConditionGroup);
      }
      return evaluateCondition(node, c as QueryCondition);
    });
  } else {
    return group.conditions.some(c => {
      if ('logicalOp' in c) {
        return evaluateConditionGroup(node, c as ConditionGroup);
      }
      return evaluateCondition(node, c as QueryCondition);
    });
  }
}

/**
 * Parse simple DSL query text into ConditionGroup.
 * Supports: `field:value`, `field = value`, `field > number`, `cond1 AND cond2`, `cond1 OR cond2`
 */
export function parseQueryDSL(queryStr: string): ConditionGroup {
  const trimmed = queryStr.trim();
  if (!trimmed) {
    return { logicalOp: 'AND', conditions: [] };
  }

  // Check if string contains OR
  if (trimmed.includes(' OR ')) {
    const parts = trimmed.split(' OR ');
    return {
      logicalOp: 'OR',
      conditions: parts.map(p => parseQueryDSL(p))
    };
  }

  // Check if string contains AND
  if (trimmed.includes(' AND ')) {
    const parts = trimmed.split(' AND ');
    return {
      logicalOp: 'AND',
      conditions: parts.map(p => parseQueryDSL(p))
    };
  }

  // Single condition parsing
  let op: Operator = '=';
  let field = 'name';
  let valStr = trimmed;

  if (trimmed.includes('>=')) {
    const [f, v] = trimmed.split('>=');
    field = f; op = '>='; valStr = v;
  } else if (trimmed.includes('<=')) {
    const [f, v] = trimmed.split('<=');
    field = f; op = '<='; valStr = v;
  } else if (trimmed.includes('>')) {
    const [f, v] = trimmed.split('>');
    field = f; op = '>'; valStr = v;
  } else if (trimmed.includes('<')) {
    const [f, v] = trimmed.split('<');
    field = f; op = '<'; valStr = v;
  } else if (trimmed.includes('!=')) {
    const [f, v] = trimmed.split('!=');
    field = f; op = '!='; valStr = v;
  } else if (trimmed.includes(' contains ')) {
    const [f, v] = trimmed.split(' contains ');
    field = f; op = 'contains'; valStr = v;
  } else if (trimmed.includes('=')) {
    const [f, v] = trimmed.split('=');
    field = f; op = '='; valStr = v;
  } else if (trimmed.includes(':')) {
    const [f, v] = trimmed.split(':');
    field = f; op = 'contains'; valStr = v;
  } else {
    // Fallback: search across all fields
    return {
      logicalOp: 'OR',
      conditions: [
        { field: 'name', operator: 'contains', value: trimmed },
        { field: 'type', operator: 'contains', value: trimmed },
        { field: 'metadata.path', operator: 'contains', value: trimmed }
      ]
    };
  }

  // Clean values
  const cleanField = field.trim();
  const cleanVal = valStr.trim().replace(/^['"]|['"]$/g, '');

  return {
    logicalOp: 'AND',
    conditions: [
      { field: cleanField, operator: op, value: cleanVal }
    ]
  };
}

/**
 * Filter nodes using structured ConditionGroup.
 */
export function queryCCC(ir: CCCIR | null | undefined, conditionGroup: ConditionGroup): CCCObject[] {
  if (!ir || !ir.nodes) return [];
  if (!conditionGroup || conditionGroup.conditions.length === 0) return ir.nodes;
  return ir.nodes.filter(node => evaluateConditionGroup(node, conditionGroup));
}

/**
 * Calculate graph statistics and aggregates over filtered or total nodes.
 */
export function calculateAggregates(nodes: CCCObject[]): CCCAggregateResult {
  const totalNodes = nodes.length;
  const byType: Record<string, number> = {};
  let totalConnCount = 0;
  let criticalHubsCount = 0;
  let orphanNodesCount = 0;
  let totalLinesOfCode = 0;
  let maxConnections: { id: string; name: string; count: number } | null = null;

  nodes.forEach(node => {
    // Type frequency
    byType[node.type] = (byType[node.type] || 0) + 1;

    // Connections count
    const connCount = node.connections ? node.connections.length : 0;
    totalConnCount += connCount;

    if (connCount >= 3) {
      criticalHubsCount++;
    }
    if (connCount === 0) {
      orphanNodesCount++;
    }

    if (!maxConnections || connCount > maxConnections.count) {
      maxConnections = { id: node.id, name: node.name, count: connCount };
    }

    // LOC calculation
    if (node.metadata && node.metadata.lines) {
      const locVal = extractMetadataValue(node.metadata, 'lines');
      if (typeof locVal === 'number' && !isNaN(locVal)) {
        totalLinesOfCode += locVal;
      }
    }
  });

  const avgConnections = totalNodes > 0 ? Math.round((totalConnCount / totalNodes) * 100) / 100 : 0;
  const dependencyDensityRatio = totalNodes > 1 ? Math.round((totalConnCount / (totalNodes * (totalNodes - 1))) * 1000) / 1000 : 0;

  return {
    totalNodes,
    byType,
    avgConnections,
    maxConnections,
    criticalHubsCount,
    orphanNodesCount,
    totalLinesOfCode,
    dependencyDensityRatio
  };
}

/**
 * Pre-defined CCC Architectural Queries
 */
export const PRESET_CCC_QUERIES: CCCPresetQuery[] = [
  {
    id: 'critical-hubs',
    name: 'Critical Architectural Hubs',
    description: 'Find choke points and highly connected core modules with >= 3 dependencies',
    dsl: 'connections >= 3',
    conditionGroup: {
      logicalOp: 'AND',
      conditions: [{ field: 'connections', operator: '>=', value: 3 }]
    }
  },
  {
    id: 'high-complexity',
    name: 'High LOC / Complex Files',
    description: 'Locate heavy codebases with over 50 lines of code',
    dsl: 'metadata.lines > 50',
    conditionGroup: {
      logicalOp: 'AND',
      conditions: [{ field: 'metadata.lines', operator: '>', value: 50 }]
    }
  },
  {
    id: 'external-packages',
    name: 'External Package Dependencies',
    description: 'Retrieve all npm package dependency symbols imported by the project',
    dsl: 'type = Dependency',
    conditionGroup: {
      logicalOp: 'AND',
      conditions: [{ field: 'type', operator: '=', value: 'Dependency' }]
    }
  },
  {
    id: 'active-services',
    name: 'Active Services & Backend APIs',
    description: 'Inspect express API services, servers, and endpoints',
    dsl: 'type = Service OR metadata.path contains server',
    conditionGroup: {
      logicalOp: 'OR',
      conditions: [
        { field: 'type', operator: '=', value: 'Service' },
        { field: 'metadata.path', operator: 'contains', value: 'server' }
      ]
    }
  },
  {
    id: 'orphan-symbols',
    name: 'Orphan / Isolated Symbols',
    description: 'Detect modules or files with 0 connections',
    dsl: 'connections = 0',
    conditionGroup: {
      logicalOp: 'AND',
      conditions: [{ field: 'connections', operator: '=', value: 0 }]
    }
  },
  {
    id: 'react-components',
    name: 'React UI Components',
    description: 'Filter frontend JSX/TSX modules in src/components directory',
    dsl: 'type = Module AND metadata.path contains components',
    conditionGroup: {
      logicalOp: 'AND',
      conditions: [
        { field: 'type', operator: '=', value: 'Module' },
        { field: 'metadata.path', operator: 'contains', value: 'components' }
      ]
    }
  }
];
