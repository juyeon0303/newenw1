import type { ManseryeokResult } from '@/lib/manseryeok';
import { buildFreePrincipleReport, type FreePrincipleReport } from '@/lib/analysis/free-report';
import {
  buildExploreBundle,
  tierLabel,
  type ExploreBundle,
  type ExploreTier,
} from '@/lib/philosophy/build-explore';
import {
  EXPLORE_AXES,
  buildExplorePrompts,
  type ExploreAxis,
} from '@/lib/philosophy/content';
import {
  getTenStarCommentary,
  getSpiritCommentary,
  getRelationCommentary,
  buildMonthCommandCommentary,
  type CommentaryNote,
} from '@/lib/philosophy/commentary';
import { INTERPRETATION_POLICY } from './policy';

export interface InterpretationInsight {
  id: string;
  category: 'relation' | 'tenstar' | 'spirit' | 'hidden';
  label: string;
  tier: ExploreTier;
  tierLabel: string;
  priority: number;
  reason?: string;
  questions: string[];
  commentary: CommentaryNote | null;
}

export interface InterpretationProfile {
  policy: typeof INTERPRETATION_POLICY;
  principle: FreePrincipleReport;
  bundle: ExploreBundle;
  insights: InterpretationInsight[];
  axes: ExploreAxis[];
  dayMasterPrompts: string[];
  monthCommandNote: CommentaryNote;
}

function insightFromOverview(
  bundle: ExploreBundle,
  item: ExploreBundle['overview'][number],
): InterpretationInsight {
  let questions: string[] = [];
  let commentary: CommentaryNote | null = null;
  let reason: string | undefined;

  if (item.category === 'tenstar' || item.category === 'hidden') {
    const map =
      item.category === 'hidden' ? bundle.hiddenTenStarByName : bundle.tenStarByName;
    const entry = map.get(item.key);
    if (entry) {
      questions = entry.questions.map((q) => q.text);
      reason = entry.reason;
      const hit = entry.hits[0];
      commentary = getTenStarCommentary(item.key, hit?.slot, hit?.layer) ?? null;
    }
  } else if (item.category === 'spirit') {
    const entry = bundle.spiritByName.get(item.key);
    if (entry) {
      questions = entry.questions.map((q) => q.text);
      reason = entry.reason;
      const hit = entry.hits[0];
      commentary = getSpiritCommentary(item.key, hit?.basis);
    }
  } else if (item.category === 'relation') {
    const entry = bundle.relationByKey.get(item.key);
    if (entry) {
      questions = entry.questions.map((q) => q.text);
      reason = entry.reason;
      const hit = entry.hits[0];
      commentary = getRelationCommentary(
        hit.type,
        hit.kind,
        hit.label,
        hit.slots,
      );
    }
  }

  return {
    id: `${item.category}:${item.key}`,
    category: item.category,
    label: item.label,
    tier: item.tier,
    tierLabel: tierLabel(item.tier),
    priority: item.priority,
    reason,
    questions,
    commentary,
  };
}

/** 사이트 철학·경쟁 우위 정책에 맞춘 통합 해석 프로필 */
export function buildInterpretationProfile(chart: ManseryeokResult): InterpretationProfile {
  const bundle = buildExploreBundle(chart);
  const n = INTERPRETATION_POLICY.topInsightCount;

  return {
    policy: INTERPRETATION_POLICY,
    principle: buildFreePrincipleReport(chart),
    bundle,
    insights: bundle.overview.slice(0, n).map((item) => insightFromOverview(bundle, item)),
    axes: [...EXPLORE_AXES],
    dayMasterPrompts: buildExplorePrompts(chart.dayMaster.stemKo),
    monthCommandNote: buildMonthCommandCommentary(chart),
  };
}
