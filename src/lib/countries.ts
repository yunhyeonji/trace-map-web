export interface Country {
  code: string; // ISO 3166-1 alpha-2
  numeric: string; // ISO 3166-1 numeric (world-atlas geometry id)
  name: string; // 한국어 이름
  en: string; // world-atlas 표기
  continent: Continent;
}

export type Continent = '아시아' | '유럽' | '북미' | '남미' | '오세아니아' | '아프리카' | '중동';

// prettier-ignore
export const COUNTRIES: Country[] = [
  { code: 'KR', numeric: '410', name: '대한민국', en: 'South Korea', continent: '아시아' },
  { code: 'JP', numeric: '392', name: '일본', en: 'Japan', continent: '아시아' },
  { code: 'CN', numeric: '156', name: '중국', en: 'China', continent: '아시아' },
  { code: 'TW', numeric: '158', name: '대만', en: 'Taiwan', continent: '아시아' },
  { code: 'HK', numeric: '344', name: '홍콩', en: 'Hong Kong', continent: '아시아' },
  { code: 'MO', numeric: '446', name: '마카오', en: 'Macao', continent: '아시아' },
  { code: 'MN', numeric: '496', name: '몽골', en: 'Mongolia', continent: '아시아' },
  { code: 'VN', numeric: '704', name: '베트남', en: 'Vietnam', continent: '아시아' },
  { code: 'TH', numeric: '764', name: '태국', en: 'Thailand', continent: '아시아' },
  { code: 'PH', numeric: '608', name: '필리핀', en: 'Philippines', continent: '아시아' },
  { code: 'MY', numeric: '458', name: '말레이시아', en: 'Malaysia', continent: '아시아' },
  { code: 'SG', numeric: '702', name: '싱가포르', en: 'Singapore', continent: '아시아' },
  { code: 'ID', numeric: '360', name: '인도네시아', en: 'Indonesia', continent: '아시아' },
  { code: 'KH', numeric: '116', name: '캄보디아', en: 'Cambodia', continent: '아시아' },
  { code: 'LA', numeric: '418', name: '라오스', en: 'Laos', continent: '아시아' },
  { code: 'MM', numeric: '104', name: '미얀마', en: 'Myanmar', continent: '아시아' },
  { code: 'IN', numeric: '356', name: '인도', en: 'India', continent: '아시아' },
  { code: 'NP', numeric: '524', name: '네팔', en: 'Nepal', continent: '아시아' },
  { code: 'LK', numeric: '144', name: '스리랑카', en: 'Sri Lanka', continent: '아시아' },
  { code: 'MV', numeric: '462', name: '몰디브', en: 'Maldives', continent: '아시아' },
  { code: 'KZ', numeric: '398', name: '카자흐스탄', en: 'Kazakhstan', continent: '아시아' },
  { code: 'UZ', numeric: '860', name: '우즈베키스탄', en: 'Uzbekistan', continent: '아시아' },
  { code: 'AE', numeric: '784', name: '아랍에미리트', en: 'United Arab Emirates', continent: '중동' },
  { code: 'QA', numeric: '634', name: '카타르', en: 'Qatar', continent: '중동' },
  { code: 'SA', numeric: '682', name: '사우디아라비아', en: 'Saudi Arabia', continent: '중동' },
  { code: 'JO', numeric: '400', name: '요르단', en: 'Jordan', continent: '중동' },
  { code: 'IL', numeric: '376', name: '이스라엘', en: 'Israel', continent: '중동' },
  { code: 'TR', numeric: '792', name: '튀르키예', en: 'Turkey', continent: '중동' },
  { code: 'GE', numeric: '268', name: '조지아', en: 'Georgia', continent: '유럽' },
  { code: 'GB', numeric: '826', name: '영국', en: 'United Kingdom', continent: '유럽' },
  { code: 'IE', numeric: '372', name: '아일랜드', en: 'Ireland', continent: '유럽' },
  { code: 'FR', numeric: '250', name: '프랑스', en: 'France', continent: '유럽' },
  { code: 'DE', numeric: '276', name: '독일', en: 'Germany', continent: '유럽' },
  { code: 'IT', numeric: '380', name: '이탈리아', en: 'Italy', continent: '유럽' },
  { code: 'ES', numeric: '724', name: '스페인', en: 'Spain', continent: '유럽' },
  { code: 'PT', numeric: '620', name: '포르투갈', en: 'Portugal', continent: '유럽' },
  { code: 'NL', numeric: '528', name: '네덜란드', en: 'Netherlands', continent: '유럽' },
  { code: 'BE', numeric: '056', name: '벨기에', en: 'Belgium', continent: '유럽' },
  { code: 'LU', numeric: '442', name: '룩셈부르크', en: 'Luxembourg', continent: '유럽' },
  { code: 'CH', numeric: '756', name: '스위스', en: 'Switzerland', continent: '유럽' },
  { code: 'AT', numeric: '040', name: '오스트리아', en: 'Austria', continent: '유럽' },
  { code: 'CZ', numeric: '203', name: '체코', en: 'Czechia', continent: '유럽' },
  { code: 'HU', numeric: '348', name: '헝가리', en: 'Hungary', continent: '유럽' },
  { code: 'PL', numeric: '616', name: '폴란드', en: 'Poland', continent: '유럽' },
  { code: 'HR', numeric: '191', name: '크로아티아', en: 'Croatia', continent: '유럽' },
  { code: 'SI', numeric: '705', name: '슬로베니아', en: 'Slovenia', continent: '유럽' },
  { code: 'GR', numeric: '300', name: '그리스', en: 'Greece', continent: '유럽' },
  { code: 'DK', numeric: '208', name: '덴마크', en: 'Denmark', continent: '유럽' },
  { code: 'SE', numeric: '752', name: '스웨덴', en: 'Sweden', continent: '유럽' },
  { code: 'NO', numeric: '578', name: '노르웨이', en: 'Norway', continent: '유럽' },
  { code: 'FI', numeric: '246', name: '핀란드', en: 'Finland', continent: '유럽' },
  { code: 'IS', numeric: '352', name: '아이슬란드', en: 'Iceland', continent: '유럽' },
  { code: 'EE', numeric: '233', name: '에스토니아', en: 'Estonia', continent: '유럽' },
  { code: 'LV', numeric: '428', name: '라트비아', en: 'Latvia', continent: '유럽' },
  { code: 'LT', numeric: '440', name: '리투아니아', en: 'Lithuania', continent: '유럽' },
  { code: 'RO', numeric: '642', name: '루마니아', en: 'Romania', continent: '유럽' },
  { code: 'BG', numeric: '100', name: '불가리아', en: 'Bulgaria', continent: '유럽' },
  { code: 'RS', numeric: '688', name: '세르비아', en: 'Serbia', continent: '유럽' },
  { code: 'ME', numeric: '499', name: '몬테네그로', en: 'Montenegro', continent: '유럽' },
  { code: 'MT', numeric: '470', name: '몰타', en: 'Malta', continent: '유럽' },
  { code: 'CY', numeric: '196', name: '키프로스', en: 'Cyprus', continent: '유럽' },
  { code: 'RU', numeric: '643', name: '러시아', en: 'Russia', continent: '유럽' },
  { code: 'UA', numeric: '804', name: '우크라이나', en: 'Ukraine', continent: '유럽' },
  { code: 'US', numeric: '840', name: '미국', en: 'United States of America', continent: '북미' },
  { code: 'CA', numeric: '124', name: '캐나다', en: 'Canada', continent: '북미' },
  { code: 'MX', numeric: '484', name: '멕시코', en: 'Mexico', continent: '북미' },
  { code: 'CU', numeric: '192', name: '쿠바', en: 'Cuba', continent: '북미' },
  { code: 'GU', numeric: '316', name: '괌', en: 'Guam', continent: '오세아니아' },
  { code: 'BR', numeric: '076', name: '브라질', en: 'Brazil', continent: '남미' },
  { code: 'AR', numeric: '032', name: '아르헨티나', en: 'Argentina', continent: '남미' },
  { code: 'CL', numeric: '152', name: '칠레', en: 'Chile', continent: '남미' },
  { code: 'PE', numeric: '604', name: '페루', en: 'Peru', continent: '남미' },
  { code: 'CO', numeric: '170', name: '콜롬비아', en: 'Colombia', continent: '남미' },
  { code: 'BO', numeric: '068', name: '볼리비아', en: 'Bolivia', continent: '남미' },
  { code: 'AU', numeric: '036', name: '호주', en: 'Australia', continent: '오세아니아' },
  { code: 'NZ', numeric: '554', name: '뉴질랜드', en: 'New Zealand', continent: '오세아니아' },
  { code: 'FJ', numeric: '242', name: '피지', en: 'Fiji', continent: '오세아니아' },
  { code: 'EG', numeric: '818', name: '이집트', en: 'Egypt', continent: '아프리카' },
  { code: 'MA', numeric: '504', name: '모로코', en: 'Morocco', continent: '아프리카' },
  { code: 'ZA', numeric: '710', name: '남아프리카공화국', en: 'South Africa', continent: '아프리카' },
  { code: 'KE', numeric: '404', name: '케냐', en: 'Kenya', continent: '아프리카' },
  { code: 'TZ', numeric: '834', name: '탄자니아', en: 'Tanzania', continent: '아프리카' },
];

const byCode = new Map(COUNTRIES.map((c) => [c.code, c]));
const byNumeric = new Map(COUNTRIES.map((c) => [c.numeric, c]));
const byEnglish = new Map(COUNTRIES.map((c) => [c.en.toLowerCase(), c]));

export function getCountry(code: string | undefined | null): Country | undefined {
  if (!code) return undefined;
  return byCode.get(code.toUpperCase());
}

export function countryName(code: string | undefined | null): string {
  return getCountry(code)?.name ?? code ?? '';
}

/** world-atlas 지오메트리(id 또는 이름)로 국가 찾기 */
export function findCountryByGeo(id: string | number | undefined, name?: string) {
  if (id !== undefined) {
    const found = byNumeric.get(String(id).padStart(3, '0'));
    if (found) return found;
  }
  return name ? byEnglish.get(name.toLowerCase()) : undefined;
}

/** 'KR' → 🇰🇷 */
export function flagEmoji(code: string | undefined | null): string {
  if (!code || code.length !== 2) return '🌍';
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}
