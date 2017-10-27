var sc = sc || {};

sc.assets = {
    url: 'assets/',
    images: [
        'image/club-luck-1.jpg',
        'image/club-luck-2.jpg',
        'image/bg-raffle.jpg',
        'image/bg-raffle.jpg',
        'image/gift-1.png',
        'image/gift-2.png',
        'image/gift-3.png',
        'image/gift-4.png',
        'image/form-active.png',
        'image/test-btn.png',
        'image/test-btn2.png',
        'image/xz-luck-point',
        'image/xz-luck-point2',
    ]
};

sc.ftmsFormOptions = {
    buyCarTimes: [
        '1周内',
        '1个月内',
        '1-3个月',
        '3-6个月',
        '6个月以上',
        '已购车'
    ],
    haveCars: [
        '全新COROLLA卡罗拉',
        'CROWN皇冠',
        'REIZ锐志',
        'COROLLA EX花冠',
        '全新VIOS威驰',
        '全新RAV4荣放',
        'LC200兰德酷路泽',
        'PRADO普拉多',
        'COASTER柯斯达',
        'HIACE',
        'TOYOTA86',
        'PREVIA普瑞维亚',
        'COROLLA HYBRID卡罗拉双擎',
        'PRIUS普锐斯',
        '威驰FS',
        // { type: '轿车', name: '新COROLLA卡罗拉' },
        // { type: '轿车', name: 'CROWN皇冠', },
        // { type: '轿车', name: 'REIZ锐志', },
        // { type: '轿车', name: 'COROLLA EX花冠', },
        // { type: '轿车', name: '全新VIOS威驰', },
        // { type: '一汽丰田双擎', name: 'PRIUS普锐斯', },
        // { type: '一汽丰田双擎', name: '卡罗拉双擎', },
        // { type: 'SUV', name: '全新RAV4荣放', },
        // { type: 'SUV', name: 'LC200兰德酷路泽', },
        // { type: 'SUV', name: 'PRADO普拉多', },
        // { type: '中型客车', name: 'COASTER柯斯达', },
        // { type: '原装进口', name: 'TOYOTA86', },
        // { type: '原装进口', name: 'PREVIA普瑞维亚', },
        // { type: '原装进口', name: 'HIACE', },
        // { type: '其他', name: '其他' }
    ],
    carId: [6, 30, 5, 7, 8, 9, 10, 11, 12, 25, 26, 27, 28, 29, 31]
};
//经销商列表
var province_arr = ["上海", "云南", "内蒙古", "北京", "吉林", "四川", "天津", "宁夏", "安徽", "山东", "山西", "广东", "广西", "新疆", "江苏", "江西", "河北", "河南", "浙江", "海南", "湖北", "湖南", "甘肃", "福建", "西藏", "贵州", "辽宁", "重庆", "陕西", "青海", "黑龙江"];

var city_arr = [
    ["上海"],
    ["临沧", "丽江", "保山", "大理", "文山", "昆明", "昭通", "曲靖", "楚雄", "玉溪", "红河"],
    ["乌兰浩特", "乌海", "包头", "呼伦贝尔", "呼和浩特", "巴彦淖尔", "赤峰", "通辽", "鄂尔多斯", "锡林浩特", "霍林郭勒"],
    ["北京"],
    ["吉林", "四平", "延吉", "松原", "辽源", "通化", "长春"],
    ["乐山", "凉山彝族自治州", "南充", "宜宾", "巴中", "广元", "成都", "泸州", "眉山", "绵阳", "自贡", "达州", "遂宁"],
    ["天津"],
    ["回族自治区", "银川"],
    ["亳州", "六安", "合肥", "安庆", "宣城", "宿州", "滁州", "芜湖", "蚌埠", "铜陵", "阜阳"],
    ["东营", "临沂", "威海", "广饶", "德州", "日照", "枣庄", "泰安", "济南", "济宁", "济阳", "淄博", "滨州", "潍坊", "烟台", "聊城", "莱西", "菏泽", "青岛", "高密"],
    ["临汾", "吕梁", "大同", "太原", "忻州", "晋中", "晋城", "朔州", "河津", "运城", "长治", "阳泉"],
    ["东莞", "中山", "乐昌", "云浮", "从化", "佛山", "兴宁", "广州", "开平", "惠州", "揭阳", "普宁", "梅州", "汕头", "汕尾", "江门", "河源", "深圳", "清远", "湛江", "潮州", "珠海", "肇庆", "茂名", "阳春", "阳江", "韶关"],
    ["北海", "南宁", "崇左", "广西壮族自治区", "柳州", "桂林", "梧州", "河池", "玉林", "百色", "贵港", "贺州", "钦州", "防城港"],
    ["乌鲁木齐", "伊宁", "克拉玛依", "哈密地区", "库尔勒", "昌吉", "维吾尔自治区", "阿克苏"],
    ["丹阳", "南京", "南通", "吴江", "太仓", "如皋", "宜兴", "宿迁", "常州", "常熟", "张家港", "徐州", "扬州", "无锡", "昆山", "江阴", "泰州", "海安", "淮安", "溧水", "溧阳", "盐城", "苏州", "连云港", "金坛", "镇江"],
    ["上饶", "九江", "南昌", "吉安", "宜春", "抚州", "新余", "景德镇", "萍乡", "赣州", "鹰潭"],
    ["保定", "唐山", "廊坊", "张家口", "承德", "沧州", "石家庄", "秦皇岛", "衡水", "辛集", "遵化", "邢台", "邯郸"],
    ["三门峡", "信阳", "南阳", "周口", "商丘", "安阳", "平顶山", "开封", "新乡", "洛阳", "漯河", "濮阳", "焦作", "登封", "西峡", "许昌", "郑州", "驻马店", "鹤壁"],
    ["上虞", "丽水", "义乌", "乐清", "余姚", "台州", "嘉兴", "宁波", "安吉", "平湖", "慈溪", "杭州", "海宁", "温岭", "温州", "湖州", "瑞安", "绍兴", "舟山", "衢州", "诸暨", "金华"],
    ["三亚", "屯昌", "文昌", "海口", "琼海"],
    ["仙桃", "十堰", "咸宁", "孝感", "安徽", "宜昌", "恩施", "武汉", "潜江", "荆州", "荆门", "襄阳", "鄂州", "随州", "黄冈", "黄石"],
    ["娄底", "岳阳", "常德", "张家界", "怀化", "攸县", "株洲", "永州", "湘潭", "益阳", "耒阳", "衡阳", "邵阳", "郴州", "长沙"],
    ["兰州", "天水", "定西", "平凉", "庆阳", "张掖", "武威", "白银", "酒泉"],
    ["三明", "南平", "厦门", "宁德", "晋江", "泉州", "漳州", "石狮", "福州", "福清", "莆田", "龙岩"],
    ["拉萨", "日喀则"],
    ["六盘水", "兴义", "安顺", "毕节", "贵阳", "遵义", "都匀", "黔东南苗族侗族自治州"],
    ["丹东", "大连", "庄河", "抚顺", "新民", "朝阳", "本溪", "沈阳", "盘锦", "营口", "葫芦岛", "辽阳", "铁岭", "锦州", "阜新", "鞍山"],
    ["重庆"],
    ["商洛", "安康", "宝鸡", "延安", "榆林", "汉中", "渭南", "航天基地", "西安"],
    ["格尔木", "西宁"],
    ["七台河", "五常", "佳木斯", "加格达奇", "双鸭山", "哈尔滨", "大庆", "牡丹江", "绥化", "鸡西", "鹤岗", "黑河", "齐齐哈尔"]
];


sc.particlesystem = {
    title: 'Particle System',
    default: {
        enabled: true,
        autoPlay: false,
        numParticles: 20,
        lifetime: 2,
        rate: 0.1,
        rate2: 0.1,
        startAngle: 0,
        startAngle2: 0,
        loop: true,
        preWarm: false,
        lighting: false,
        halfLambert: false,
        intensity: 1,
        depthWrite: false,
        depthSoftening: 0,
        sort: 0,
        blendType: 2,
        stretch: 0,
        alignToMotion: false,
        emitterShape: 0,
        emitterExtents: [3, 8, 3],
        emitterRadius: 0,
        initialVelocity: 0,
        animTilesX: 1,
        animTilesY: 1,
        animNumFrames: 1,
        animSpeed: 1,
        animLoop: true,
        wrap: false,
        wrapBounds: [0, 0, 0],
        colorMapAsset: null,
        normalMapAsset: null,
        mesh: null,
        localVelocityGraph: {
            type: 1,
            keys: [
                [0, 0],
                [0, 0],
                [0, 0]
            ],
            betweenCurves: false
        },
        localVelocityGraph2: {
            type: 1,
            keys: [
                [0, 0],
                [0, 0],
                [0, 0]
            ]
        },
        velocityGraph: {
            type: 1,
            keys: [
                [0, 0],
                [0, 3],
                [0, 0]
            ],
            betweenCurves: true
        },
        velocityGraph2: {
            type: 1,
            keys: [
                [0, 0],
                [0, 0],
                [0, 0]
            ]
        },
        rotationSpeedGraph: {
            type: 1,
            keys: [0, 0],
            betweenCurves: false
        },
        rotationSpeedGraph2: {
            type: 1,
            keys: [0, 0]
        },
        scaleGraph: {
            type: 1,
            keys: [0, 0, 0.5, 0.3, 1, 0],
            betweenCurves: false
        },
        scaleGraph2: {
            type: 1,
            keys: [0, 0]
        },
        colorGraph: {
            type: 1,
            keys: [
                [0, 1],
                [0, 1],
                [0, 1]
            ],
            betweenCurves: false
        },
        alphaGraph: {
            type: 1,
            keys: [0, 0, 0.5, 1, 0.9, 0],
            betweenCurves: false
        },
        alphaGraph2: {
            type: 1,
            keys: [0, 1]
        }
    },
    types: {
        emitterExtents: 'vec3',
        localVelocityGraph: 'curveset',
        localVelocityGraph2: 'curveset',
        velocityGraph: 'curveset',
        velocityGraph2: 'curveset',
        rotationSpeedGraph: 'curve',
        rotationSpeedGraph2: 'curve',
        scaleGraph: 'curve',
        scaleGraph2: 'curve',
        colorGraph: 'curveset',
        alphaGraph: 'curve',
        alphaGraph2: 'curve'
    }
};