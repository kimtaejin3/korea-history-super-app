export type TimelineEntry = { year: number; event: string };

export type Figure = {
  id: string;
  name: string;
  nameHanja: string;
  title: string;
  titleHanja: string;
  era: string;
  years: string;
  placeIds: string[];
  accent: string;
  glyph: string;
  summary: string;
  story: string;
  timeline: TimelineEntry[];
};

export const FIGURES: Figure[] = [
  {
    id: 'yi-sunsin',
    name: '이순신',
    nameHanja: '李舜臣',
    title: '충무공',
    titleHanja: '忠武公',
    era: '조선 중기',
    years: '1545-1598',
    placeIds: ['hyeonchungsa'],
    accent: '#1F3A52',
    glyph: '忠',
    summary: '임진왜란 23전 23승의 명장. 거북선을 운용하고 난중일기를 남긴 충신.',
    story:
      "이순신은 한양에서 태어나 충남 아산에서 성장했고, 32세에 늦은 무과에 급제했다. 1591년 류성룡의 천거로 전라좌수사가 되어 거북선을 준비했으며, 임진왜란 7년간 23전 23승의 전무후무한 승전으로 조선 수군을 지켰다. 노량해전에서 적탄을 맞고 전사하기 직전 '전쟁이 한창이니 내 죽음을 알리지 말라'는 유언을 남겼다. 그가 남긴 '난중일기'는 유네스코 세계기록유산이다.",
    timeline: [
      { year: 1545, event: '한양 건천동에서 출생' },
      { year: 1576, event: '32세, 무과 급제' },
      { year: 1579, event: '해미읍성 충청병마절도사 군관' },
      { year: 1591, event: '전라좌수사 임명 · 거북선 준비' },
      { year: 1592, event: '임진왜란 발발 · 옥포해전 첫 승전' },
      { year: 1597, event: '명량해전 13척으로 133척 격파' },
      { year: 1598, event: '노량해전에서 전사' },
    ],
  },
  {
    id: 'jeongjo',
    name: '정조',
    nameHanja: '正祖',
    title: '문체반정의 군주',
    titleHanja: '文體反正',
    era: '조선 후기',
    years: '1752-1800',
    placeIds: ['hwaseong'],
    accent: '#C8442A',
    glyph: '正',
    summary: '아버지 사도세자의 비극을 딛고 문예부흥과 개혁을 이끈 22대 왕.',
    story:
      '정조는 사도세자의 아들로 11세에 아버지의 비극을 목격했다. 24세에 즉위해 규장각을 설치하고 인재를 양성했으며, 정약용 등 실학자를 등용해 개혁을 추진했다. 아버지의 능을 화산으로 옮기면서 신도시 수원 화성을 축조했고, 매년 능행차를 통해 백성과 직접 소통했다. 그러나 49세에 의문의 죽음을 맞아 그가 꿈꾼 개혁은 미완으로 남았다.',
    timeline: [
      { year: 1752, event: '사도세자의 아들로 출생' },
      { year: 1762, event: '11세, 아버지 사도세자 임오화변' },
      { year: 1776, event: '24세, 즉위 · 규장각 설치' },
      { year: 1789, event: '사도세자 능을 화산으로 이장' },
      { year: 1796, event: '수원 화성 완공' },
      { year: 1800, event: '갑작스러운 승하' },
    ],
  },
  {
    id: 'kim-yuk',
    name: '김육',
    nameHanja: '金堉',
    title: '백성을 살린 영의정',
    titleHanja: '潛谷',
    era: '조선 후기',
    years: '1580-1658',
    placeIds: ['daedongbeop-bi'],
    accent: '#7A6450',
    glyph: '法',
    summary: '대동법을 충청·전라로 확대 시행한 경세가. 백성의 부담을 덜기 위해 평생을 바쳤다.',
    story:
      '김육은 광해군 시절 향촌에서 농사를 지으며 백성의 고충을 직접 체험했다. 인조반정 후 출사하여 평생 대동법 확대에 매달렸고, 효종 때 영의정에 올라 충청도에 대동법을 시행했다. 임종을 앞두고도 전라도 확대를 효종에게 간곡히 부탁했으며, 그의 사후 1년 만에 평택 소사벌에 대동법 시행기념비가 세워졌다. 백성을 위한 실용 행정의 표본으로 평가된다.',
    timeline: [
      { year: 1580, event: '한양에서 출생' },
      { year: 1623, event: '인조반정 후 출사' },
      { year: 1638, event: '충청감사로 대동법 건의' },
      { year: 1651, event: '영의정 임명 · 충청 대동법 시행' },
      { year: 1658, event: '향년 79세 사망' },
      { year: 1659, event: '평택 소사벌에 시행기념비 건립' },
    ],
  },
  {
    id: 'jeong-yakyong',
    name: '정약용',
    nameHanja: '丁若鏞',
    title: '실학의 집대성',
    titleHanja: '茶山',
    era: '조선 후기',
    years: '1762-1836',
    placeIds: ['hwaseong'],
    accent: '#4F6B5C',
    glyph: '實',
    summary: '500여 권의 저서를 남긴 조선 최대의 실학자. 화성 설계와 거중기 발명의 주역.',
    story:
      "정약용은 정조의 총애를 받아 28세에 문과 급제했고, 1792년 화성 축조 때 거중기와 녹로를 고안해 공기를 4년에서 2년 9개월로 단축시켰다. 정조 사후 신유박해(1801)로 강진에 18년간 유배되었고, 그 기간에 '목민심서', '경세유표', '흠흠신서' 등 500여 권의 저서를 남겼다. 한국 실학을 집대성한 인물로 평가된다.",
    timeline: [
      { year: 1762, event: '경기 광주에서 출생' },
      { year: 1789, event: '28세, 문과 급제' },
      { year: 1792, event: '화성 설계 · 거중기 발명' },
      { year: 1801, event: '신유박해로 강진 유배' },
      { year: 1818, event: '유배 해제 · 18년 만에 귀향' },
      { year: 1836, event: '향년 75세 사망' },
    ],
  },
  {
    id: 'kim-daeseong',
    name: '김대성',
    nameHanja: '金大城',
    title: '두 세계의 효자',
    titleHanja: '兩世孝子',
    era: '통일신라',
    years: '700-774',
    placeIds: [],
    accent: '#8B6F47',
    glyph: '佛',
    summary: '전세의 부모를 위해 석굴암, 현생 부모를 위해 불국사를 창건한 재상.',
    story:
      "'삼국유사'에 따르면 김대성은 통일신라 경덕왕 때의 재상으로, 전세의 가난한 부모를 위해 석굴암을, 현생의 부모를 위해 불국사를 동시에 창건했다고 한다. 751년 두 사찰의 공사를 시작했으나 그가 죽기 전까지 완공하지 못해 국가가 이어받아 774년에 끝마쳤다. 한 사람이 두 세계의 부모를 위해 두 걸작을 동시에 만든 효심의 상징으로 전해진다.",
    timeline: [
      { year: 700, event: '통일신라에서 출생' },
      { year: 745, event: '경덕왕 시기 재상에 오름' },
      { year: 751, event: '불국사·석굴암 동시 창건 시작' },
      { year: 774, event: '74세 사망 · 국가가 공사 인계' },
    ],
  },
];
