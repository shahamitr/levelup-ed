
export enum ViewState {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  WORLD_MAP = 'WORLD_MAP',
  LESSON = 'LESSON',
  BOSS_FIGHT = 'BOSS_FIGHT',
  CELEBRATION = 'CELEBRATION',
  DASHBOARD = 'DASHBOARD',
  ADMIN = 'ADMIN',
  USER_PROFILE = 'USER_PROFILE'
}

export interface LeagueUser {
  id: string;
  username: string;
  xp: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface League {
  id: string; // e.g. 'bronze', 'silver'
  name: string;
  users: LeagueUser[];
}

export enum WorldId {
  WEB = 'web_kingdom',
  DATA = 'data_empire',
  CYBER = 'cyber_city',
  AI = 'ai_lab',
  SOC = 'soc_defense',
  RED_TEAM = 'red_offense',
  MARKETING = 'marketing_growth',
  GENAI = 'genai_genesis',
  PROMPT = 'prompt_palace',
  AGENTS = 'agent_arena',

  // Core Tech Worlds
  CLOUD = 'cloud_kingdom',
  DEVOPS = 'devops_dungeon',
  MOBILE = 'mobile_metropolis',
  GAME = 'game_grid',
  BLOCKCHAIN = 'chain_citadel',
  UIUX = 'design_district',
  IOT = 'iot_island',
  DATA_ENG = 'data_eng_dam',
  XR = 'xr_zone',
  QUANTUM = 'quantum_realm',
  SRE = 'sre_site',
  PRODUCT = 'product_peak',
  RUST = 'rust_ridge',
  GO = 'go_garrison',
  SWIFT = 'swift_summit',
  KOTLIN = 'kotlin_keep',
  RUBY = 'ruby_ravine',
  SCALA = 'scala_spire',
  SALESFORCE = 'crm_canyon',
  QA = 'qa_quarry',

  // W3Schools-Inspired Additions
  STATISTICS = 'stats_summit',
  WORDPRESS = 'wordpress_world',
  GIT = 'git_galaxy',
  EXCEL = 'excel_empire',
  BOOTSTRAP = 'bootstrap_base',
  TAILWIND = 'tailwind_tower',
  NUMPY_PANDAS = 'data_science_lab',
  ACCESSIBILITY = 'a11y_arena',
  XML_JSON = 'data_formats_fort',

  // roadmap.sh-Inspired Additions
  TECH_WRITER = 'writer_workshop',
  ENG_MANAGER = 'manager_mansion',
  DEVREL = 'devrel_domain',
  BI_ANALYST = 'bi_bureau',
  MLOPS = 'mlops_ops',
  FLUTTER = 'flutter_field',
  GRAPHQL = 'graphql_garden',
  LARAVEL = 'laravel_land',
  DJANGO = 'django_dungeon',
  ANGULAR = 'angular_arena',
  REACT = 'react_realm',
  VUE = 'vue_valley',
  NODEJS = 'node_nexus',
  TYPESCRIPT = 'typescript_tower',
  NEXTJS = 'nextjs_nexus',
  ASPNET = 'dotnet_domain',
  SPRING_BOOT = 'spring_springs',
  ELASTICSEARCH = 'elastic_engine',
  LINUX = 'linux_lair',
  DOCKER = 'docker_dock',
  KUBERNETES = 'k8s_kingdom',
  AWS = 'aws_arcade',
  TERRAFORM = 'terraform_territory',
  REDIS = 'redis_realm',
  DSA = 'dsa_dojo',

  // Best Practices Tracks
  API_SECURITY = 'api_security_academy',
  CODE_REVIEW = 'code_review_camp',
  SYSTEM_DESIGN = 'system_design_studio',
  PERFORMANCE = 'perf_peak',

  // Additional Recommended Courses
  AI_RED_TEAM = 'ai_red_team_arena',
  PWA = 'pwa_planet',
  COMPUTER_SCIENCE = 'cs_core',
  GOOGLE_SHEETS = 'sheets_studio',
  DATA_VIZ = 'dataviz_dome',
  AZURE = 'azure_academy',
  MATPLOTLIB = 'matplotlib_manor',
  GRC_COMPLIANCE = 'compliance_castle',
  HTML = 'html_hub',
  CSS = 'css_citadel',
  JAVASCRIPT = 'js_jungle',
  CSHARP = 'csharp_castle',
  R_LANG = 'r_ridge'
}

export interface World {
  id: WorldId;
  name: string;
  description: string;
  imageUrl: string;
  primaryColor: string;
  bossName: string;
  totalLevels: number;
  projectIdeas?: string[]; // New: List of capstone project ideas
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  worldIds: WorldId[]; // Ordered list of worlds to complete
  careerOutcome: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  isCorrect?: boolean;
  type?: 'normal' | 'intervention';
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  type: 'daily' | 'epic';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (user: UserState) => boolean;
  rarity: 'Common' | 'Rare' | 'Legendary';
}

export interface Milestone {
  id: string;
  worldId: string;
  levelThreshold: number; // e.g. 5 for full completion
  name: string;
  badgeUrl: string; // Icon identifier or URL
  description: string;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  statBoost?: { skill: keyof SkillProfile; value: number };
}

export interface SkillProfile {
  logic: number;
  architecture: number;
  syntax: number;
  security: number;
}

export interface UserState {
  name: string;
  xp: number;
  level: number;
  streak: number;
  completedWorlds: Record<string, number[]>;
  inventory: Artifact[];
  skillProfile: SkillProfile;
  focusScore: number;
  focusHistory: { time: string; score: number }[];
  lastActive: number;
  bounties: Bounty[];
  achievements: string[];
  milestones: string[]; // IDs of unlocked milestones
  gems: number;
  freezeCount: number;
}

export interface BossState {
  active: boolean;
  bossHp: number;
  maxBossHp: number;
  playerHp: number;
  maxPlayerHp: number;
  turn: number;
  messages: Message[];
  status: 'intro' | 'fighting' | 'won' | 'lost';
}
