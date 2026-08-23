import { describe, it, expect } from 'vitest';
import { CCCObject, CCCIR } from '../types';
import { 
  evaluateCondition, 
  evaluateConditionGroup, 
  parseQueryDSL, 
  calculateAggregates, 
  queryCCC 
} from '../lib/cccQueryEngine';

describe('CCC Query Engine', () => {
  const sampleNodes: CCCObject[] = [
    {
      id: 'root-project',
      name: 'Nexus Workspace',
      type: 'Project',
      metadata: { path: '/app', lines: '500 loc' },
      connections: ['dep-react', 'file-server', 'file-[#src/App.tsx#]']
    },
    {
      id: 'dep-react',
      name: 'react',
      type: 'Dependency',
      metadata: { version: '^19.0.0' },
      connections: []
    },
    {
      id: 'file-server',
      name: 'server.ts',
      type: 'Service',
      metadata: { path: 'server.ts', lines: '250 loc', size: '12kb' },
      connections: ['dep-express', 'dep-ws']
    },
    {
      id: 'file-app',
      name: 'App.tsx',
      type: 'Module',
      metadata: { path: 'src/App.tsx', lines: '120 loc' },
      connections: ['dep-react', 'dep-lucide-react']
    },
    {
      id: 'file-helper',
      name: 'utils.ts',
      type: 'Module',
      metadata: { path: 'src/lib/utils.ts', lines: '15 loc' },
      connections: []
    }
  ];

  const sampleIR: CCCIR = {
    nodes: sampleNodes,
    lastUpdated: Date.now()
  };

  it('evaluates simple equality and numeric conditions', () => {
    const node = sampleNodes[2]; // server.ts
    expect(evaluateCondition(node, { field: 'type', operator: '=', value: 'Service' })).toBe(true);
    expect(evaluateCondition(node, { field: 'type', operator: '=', value: 'Module' })).toBe(false);
    expect(evaluateCondition(node, { field: 'metadata.lines', operator: '>', value: 100 })).toBe(true);
    expect(evaluateCondition(node, { field: 'connections', operator: '>=', value: 2 })).toBe(true);
  });

  it('evaluates string containment and array connections', () => {
    const node = sampleNodes[0]; // root-project
    expect(evaluateCondition(node, { field: 'metadata.path', operator: 'contains', value: 'app' })).toBe(true);
    expect(evaluateCondition(node, { field: 'connections', operator: '=', value: 3 })).toBe(true);
  });

  it('evaluates nested condition groups (AND / OR)', () => {
    const node = sampleNodes[3]; // App.tsx
    const andGroup = {
      logicalOp: 'AND' as const,
      conditions: [
        { field: 'type', operator: '=' as const, value: 'Module' },
        { field: 'metadata.path', operator: 'contains' as const, value: 'src' }
      ]
    };
    expect(evaluateConditionGroup(node, andGroup)).toBe(true);

    const orGroup = {
      logicalOp: 'OR' as const,
      conditions: [
        { field: 'type', operator: '=' as const, value: 'Service' },
        { field: 'name', operator: '=' as const, value: 'App.tsx' }
      ]
    };
    expect(evaluateConditionGroup(node, orGroup)).toBe(true);
  });

  it('parses DSL query strings into condition groups', () => {
    const dsl1 = 'type = Dependency';
    const parsed1 = parseQueryDSL(dsl1);
    expect(queryCCC(sampleIR, parsed1)).toHaveLength(1);
    expect(queryCCC(sampleIR, parsed1)[0].name).toBe('react');

    const dsl2 = 'metadata.lines > 100 AND type = Module';
    const parsed2 = parseQueryDSL(dsl2);
    expect(queryCCC(sampleIR, parsed2)).toHaveLength(1);
    expect(queryCCC(sampleIR, parsed2)[0].name).toBe('App.tsx');
  });

  it('calculates graph aggregates accurately', () => {
    const stats = calculateAggregates(sampleNodes);
    expect(stats.totalNodes).toBe(5);
    expect(stats.byType['Module']).toBe(2);
    expect(stats.byType['Dependency']).toBe(1);
    expect(stats.byType['Service']).toBe(1);
    expect(stats.criticalHubsCount).toBe(1); // root-project has 3
    expect(stats.orphanNodesCount).toBe(2); // dep-react and utils.ts
    expect(stats.totalLinesOfCode).toBe(885);
  });
});
