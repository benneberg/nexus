import { describe, test, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStore } from '../store/useStore';

describe('Store Logic', () => {
  beforeEach(() => {
    // Reset store state if necessary or use a clean state
  });

  test('should add project and instantiate template files', () => {
    const { result } = renderHook(() => useStore());
    
    const projectId = `test-p-${Date.now()}`;
    
    act(() => {
      result.current.addProject({
        id: projectId,
        name: 'Test Project',
        description: 'A test project',
        scaffoldType: 'react-pwa',
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    const project = result.current.projects.find(p => p.id === projectId);
    expect(project).toBeDefined();
    expect(project?.name).toBe('Test Project');

    const artifacts = result.current.artifacts.filter(a => a.projectId === projectId);
    // react-pwa template has 2 initial files + 1 distilled thought artifact added automatically
    expect(artifacts.length).toBeGreaterThan(0);
    
    const codeArtifacts = artifacts.filter(a => a.type === 'code');
    expect(codeArtifacts.length).toBeGreaterThan(0);
  });

  test('should set active view', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.setActiveView('deck');
    });
    
    expect(result.current.activeView).toBe('deck');
  });

  test('should update telemetry stream metrics', () => {
    const { result } = renderHook(() => useStore());
    
    const sampleTelemetry = {
      timestamp: 1700000000000,
      cpu: 18,
      memory: 42,
      network: 12,
      latency: 24,
      uptime: '3d 12h'
    };

    act(() => {
      result.current.updateTelemetryStream(sampleTelemetry);
    });

    expect(result.current.telemetryStream).toEqual(sampleTelemetry);
  });

  test('should support saving existing project as custom template', () => {
    const { result } = renderHook(() => useStore());
    const projectId = `p-template-${Date.now()}`;

    act(() => {
      result.current.addProject({
        id: projectId,
        name: 'Template Source Project',
        description: 'Source for custom template',
        scaffoldType: 'react-pwa',
        status: 'active',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    act(() => {
      result.current.saveAsTemplate(projectId, 'Custom React Arch', 'Custom Architecture Template');
    });

    const templates = result.current.templates || [];
    const createdTemplate = templates.find(t => t.name === 'Custom React Arch');
    expect(createdTemplate).toBeDefined();
    expect(createdTemplate?.description).toBe('Custom Architecture Template');
  });

  test('should install skill from marketplace', () => {
    const { result } = renderHook(() => useStore());
    const testSkillId = 'skill-test-1';

    // Add dummy skill to marketplace
    act(() => {
      useStore.setState({
        marketplaceSkills: [
          {
            id: testSkillId,
            name: 'Test Skill',
            version: '1.0.0',
            description: 'Test skill description',
            category: 'SECURITY',
            author: 'Nexus',
            downloads: 10,
            rating: 5,
            triggers: ['security'],
            tools: ['audit'],
            retrievalRules: [],
            workflows: [],
            validations: [],
            prompts: []
          }
        ]
      });
    });

    act(() => {
      result.current.installSkill(testSkillId);
    });

    const installedSkill = result.current.skills.find(s => s.id === testSkillId);
    expect(installedSkill).toBeDefined();
    expect(installedSkill?.name).toBe('Test Skill');
  });
});
