
export enum ViewState {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  WORLD_MAP = 'WORLD_MAP',
  LESSON = 'LESSON',
  BOSS_FIGHT = 'BOSS_FIGHT',
  CELEBRATION = 'CELEBRATION',
  DASHBOARD = 'DASHBOARD',
  ADMIN = 'ADMIN'
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

  // New Worlds
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
  QA = 'qa_quarry'
}

export interface World {
  id: WorldId;
  name: string;
  description: string;
  imageUrl: string;
  primaryColor: string;
  bossName: string;
  totalLevels: number;
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
