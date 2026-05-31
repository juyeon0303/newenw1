# saju-explore

만세력 천을귀인 V5.22와 동일한 데이터 항목을 **크롤링 없이** 산출식으로 계산하는 사주 탐구 프로젝트.

## 만세력 천을귀인 V5.22 대응 항목

| # | 항목 | 구현 |
|---|------|------|
| 1 | 사주팔자 (년·월·일·시) | `tyme4ts` + 입춘·절기 기준 |
| 2 | 천간 합·충 | `compute/relations.ts` |
| 3 | 천간 십성 | 일간 기준 `TenStar` |
| 4 | 간지 (천간·지지) | 4기둥 |
| 5 | 지지 십성 | 본기 지장간 십성 |
| 6 | 지장간 + 십성 | `HideHeavenStem` |
| 7 | 12운성 — 봉법 (일간 기준) | `Terrain` |
| 8 | 12운성 — 거법 (각주 천간 기준) | `自坐` |
| 9 | 납음오행 | `SixtyCycle.getSound()` |
| 10 | 형·충·회·합·해·파·원진·귀문·천라·지망 | `compute/relations.ts` |
| 11 | 오행 개수 | `compute/monthly-command.ts` |
| 12 | 공망(년·일), 천을귀인, 월령(사령·당령) | `relations` + `spirits` + `monthly-command` |
| 14 | 12신살 (년지·일지·일간 기준) | `compute/spirits.ts` |
| 15 | 기타 신살 20여 종 | `EXTRA_SPIRITS` |
| 16–18 | 대운·세운·월운 | `ChildLimit` / `DecadeFortune` |

## 천을귀인 보정 규칙

- **경도 보정**: 동경 **127.5°** 기준 `(출생경도 - 127.5) × 4분`
- **썸머타임**: 한국 역사적 DST 구간 자동 역보정
- **균시차**: Meeus 간략식 (옵션)
- **야자시**: `yajasi: true` → 23:00~23:59 당일 일주

## 사용법

```typescript
import { calculateManseryeok } from './src/lib/manseryeok';

const chart = calculateManseryeok({
  year: 1990,
  month: 5,
  day: 15,
  hour: 14,
  minute: 30,
  gender: 'male',
  yajasi: false,
  timeCorrection: {
    longitude: 126.978, // 서울
    applyDst: true,
    applyEquationOfTime: true,
  },
});

console.log(chart.pillars);      // 4기둥 전체
console.log(chart.daewoon);      // 대운
console.log(chart.extraSpirits); // 기타 신살
```

## 검증

앱과 대조할 때 생년월일시·성별·야자시·출생지 경도를 동일하게 맞춘 뒤 비교하세요.

```bash
npm test
```

## 스택

- `tyme4ts` — 절기·간지·대운 (寿星天文历 기반)
- TypeScript + Vitest
