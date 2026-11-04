import type { ArchitectureExperiment, ArchNode } from '../../data/architecture';

interface DiagramProps {
  experiment: ArchitectureExperiment;
}

const NODE_W = 124;
const NODE_H = 52;

function boundaryPoint(from: ArchNode, to: ArchNode) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const scale = Math.min(
    (NODE_W / 2 + 2) / Math.max(Math.abs(dx), 1),
    (NODE_H / 2 + 2) / Math.max(Math.abs(dy), 1),
  );
  return { x: from.x + dx * scale, y: from.y + dy * scale };
}

const toneStyles = {
  strong: {
    fill: '#14120e',
    stroke: 'rgba(184, 165, 138, 0.9)',
    label: '#f4f0e7',
    sub: 'rgba(184, 165, 138, 0.8)',
  },
  accent: {
    fill: '#0c0b09',
    stroke: 'rgba(184, 165, 138, 0.48)',
    label: '#e9e3d7',
    sub: 'rgba(148, 142, 131, 0.95)',
  },
  muted: {
    fill: '#080807',
    stroke: 'rgba(244, 240, 231, 0.18)',
    label: '#c5bfb2',
    sub: 'rgba(148, 142, 131, 0.9)',
  },
} as const;

export function Diagram({ experiment }: DiagramProps) {
  const nodeById = new Map(experiment.nodes.map((node) => [node.id, node]));
  const markerId = `arrow-${experiment.id}`;

  return (
    <div className="diagram">
      <svg
        viewBox="0 0 800 420"
        role="img"
        aria-label={`Architecture diagram for ${experiment.title}`}
      >
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0.5 L7 4 L0 7.5 z" fill="rgba(184, 165, 138, 0.7)" />
          </marker>
        </defs>

        {experiment.zones?.map((zone) => (
          <g key={zone.label}>
            <rect
              x={zone.x}
              y={zone.y}
              width={zone.w}
              height={zone.h}
              fill="rgba(184, 165, 138, 0.018)"
              stroke="rgba(244, 240, 231, 0.1)"
              strokeDasharray="3 5"
            />
            <text
              x={zone.x + 10}
              y={zone.y + 15}
              fill="rgba(148, 142, 131, 0.8)"
              fontSize="7.5"
              letterSpacing="1.8"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {zone.label}
            </text>
          </g>
        ))}

        {experiment.edges.map((edge, index) => {
          const from = nodeById.get(edge.from);
          const to = nodeById.get(edge.to);
          if (!from || !to) return null;
          const start = boundaryPoint(from, to);
          const end = boundaryPoint(to, from);
          const midX = (start.x + end.x) / 2;
          const midY = (start.y + end.y) / 2;

          return (
            <g key={`${edge.from}-${edge.to}-${index}`}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="rgba(184, 165, 138, 0.38)"
                strokeWidth="1"
                strokeDasharray={edge.dashed ? '3 4' : undefined}
                markerEnd={`url(#${markerId})`}
              />
              {edge.label ? (
                <text
                  x={midX}
                  y={midY - 5}
                  textAnchor="middle"
                  fill="rgba(148, 142, 131, 0.9)"
                  fontSize="7"
                  letterSpacing="0.8"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {edge.label.toUpperCase()}
                </text>
              ) : null}
            </g>
          );
        })}

        {experiment.nodes.map((node) => {
          const tone = toneStyles[node.tone ?? 'accent'];
          return (
            <g className="diagram__node" key={node.id}>
              <title>{`${node.label}${node.sub ? ` — ${node.sub}` : ''}`}</title>
              <rect
                x={node.x - NODE_W / 2}
                y={node.y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx="1"
                fill={tone.fill}
                stroke={tone.stroke}
                strokeWidth={node.tone === 'strong' ? 1.2 : 1}
              />
              <text
                x={node.x}
                y={node.y - (node.sub ? 3 : -4)}
                textAnchor="middle"
                fill={tone.label}
                fontSize="10.5"
                fontWeight="500"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {node.label}
              </text>
              {node.sub ? (
                <text
                  x={node.x}
                  y={node.y + 11}
                  textAnchor="middle"
                  fill={tone.sub}
                  fontSize="7"
                  letterSpacing="0.9"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {node.sub.toUpperCase()}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
