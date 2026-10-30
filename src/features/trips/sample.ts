import { TripDraft } from './types';

const place = (name: string, address: string, lat: number, lng: number, memo?: string) => ({
  id: `${name}-${lat}`,
  name,
  address,
  lat,
  lng,
  memo,
});

const base = { photoIds: [], coverPhotoId: undefined };

/** 처음 방문했을 때 "샘플로 둘러보기"에 쓰는 데이터 */
export const SAMPLE_TRIPS: TripDraft[] = [
  {
    ...base,
    title: '골목마다 노란 트램이 지나가던 리스본',
    countryCode: 'PT',
    city: '리스본',
    startDate: '2025-09-12',
    endDate: '2025-09-17',
    companions: ['지수'],
    tags: ['유럽', '도보여행', '에그타르트'],
    story:
      '언덕을 오를 때마다 숨이 찼지만, 꼭대기에서 보는 주황색 지붕들이 매번 보상이었다.\n\n28번 트램은 결국 사람이 너무 많아 포기하고 걸어서 알파마를 돌았는데, 그게 오히려 이번 여행에서 제일 좋았던 하루.',
    places: [
      place('벨렝 탑', 'Torre de Belém, Lisboa', 38.6916, -9.216, '오전 일찍 가야 줄이 짧다'),
      place(
        '파스테이스 드 벨렝',
        'Rua de Belém 84, Lisboa',
        38.6975,
        -9.2032,
        '에그타르트 3개 순삭'
      ),
      place('코메르시우 광장', 'Praça do Comércio, Lisboa', 38.7075, -9.1364),
      place('상 조르즈 성', 'Castelo de São Jorge, Lisboa', 38.7139, -9.1335, '해 질 녘 전망 최고'),
      place('세뇨라 두 몬테 전망대', 'Miradouro da Senhora do Monte', 38.7192, -9.1328),
    ],
  },
  {
    ...base,
    title: '비 오는 도쿄, 동네 산책',
    countryCode: 'JP',
    city: '도쿄',
    startDate: '2025-06-05',
    endDate: '2025-06-08',
    companions: [],
    tags: ['혼행', '카페', '산책'],
    story:
      '장마 시작이라 내내 비가 왔다. 덕분에 관광지 대신 작은 동네와 카페를 천천히 돌아다녔다.\n나카메구로 강가의 수국이 생각보다 훨씬 예뻤다.',
    places: [
      place('나카메구로', 'Nakameguro, Meguro City, Tokyo', 35.6441, 139.6988, '강가 수국 산책길'),
      place('다이칸야마 츠타야', 'Daikanyama T-Site, Shibuya', 35.6489, 139.6997),
      place(
        '시모키타자와',
        'Shimokitazawa, Setagaya City, Tokyo',
        35.6618,
        139.6681,
        '빈티지 숍 구경'
      ),
      place('야나카 긴자', 'Yanaka Ginza, Taito City, Tokyo', 35.7277, 139.7656),
    ],
  },
  {
    ...base,
    title: '엄마랑 다낭 3박 4일',
    countryCode: 'VN',
    city: '다낭',
    startDate: '2025-01-18',
    endDate: '2025-01-21',
    companions: ['엄마'],
    tags: ['가족여행', '휴양'],
    story:
      '처음으로 엄마와 단둘이 떠난 해외여행. 바나힐 케이블카에서 엄마가 아이처럼 좋아하던 얼굴이 아직도 생각난다.',
    places: [
      place('미케 비치', 'My Khe Beach, Da Nang', 16.0544, 108.2478),
      place('바나힐', 'Ba Na Hills, Da Nang', 15.9977, 107.9881, '케이블카 대기 1시간'),
      place('호이안 올드타운', 'Hoi An Ancient Town', 15.8771, 108.3266, '등불 켜지는 저녁이 진짜'),
    ],
  },
  {
    ...base,
    title: '겨울 제주, 오름 세 개',
    countryCode: 'KR',
    city: '제주',
    startDate: '2024-12-07',
    endDate: '2024-12-09',
    companions: ['민호', '서연'],
    tags: ['국내', '오름', '드라이브'],
    story:
      '바람이 엄청 불었지만 하늘이 맑아서 한라산이 계속 보였다. 다음엔 꼭 눈 오는 날 다시 오기.',
    places: [
      place('새별오름', 'Saebyeol Oreum, Jeju', 33.3661, 126.3571),
      place('용눈이오름', 'Yongnuni Oreum, Jeju', 33.4597, 126.8317),
      place(
        '성산일출봉',
        'Seongsan Ilchulbong, Jeju',
        33.4581,
        126.9425,
        '일출은 구름 때문에 실패'
      ),
    ],
  },
  {
    ...base,
    title: '파리에서 보낸 일주일',
    countryCode: 'FR',
    city: '파리',
    startDate: '2024-05-02',
    endDate: '2024-05-08',
    companions: ['지수'],
    tags: ['유럽', '미술관'],
    story:
      '오르세 미술관에서만 반나절. 센강 따라 걷다가 해가 지는 시간에 에펠탑 불이 켜지는 걸 봤다.',
    places: [
      place('오르세 미술관', "Musée d'Orsay, Paris", 48.86, 2.3266),
      place('몽마르트르', 'Montmartre, Paris', 48.8867, 2.3431),
      place('마레 지구', 'Le Marais, Paris', 48.8575, 2.3622, '팔라펠 맛집'),
      place('트로카데로', 'Trocadéro, Paris', 48.8616, 2.2893, '에펠탑 정면 뷰'),
    ],
  },
];
