export type Quiz = {
  q: string;
  options: string[];
  answer: number;
  hint: string;
};

export type Photo = {
  url: string;
  width?: number;
  height?: number;
  credit: string;
  sourceUrl?: string;
  license: 'cc-by-sa' | 'public-domain' | 'kogl-1' | 'kogl-2' | 'kogl-3' | 'kogl-4' | 'unknown';
  desc?: string;
};

export type Place = {
  id: string;
  name: string;
  nameHanja: string;
  region: string;
  era: string;
  distance: number;
  coords: { x: number; y: number };
  lat?: number;
  lon?: number;
  accent: string;
  tag: string;
  period: string;
  summary: string;
  story: string;
  visits: number;
  nearbyStamps: number;
  quiz: Quiz | null;
  /** 썸네일/사진 (출처 표기 필수) */
  photo?: Photo | null;
};

export const PLACES: Place[] = [
  {
    id: 'paengseong-gaeksa',
    name: '팽성읍 객사',
    nameHanja: '彭城邑 客舍',
    region: '경기 평택',
    era: '조선',
    distance: 4.2,
    coords: { x: 38, y: 27 },
    lat: 36.964,
    lon: 127.063,
    accent: '#C8442A',
    tag: '국가 보물',
    period: '1488년',
    summary:
      '조선시대 외국 사신과 관리들의 숙소로 쓰인 관아 건물. 정청과 양옆 익청이 온전히 남아 있는 드문 예.',
    story:
      '팽성읍 객사는 조선 성종 19년(1488)에 세워진 관아 건물로, 중앙의 정청(正廳)에는 임금을 상징하는 전패를 모셔두고 매월 초하루와 보름에 관리들이 망궐례를 올리던 곳이다.',
    visits: 142,
    nearbyStamps: 3,
    quiz: {
      q: '객사의 정청에서는 매월 초하루와 보름에 무엇을 행했을까요?',
      options: ['망궐례', '제례', '과거시험', '시조 낭독'],
      answer: 0,
      hint: '임금을 상징하는 전패를 향해 절을 올리는 의식입니다.',
    },
  },
  {
    id: 'daedongbeop-bi',
    name: '대동법 시행기념비',
    nameHanja: '大同法 施行記念碑',
    region: '경기 평택',
    era: '조선',
    distance: 5.1,
    coords: { x: 39, y: 28 },
    lat: 36.997,
    lon: 127.018,
    accent: '#C8442A',
    tag: '유형문화재',
    period: '1659년',
    summary:
      '효종 때 김육이 충청도 대동법을 시행한 공을 기리기 위해 세운 비석. 평택 소사벌 들판을 지나는 옛 삼남길에 자리.',
    story:
      '대동법은 쌀, 베, 동전으로 공물을 대신 납부하게 한 조선 후기 세제 개혁이다. 영의정 김육은 충청도에 대동법을 확대 시행하기 위해 평생을 바쳤고, 그가 세상을 떠난 다음해인 1659년 평택 소사벌의 삼남길에 이 비석이 세워졌다.',
    visits: 87,
    nearbyStamps: 3,
    quiz: {
      q: '대동법 시행을 주도한 인물은 누구인가요?',
      options: ['이이', '김육', '조광조', '정약용'],
      answer: 1,
      hint: '효종·현종 대 영의정을 지낸 인물입니다.',
    },
  },
  {
    id: 'hyeonchungsa',
    name: '현충사',
    nameHanja: '顯忠祠',
    region: '충남 아산',
    era: '조선',
    distance: 8.7,
    coords: { x: 36, y: 32 },
    lat: 36.804,
    lon: 127.014,
    accent: '#5F7A6B',
    tag: '사적',
    period: '1706년',
    summary:
      '충무공 이순신 장군의 영정을 모신 사당. 장군이 무과에 급제하기 전까지 살던 옛집과 활터가 함께 보존되어 있다.',
    story:
      '현충사는 숙종 32년(1706)에 이순신 장군의 충절을 기리기 위해 세워진 사당이다.',
    visits: 412,
    nearbyStamps: 2,
    quiz: {
      q: '현충사에 보관된 이순신 장군의 친필 일기는?',
      options: ['징비록', '난중일기', '임진록', '동의보감'],
      answer: 1,
      hint: '임진왜란 7년의 기록입니다.',
    },
  },
  {
    id: 'oeam-village',
    name: '외암민속마을',
    nameHanja: '外巖民俗마을',
    region: '충남 아산',
    era: '조선',
    distance: 12.4,
    coords: { x: 35, y: 33 },
    lat: 36.736,
    lon: 126.992,
    accent: '#8B6F47',
    tag: '국가민속문화재',
    period: '약 500년',
    summary:
      '예안 이씨가 5백여 년간 세거해 온 반촌. 돌담길과 초가, 기와집이 옛 모습 그대로 보존된 살아있는 마을.',
    story:
      '외암마을은 조선 명종 때 이정(李挺)이 정착한 이래 예안 이씨의 집성촌으로 약 500년의 역사를 이어 왔다.',
    visits: 256,
    nearbyStamps: 2,
    quiz: null,
  },
  {
    id: 'dokrip-hall',
    name: '독립기념관',
    nameHanja: '獨立記念館',
    region: '충남 천안',
    era: '근현대',
    distance: 18.2,
    coords: { x: 37, y: 31 },
    lat: 36.789,
    lon: 127.196,
    accent: '#1F2937',
    tag: '국립',
    period: '1987년 개관',
    summary:
      '일제강점기 항일독립운동의 역사를 보존·전시하는 국립 기념관. 겨레의 집을 중심으로 7개 전시관으로 구성.',
    story: '독립기념관은 1987년 광복 42주년에 개관한 국립 기념관으로, 국민 성금으로 세워졌다.',
    visits: 891,
    nearbyStamps: 1,
    quiz: null,
  },
  {
    id: 'hwaseong',
    name: '수원 화성',
    nameHanja: '水原華城',
    region: '경기 수원',
    era: '조선',
    distance: 31.5,
    coords: { x: 39, y: 25 },
    lat: 37.286,
    lon: 127.011,
    accent: '#C8442A',
    tag: '유네스코',
    period: '1796년',
    summary:
      '정조가 아버지 사도세자의 능을 옮기며 축조한 신도시 성곽. 정약용의 거중기로 2년 9개월 만에 완성.',
    story: '수원 화성은 정조가 아버지 사도세자의 능을 양주에서 화산(현 화성시)으로 옮기면서 1794년부터 1796년까지 축조한 성곽이다.',
    visits: 1024,
    nearbyStamps: 5,
    quiz: null,
  },
  {
    id: 'sosu-seowon',
    name: '소수서원',
    nameHanja: '紹修書院',
    region: '경북 영주',
    era: '조선',
    distance: 175.8,
    coords: { x: 47, y: 35 },
    lat: 36.844,
    lon: 128.480,
    accent: '#7A6450',
    tag: '유네스코',
    period: '1543년',
    summary:
      '주세붕이 백운동서원으로 세운 한국 최초의 사액서원. 안향을 기리며 조선 서원의 시작이 된 곳.',
    story:
      '소수서원은 1543년 풍기군수 주세붕이 안향의 사당을 모시고 세운 백운동서원에서 출발했다. 1550년 명종이 \'소수(紹修)\'라는 편액을 내려 한국 최초의 사액서원이 되었고, 이후 조선 전역에 서원이 퍼지는 시발점이 되었다. 2019년 유네스코 세계유산 한국의 서원에 포함되어 등재되었다.',
    visits: 421,
    nearbyStamps: 2,
    quiz: {
      q: '한국 최초의 사액서원으로 명종에게 \'소수\'라는 편액을 받은 서원은?',
      options: ['도산서원', '병산서원', '소수서원', '옥산서원'],
      answer: 2,
      hint: '풍기군수 주세붕이 안향의 사당을 모시고 세운 곳입니다.',
    },
  },
  {
    id: 'dosan-seowon',
    name: '도산서원',
    nameHanja: '陶山書院',
    region: '경북 안동',
    era: '조선',
    distance: 192.3,
    coords: { x: 49, y: 38 },
    lat: 36.768,
    lon: 128.848,
    accent: '#7A6450',
    tag: '유네스코',
    period: '1574년',
    summary:
      '퇴계 이황이 학문을 닦고 후학을 가르치던 도산서당 자리에 세워진 서원. 한국 성리학의 본산.',
    story:
      '도산서원은 퇴계 이황(1501-1570) 사후 4년 뒤인 1574년에 선조의 사액을 받아 건립된 서원이다. 본래 이황이 만년에 학문을 닦고 후학을 가르치던 도산서당이 있던 자리로, 안동 도산면 낙동강변에 자리 잡고 있다. 2019년 한국의 서원 9곳 중 하나로 유네스코 세계유산에 등재되었으며, 한국 성리학의 본산으로 일컬어진다.',
    visits: 678,
    nearbyStamps: 3,
    quiz: {
      q: '도산서원의 중심 인물은 누구인가요?',
      options: ['정도전', '이이', '이황', '조광조'],
      answer: 2,
      hint: '퇴계 선생으로 더 알려진 조선 성리학의 거두입니다.',
    },
  },
];

export const STAMPED: string[] = [
  'daedongbeop-bi',
  'hyeonchungsa',
  'dokrip-hall',
];
