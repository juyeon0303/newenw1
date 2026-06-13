/** 천간·지지 상수 및 한글 매핑 */

export const HEAVEN_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const EARTH_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

export type HeavenStem = (typeof HEAVEN_STEMS)[number];
export type EarthBranch = (typeof EARTH_BRANCHES)[number];

export const STEM_KO: Record<HeavenStem, string> = {
  甲: '갑', 乙: '을', 丙: '병', 丁: '정', 戊: '무', 己: '기', 庚: '경', 辛: '신', 壬: '임', 癸: '계',
};

export const BRANCH_KO: Record<EarthBranch, string> = {
  子: '자', 丑: '축', 寅: '인', 卯: '묘', 辰: '진', 巳: '사', 午: '오', 未: '미', 申: '신', 酉: '유', 戌: '술', 亥: '해',
};

export const TEN_STAR_KO: Record<string, string> = {
  比肩: '비견', 劫财: '겁재', 食神: '식신', 伤官: '상관',
  偏财: '편재', 正财: '정재', 七杀: '편관', 正官: '정관',
  偏印: '편인', 正印: '정인', 日主: '일간',
};

export const TERRAIN_KO: Record<string, string> = {
  长生: '장생', 沐浴: '목욕', 冠带: '관대', 临官: '건록', 帝旺: '제왕',
  衰: '쇠', 病: '병', 死: '사', 墓: '묘', 绝: '절', 胎: '태', 养: '양',
};

export const ELEMENT_KO: Record<string, string> = {
  木: '목', 火: '화', 土: '토', 金: '금', 水: '수',
};

export const STEM_ELEMENT: Record<HeavenStem, string> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};

export const BRANCH_ELEMENT: Record<EarthBranch, string> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火', 午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};

export const SANHE_GROUP: Record<EarthBranch, readonly EarthBranch[]> = {
  子: ['申', '子', '辰'], 申: ['申', '子', '辰'], 辰: ['申', '子', '辰'],
  寅: ['寅', '午', '戌'], 午: ['寅', '午', '戌'], 戌: ['寅', '午', '戌'],
  巳: ['巳', '酉', '丑'], 酉: ['巳', '酉', '丑'], 丑: ['巳', '酉', '丑'],
  卯: ['亥', '卯', '未'], 亥: ['亥', '卯', '未'], 未: ['亥', '卯', '未'],
};

export function stemIndex(stem: HeavenStem): number {
  return HEAVEN_STEMS.indexOf(stem);
}

export function branchIndex(branch: EarthBranch): number {
  return EARTH_BRANCHES.indexOf(branch);
}

export function stemYinYang(stem: HeavenStem): '양' | '음' {
  return stemIndex(stem) % 2 === 0 ? '양' : '음';
}

export function branchYinYang(branch: EarthBranch): '양' | '음' {
  return branchIndex(branch) % 2 === 0 ? '양' : '음';
}

export function parsePillar(pillar: string): { stem: HeavenStem; branch: EarthBranch } {
  return { stem: pillar[0] as HeavenStem, branch: pillar[1] as EarthBranch };
}
