import type { Locale } from './locale';

type StringKey =
  | 'synergy_title'
  | 'synergy_lead'
  | 'synergy_person_a'
  | 'synergy_person_b'
  | 'synergy_compare'
  | 'synergy_share'
  | 'synergy_copied'
  | 'synergy_element_gap'
  | 'synergy_collaborator'
  | 'synergy_cross_relations'
  | 'synergy_score'
  | 'daily_title'
  | 'daily_today_pillar'
  | 'daily_biorhythm'
  | 'daily_actions'
  | 'daily_caution'
  | 'daily_go'
  | 'daily_info'
  | 'nav_synergy'
  | 'nav_daily';

const STRINGS: Record<StringKey, Record<Locale, string>> = {
  synergy_title: {
    ko: '시너지 · 귀인 매칭',
    en: 'Synergy · Noble Match',
    ja: 'シナジー · 貴人マッチ',
  },
  synergy_lead: {
    ko: '두 팔자의 오행·관계를 겹쳐 봅니다. 공유 링크로 친구·연인·동료와 비교할 수 있습니다.',
    en: 'Overlay two charts for element synergy and relations. Share a link to compare with others.',
    ja: '二つの命式の五行・関係を重ねます。リンク共有で比較できます。',
  },
  synergy_person_a: { ko: '나', en: 'Me', ja: '自分' },
  synergy_person_b: { ko: '상대', en: 'Partner', ja: '相手' },
  synergy_compare: { ko: '시너지 보기', en: 'View synergy', ja: 'シナジーを見る' },
  synergy_share: { ko: '링크 복사', en: 'Copy link', ja: 'リンクをコピー' },
  synergy_copied: { ko: '복사됨', en: 'Copied', ja: 'コピーしました' },
  synergy_element_gap: {
    ko: '부족한 기운 보완',
    en: 'Element complement',
    ja: '不足気運の補完',
  },
  synergy_collaborator: {
    ko: '올해의 동업자 유형',
    en: 'Collaborator archetype',
    ja: '今年の協業者タイプ',
  },
  synergy_cross_relations: {
    ko: '교차 관계',
    en: 'Cross relations',
    ja: '交叉関係',
  },
  synergy_score: { ko: '시너지 지수', en: 'Synergy score', ja: 'シナジー指数' },
  daily_title: { ko: '오늘 가이드', en: "Today's guide", ja: '今日のガイド' },
  daily_today_pillar: { ko: '오늘 일진', en: "Today's day pillar", ja: '今日の日柱' },
  daily_biorhythm: { ko: '오행 바이오리듬', en: 'Element biorhythm', ja: '五行バイオリズム' },
  daily_actions: { ko: '액션 플랜', en: 'Action plan', ja: 'アクションプラン' },
  daily_caution: { ko: '주의', en: 'Caution', ja: '注意' },
  daily_go: { ko: '유리', en: 'Favorable', ja: '有利' },
  daily_info: { ko: '참고', en: 'Note', ja: '参考' },
  nav_synergy: { ko: '시너지', en: 'Synergy', ja: 'シナジー' },
  nav_daily: { ko: '오늘', en: 'Today', ja: '今日' },
};

export function t(key: StringKey, locale: Locale): string {
  return STRINGS[key][locale] ?? STRINGS[key].ko;
}

export const ELEMENT_I18N: Record<'木' | '火' | '土' | '金' | '水', Record<Locale, string>> = {
  木: { ko: '목(木)', en: 'Wood', ja: '木' },
  火: { ko: '화(火)', en: 'Fire', ja: '火' },
  土: { ko: '토(土)', en: 'Earth', ja: '土' },
  金: { ko: '금(金)', en: 'Metal', ja: '金' },
  水: { ko: '수(水)', en: 'Water', ja: '水' },
};
