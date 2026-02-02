// Form & Structure 模块作品数据配置
// 艺术媒介分类映射
export const MEDIA_CATEGORIES = {
  '国画': ['写意人物', '小写意山水', '小写意花鸟', '工笔', '白描', '白描风景', '绢本组图'],
  '素描': ['素描'],
  '水彩': ['水彩'],
  '版画': ['版画'],
  '雕塑': ['雕塑'],
  '构成': ['平面构成', '立体', '画面构成分析', '材料探索', '综合材料']
};

// 反向映射：从细分类别获取主媒介
export const getCategoryMedia = (category) => {
  for (const [media, categories] of Object.entries(MEDIA_CATEGORIES)) {
    if (categories.includes(category)) {
      return media;
    }
  }
  return '其他';
};

// 判断图片比例类型
// portrait: 长图 (height > width)
// landscape: 宽图 (width > height)  
// square: 正方形 (差异 < 10%)
export const getAspectType = (width, height) => {
  const ratio = height / width;
  if (ratio > 1.1) return 'portrait'; // 长图
  if (ratio < 0.9) return 'landscape'; // 宽图
  return 'square'; // 正方形
};

// 作品数据配置
// 每个作品包含：id, title, category(细分类别), media(主媒介), year, image(路径), aspectType(比例类型)
export const formStructureWorks = [
  // 写意人物 (6张)
  {
    id: 1,
    title: '写意人物·01',
    category: '写意人物',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/写意人物/1980e311c0578010fba5f0cd698e27cc 1.png',
    aspectType: 'portrait'
  },
  {
    id: 2,
    title: '写意人物·02',
    category: '写意人物',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/写意人物/2839374d974dc66c01ccfe4ac1265326 1.png',
    aspectType: 'portrait'
  },
  {
    id: 3,
    title: '写意人物·03',
    category: '写意人物',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/写意人物/page_005_img_001 1.png',
    aspectType: 'portrait'
  },
  {
    id: 4,
    title: '写意人物·04',
    category: '写意人物',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/写意人物/page_005_img_002 1.png',
    aspectType: 'portrait'
  },
  {
    id: 5,
    title: '写意人物·05',
    category: '写意人物',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/写意人物/page_005_img_003 1.png',
    aspectType: 'portrait'
  },
  {
    id: 6,
    title: '写意人物·06',
    category: '写意人物',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/写意人物/page_005_img_004 1.png',
    aspectType: 'portrait'
  },

  // 小写意山水 (3张)
  {
    id: 7,
    title: '小写意山水·01',
    category: '小写意山水',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/小写意山水/page_007_img_001 1.png',
    aspectType: 'portrait' // 679×1400 (2.06)
  },
  {
    id: 8,
    title: '小写意山水·02',
    category: '小写意山水',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/小写意山水/page_008_img_001 1.png',
    aspectType: 'portrait' // 683×1400 (2.05)
  },
  {
    id: 9,
    title: '小写意山水·03',
    category: '小写意山水',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/小写意山水/page_009_img_001 1.png',
    aspectType: 'square' // 1452×1400 (0.96)
  },

  // 小写意花鸟 (3张)
  {
    id: 10,
    title: '小写意花鸟·01',
    category: '小写意花鸟',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/小写意花鸟/page_011_img_001 1.png',
    aspectType: 'landscape' // 1470×1000 (0.68)
  },
  {
    id: 11,
    title: '小写意花鸟·02',
    category: '小写意花鸟',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/小写意花鸟/page_011_img_002 1.png',
    aspectType: 'landscape' // 1508×1000 (0.66)
  },
  {
    id: 12,
    title: '小写意花鸟·03',
    category: '小写意花鸟',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/小写意花鸟/page_011_img_003 1.png',
    aspectType: 'landscape' // 1496×1000 (0.67)
  },

  // 工笔 (1张)
  {
    id: 13,
    title: '工笔研究',
    category: '工笔',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/工笔/page_003_img_001 1.png',
    aspectType: 'portrait'
  },

  // 平面构成 (3张)
  {
    id: 14,
    title: '平面构成·01',
    category: '平面构成',
    media: '构成',
    year: '2022',
    image: '/gallery/form-structure/平面构成/69ccb39ffafd3e0d52da2177c788dc3b 1.png',
    aspectType: 'landscape' // 1400×1000 (0.71)
  },
  {
    id: 15,
    title: '平面构成·02',
    category: '平面构成',
    media: '构成',
    year: '2022',
    image: '/gallery/form-structure/平面构成/135963c693f7d1662291172b3c8a1dfb 1.png',
    aspectType: 'landscape' // 1335×1000 (0.75)
  },
  {
    id: 16,
    title: '平面构成·03',
    category: '平面构成',
    media: '构成',
    year: '2022',
    image: '/gallery/form-structure/平面构成/ead6b7945c750c541914e306b2a15985 1.png',
    aspectType: 'landscape' // 1435×1000 (0.70)
  },

  // 材料探索 (5张)
  {
    id: 17,
    title: '材料探索·01',
    category: '材料探索',
    media: '构成',
    year: '2022',
    image: '/gallery/form-structure/材料探索/8ad2b63747ce5744551d213df204dd51 1.png',
    aspectType: 'portrait' // 971×1400 (1.44)
  },
  {
    id: 18,
    title: '材料探索·02',
    category: '材料探索',
    media: '构成',
    year: '2022',
    image: '/gallery/form-structure/材料探索/47ca46a1900af65e8761ab875908cfd1 1.png',
    aspectType: 'portrait' // 998×1400 (1.40)
  },
  {
    id: 19,
    title: '材料探索·03',
    category: '材料探索',
    media: '构成',
    year: '2022',
    image: '/gallery/form-structure/材料探索/57d1dc58926d60180e63ed9a33e957b7 1.png',
    aspectType: 'portrait' // 1184×1400 (1.18)
  },
  {
    id: 20,
    title: '材料探索·04',
    category: '材料探索',
    media: '构成',
    year: '2022',
    image: '/gallery/form-structure/材料探索/page_017_img_001 1.png',
    aspectType: 'portrait'
  },
  {
    id: 21,
    title: '材料探索·05',
    category: '材料探索',
    media: '构成',
    year: '2022',
    image: '/gallery/form-structure/材料探索/page_018_img_001 1.png',
    aspectType: 'portrait'
  },

  // 水彩 (1张)
  {
    id: 22,
    title: '水彩写生',
    category: '水彩',
    media: '水彩',
    year: '2023',
    image: '/gallery/form-structure/水彩/747343f950453f98153db9ad6cd6de66 1.png',
    aspectType: 'landscape' // 1952×1400 (0.72)
  },

  // 版画 (2张)
  {
    id: 23,
    title: '版画·01',
    category: '版画',
    media: '版画',
    year: '2022',
    image: '/gallery/form-structure/版画/page_012_img_001 1.png',
    aspectType: 'portrait'
  },
  {
    id: 24,
    title: '版画·02',
    category: '版画',
    media: '版画',
    year: '2022',
    image: '/gallery/form-structure/版画/page_014_img_001 1.png',
    aspectType: 'portrait'
  },

  // 画面构成分析 (2张)
  {
    id: 25,
    title: '画面构成分析·01',
    category: '画面构成分析',
    media: '构成',
    year: '2023',
    image: '/gallery/form-structure/画面构成分析/page_104_img_001 1.png',
    aspectType: 'landscape'
  },
  {
    id: 26,
    title: '画面构成分析·02',
    category: '画面构成分析',
    media: '构成',
    year: '2023',
    image: '/gallery/form-structure/画面构成分析/page_105_img_001 1.png',
    aspectType: 'landscape'
  },

  // 白描 (3张)
  {
    id: 27,
    title: '白描·01',
    category: '白描',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/白描/2eb15c89dbc51e94434371f1bc41c97d 1.png',
    aspectType: 'portrait'
  },
  {
    id: 28,
    title: '白描·02',
    category: '白描',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/白描/7b193eda34e9bb3b41cef662fcc4c081 1.png',
    aspectType: 'portrait'
  },
  {
    id: 29,
    title: '白描·03',
    category: '白描',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/白描/97aab837bf592b42b026d83fbb0079da 1.png',
    aspectType: 'portrait'
  },

  // 白描风景 (1张)
  {
    id: 30,
    title: '白描风景',
    category: '白描风景',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/白描风景/b9c9922bde6c8d420ac69e1f8d7c89ff 1.png',
    aspectType: 'landscape'
  },

  // 立体 (3张)
  {
    id: 31,
    title: '立体构成·01',
    category: '立体',
    media: '构成',
    year: '2022',
    image: '/gallery/form-structure/立体/page_016_img_001 2.png',
    aspectType: 'square' // 1291×1400 (1.08)
  },
  {
    id: 32,
    title: '立体构成·02',
    category: '立体',
    media: '构成',
    year: '2022',
    image: '/gallery/form-structure/立体/page_016_img_002 2.png',
    aspectType: 'portrait' // 912×1400 (1.54)
  },
  {
    id: 33,
    title: '立体构成·03',
    category: '立体',
    media: '构成',
    year: '2022',
    image: '/gallery/form-structure/立体/page_016_img_003 1.png',
    aspectType: 'portrait' // 809×1400 (1.73)
  },

  // 素描 (2张)
  {
    id: 34,
    title: '素描·01',
    category: '素描',
    media: '素描',
    year: '2023',
    image: '/gallery/form-structure/素描/1a06be171899cd5273652d74f381617d 1.png',
    aspectType: 'portrait'
  },
  {
    id: 35,
    title: '素描·02',
    category: '素描',
    media: '素描',
    year: '2023',
    image: '/gallery/form-structure/素描/A4 - 1.png',
    aspectType: 'portrait'
  },

  // 绢本组图 (1张)
  {
    id: 36,
    title: '绢本组图',
    category: '绢本组图',
    media: '国画',
    year: '2023',
    image: '/gallery/form-structure/绢本组图/page_010_img_002 2.png',
    aspectType: 'landscape' // 1615×1400 (0.87)
  },

  // 综合材料 (2张)
  {
    id: 37,
    title: '综合材料·01',
    category: '综合材料',
    media: '构成',
    year: '2022',
    image: '/gallery/form-structure/综合材料/page_015_img_001 1.png',
    aspectType: 'portrait'
  },
  {
    id: 38,
    title: '综合材料·02',
    category: '综合材料',
    media: '构成',
    year: '2022',
    image: '/gallery/form-structure/综合材料/page_015_img_002 1.png',
    aspectType: 'portrait'
  },

  // 雕塑 (1张)
  {
    id: 39,
    title: '雕塑作品',
    category: '雕塑',
    media: '雕塑',
    year: '2022',
    image: '/gallery/form-structure/雕塑/page_059_img_001 2.png',
    aspectType: 'landscape' // 1331×1000 (0.75)
  }
];

// 获取所有媒介类别
export const getAllMediaTypes = () => Object.keys(MEDIA_CATEGORIES);

// 根据媒介筛选作品
export const filterByMedia = (works, selectedMedia) => {
  if (selectedMedia.length === 0 || selectedMedia.length === getAllMediaTypes().length) {
    return works; // 全选或不选，返回所有
  }
  return works.filter(work => selectedMedia.includes(work.media));
};

// 根据比例类型筛选作品 (正方形会同时出现在两种模式中)
export const filterByAspectType = (works, aspectType) => {
  if (aspectType === 'portrait') {
    return works.filter(work => work.aspectType === 'portrait' || work.aspectType === 'square');
  } else if (aspectType === 'landscape') {
    return works.filter(work => work.aspectType === 'landscape' || work.aspectType === 'square');
  }
  return works;
};

// 组合筛选
export const filterWorks = (works, selectedMedia, aspectType) => {
  let filtered = filterByMedia(works, selectedMedia);
  filtered = filterByAspectType(filtered, aspectType);
  return filtered;
};
