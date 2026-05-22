export type ArtifactFact = { label: string; value: string };

export type Artifact = {
  id: string;
  name: string;
  nameHanja: string;
  designation: string;
  category: string;
  period: string;
  placeId: string;
  accent: string;
  summary: string;
  story: string;
  facts: ArtifactFact[];
};

export const ARTIFACTS: Artifact[] = [
  {
    id: 'dabotap',
    name: '다보탑',
    nameHanja: '多寶塔',
    designation: '국보 제20호',
    category: '석탑',
    period: '통일신라 8세기',
    placeId: 'bulguksa',
    accent: '#C8442A',
    summary: '불국사 대웅전 앞 쌍탑 중 동쪽 탑. 통일신라 석탑 예술의 최고봉.',
    story:
      "다보탑은 통일신라 경덕왕 10년(751) 김대성이 불국사를 창건하면서 석가탑과 함께 세운 쌍탑이다. '법화경'에 나오는 다보여래의 상주증명(常住證明)을 형상화한 것으로, 일반적인 석탑 양식에서 벗어난 매우 독특한 구조를 가졌다. 사면에 계단을 두고 사방불의 의미를 담았으며, 한국 화폐 10원 동전 뒷면의 도안으로 친숙하다.",
    facts: [
      { label: '높이', value: '10.4m' },
      { label: '재료', value: '화강암' },
      { label: '함께', value: '석가탑 (국보 21호)' },
      { label: '소재', value: '경북 경주 불국사' },
    ],
  },
  {
    id: 'geumdong-hyangno',
    name: '백제금동대향로',
    nameHanja: '百濟金銅大香爐',
    designation: '국보 제287호',
    category: '금속공예',
    period: '백제 6-7세기',
    placeId: 'jeongnimsa',
    accent: '#8B6F47',
    summary: '1993년 부여 능산리 절터에서 발견된 백제 최고 걸작.',
    story:
      '1993년 12월 부여 능산리 절터의 공방지에서 거의 완전한 모습으로 발견되었다. 높이 64cm, 무게 11.85kg의 대형 금동 향로로, 뚜껑에는 74개의 산봉우리와 신선·동물·악사 등 다양한 인물이 정교하게 새겨져 있다. 도교의 신선 사상, 불교의 연꽃, 백제의 음악 문화가 어우러진 백제 미술의 정수로 평가된다.',
    facts: [
      { label: '높이', value: '64cm' },
      { label: '무게', value: '11.85kg' },
      { label: '발견', value: '1993년 12월' },
      { label: '소장', value: '국립부여박물관' },
    ],
  },
  {
    id: 'seokgatap',
    name: '석가탑',
    nameHanja: '釋迦塔',
    designation: '국보 제21호',
    category: '석탑',
    period: '통일신라 751년',
    placeId: 'bulguksa',
    accent: '#5F7A6B',
    summary: "'무영탑(無影塔)' 전설로 유명한 한국 석탑의 표준.",
    story:
      "석가탑은 다보탑과 함께 불국사에 세워진 통일신라의 대표적인 삼층석탑이다. 본래 이름은 '석가여래상주설법탑'이며, 후대에 백제 석공 아사달이 만들었다는 '무영탑(無影塔)' 설화로 더 유명하다. 1966년 보수 과정에서 세계 최고(最古)의 목판인쇄물인 '무구정광대다라니경'이 발견되어 한국 인쇄 문화의 자부심을 보여주었다.",
    facts: [
      { label: '높이', value: '10.75m' },
      { label: '발견 유물', value: '무구정광대다라니경' },
      { label: '별명', value: '무영탑(無影塔)' },
      { label: '소재', value: '경북 경주 불국사' },
    ],
  },
  {
    id: 'geobukseon',
    name: '거북선',
    nameHanja: '龜船',
    designation: '재현 유물',
    category: '병선',
    period: '조선 1592년',
    placeId: 'tongyeong-jeseungdang',
    accent: '#1F3A52',
    summary: '이순신과 나대용이 개량한 돌격용 전선. 임진왜란 해전에서 결정적 역할.',
    story:
      "거북선은 조선 태종 때(1413)의 기록에 이미 '귀선(龜船)'이 등장하나, 이순신과 군관 나대용이 임진왜란 직전 본격적으로 개량·제작했다. 등을 철판으로 덮고 송곳을 박아 적의 등선(登船) 공격을 차단했고, 좌우에 노 16척과 14문의 화포를 갖춰 빠른 기동과 화력을 모두 갖춘 돌격선이었다. 1592년 사천해전에서 처음 실전 투입되어 한산대첩까지 큰 공을 세웠다.",
    facts: [
      { label: '길이', value: '약 30m' },
      { label: '노 수', value: '좌우 각 16척' },
      { label: '화포', value: '14문' },
      { label: '처음 출전', value: '사천해전 (1592)' },
    ],
  },
  {
    id: 'hunminjeongeum',
    name: '훈민정음 해례본',
    nameHanja: '訓民正音 解例本',
    designation: '국보 제70호 · 유네스코',
    category: '서책',
    period: '조선 1446년',
    placeId: 'sejong-grave',
    accent: '#C8442A',
    summary: '세종이 한글 창제 원리를 해설한 책. 유네스코 세계기록유산.',
    story:
      "훈민정음 해례본은 세종 28년(1446) 9월 반포된 책으로, 새 문자 '훈민정음'의 창제 원리와 자모의 모양·소리를 정인지·신숙주 등 집현전 학자들이 해설한 책이다. 본문 '예의편'과 해설 '해례편'으로 구성되며, 1940년 안동에서 발견된 간송본이 국보 제70호로 지정되었다. 1997년 유네스코 세계기록유산으로 등재되어 한글의 학술적 가치를 세계에 알렸다.",
    facts: [
      { label: '반포', value: '1446년 9월' },
      { label: '저술', value: '정인지·신숙주 등' },
      { label: '발견', value: '1940년 안동' },
      { label: '소장', value: '간송미술관' },
    ],
  },
];
