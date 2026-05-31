import type {
  ManseryeokResult,
  PillarDetail,
  PillarSlot,
} from '@/lib/manseryeok';
import { BRANCH_KO, STEM_KO, type EarthBranch, type HeavenStem } from '@/lib/manseryeok';
import {
  buildTenStarQuestions,
  type TenStarHit,
  type GeneratedQuestion,
  TEN_STAR_TEMPLATES,
} from './templates/ten-star';
import {
  buildSpiritQuestions,
  type SpiritHit,
  type SpiritQuestion,
  SPIRIT_TEMPLATES,
} from './templates/spirits';
import {
  buildRelationQuestions,
  type RelationHit,
  type RelationQuestion,
  type RelationSlotRef,
  type ExploreTier,
  scoreToTier,
  tierLabel,
} from './templates/relations';

export type { ExploreTier };
export { tierLabel };

export interface ScoredEntry<T> {
  key: string;
  priority: number;
  tier: ExploreTier;
  hits: T[];
  questions: Array<GeneratedQuestion | SpiritQuestion | RelationQuestion>;
}

export interface ExploreBundle {
  tenStarHits: TenStarHit[];
  /** 천간·지지 십성만 — 지장간 제외 */
  tenStarByName: Map<string, ScoredEntry<TenStarHit>>;
  /** 지장간에만 있는 십성 */
  hiddenTenStarByName: Map<string, ScoredEntry<TenStarHit>>;
  spiritHits: SpiritHit[];
  spiritByName: Map<string, ScoredEntry<SpiritHit>>;
  relationHits: RelationHit[];
  relationByKey: Map<string, ScoredEntry<RelationHit>>;
  /** 전 카테고리 통합 우선순위 */
  overview: Array<{
    category: 'relation' | 'tenstar' | 'spirit' | 'hidden';
    key: string;
    label: string;
    tier: ExploreTier;
    priority: number;
  }>;
}

const SLOT_KO: Record<PillarSlot, string> = {
  year: '년',
  month: '월',
  day: '일',
  hour: '시',
};

const SLOT_WEIGHT: Record<PillarSlot, number> = {
  day: 35,
  month: 22,
  hour: 18,
  year: 10,
};

const LAYER_WEIGHT = { stem: 48, branch: 42, hidden: 12 };

const RELATION_TYPE_WEIGHT: Record<string, number> = {
  충: 100,
  형: 82,
  해: 72,
  파: 68,
  원진: 62,
  귀문: 58,
  합: 52,
  회: 48,
  천라: 44,
  지망: 44,
};

const SPIRIT_BASIS_WEIGHT: Record<string, number> = {
  일지: 28,
  일간: 22,
  년지: 12,
  월지: 14,
  시지: 16,
};

function slotsForStem(chart: ManseryeokResult, stem: HeavenStem): RelationSlotRef[] {
  const slots: PillarSlot[] = ['year', 'month', 'day', 'hour'];
  return slots
    .filter((s) => chart.pillars[s].stem === stem)
    .map((s) => ({ slot: s, slotKo: SLOT_KO[s], part: '천간' as const }));
}

function slotsForBranch(chart: ManseryeokResult, branch: EarthBranch): RelationSlotRef[] {
  const slots: PillarSlot[] = ['year', 'month', 'day', 'hour'];
  return slots
    .filter((s) => chart.pillars[s].branch === branch)
    .map((s) => ({ slot: s, slotKo: SLOT_KO[s], part: '지지' as const }));
}

function formatRelationSlots(slots: RelationSlotRef[]): string {
  const parts = slots.map((s) => `${s.slotKo}${s.part === '천간' ? '간' : '지'}`);
  return [...new Set(parts)].join('·');
}

function relationPriority(hit: Omit<RelationHit, 'priority' | 'tier'>): number {
  let w = RELATION_TYPE_WEIGHT[hit.type] ?? 40;
  if (hit.kind === 'stem' && hit.type === '충') w += 12;
  for (const s of hit.slots) {
    w += SLOT_WEIGHT[s.slot];
  }
  return w;
}

function tenStarHitPriority(hit: TenStarHit): number {
  return LAYER_WEIGHT[hit.layer] + SLOT_WEIGHT[hit.slot];
}

function spiritHitPriority(hit: SpiritHit): number {
  let w = hit.category === '12신살' ? 40 : 50;
  if (hit.basis) w += SPIRIT_BASIS_WEIGHT[hit.basis] ?? 8;
  if (hit.auspicious === true) w += 5;
  return w;
}

function collectTenStarHits(chart: ManseryeokResult): { primary: TenStarHit[]; hidden: TenStarHit[] } {
  const primary: TenStarHit[] = [];
  const hidden: TenStarHit[] = [];
  const slots: PillarSlot[] = ['year', 'month', 'day', 'hour'];

  for (const slot of slots) {
    const p: PillarDetail = chart.pillars[slot];

    if (p.stemTenStarKo && !(slot === 'day' && p.stemTenStarKo === '비견')) {
      primary.push({
        tenStarKo: p.stemTenStarKo,
        slot,
        slotKo: p.slotKo,
        layer: 'stem',
        layerKo: '천간',
        pillar: p.pillar,
      });
    }

    if (p.branchTenStarKo) {
      primary.push({
        tenStarKo: p.branchTenStarKo,
        slot,
        slotKo: p.slotKo,
        layer: 'branch',
        layerKo: '지지',
        pillar: p.pillar,
      });
    }

    for (const h of p.hiddenStems) {
      if (h.tenStarKo && h.tenStarKo !== '비견') {
        hidden.push({
          tenStarKo: h.tenStarKo,
          slot,
          slotKo: p.slotKo,
          layer: 'hidden',
          layerKo: '지장간',
          pillar: p.pillar,
        });
      }
    }
  }

  return { primary, hidden };
}

function collectSpiritHits(chart: ManseryeokResult): SpiritHit[] {
  const hits: SpiritHit[] = [];
  const slots: PillarSlot[] = ['year', 'month', 'day', 'hour'];

  for (const slot of slots) {
    const p = chart.pillars[slot];
    for (const s12 of p.spirit12) {
      for (const spirit of s12.spirits) {
        hits.push({
          name: spirit,
          category: '12신살',
          slot: p.slotKo,
          basis: s12.basis,
        });
      }
    }
  }

  for (const s of chart.extraSpirits) {
    const def = SPIRIT_TEMPLATES[s.name];
    hits.push({
      name: s.name,
      category: def?.category ?? '기타',
      slot: '원국',
      auspicious: s.auspicious,
    });
  }

  return hits;
}

function dedupeRelations<T extends { label: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item.label)) continue;
    seen.add(item.label);
    out.push(item);
  }
  return out;
}

function collectRelationHits(chart: ManseryeokResult): RelationHit[] {
  const hits: RelationHit[] = [];

  for (const rel of dedupeRelations(chart.branchRelations)) {
    const slots = [
      ...slotsForBranch(chart, rel.branches[0]),
      ...slotsForBranch(chart, rel.branches[1]),
    ];
    const uniqueSlots = [...new Map(slots.map((s) => [`${s.slot}-${s.part}`, s])).values()];
    const ko = `${BRANCH_KO[rel.branches[0]]}${BRANCH_KO[rel.branches[1]]}${rel.type}`;
    const base = {
      kind: 'branch' as const,
      type: rel.type,
      label: rel.label,
      displayLabel: `${ko} (${formatRelationSlots(uniqueSlots)})`,
      slots: uniqueSlots,
    };
    const priority = relationPriority(base);
    hits.push({ ...base, priority, tier: scoreToTier(priority) });
  }

  for (const rel of dedupeRelations(chart.stemRelations)) {
    if (rel.type !== '충' && rel.type !== '합') continue;
    const slots = [
      ...slotsForStem(chart, rel.stems[0]),
      ...slotsForStem(chart, rel.stems[1]),
    ];
    const uniqueSlots = [...new Map(slots.map((s) => [`${s.slot}-${s.part}`, s])).values()];
    const ko = `${STEM_KO[rel.stems[0]]}${STEM_KO[rel.stems[1]]}${rel.type}`;
    const base = {
      kind: 'stem' as const,
      type: rel.type as '충' | '합',
      label: rel.label,
      displayLabel: `${ko} (${formatRelationSlots(uniqueSlots)})`,
      slots: uniqueSlots,
    };
    const priority = relationPriority(base);
    hits.push({ ...base, priority, tier: scoreToTier(priority) });
  }

  return hits.sort((a, b) => b.priority - a.priority);
}

function groupTenStars(hits: TenStarHit[]): Map<string, ScoredEntry<TenStarHit>> {
  const map = new Map<string, ScoredEntry<TenStarHit>>();

  for (const hit of hits) {
    if (!TEN_STAR_TEMPLATES[hit.tenStarKo]) continue;
    const entry = map.get(hit.tenStarKo) ?? {
      key: hit.tenStarKo,
      priority: 0,
      tier: 'reference' as ExploreTier,
      hits: [],
      questions: [],
    };
    entry.hits.push(hit);
    entry.priority = Math.max(entry.priority, tenStarHitPriority(hit));
    map.set(hit.tenStarKo, entry);
  }

  for (const [, entry] of map) {
    entry.tier = scoreToTier(entry.priority);
    const seen = new Set<string>();
    for (const hit of entry.hits) {
      for (const q of buildTenStarQuestions(hit)) {
        if (!seen.has(q.text)) {
          seen.add(q.text);
          entry.questions.push(q);
        }
      }
    }
  }

  return map;
}

function groupSpirits(hits: SpiritHit[]): Map<string, ScoredEntry<SpiritHit>> {
  const map = new Map<string, ScoredEntry<SpiritHit>>();

  for (const hit of hits) {
    const entry = map.get(hit.name) ?? {
      key: hit.name,
      priority: 0,
      tier: 'reference' as ExploreTier,
      hits: [],
      questions: [],
    };
    entry.hits.push(hit);
    entry.priority = Math.max(entry.priority, spiritHitPriority(hit));
    map.set(hit.name, entry);
  }

  for (const [, entry] of map) {
    entry.tier = scoreToTier(entry.priority);
    const seen = new Set<string>();
    for (const hit of entry.hits) {
      for (const q of buildSpiritQuestions(hit)) {
        if (!seen.has(q.text)) {
          seen.add(q.text);
          entry.questions.push(q);
        }
      }
    }
  }

  return map;
}

function groupRelations(hits: RelationHit[]): Map<string, ScoredEntry<RelationHit>> {
  const map = new Map<string, ScoredEntry<RelationHit>>();

  for (const hit of hits) {
    const key = `${hit.kind}:${hit.label}`;
    const entry = map.get(key) ?? {
      key,
      priority: hit.priority,
      tier: hit.tier,
      hits: [],
      questions: [],
    };
    entry.hits.push(hit);
    entry.priority = Math.max(entry.priority, hit.priority);
    entry.tier = scoreToTier(entry.priority);
    map.set(key, entry);
  }

  for (const [, entry] of map) {
    const seen = new Set<string>();
    for (const hit of entry.hits) {
      for (const q of buildRelationQuestions(hit)) {
        if (!seen.has(q.text)) {
          seen.add(q.text);
          entry.questions.push(q);
        }
      }
    }
  }

  return map;
}

function sortMapKeys<T>(map: Map<string, ScoredEntry<T>>): string[] {
  return [...map.entries()]
    .sort((a, b) => b[1].priority - a[1].priority)
    .map(([k]) => k);
}

function buildOverview(bundle: Omit<ExploreBundle, 'overview'>): ExploreBundle['overview'] {
  const items: ExploreBundle['overview'] = [];

  for (const [key, entry] of bundle.relationByKey) {
    const hit = entry.hits[0];
    items.push({
      category: 'relation',
      key,
      label: hit.displayLabel,
      tier: entry.tier,
      priority: entry.priority,
    });
  }
  for (const [key, entry] of bundle.tenStarByName) {
    items.push({
      category: 'tenstar',
      key,
      label: key,
      tier: entry.tier,
      priority: entry.priority,
    });
  }
  for (const [key, entry] of bundle.spiritByName) {
    items.push({
      category: 'spirit',
      key,
      label: key,
      tier: entry.tier,
      priority: entry.priority,
    });
  }
  for (const [key, entry] of bundle.hiddenTenStarByName) {
    items.push({
      category: 'hidden',
      key,
      label: `${key} (지장간)`,
      tier: entry.tier,
      priority: entry.priority,
    });
  }

  return items.sort((a, b) => b.priority - a.priority);
}

export function buildExploreBundle(chart: ManseryeokResult): ExploreBundle {
  const { primary, hidden } = collectTenStarHits(chart);
  const spiritHits = collectSpiritHits(chart);
  const relationHits = collectRelationHits(chart);

  const partial = {
    tenStarHits: [...primary, ...hidden],
    tenStarByName: groupTenStars(primary),
    hiddenTenStarByName: groupTenStars(hidden),
    spiritHits,
    spiritByName: groupSpirits(spiritHits),
    relationHits,
    relationByKey: groupRelations(relationHits),
  };

  return {
    ...partial,
    overview: buildOverview(partial),
  };
}

export function sortedTenStarKeys(bundle: ExploreBundle): string[] {
  return sortMapKeys(bundle.tenStarByName);
}

export function sortedSpiritKeys(bundle: ExploreBundle): string[] {
  return sortMapKeys(bundle.spiritByName);
}

export function sortedRelationKeys(bundle: ExploreBundle): string[] {
  return sortMapKeys(bundle.relationByKey);
}

export function sortedHiddenTenStarKeys(bundle: ExploreBundle): string[] {
  return sortMapKeys(bundle.hiddenTenStarByName);
}

export { TEN_STAR_TEMPLATES } from './templates/ten-star';
export { SPIRIT_TEMPLATES } from './templates/spirits';
export { relationHint } from './templates/relations';
