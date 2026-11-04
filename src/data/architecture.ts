export interface ArchNode {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w?: number;
  tone?: 'accent' | 'strong' | 'muted';
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
}

export interface ArchZone {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ArchitectureExperiment {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  status: string;
  statusTone: 'live' | 'progress' | 'study';
  summary: string;
  services: string[];
  deployment: string[];
  lessons: string[];
  nodes: ArchNode[];
  edges: ArchEdge[];
  zones?: ArchZone[];
}

export const EXPERIMENTS: ArchitectureExperiment[] = [
  {
    id: 'django-aws',
    index: '01',
    title: 'Django on AWS',
    subtitle: 'A reference deployment for a containerised Django app',
    status: 'Reference architecture',
    statusTone: 'study',
    summary:
      'A study of how a Django application moves from a local process to a private, observable AWS deployment: static assets at the edge, a load-balanced application layer, a managed database, and secrets kept out of the image.',
    services: [
      'Route 53',
      'CloudFront',
      'Application Load Balancer',
      'ECS Fargate',
      'RDS PostgreSQL',
      'S3',
      'Secrets Manager',
      'CloudWatch',
    ],
    deployment: [
      'Build the Django image, push it to ECR, and run it as an ECS service behind an ALB.',
      'Keep the database in private subnets; allow traffic only from the application security group.',
      'Serve static and media files from S3 through CloudFront, with the bucket private.',
      'Inject database credentials at runtime from Secrets Manager and send structured logs to CloudWatch.',
    ],
    lessons: [
      'A health check is part of the architecture: it decides whether a task is allowed to receive traffic.',
      'The boring boundaries matter most — security groups, private subnets, and a single ingress path.',
      'Managed services remove undifferentiated work, but they do not remove the need to understand failure modes.',
    ],
    zones: [
      { label: 'EDGE', x: 12, y: 24, w: 206, h: 372 },
      { label: 'PRIVATE VPC', x: 232, y: 24, w: 330, h: 372 },
      { label: 'OPERATIONS', x: 580, y: 24, w: 168, h: 372 },
    ],
    nodes: [
      { id: 'client', label: 'Client', sub: 'Browser', x: 78, y: 260, tone: 'muted' },
      { id: 'r53', label: 'Route 53', sub: 'DNS', x: 78, y: 88, tone: 'muted' },
      { id: 'cf', label: 'CloudFront', sub: 'TLS + cache', x: 166, y: 178, tone: 'accent' },
      { id: 's3', label: 'S3', sub: 'static + media', x: 166, y: 334, tone: 'muted' },
      { id: 'alb', label: 'ALB', sub: 'HTTPS ingress', x: 300, y: 214, tone: 'accent' },
      { id: 'ecs', label: 'ECS Fargate', sub: 'Django app', x: 432, y: 128, tone: 'strong' },
      { id: 'rds', label: 'RDS', sub: 'PostgreSQL', x: 432, y: 316, tone: 'strong' },
      { id: 'secrets', label: 'Secrets', sub: 'runtime config', x: 664, y: 128, tone: 'muted' },
      { id: 'logs', label: 'CloudWatch', sub: 'logs + metrics', x: 664, y: 300, tone: 'muted' },
    ],
    edges: [
      { from: 'client', to: 'r53', label: 'DNS' },
      { from: 'client', to: 'cf' },
      { from: 'r53', to: 'cf' },
      { from: 'cf', to: 's3', label: 'assets' },
      { from: 'cf', to: 'alb', label: 'app' },
      { from: 'alb', to: 'ecs' },
      { from: 'ecs', to: 'rds' },
      { from: 'ecs', to: 'secrets', label: 'read' },
      { from: 'ecs', to: 'logs' },
      { from: 'rds', to: 'logs', dashed: true },
    ],
  },
  {
    id: 'terraform',
    index: '02',
    title: 'Terraform foundations',
    subtitle: 'Reusable modules for a reviewable AWS account',
    status: 'In progress',
    statusTone: 'progress',
    summary:
      'A modular Terraform foundation for repeatable networking and application environments. The goal is not a perfect platform on day one; it is an infrastructure description that a reviewer can read, a teammate can reuse, and a pipeline can apply safely.',
    services: [
      'Terraform',
      'VPC',
      'Subnets',
      'Security Groups',
      'IAM',
      'S3',
      'DynamoDB',
      'GitHub Actions',
    ],
    deployment: [
      'Compose environments from small modules: network, compute, storage, and identity.',
      'Store state in S3 with DynamoDB locking so plans are safe to run from CI.',
      'Keep variables explicit and commit a plan to the pull request when the change is risky.',
      'Separate long-lived foundations from application stacks that change more often.',
    ],
    lessons: [
      'Remote state is not an implementation detail; it is part of the team’s safety model.',
      'A module is only reusable when its inputs and outputs are honest and documented.',
      'Some resources should not be recreated casually. Protect stateful resources before trusting an apply.',
    ],
    zones: [
      { label: 'SOURCE', x: 12, y: 24, w: 196, h: 372 },
      { label: 'PROVISION', x: 224, y: 24, w: 350, h: 372 },
      { label: 'PLATFORM', x: 590, y: 24, w: 168, h: 372 },
    ],
    nodes: [
      { id: 'repo', label: 'Git repo', sub: 'modules + envs', x: 82, y: 120, tone: 'accent' },
      { id: 'ci', label: 'Plan & apply', sub: 'GitHub Actions', x: 82, y: 300, tone: 'muted' },
      { id: 'vpc', label: 'Network', sub: 'VPC module', x: 280, y: 210, tone: 'strong' },
      { id: 'app', label: 'App stack', sub: 'compute + ALB', x: 462, y: 110, tone: 'accent' },
      { id: 'data', label: 'Data layer', sub: 'RDS + S3', x: 462, y: 310, tone: 'accent' },
      { id: 'iam', label: 'IAM', sub: 'roles + policies', x: 674, y: 92, tone: 'muted' },
      { id: 'state', label: 'Remote state', sub: 'S3 + DynamoDB', x: 674, y: 210, tone: 'strong' },
      { id: 'assets', label: 'Assets', sub: 'private S3', x: 674, y: 328, tone: 'muted' },
    ],
    edges: [
      { from: 'repo', to: 'ci', label: 'merge' },
      { from: 'ci', to: 'vpc', label: 'apply' },
      { from: 'vpc', to: 'app' },
      { from: 'vpc', to: 'data' },
      { from: 'ci', to: 'iam', dashed: true },
      { from: 'ci', to: 'state', label: 'lock' },
      { from: 'app', to: 'assets' },
      { from: 'data', to: 'state', dashed: true },
    ],
  },
  {
    id: 'cicd',
    index: '03',
    title: 'CI/CD pipeline',
    subtitle: 'From a pull request to a reversible deployment',
    status: 'In progress',
    statusTone: 'progress',
    summary:
      'A delivery pipeline that treats tests, artifacts, and environments as one path. Every change is checked, every image is traceable, and production is a deliberate step rather than a leap of faith.',
    services: [
      'GitHub Actions',
      'Docker',
      'Amazon ECR',
      'ECS',
      'CloudWatch',
      'IAM OIDC',
    ],
    deployment: [
      'Run linting, type checks, and tests on every pull request.',
      'Build a versioned image only after the test gate passes; tag it with the commit SHA.',
      'Push to ECR and deploy a new ECS task definition with a health-check gate.',
      'Keep a manual approval before production and a previous task definition ready to roll back to.',
    ],
    lessons: [
      'A pipeline that is slow will be bypassed. Cache dependencies and keep the fast checks fast.',
      'Deployments need an exit as much as an entrance: a known-good previous version is part of the design.',
      'Secrets belong in a secret store, not in workflow YAML. OIDC removes long-lived keys entirely.',
    ],
    zones: [
      { label: 'SOURCE', x: 12, y: 24, w: 160, h: 372 },
      { label: 'BUILD', x: 188, y: 24, w: 300, h: 372 },
      { label: 'RELEASE', x: 504, y: 24, w: 254, h: 372 },
    ],
    nodes: [
      { id: 'commit', label: 'Pull request', sub: 'review + commit', x: 78, y: 210, tone: 'muted' },
      { id: 'actions', label: 'Actions', sub: 'workflow', x: 250, y: 210, tone: 'accent' },
      { id: 'tests', label: 'Test & lint', sub: 'gate', x: 250, y: 86, tone: 'strong' },
      { id: 'image', label: 'Docker build', sub: 'commit SHA', x: 250, y: 334, tone: 'strong' },
      { id: 'approval', label: 'Approval', sub: 'manual gate', x: 430, y: 86, tone: 'muted' },
      { id: 'ecr', label: 'Amazon ECR', sub: 'image registry', x: 430, y: 334, tone: 'accent' },
      { id: 'ecs', label: 'ECS deploy', sub: 'rolling update', x: 614, y: 334, tone: 'strong' },
      { id: 'prod', label: 'Production', sub: 'health check', x: 614, y: 188, tone: 'accent' },
      { id: 'logs', label: 'CloudWatch', sub: 'deploy signal', x: 710, y: 86, tone: 'muted' },
    ],
    edges: [
      { from: 'commit', to: 'actions' },
      { from: 'actions', to: 'tests' },
      { from: 'actions', to: 'image' },
      { from: 'tests', to: 'image', dashed: true },
      { from: 'tests', to: 'approval' },
      { from: 'image', to: 'ecr' },
      { from: 'approval', to: 'ecs', dashed: true },
      { from: 'ecr', to: 'ecs' },
      { from: 'ecs', to: 'prod' },
      { from: 'prod', to: 'logs', dashed: true },
    ],
  },
  {
    id: 'static-cdn',
    index: '04',
    title: 'S3 + CloudFront',
    subtitle: 'A private origin at the edge',
    status: 'Applied pattern',
    statusTone: 'live',
    summary:
      'A static delivery pattern that keeps the origin bucket private, terminates TLS at the edge, and treats cache invalidation as part of the deployment. The same shape serves documentation, marketing sites, and this portfolio.',
    services: [
      'S3',
      'CloudFront',
      'Origin Access Control',
      'Route 53',
      'ACM',
      'AWS WAF',
      'CloudWatch',
    ],
    deployment: [
      'Create a private S3 bucket and grant CloudFront access through Origin Access Control.',
      'Attach an ACM certificate and a custom domain through Route 53.',
      'Build static assets in CI, sync them to S3, and invalidate only the changed paths.',
      'Add WAF rules and cache headers before the site receives real traffic.',
    ],
    lessons: [
      'A public bucket is usually a choice, not a requirement. OAC makes the private path the easy one.',
      'Caching is a product decision: the right TTL depends on what the user expects to see change.',
      'Deploy and invalidation should be one step, or the edge will confidently serve the old site.',
    ],
    zones: [
      { label: 'PUBLIC', x: 12, y: 24, w: 180, h: 372 },
      { label: 'EDGE', x: 204, y: 24, w: 300, h: 372 },
      { label: 'ORIGIN', x: 516, y: 24, w: 242, h: 372 },
    ],
    nodes: [
      { id: 'visitor', label: 'Visitor', sub: 'HTTPS', x: 78, y: 210, tone: 'muted' },
      { id: 'dns', label: 'Route 53', sub: 'custom domain', x: 286, y: 88, tone: 'muted' },
      { id: 'waf', label: 'AWS WAF', sub: 'edge rules', x: 286, y: 330, tone: 'muted' },
      { id: 'acm', label: 'ACM', sub: 'TLS certificate', x: 160, y: 88, tone: 'muted' },
      { id: 'cf', label: 'CloudFront', sub: 'global edge cache', x: 360, y: 210, tone: 'strong' },
      { id: 's3', label: 'S3 origin', sub: 'private + OAC', x: 570, y: 210, tone: 'strong' },
      { id: 'deploy', label: 'Deploy', sub: 'sync + invalidate', x: 672, y: 88, tone: 'accent' },
      { id: 'logs', label: 'CloudWatch', sub: 'access logs', x: 672, y: 330, tone: 'muted' },
    ],
    edges: [
      { from: 'visitor', to: 'dns', label: 'resolve' },
      { from: 'dns', to: 'cf' },
      { from: 'acm', to: 'cf', dashed: true },
      { from: 'visitor', to: 'cf', label: 'request' },
      { from: 'waf', to: 'cf', dashed: true },
      { from: 'cf', to: 's3', label: 'OAC' },
      { from: 'deploy', to: 's3' },
      { from: 'deploy', to: 'cf', label: 'invalidate', dashed: true },
      { from: 'cf', to: 'logs' },
    ],
  },
  {
    id: 'serverless',
    index: '05',
    title: 'Serverless events',
    subtitle: 'Small functions with an explicit contract',
    status: 'Experiment',
    statusTone: 'study',
    summary:
      'A small event-driven API used to understand the edges of serverless: cold starts, idempotency, permissions, and the moment an asynchronous workflow becomes harder to reason about than a single process.',
    services: [
      'API Gateway',
      'AWS Lambda',
      'DynamoDB',
      'S3',
      'EventBridge',
      'CloudWatch',
      'IAM',
    ],
    deployment: [
      'Put API Gateway in front of a single-purpose Lambda handler with a narrow IAM role.',
      'Persist the write in DynamoDB with a conditional expression to make retries safe.',
      'Emit domain events to EventBridge and process slow work in a separate function.',
      'Write structured logs and a correlation ID so one request can be followed end to end.',
    ],
    lessons: [
      'Serverless does not remove architecture; it moves the boundaries into configuration and IAM.',
      'Retries are a feature until they are a duplicate order. Idempotency has to be designed in.',
      'A cold start is easier to accept when the function does less. Keep the handler small.',
    ],
    zones: [
      { label: 'REQUEST', x: 12, y: 24, w: 180, h: 372 },
      { label: 'COMPUTE', x: 204, y: 24, w: 290, h: 372 },
      { label: 'STATE & EVENTS', x: 506, y: 24, w: 252, h: 372 },
    ],
    nodes: [
      { id: 'client', label: 'Client', sub: 'web / mobile', x: 78, y: 210, tone: 'muted' },
      { id: 'api', label: 'API Gateway', sub: 'HTTP API', x: 280, y: 210, tone: 'accent' },
      { id: 'auth', label: 'Authorizer', sub: 'token check', x: 280, y: 88, tone: 'muted' },
      { id: 'fn', label: 'Lambda', sub: 'write handler', x: 410, y: 178, tone: 'strong' },
      { id: 'dynamo', label: 'DynamoDB', sub: 'conditional write', x: 616, y: 88, tone: 'strong' },
      { id: 'event', label: 'EventBridge', sub: 'domain event', x: 616, y: 210, tone: 'accent' },
      { id: 'worker', label: 'Lambda', sub: 'async worker', x: 410, y: 330, tone: 'strong' },
      { id: 's3', label: 'S3', sub: 'generated asset', x: 616, y: 330, tone: 'accent' },
      { id: 'logs', label: 'CloudWatch', sub: 'traces + logs', x: 710, y: 210, tone: 'muted' },
    ],
    edges: [
      { from: 'client', to: 'api' },
      { from: 'auth', to: 'api', dashed: true },
      { from: 'api', to: 'fn' },
      { from: 'fn', to: 'dynamo' },
      { from: 'fn', to: 'event' },
      { from: 'event', to: 'worker' },
      { from: 'worker', to: 's3' },
      { from: 'fn', to: 'logs', dashed: true },
      { from: 'worker', to: 'logs', dashed: true },
    ],
  },
  {
    id: 'secure',
    index: '06',
    title: 'Secure by default',
    subtitle: 'The defaults that keep an application private',
    status: 'Guiding principles',
    statusTone: 'live',
    summary:
      'A working checklist for application security on AWS: explicit ingress, private data, short-lived credentials, encrypted transport, and logs that can answer what happened without exposing what should stay secret.',
    services: [
      'AWS WAF',
      'ALB',
      'Private subnets',
      'IAM',
      'Secrets Manager',
      'RDS',
      'CloudWatch',
      'KMS',
    ],
    deployment: [
      'Expose only the load balancer; allow it to reach the application on a single known port.',
      'Keep the database and application tasks in private subnets with no public IPs.',
      'Use IAM roles and OIDC for deployments instead of storing long-lived access keys.',
      'Encrypt data at rest and in transit, rotate secrets, and remove verbose errors from public responses.',
    ],
    lessons: [
      'Least privilege is a practice, not a one-time policy: start narrow and add intentionally.',
      'Security groups are a diagram you can actually enforce. Draw the allowed paths first.',
      'Good logs are a security control. Silence is not evidence of safety.',
    ],
    zones: [
      { label: 'PUBLIC', x: 12, y: 24, w: 180, h: 372 },
      { label: 'PRIVATE', x: 204, y: 24, w: 316, h: 372 },
      { label: 'CONTROL', x: 532, y: 24, w: 226, h: 372 },
    ],
    nodes: [
      { id: 'internet', label: 'Internet', sub: 'untrusted', x: 78, y: 210, tone: 'muted' },
      { id: 'waf', label: 'AWS WAF', sub: 'allow / deny', x: 280, y: 88, tone: 'accent' },
      { id: 'alb', label: 'ALB', sub: 'public ingress', x: 280, y: 210, tone: 'strong' },
      { id: 'app', label: 'Private app', sub: 'no public IP', x: 390, y: 330, tone: 'strong' },
      { id: 'db', label: 'RDS', sub: 'private subnets', x: 578, y: 210, tone: 'strong' },
      { id: 'secrets', label: 'Secrets', sub: 'rotated', x: 490, y: 88, tone: 'muted' },
      { id: 'iam', label: 'IAM', sub: 'least privilege', x: 690, y: 88, tone: 'muted' },
      { id: 'logs', label: 'CloudWatch', sub: 'audit trail', x: 690, y: 330, tone: 'muted' },
    ],
    edges: [
      { from: 'internet', to: 'waf' },
      { from: 'waf', to: 'alb' },
      { from: 'alb', to: 'app' },
      { from: 'app', to: 'db' },
      { from: 'app', to: 'secrets', dashed: true },
      { from: 'app', to: 'iam', dashed: true },
      { from: 'app', to: 'logs' },
      { from: 'db', to: 'logs', dashed: true },
    ],
  },
];
