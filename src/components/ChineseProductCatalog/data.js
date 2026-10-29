export const groups = [["blikvm", "BliKVM", "远程管理电脑，覆盖接线、网页操作、网络访问和系统维护。"], ["bliswitch", "BliSwitch", "多电脑 HDMI / USB 切换，独立控制与 BliKVM 联动。"], ["capture", "HDMI 采集模块", "CSI 视频采集、I²S 音频与 Linux 平台接入。"], ["atx", "ATX 控制板", "连接主板电源、复位与指示灯信号。"], ["splitter", "USB 电源 / 数据分离器", "分离 Raspberry Pi 4 USB-C 供电与 OTG 数据。"]];
export const products = [{"id": "blikvm-v4", "group": "blikvm", "title": "BliKVM v4", "description": "一体式远程 KVM", "img": "/img/product/blikvm-v4-transp.webp", "manual": "device-guides/BliKVM-v4-guide", "buy": "https://item.taobao.com/item.htm?id=730202747005"}, {"id": "blikvm-v3", "group": "blikvm", "title": "BliKVM v3", "description": "Raspberry Pi 4B HAT", "img": "/img/product/blikvm-v3-transp.webp", "manual": "device-guides/BliKVM-v3-guide", "buy": "https://item.taobao.com/item.htm?id=676852578588"}, {"id": "blikvm-v2", "group": "blikvm", "title": "BliKVM v2", "description": "机箱内 PCIe 形态", "img": "/img/product/blikvm-v2-transp.webp", "manual": "device-guides/BliKVM-v2-guide", "buy": "https://item.taobao.com/item.htm?id=679753758084"}, {"id": "blikvm-v1", "group": "blikvm", "title": "BliKVM v1", "description": "基于 CM4 的远程 KVM", "img": "/img/product/blikvm-v1-transp.webp", "manual": "device-guides/BliKVM-v1-guide", "buy": "https://item.taobao.com/item.htm?id=668763563893"}, {"id": "bliswitch-v2", "group": "bliswitch", "title": "BliSwitch v2", "description": "8 进 1 出，支持 ATX 控制", "img": "/img/product/bliswitch-v2-transp.webp", "manual": "device-guides/BliSwitch-v2-guide", "buy": "https://item.taobao.com/item.htm?id=844629346441"}, {"id": "bliswitch-v1", "group": "bliswitch", "title": "BliSwitch v1", "description": "4 进 1 出，便携式切换", "img": "/img/product/bliswitch-v1-transp.webp", "manual": "device-guides/BliSwitch-v1-guide", "buy": "https://item.taobao.com/item.htm?id=698047414626"}, {"id": "c792", "group": "capture", "title": "C792", "description": "HDMI 环出、CSI 视频与 I²S 音频", "img": "/img/product/C792-transp.webp", "manual": "device-guides/C792", "buy": "https://item.taobao.com/item.htm?id=940263795279"}, {"id": "c790", "group": "capture", "title": "C790", "description": "15 / 22 针 CSI 接口与 I²S 音频", "img": "/img/product/C790-transp.webp", "manual": "device-guides/C790", "buy": "https://item.taobao.com/item.htm?id=592007124730"}, {"id": "c779", "group": "capture", "title": "C779", "description": "15 针双通道 CSI 视频采集", "img": "/img/product/C779-transp.webp", "manual": "device-guides/C779", "buy": "https://item.taobao.com/item.htm?id=592007124730&skuId=4551174557715"}, {"id": "atx", "group": "atx", "title": "ATXA 控制板套件", "description": "控制端与主板端两块板，通过线缆连接", "img": "/assets/images/atx/ATXA_A.png", "manual": "accessories/atx-guide", "buy": "https://www.aliexpress.com/item/1005003761450893.html"}, {"id": "splitter", "group": "splitter", "title": "USB Splitter", "description": "Raspberry Pi 4 USB-C 电源 / 数据分离器", "img": "/img/product/splitter-transp.webp", "manual": "accessories/usb-splitter-guide", "buy": "https://item.taobao.com/item.htm?id=674651463244"}];

const englishGroups = [
  ['blikvm', 'BliKVM', 'Remote computer management: wiring, browser operation, networking and maintenance.'],
  ['bliswitch', 'BliSwitch', 'Multi-computer HDMI / USB switching, independently or with BliKVM.'],
  ['capture', 'HDMI capture modules', 'CSI video, I²S audio and Linux integration.'],
  ['atx', 'ATX control boards', 'Motherboard power, reset and indicator connections.'],
  ['splitter', 'USB power / data splitter', 'Separate Raspberry Pi 4 USB-C power and OTG data.'],
];
const englishDescriptions = [
  'All-in-one remote KVM', 'Raspberry Pi 4B HAT', 'PCIe form factor for internal installation',
  'CM4-based remote KVM', '8 inputs, 1 output, with ATX control', 'Portable 4-input, 1-output switch',
  'HDMI passthrough, CSI video and I²S audio', '15 / 22-pin CSI and I²S audio', '15-pin, two-lane CSI video capture',
  'Controller-side and motherboard-side boards joined by cable', 'Raspberry Pi 4 USB-C power / data splitter',
];
const englishBuyUrls = [
  '1005005859415746', '1005004377930400', '1005004572837650', '1005003262886521',
  '1005008024603865', '1005005149590635', '1005009325895459', '1005002861310912',
  '1005003033156483', '1005003761450893', '1005003793429781',
];
export function getGroups(zh) {return zh ? groups : englishGroups;}
export function getProducts(zh) {
  const c778 = {id: "c778", group: "capture", title: "C778", description: zh ? "LT6911UXE · 4K60 / 1080p120 输入 · 双 CSI-2" : "LT6911UXE · 4K60 / 1080p120 input · Dual CSI-2", img: "/assets/images/c778/c778-front-cutout-v1.png", manual: "device-guides/C778"};
  const localized = zh ? products : products.map((p, i) => ({
  ...p, title: p.id === 'atx' ? 'ATXA control board kit' : p.title,
  description: englishDescriptions[i], buy: `https://www.aliexpress.com/item/${englishBuyUrls[i]}.html`,
}));
  const index = localized.findIndex(p => p.group === "capture");
  return [...localized.slice(0, index), c778, ...localized.slice(index)];
}
