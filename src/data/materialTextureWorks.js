// Material & Texture 模块作品数据配置

// 艺术媒介分类映射
export const MEDIA_CATEGORIES = {
  '板绘': ['板绘1', '板绘2', '板绘3', '板绘4', '板绘5'],
  '水彩': ['水彩1', '水彩2'],
  '色粉': ['色粉1', '色粉2', '色粉3', '色粉4', '色粉5']
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

// 获取所有媒介类型
export const getAllMediaTypes = () => {
  return Object.keys(MEDIA_CATEGORIES);
};

// 判断图片比例类型
export const getAspectType = (width, height) => {
  const ratio = height / width;
  if (ratio > 1.1) return 'portrait'; // 长图
  if (ratio < 0.9) return 'landscape'; // 宽图
  return 'square'; // 正方形
};

// 筛选作品
export const filterWorks = (works, mediaTypes, aspectType) => {
  return works.filter(work => {
    const mediaMatch = mediaTypes.includes(work.media);
    const aspectMatch = work.aspectType === aspectType;
    return mediaMatch && aspectMatch;
  });
};

// 作品数据配置
export const materialTextureWorks = [
  // 板绘1 (2张)
  {
    id: 1,
    title: '板绘·01',
    category: '板绘1',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘1/page_032_img_001 1.png',
    aspectType: 'landscape'
  },
  {
    id: 2,
    title: '板绘·02',
    category: '板绘1',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘1/page_032_img_002 1.png',
    aspectType: 'landscape'
  },

  // 板绘2 (4张)
  {
    id: 3,
    title: '板绘·03',
    category: '板绘2',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘2/page_031_img_001 1.png',
    aspectType: 'portrait'
  },
  {
    id: 4,
    title: '板绘·04',
    category: '板绘2',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘2/page_031_img_002 1.png',
    aspectType: 'portrait'
  },
  {
    id: 5,
    title: '板绘·05',
    category: '板绘2',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘2/page_031_img_003 1.png',
    aspectType: 'portrait'
  },
  {
    id: 6,
    title: '板绘·06',
    category: '板绘2',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘2/page_031_img_004 1.png',
    aspectType: 'portrait'
  },

  // 板绘3 (3张)
  {
    id: 7,
    title: '板绘·07',
    category: '板绘3',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘3/Frame 1.png',
    aspectType: 'square'
  },
  {
    id: 8,
    title: '板绘·08',
    category: '板绘3',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘3/Frame 2.png',
    aspectType: 'square'
  },
  {
    id: 9,
    title: '板绘·09',
    category: '板绘3',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘3/Frame 3.png',
    aspectType: 'square'
  },

  // 板绘4 (6张)
  {
    id: 10,
    title: '板绘·10',
    category: '板绘4',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘4/36bd3a013963b79074c4dc8aae4a1857 1.png',
    aspectType: 'portrait'
  },
  {
    id: 11,
    title: '板绘·11',
    category: '板绘4',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘4/page_026_img_001 2.png',
    aspectType: 'portrait'
  },
  {
    id: 12,
    title: '板绘·12',
    category: '板绘4',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘4/page_027_img_001 1.png',
    aspectType: 'portrait'
  },
  {
    id: 13,
    title: '板绘·13',
    category: '板绘4',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘4/page_027_img_002 1.png',
    aspectType: 'portrait'
  },
  {
    id: 14,
    title: '板绘·14',
    category: '板绘4',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘4/page_030_img_002 1.png',
    aspectType: 'portrait'
  },
  {
    id: 15,
    title: '板绘·15',
    category: '板绘4',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘4/page_030_img_003 1.png',
    aspectType: 'square'
  },

  // 板绘5 (3张)
  {
    id: 16,
    title: '板绘·16',
    category: '板绘5',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘5/page_028_img_002 2.png',
    aspectType: 'landscape'
  },
  {
    id: 17,
    title: '板绘·17',
    category: '板绘5',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘5/page_029_img_001 1.png',
    aspectType: 'portrait'
  },
  {
    id: 18,
    title: '板绘·18',
    category: '板绘5',
    media: '板绘',
    year: '2023',
    image: '/gallery/material-texture/板绘5/page_029_img_002 1.png',
    aspectType: 'portrait'
  },

  // 水彩1 (3张)
  {
    id: 19,
    title: '水彩·01',
    category: '水彩1',
    media: '水彩',
    year: '2023',
    image: '/gallery/material-texture/水彩1/0de09011f263522b47d3b6677117c821 1.png',
    aspectType: 'landscape'
  },
  {
    id: 20,
    title: '水彩·02',
    category: '水彩1',
    media: '水彩',
    year: '2023',
    image: '/gallery/material-texture/水彩1/Group 1.png',
    aspectType: 'landscape'
  },
  {
    id: 21,
    title: '水彩·03',
    category: '水彩1',
    media: '水彩',
    year: '2023',
    image: '/gallery/material-texture/水彩1/page_020_img_004 1.png',
    aspectType: 'landscape'
  },

  // 水彩2 (4张)
  {
    id: 22,
    title: '水彩·04',
    category: '水彩2',
    media: '水彩',
    year: '2023',
    image: '/gallery/material-texture/水彩2/page_020_img_005 1.png',
    aspectType: 'landscape'
  },
  {
    id: 23,
    title: '水彩·05',
    category: '水彩2',
    media: '水彩',
    year: '2023',
    image: '/gallery/material-texture/水彩2/page_020_img_006 1.png',
    aspectType: 'landscape'
  },
  {
    id: 24,
    title: '水彩·06',
    category: '水彩2',
    media: '水彩',
    year: '2023',
    image: '/gallery/material-texture/水彩2/page_020_img_007 1.png',
    aspectType: 'landscape'
  },
  {
    id: 25,
    title: '水彩·07',
    category: '水彩2',
    media: '水彩',
    year: '2023',
    image: '/gallery/material-texture/水彩2/page_020_img_008 1.png',
    aspectType: 'landscape'
  },

  // 色粉1 (2张)
  {
    id: 26,
    title: '色粉·01',
    category: '色粉1',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉1/49b83a7852b303fb3d41c666156363a2 1.png',
    aspectType: 'landscape'
  },
  {
    id: 27,
    title: '色粉·02',
    category: '色粉1',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉1/eaa497469ef581d674e0ee0d3b48e34a 1.png',
    aspectType: 'landscape'
  },

  // 色粉2 (6张)
  {
    id: 28,
    title: '色粉·03',
    category: '色粉2',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉2/8d2017f01669c92079156960e9598508 1.png',
    aspectType: 'portrait'
  },
  {
    id: 29,
    title: '色粉·04',
    category: '色粉2',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉2/ede8252c7989284c475d20a8899eceb4 1.png',
    aspectType: 'portrait'
  },
  {
    id: 30,
    title: '色粉·05',
    category: '色粉2',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉2/page_023_img_003 1.png',
    aspectType: 'portrait'
  },
  {
    id: 31,
    title: '色粉·06',
    category: '色粉2',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉2/page_024_img_001 1.png',
    aspectType: 'portrait'
  },
  {
    id: 32,
    title: '色粉·07',
    category: '色粉2',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉2/page_024_img_002 1.png',
    aspectType: 'portrait'
  },
  {
    id: 33,
    title: '色粉·08',
    category: '色粉2',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉2/page_024_img_003 1.png',
    aspectType: 'portrait'
  },

  // 色粉3 (6张)
  {
    id: 34,
    title: '色粉·09',
    category: '色粉3',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉3/1c80af0c03daccb5cd4ac15343cb15b2 1.png',
    aspectType: 'portrait'
  },
  {
    id: 35,
    title: '色粉·10',
    category: '色粉3',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉3/page_019_img_001 1.png',
    aspectType: 'portrait'
  },
  {
    id: 36,
    title: '色粉·11',
    category: '色粉3',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉3/page_022_img_001 1.png',
    aspectType: 'portrait'
  },
  {
    id: 37,
    title: '色粉·12',
    category: '色粉3',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉3/page_022_img_003 1.png',
    aspectType: 'portrait'
  },
  {
    id: 38,
    title: '色粉·13',
    category: '色粉3',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉3/page_022_img_004 1.png',
    aspectType: 'portrait'
  },
  {
    id: 39,
    title: '色粉·14',
    category: '色粉3',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉3/page_023_img_001 1.png',
    aspectType: 'portrait'
  },

  // 色粉4 (4张)
  {
    id: 40,
    title: '色粉·15',
    category: '色粉4',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉4/page_021_img_001 1.png',
    aspectType: 'portrait'
  },
  {
    id: 41,
    title: '色粉·16',
    category: '色粉4',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉4/page_023_img_002 1.png',
    aspectType: 'portrait'
  },
  {
    id: 42,
    title: '色粉·17',
    category: '色粉4',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉4/page_023_img_004 1.png',
    aspectType: 'portrait'
  },
  {
    id: 43,
    title: '色粉·18',
    category: '色粉4',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉4/page_024_img_004 1.png',
    aspectType: 'portrait'
  },

  // 色粉5 (6张)
  {
    id: 44,
    title: '色粉·19',
    category: '色粉5',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉5/page_025_img_001 1.png',
    aspectType: 'landscape'
  },
  {
    id: 45,
    title: '色粉·20',
    category: '色粉5',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉5/page_025_img_002 1.png',
    aspectType: 'landscape'
  },
  {
    id: 46,
    title: '色粉·21',
    category: '色粉5',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉5/page_025_img_003 1.png',
    aspectType: 'landscape'
  },
  {
    id: 47,
    title: '色粉·22',
    category: '色粉5',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉5/page_025_img_004 1.png',
    aspectType: 'landscape'
  },
  {
    id: 48,
    title: '色粉·23',
    category: '色粉5',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉5/page_025_img_005 1.png',
    aspectType: 'landscape'
  },
  {
    id: 49,
    title: '色粉·24',
    category: '色粉5',
    media: '色粉',
    year: '2023',
    image: '/gallery/material-texture/色粉5/page_025_img_006 1.png',
    aspectType: 'landscape'
  }
];
