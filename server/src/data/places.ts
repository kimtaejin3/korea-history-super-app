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
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/%EC%A2%8C%EC%9D%B5%EC%82%AC%EB%82%B4%EB%B6%80.jpg/330px-%EC%A2%8C%EC%9D%B5%EC%82%AC%EB%82%B4%EB%B6%80.jpg',
      width: 750,
      height: 521,
      credit: 'Wikimedia Commons',
      sourceUrl: 'https://ko.wikipedia.org/wiki/%ED%8C%BD%EC%84%B1%EC%9D%8D_%EA%B0%9D%EC%82%AC',
      license: 'cc-by-sa',
    },
  },
  {
    id: 'daedongbeop-bi',
    name: '대동법 시행기념비',
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
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/ko/thumb/a/a8/%EB%8C%80%EB%8F%99%EB%B2%95_%EC%8B%9C%ED%96%89_%EA%B8%B0%EB%85%90%EB%B9%84_%ED%83%81%EB%B3%B8.jpg/330px-%EB%8C%80%EB%8F%99%EB%B2%95_%EC%8B%9C%ED%96%89_%EA%B8%B0%EB%85%90%EB%B9%84_%ED%83%81%EB%B3%B8.jpg',
      width: 2848,
      height: 4272,
      credit: 'Wikimedia Commons',
      sourceUrl:
        'https://ko.wikipedia.org/wiki/%EB%8C%80%EB%8F%99%EB%B2%95_%EC%8B%9C%ED%96%89_%EA%B8%B0%EB%85%90%EB%B9%84',
      license: 'cc-by-sa',
    },
  },
  {
    id: 'hyeonchungsa',
    name: '현충사',
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
    story: '현충사는 숙종 32년(1706)에 이순신 장군의 충절을 기리기 위해 세워진 사당이다.',
    visits: 412,
    nearbyStamps: 2,
    quiz: {
      q: '현충사에 보관된 이순신 장군의 친필 일기는?',
      options: ['징비록', '난중일기', '임진록', '동의보감'],
      answer: 1,
      hint: '임진왜란 7년의 기록입니다.',
    },
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/%ED%98%84%EC%B6%A9%EC%82%AC%28Hyeonchoong-sa%29_01.jpg/330px-%ED%98%84%EC%B6%A9%EC%82%AC%28Hyeonchoong-sa%29_01.jpg',
      width: 2272,
      height: 1704,
      credit: 'Wikimedia Commons',
      sourceUrl: 'https://ko.wikipedia.org/wiki/%ED%98%84%EC%B6%A9%EC%82%AC',
      license: 'cc-by-sa',
    },
  },
  {
    id: 'oeam-village',
    name: '외암민속마을',
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
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Oeam_Folk_Village_2010.JPG/330px-Oeam_Folk_Village_2010.JPG',
      width: 3872,
      height: 2592,
      credit: 'Wikimedia Commons',
      sourceUrl: 'https://ko.wikipedia.org/wiki/%EC%99%B8%EC%95%94%EB%A7%88%EC%9D%84',
      license: 'cc-by-sa',
    },
  },
  {
    id: 'dokrip-hall',
    name: '독립기념관',
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
    story:
      '수원 화성은 정조가 아버지 사도세자의 능을 양주에서 화산(현 화성시)으로 옮기면서 1794년부터 1796년까지 축조한 성곽이다.',
    visits: 1024,
    nearbyStamps: 5,
    quiz: null,
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Bifyu_8.jpg/330px-Bifyu_8.jpg',
      width: 1600,
      height: 1200,
      credit: 'Wikimedia Commons',
      sourceUrl: 'https://ko.wikipedia.org/wiki/%EC%88%98%EC%9B%90_%ED%99%94%EC%84%B1',
      license: 'cc-by-sa',
    },
  },
  {
    id: 'sosu-seowon',
    name: '소수서원',
    region: '경북 영주',
    era: '조선',
    distance: 175.8,
    coords: { x: 47, y: 35 },
    lat: 36.844,
    lon: 128.48,
    accent: '#7A6450',
    tag: '유네스코',
    period: '1543년',
    summary:
      '주세붕이 백운동서원으로 세운 한국 최초의 사액서원. 안향을 기리며 조선 서원의 시작이 된 곳.',
    story:
      "소수서원은 1543년 풍기군수 주세붕이 안향의 사당을 모시고 세운 백운동서원에서 출발했다. 1550년 명종이 '소수(紹修)'라는 편액을 내려 한국 최초의 사액서원이 되었고, 이후 조선 전역에 서원이 퍼지는 시발점이 되었다. 2019년 유네스코 세계유산 한국의 서원에 포함되어 등재되었다.",
    visits: 421,
    nearbyStamps: 2,
    quiz: {
      q: "한국 최초의 사액서원으로 명종에게 '소수'라는 편액을 받은 서원은?",
      options: ['도산서원', '병산서원', '소수서원', '옥산서원'],
      answer: 2,
      hint: '풍기군수 주세붕이 안향의 사당을 모시고 세운 곳입니다.',
    },
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Sosuseowon.jpg/330px-Sosuseowon.jpg',
      width: 2592,
      height: 1936,
      credit: 'Wikimedia Commons',
      sourceUrl:
        'https://ko.wikipedia.org/wiki/%EC%98%81%EC%A3%BC_%EC%86%8C%EC%88%98%EC%84%9C%EC%9B%90',
      license: 'cc-by-sa',
    },
  },
  {
    id: 'dosan-seowon',
    name: '도산서원',
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
    photo: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Korea-Andong-Dosan_Seowon_3025-06.JPG/330px-Korea-Andong-Dosan_Seowon_3025-06.JPG',
      width: 1280,
      height: 960,
      credit: 'Wikimedia Commons',
      sourceUrl:
        'https://ko.wikipedia.org/wiki/%EC%95%88%EB%8F%99_%EB%8F%84%EC%82%B0%EC%84%9C%EC%9B%90',
      license: 'cc-by-sa',
    },
  },
  // ─── 일제강점기 항일의 자취 토픽 ───
  {
    id: 'seodaemun-prison',
    name: '서대문형무소역사관',
    region: '서울 서대문',
    era: '근현대',
    distance: 0,
    coords: { x: 40, y: 18 },
    lat: 37.574,
    lon: 126.9569,
    accent: '#1F3A52',
    tag: '사적',
    period: '1908년 개소',
    summary:
      '일제강점기 항일 운동가들이 갇혀 고초를 겪던 옥사를 보존한 역사관. 1908년 경성감옥으로 문을 열어 1945년까지 수많은 독립운동가를 수감했다.',
    story:
      '서대문형무소는 1908년 경성감옥으로 처음 문을 열어 일제강점기 동안 항일 독립운동가 수감의 중심지가 되었다. 광복 이후에도 서대문형무소로 1987년까지 사용되었으며, 1998년 역사관으로 개관해 옥사·취조실·사형장 등 현장을 보존하고 있다.',
    visits: 320,
    nearbyStamps: 1,
    quiz: null,
  },
  {
    id: 'ahn-junggun-memorial',
    name: '안중근의사기념관',
    region: '서울 중구',
    era: '근현대',
    distance: 0,
    coords: { x: 40, y: 18 },
    lat: 37.5552,
    lon: 126.9776,
    accent: '#1F3A52',
    tag: '기념관',
    period: '1970년 개관',
    summary:
      '1909년 하얼빈에서 이토 히로부미를 저격한 안중근 의사를 기리는 기념관. 남산 자락에 자리한다.',
    story:
      "안중근 의사(1879-1910)는 1909년 10월 26일 하얼빈역에서 일본 초대 통감 이토 히로부미를 저격하고 체포되어 이듬해 뤼순감옥에서 순국했다. 기념관은 1970년 처음 개관, 2010년 광복 65주년에 맞춰 새 건물로 재개관했으며 의사의 유필 '대한국인 안중근'을 중심으로 한 광장이 있다.",
    visits: 215,
    nearbyStamps: 0,
    quiz: null,
  },
  {
    id: 'baekbeom-kimgu-memorial',
    name: '백범김구기념관',
    region: '서울 용산',
    era: '근현대',
    distance: 0,
    coords: { x: 40, y: 18 },
    lat: 37.5392,
    lon: 126.9658,
    accent: '#1F3A52',
    tag: '기념관',
    period: '2002년 개관',
    summary:
      '대한민국 임시정부 주석을 지낸 백범 김구 선생을 기리는 기념관. 효창공원 안에 자리한다.',
    story:
      '김구(1876-1949) 선생은 한일합방 반대 운동과 임시정부 활동, 한인애국단 조직 등 항일 독립운동의 중심에 섰던 인물이다. 광복 후 통일 정부 수립을 위해 노력하다 1949년 안두희에 의해 암살당했다. 기념관은 2002년 효창공원 안에 개관해 선생의 일생과 임정 활동을 전시한다.',
    visits: 187,
    nearbyStamps: 0,
    quiz: null,
  },
  {
    id: 'hyochang-park',
    name: '효창공원',
    region: '서울 용산',
    era: '근현대',
    distance: 0,
    coords: { x: 40, y: 18 },
    lat: 37.5391,
    lon: 126.9647,
    accent: '#1F3A52',
    tag: '사적',
    period: '1947년 묘역 조성',
    summary:
      '백범 김구·윤봉길·이봉창·이동녕 등 항일 독립운동가들의 묘역이 자리한 공원. 본래 정조의 장남 문효세자의 묘소(효창원)였다.',
    story:
      '효창공원은 본래 조선 정조의 맏아들 문효세자(1782-1786)의 묘소인 효창원이 있던 곳이다. 1944년 일제가 묘를 강제 이장하고 골프장으로 만들었으며, 광복 후인 1946년 김구의 주도로 윤봉길·이봉창·백정기 의사의 유해가 봉환되어 안장되었다. 1949년 김구 자신도 이곳에 잠들었다.',
    visits: 256,
    nearbyStamps: 0,
    quiz: null,
  },
  // ─── 한국의 서원 토픽 ───
  {
    id: 'byeongsan-seowon',
    name: '병산서원',
    region: '경북 안동',
    era: '조선',
    distance: 0,
    coords: { x: 49, y: 38 },
    lat: 36.5395,
    lon: 128.526,
    accent: '#7A6450',
    tag: '유네스코',
    period: '1572년',
    summary:
      '서애 류성룡과 그의 아들 류진을 모신 서원. 낙동강 절벽 위 만대루에서 보는 풍경이 한국의 서원 건축 중 으뜸으로 꼽힌다.',
    story:
      '병산서원은 1572년 서애 류성룡(1542-1607)이 후학을 가르치던 풍악서당이 시초로, 1620년 류성룡과 그의 아들 류진을 배향하면서 서원으로 자리잡았다. 만대루(晩對樓)에서 바라보는 낙동강과 병산의 절경이 유명하며, 2019년 한국의 서원 9곳 중 하나로 유네스코 세계유산에 등재되었다.',
    visits: 412,
    nearbyStamps: 1,
    quiz: null,
  },
  {
    id: 'oksan-seowon',
    name: '옥산서원',
    region: '경북 경주',
    era: '조선',
    distance: 0,
    coords: { x: 53, y: 48 },
    lat: 35.9608,
    lon: 129.25,
    accent: '#7A6450',
    tag: '유네스코',
    period: '1572년',
    summary:
      '회재 이언적을 기리며 1572년에 세워진 서원. 그가 만년에 학문을 닦던 독락당 옆에 자리한다.',
    story:
      '옥산서원은 회재 이언적(1491-1553)을 배향하기 위해 1572년 경주부윤 이제민이 사림과 함께 세웠다. 이언적이 만년에 거처하며 학문을 닦던 독락당 곁에 자리하며, 1574년 사액을 받았다. 2019년 한국의 서원 9곳 중 하나로 유네스코 세계유산에 등재되었다.',
    visits: 198,
    nearbyStamps: 0,
    quiz: null,
  },
  {
    id: 'dodong-seowon',
    name: '도동서원',
    region: '대구 달성',
    era: '조선',
    distance: 0,
    coords: { x: 53, y: 42 },
    lat: 35.6479,
    lon: 128.5283,
    accent: '#7A6450',
    tag: '유네스코',
    period: '1605년',
    summary:
      '한훤당 김굉필을 배향한 서원. 낙동강을 바라보는 위치와 정연한 건축 배치가 유명하다.',
    story:
      '도동서원은 조선 초기 사림파 거두 한훤당 김굉필(1454-1504)을 배향하기 위해 1605년 사림과 지역민이 세웠다. 본래 1568년 비슬산 자락에 세워진 쌍계서원이 임진왜란으로 소실되자 현 위치에 다시 지어진 것이다. 2019년 한국의 서원 9곳 중 하나로 유네스코 세계유산에 등재되었다.',
    visits: 154,
    nearbyStamps: 0,
    quiz: null,
  },
  // ─── 조선의 한옥마을 토픽 ───
  {
    id: 'andong-hahoe-village',
    name: '안동 하회마을',
    region: '경북 안동',
    era: '조선',
    distance: 0,
    coords: { x: 49, y: 38 },
    lat: 36.5392,
    lon: 128.5167,
    accent: '#8B6F47',
    tag: '유네스코',
    period: '약 600년',
    summary:
      "풍산 류씨가 600여 년 동안 세거해 온 한국의 대표적 동성 반촌. 낙동강이 마을을 휘감아 돌아 '하회'라는 이름을 얻었다.",
    story:
      "안동 하회마을은 풍산 류씨가 14세기 후반부터 정착해 600여 년 동안 세거해 온 동성 마을이다. 마을 이름은 낙동강이 휘돌아 흐르는 지형(河回)에서 유래했으며, 서애 류성룡의 종택 '충효당'과 '양진당' 등 보물급 건축이 보존되어 있다. 2010년 경주 양동마을과 함께 '한국의 역사마을'로 유네스코 세계유산에 등재되었다.",
    visits: 1245,
    nearbyStamps: 4,
    quiz: null,
  },
  {
    id: 'gyeongju-yangdong-village',
    name: '경주 양동마을',
    region: '경북 경주',
    era: '조선',
    distance: 0,
    coords: { x: 53, y: 48 },
    lat: 35.9892,
    lon: 129.2967,
    accent: '#8B6F47',
    tag: '유네스코',
    period: '약 600년',
    summary:
      '월성 손씨와 여강 이씨가 함께 일군 한국의 대표적 양반 동성마을. 산자락에 자리한 기와집과 초가가 풍경을 이룬다.',
    story:
      "양동마을은 15세기 중반 경주 손씨 가문과 여강 이씨 가문이 정착하면서 형성된 양반 동성마을이다. 마을 안에 보물·국가민속문화재 수십 점이 자리하며, 손씨 종택 '서백당'과 이씨 종택 '무첨당' 등이 대표적이다. 2010년 안동 하회마을과 함께 유네스코 세계유산에 등재되었다.",
    visits: 678,
    nearbyStamps: 2,
    quiz: null,
  },
  {
    id: 'jeonju-hanok-village',
    name: '전주 한옥마을',
    region: '전북 전주',
    era: '근현대',
    distance: 0,
    coords: { x: 37, y: 53 },
    lat: 35.816,
    lon: 127.1535,
    accent: '#8B6F47',
    tag: '관광특구',
    period: '1930년대~',
    summary:
      '일제강점기 일본인 상권에 맞서 조선인들이 한옥을 지으며 형성된 마을. 현재 700여 채의 한옥이 모여 있다.',
    story:
      '전주 한옥마을은 일제강점기인 1930년대, 일본인이 전주성 안에 자리잡고 상권을 장악하자 이에 맞서 조선인들이 교동·풍남동 일대에 한옥을 짓기 시작하면서 형성되었다. 현재 700여 채의 전통 한옥이 밀집해 있으며, 경기전·전동성당 등 역사 건축과 함께 한국의 대표적 한옥 보존지로 자리매김했다.',
    visits: 2104,
    nearbyStamps: 7,
    quiz: null,
  },
];

export const STAMPED: string[] = ['daedongbeop-bi', 'hyeonchungsa', 'dokrip-hall'];
