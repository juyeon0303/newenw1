import type { ElementCount } from '@/lib/manseryeok/compute/monthly-command';

export type Element = keyof ElementCount;

/** 오행 상생: A가 B를 생함 */
export const ELEMENT_GENERATES: Record<Element, Element> = {
  木: '火',
  火: '土',
  土: '金',
  金: '水',
  水: '木',
};

/** 오행 상극: A가 B를 극함 */
export const ELEMENT_CONTROLS: Record<Element, Element> = {
  木: '土',
  火: '金',
  土: '水',
  金: '木',
  水: '火',
};

export function elementGenerates(from: Element): Element {
  return ELEMENT_GENERATES[from];
}

export function elementControls(from: Element): Element {
  return ELEMENT_CONTROLS[from];
}

export function elementGeneratedBy(el: Element): Element {
  const entries = Object.entries(ELEMENT_GENERATES) as [Element, Element][];
  return entries.find(([, v]) => v === el)![0];
}

export function elementControlledBy(el: Element): Element {
  const entries = Object.entries(ELEMENT_CONTROLS) as [Element, Element][];
  return entries.find(([, v]) => v === el)![0];
}
