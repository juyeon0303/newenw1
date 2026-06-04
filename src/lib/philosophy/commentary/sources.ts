/** 전통·문헌 출처 — 웹 잡문은 넣지 않음 */

export type SourceKind = 'classic' | 'reference';

export interface SourceRef {
  id: string;
  kind: SourceKind;
  title: string;
  titleHanja?: string;
  author?: string;
  era?: string;
  /** 판·역본·장 정보 등 */
  note?: string;
}

export const SOURCES: Record<string, SourceRef> = {
  jaPYeong: {
    id: 'jaPYeong',
    kind: 'classic',
    title: '자평진전',
    titleHanja: '子平真诠',
    author: '沈孝瞻',
    era: '淸',
    note: '십성·용신·격국 논의의 기본 고전',
  },
  jeokCheon: {
    id: 'jeokCheon',
    kind: 'classic',
    title: '적천수',
    titleHanja: '滴天髓',
    author: '任鐵樵(注)',
    era: '淸',
    note: '천간·지지·기세·충합 논의',
  },
  samMyeong: {
    id: 'samMyeong',
    kind: 'classic',
    title: '삼명통회',
    titleHanja: '三命通會',
    author: '万民英',
    era: '明',
    note: '신살·운성·형충회합 등 종합',
  },
  qiongTong: {
    id: 'qiongTong',
    kind: 'classic',
    title: '궁통보감',
    titleHanja: '窮通寶鑑',
    era: '淸',
    note: '월령·계절·오행 희기',
  },
  yeonHae: {
    id: 'yeonHae',
    kind: 'classic',
    title: '연해자평',
    titleHanja: '淵海子平',
    author: '徐子平(托名)·後人輯',
    era: '宋–明',
    note: '子平諸書淵源',
  },
};

export function formatSource(ref: SourceRef): string {
  const parts = [ref.titleHanja ? `${ref.title}(${ref.titleHanja})` : ref.title];
  if (ref.author) parts.push(ref.author);
  if (ref.era) parts.push(ref.era);
  return parts.join(' · ');
}
