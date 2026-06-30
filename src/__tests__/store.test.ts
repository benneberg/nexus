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
});
