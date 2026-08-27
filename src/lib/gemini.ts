export interface OrchestrationOptions {
  brainMode?: 'flash' | 'deep-reasoning' | 'multi-brain' | 'security-auditor';
  model?: string;
  context?: any;
}

export const generateOrchestration = async (prompt: string, contextOrOptions?: any, options?: OrchestrationOptions) => {
  let context = contextOrOptions;
  let brainMode = 'flash';
  let model: string | undefined = undefined;

  if (contextOrOptions && typeof contextOrOptions === 'object' && ('brainMode' in contextOrOptions || 'model' in contextOrOptions)) {
    brainMode = contextOrOptions.brainMode || 'flash';
    model = contextOrOptions.model;
    context = contextOrOptions.context;
  } else if (options) {
    brainMode = options.brainMode || 'flash';
    model = options.model;
    if (options.context) context = options.context;
  }

  const response = await fetch('/api/orchestrate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt, context, brainMode, model })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server returned status ${response.status}`);
  }

  return response.json();
};
