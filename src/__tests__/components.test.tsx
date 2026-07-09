import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useStore } from '../store/useStore';
import { ChatPanel } from '../components/workspace/ChatPanel';
import { ArtifactPanel } from '../components/workspace/ArtifactPanel';

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: any) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}));

// Mock ReactFlow
vi.mock('reactflow', () => {
  const ReactFlowMock = ({ children }: any) => <div data-testid="reactflow-mock">{children}</div>;
  return {
    default: ReactFlowMock,
    Background: () => <div data-testid="reactflow-background" />,
    Controls: () => <div data-testid="reactflow-controls" />,
    MiniMap: () => <div data-testid="reactflow-minimap" />,
    useNodesState: (initial: any) => [initial, vi.fn()],
    useEdgesState: (initial: any) => [initial, vi.fn()],
    addEdge: vi.fn(),
    MarkerType: { ArrowClosed: 'arrowclosed' },
  };
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Workspace Component Panels', () => {
  test('ChatPanel should render properly and accept input', () => {
    // Force empty messages state to test greeting screen
    useStore.setState({ messages: [] });
    
    render(<ChatPanel />);
    
    // Check if empty state system greeting is rendered
    expect(screen.getByText(/Primed/i)).toBeDefined();
    
    // Find input textarea
    const textarea = screen.getByPlaceholderText(/Input steering intent/i);
    expect(textarea).toBeDefined();
    
    // Type into textarea
    fireEvent.change(textarea, { target: { value: 'Add user auth to the app' } });
    expect((textarea as HTMLTextAreaElement).value).toBe('Add user auth to the app');
  });

  test('ChatPanel should display active messages list when not empty', () => {
    // Seed messages
    useStore.setState({
      messages: [
        {
          id: 'test-welcome',
          role: 'assistant',
          content: 'Hello, I am the Nexus Semantic Orchestrator.',
          timestamp: Date.now(),
        }
      ]
    });

    render(<ChatPanel />);

    // Check if welcome message content is rendered
    expect(screen.getByText(/Hello, I am the Nexus Semantic Orchestrator/)).toBeDefined();
  });

  test('ArtifactPanel should render with default tabs and files', () => {
    // Add a mockup project to store for artifact listing
    const store = useStore.getState();
    store.addProject({
      id: 'test-p-1',
      name: 'Sample Test Project',
      description: 'A simple test project description',
      scaffoldType: 'react-pwa',
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    store.setCurrentProject('test-p-1');
    
    render(<ArtifactPanel />);
    
    // Should render Code and terminal view tab options
    expect(screen.getByText(/Logs/i)).toBeDefined();
    expect(screen.getByText(/Preview/i)).toBeDefined();
  });
});
