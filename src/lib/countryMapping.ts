// 국가 이름을 ISO A2 코드로 변환하는 매핑 테이블
// TODO: i18n-iso-countries 라이브러리 사용 권장
// npm install i18n-iso-countries 후 아래 코드로 교체:
// import countries from 'i18n-iso-countries';
// countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
// export function getCountryCode(countryName: string | undefined | null): string | null {
//   if (!countryName) return null;
//   try {
//     return countries.getAlpha2Code(countryName, 'en') || null;
//   } catch {
//     return countryNameToCode[countryName] || null; // fallback
//   }
// }

// world-atlas의 국가 이름과 ISO 코드 매핑 (fallback)
export const countryNameToCode: Record<string, string> = {
  'Afghanistan': 'AF',
  'Albania': 'AL',
  'Algeria': 'DZ',
  'Argentina': 'AR',
  'Australia': 'AU',
  'Austria': 'AT',
  'Bangladesh': 'BD',
  'Belarus': 'BY',
  'Belgium': 'BE',
  'Brazil': 'BR',
  'Bulgaria': 'BG',
  'Cambodia': 'KH',
  'Canada': 'CA',
  'Chile': 'CL',
  'China': 'CN',
  'Colombia': 'CO',
  'Croatia': 'HR',
  'Czech Republic': 'CZ',
  'Denmark': 'DK',
  'Egypt': 'EG',
  'Finland': 'FI',
  'France': 'FR',
  'Germany': 'DE',
  'Greece': 'GR',
  'Hong Kong': 'HK',
  'Hungary': 'HU',
  'Iceland': 'IS',
  'India': 'IN',
  'Indonesia': 'ID',
  'Iran': 'IR',
  'Iraq': 'IQ',
  'Ireland': 'IE',
  'Israel': 'IL',
  'Italy': 'IT',
  'Japan': 'JP',
  'Jordan': 'JO',
  'Kazakhstan': 'KZ',
  'Kenya': 'KE',
  'Korea': 'KR',
  'South Korea': 'KR',
  'Kuwait': 'KW',
  'Laos': 'LA',
  'Latvia': 'LV',
  'Lebanon': 'LB',
  'Lithuania': 'LT',
  'Luxembourg': 'LU',
  'Malaysia': 'MY',
  'Mexico': 'MX',
  'Mongolia': 'MN',
  'Morocco': 'MA',
  'Myanmar': 'MM',
  'Netherlands': 'NL',
  'New Zealand': 'NZ',
  'Nigeria': 'NG',
  'North Korea': 'KP',
  'Norway': 'NO',
  'Pakistan': 'PK',
  'Paraguay': 'PY',
  'Peru': 'PE',
  'Philippines': 'PH',
  'Poland': 'PL',
  'Portugal': 'PT',
  'Qatar': 'QA',
  'Romania': 'RO',
  'Russia': 'RU',
  'Saudi Arabia': 'SA',
  'Singapore': 'SG',
  'Slovakia': 'SK',
  'Slovenia': 'SI',
  'South Africa': 'ZA',
  'Spain': 'ES',
  'Sri Lanka': 'LK',
  'Sweden': 'SE',
  'Switzerland': 'CH',
  'Syria': 'SY',
  'Taiwan': 'TW',
  'Thailand': 'TH',
  'Turkey': 'TR',
  'Ukraine': 'UA',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'United States': 'US',
  'Uruguay': 'UY',
  'Venezuela': 'VE',
  'Vietnam': 'VN',
  'Yemen': 'YE',
};

/**
 * 국가 이름을 ISO A2 코드로 변환
 */
export function getCountryCode(countryName: string | undefined | null): string | null {
  if (!countryName) return null;
  return countryNameToCode[countryName] || null;
}

