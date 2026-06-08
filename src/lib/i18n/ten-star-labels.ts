import type { Locale } from './locale';

export interface TenStarLocaleEntry {
  /** 십성 한글 키 (비견, 겁재, …) */
  label: string;
  psychology: string;
}

const ENTRIES: Record<string, Record<Locale, TenStarLocaleEntry>> = {
  비견: {
    ko: { label: '비견', psychology: '동등한 자아·라이벌' },
    en: { label: 'Peer Mirror', psychology: 'Equal self / rivalry drive' },
    ja: { label: '比肩', psychology: '対等な自己・ライバル性' },
  },
  겁재: {
    ko: { label: '겁재', psychology: '자원 재분배·경쟁 압력' },
    en: { label: 'Resource Rival', psychology: 'Sudden redistribution / competition' },
    ja: { label: '劫財', psychology: '資源の再分配・奪い合い' },
  },
  식신: {
    ko: { label: '식신', psychology: '안정된 창조·몰입' },
    en: { label: 'Flow Creator', psychology: 'Steady output / flow state' },
    ja: { label: '食神', psychology: '安定した創造・フロー' },
  },
  상관: {
    ko: { label: '상관', psychology: '개혁적 표현·천재성' },
    en: { label: 'Authentic Voice', psychology: 'Reform energy / nonconformity' },
    ja: { label: '傷官', psychology: '改革エネルギー・表現の鋭さ' },
  },
  편재: {
    ko: { label: '편재', psychology: '기회 포착·유동 자산' },
    en: { label: 'Opportunist', psychology: 'Fluid assets / quick wins' },
    ja: { label: '偏財', psychology: '機会捕捉・流動資産' },
  },
  정재: {
    ko: { label: '정재', psychology: '안정 수입·관리' },
    en: { label: 'Steward', psychology: 'Stable income / stewardship' },
    ja: { label: '正財', psychology: '安定収入・管理力' },
  },
  편관: {
    ko: { label: '편관', psychology: '압박·결단·책임' },
    en: { label: 'Pressure Leader', psychology: 'Stress tolerance / decisive authority' },
    ja: { label: '偏官', psychology: '圧力・決断・責任' },
  },
  정관: {
    ko: { label: '정관', psychology: '규범·질서·신뢰' },
    en: { label: 'Order Keeper', psychology: 'Norms / trust / structure' },
    ja: { label: '正官', psychology: '規範・秩序・信頼' },
  },
  편인: {
    ko: { label: '편인', psychology: '직관·학습·내면' },
    en: { label: 'Intuitive Learner', psychology: 'Insight / unconventional learning' },
    ja: { label: '偏印', psychology: '直感・学習・内面' },
  },
  정인: {
    ko: { label: '정인', psychology: '보호·양육·정서 안정' },
    en: { label: 'Nurturing Guide', psychology: 'Protection / emotional stability' },
    ja: { label: '正印', psychology: '保護・養育・情緒の安定' },
  },
};

export const TEN_STAR_KEYS = Object.keys(ENTRIES);

export function tenStarLabel(koKey: string, locale: Locale): TenStarLocaleEntry {
  const row = ENTRIES[koKey];
  if (!row) {
    return { label: koKey, psychology: koKey };
  }
  return row[locale] ?? row.ko;
}

export function formatTenStarDisplay(koKey: string, locale: Locale): string {
  const { label, psychology } = tenStarLabel(koKey, locale);
  if (locale === 'ko') return koKey;
  return `${label} · ${psychology}`;
}
