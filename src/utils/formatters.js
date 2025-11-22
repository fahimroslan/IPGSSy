const currencyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(value) {
  return currencyFormatter.format(Number(value) || 0);
}

export function formatAgentCode(agentId) {
  if (agentId === null || agentId === undefined) return 'AG-????';
  return `AG-${String(agentId).padStart(4, '0')}`;
}

export function formatFeeGroupCode(agentId, sequence) {
  const agentCode = formatAgentCode(agentId);
  const seqPart = sequence ? `FG-${String(sequence).padStart(2, '0')}` : 'FG-??';
  return `${agentCode}/${seqPart}`;
}

const AGENT_TYPE_LABELS = {
  internal: 'Internal Marketing',
  external: 'External Agent',
};

export function getAgentTypeLabel(type) {
  return AGENT_TYPE_LABELS[type] || AGENT_TYPE_LABELS.external;
}
