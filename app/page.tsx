"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Language = "th" | "en" | "zh";
type Localized = Record<Language, string>;
type Product = {
  id: string;
  name: Localized;
  description: Localized;
  allergens: Localized;
  weight: Localized;
  price: number;
  image: string;
};
type CartLine = { productId: string; name: string; quantity: number; price: number; pieces: number };

const products: Product[] = [
  {
    id: "yuzu",
    name: { th: "ยูซุเคียวโฮ", en: "Yuzu Kyoho", zh: "柚子巨峰葡萄" },
    description: {
      th: "กลิ่นซิตรัสสดใส ผสานรสองุ่นเคียวโฮนุ่มลึก",
      en: "Bright citrus lifted by the rounded sweetness of Kyoho grape.",
      zh: "清新柚香与巨峰葡萄的圆润甜味交织。",
    },
    allergens: { th: "ข้อมูลสารก่อภูมิแพ้ตามฉลากสินค้าจริง", en: "See final product label for allergen declaration", zh: "过敏原信息以最终产品标签为准" },
    weight: { th: "น้ำหนักสุทธิรอยืนยัน", en: "Final net weight to be confirmed", zh: "净重待最终确认" },
    price: 200,
    image: "/images/mooncake-yuzu.png",
  },
  {
    id: "sweet-potato",
    name: { th: "มันหวานมิยาซากิ", en: "Miyazaki Sweet Potato", zh: "宫崎甘薯" },
    description: {
      th: "เนื้อสัมผัสเนียนละมุน หอมหวานอย่างเป็นธรรมชาติ",
      en: "Silky, naturally sweet and quietly indulgent.",
      zh: "口感细腻，甘甜自然，温润雅致。",
    },
    allergens: { th: "ข้อมูลสารก่อภูมิแพ้ตามฉลากสินค้าจริง", en: "See final product label for allergen declaration", zh: "过敏原信息以最终产品标签为准" },
    weight: { th: "น้ำหนักสุทธิรอยืนยัน", en: "Final net weight to be confirmed", zh: "净重待最终确认" },
    price: 200,
    image: "/images/mooncake-sweet-potato.png",
  },
  {
    id: "japanese-peach",
    name: { th: "พีชญี่ปุ่น", en: "Japanese Peach", zh: "日本白桃" },
    description: {
      th: "หอมพีชละมุน รสเบา สดชื่น และร่วมสมัย",
      en: "A delicate, refreshing peach profile with a modern finish.",
      zh: "淡雅白桃芳香，清爽轻盈，余韵现代。",
    },
    allergens: { th: "ข้อมูลสารก่อภูมิแพ้ตามฉลากสินค้าจริง", en: "See final product label for allergen declaration", zh: "过敏原信息以最终产品标签为准" },
    weight: { th: "น้ำหนักสุทธิรอยืนยัน", en: "Final net weight to be confirmed", zh: "净重待最终确认" },
    price: 200,
    image: "/images/mooncake-japanese-peach.png",
  },
  {
    id: "truffle-macadamia",
    name: { th: "แบล็คทรัฟเฟิลแมคคาเดเมีย", en: "Black Truffle Macadamia", zh: "黑松露夏威夷果" },
    description: {
      th: "กลิ่นทรัฟเฟิลหรูหรา ตัดด้วยความมันกรุบของแมคคาเดเมีย",
      en: "A savoury truffle note balanced by buttery macadamia.",
      zh: "黑松露的馥郁与夏威夷果的醇香相得益彰。",
    },
    allergens: { th: "มีถั่วเปลือกแข็ง; โปรดดูฉลากจริง", en: "Contains tree nuts; see final label", zh: "含坚果；请以最终标签为准" },
    weight: { th: "น้ำหนักสุทธิรอยืนยัน", en: "Final net weight to be confirmed", zh: "净重待最终确认" },
    price: 200,
    image: "/images/mooncake-truffle-macadamia.png",
  },
];

const copy = {
  th: {
    announcement: "เปิดพรีออเดอร์คอลเลกชันไหว้พระจันทร์ 2026",
    story: "เรื่องราวของเรา", collection: "คอลเลกชัน", gifts: "ของขวัญ", corporate: "สำหรับองค์กร", guide: "คู่มือและ FAQ", navCta: "สั่งซื้อล่วงหน้า",
    eyebrow: "EMPEROR MOONCAKE · MID-AUTUMN 2026", titleA: "รสชาติใหม่", titleB: "ในงานฝีมือดั้งเดิม",
    intro: "ขนมไหว้พระจันทร์สีชมพู–ฟ้า คอลเลกชันพิเศษที่ผสานความหมายของการมอบให้ งานฝีมือ และความร่วมสมัย",
    primary: "เลือกซื้อคอลเลกชัน", secondary: "สั่งซื้อสำหรับองค์กร",
    voucher: "รับสิทธิ์ HERO Insure มูลค่า 200 บาท ต่อขนม 1 ชิ้น", voucherRule: "1 สิทธิ์ ต่อรถ 1 คัน และ พ.ร.บ. 1 กรมธรรม์ ไม่สามารถรวมสิทธิ์ได้",
    scroll: "เลื่อนเพื่อสำรวจ", season: "เทศกาลแห่งการพบกัน", seasonTitle: "ของขวัญที่เริ่มต้นจากความใส่ใจ",
    seasonBody: "EMPEROR Mooncake นำความงดงามของประเพณีมาสู่ของขวัญร่วมสมัย ด้วยสีชมพู–ฟ้าอันโดดเด่น บรรจุภัณฑ์พรีเมียม และบริการสำหรับบุคคลและองค์กร",
    statOne: "3 ภาษา", statTwo: "ชำระผ่าน HERO PAY", statThree: "สิทธิ์เฉพาะทุกชิ้น",
    collectionKicker: "Pink–Blue Collection", collectionTitle: "เลือกความหมายที่อยากมอบให้", collectionBody: "ทุกชิ้นราคา 200 บาท และสร้างสิทธิ์ HERO Insure แยก 1 รหัสต่อชิ้น",
    ingredients: "ส่วนประกอบ", allergens: "สารก่อภูมิแพ้", availability: "พรีออเดอร์ · Mid-Autumn 2026", add: "เพิ่มลงตะกร้า",
    specification: "ชื่อรสชาติและภาพเป็นแคตตาล็อกเปิดตัว ส่วนประกอบ น้ำหนัก และข้อมูลสารก่อภูมิแพ้ฉบับสมบูรณ์ต้องยืนยันกับผู้ผลิตก่อนเปิดรับชำระเงินจริง",
    giftKicker: "Gift Collection", giftTitle: "ตั้งแต่หนึ่งชิ้นถึงของขวัญทั้งองค์กร", giftBody: "เลือก 1, 2, 4, 6 หรือ 8 ชิ้น พร้อมข้อความของขวัญ การ์ดบริษัท และกำหนดวันจัดส่ง",
    from: "เริ่มต้น", chooseSet: "เลือกชุดนี้", corporateTitle: "ของขวัญองค์กรที่ทำงานแทนคำขอบคุณ", corporateBody: "รองรับการสั่งจำนวนมาก การ์ดโลโก้บริษัท รายชื่อผู้รับหลายแห่ง และการจัดส่งตามกำหนด",
    bulk: "ราคาสำหรับองค์กร", card: "การ์ดและโลโก้", delivery: "จัดส่งตามกำหนด", requestQuote: "ขอใบเสนอราคา",
    name: "ชื่อผู้ติดต่อ", company: "บริษัท", email: "อีเมล", phone: "โทรศัพท์", quantity: "จำนวนโดยประมาณ", message: "รายละเอียดเพิ่มเติม", send: "ส่งคำขอ",
    faqTitle: "คำถามที่พบบ่อย", footerLine: "Premium Asian Lifestyle · Modern Flavours · Traditional Craftsmanship",
    cart: "ตะกร้า", empty: "ตะกร้าของคุณยังว่าง", subtotal: "ยอดรวมสินค้า", checkout: "ดำเนินการสั่งซื้อ", continueShopping: "เลือกซื้อเพิ่มเติม", remove: "ลบ",
    boxStyle: "รูปแบบกล่อง", coupon: "คูปอง / Voucher", deliveryFee: "ค่าจัดส่งคำนวณหลังยืนยันที่อยู่", checkoutTitle: "ข้อมูลการสั่งซื้อ",
    fullName: "ชื่อ–นามสกุล", address: "ที่อยู่จัดส่ง", taxInvoice: "ต้องการใบกำกับภาษี", giftMessage: "ข้อความบนการ์ด", deliveryDate: "วันที่ต้องการรับสินค้า", instructions: "คำแนะนำพิเศษ",
    payMethod: "วิธีชำระเงิน", placeOrder: "ยืนยันคำสั่งซื้อ", orderSuccess: "รับคำสั่งซื้อแล้ว", paymentFollow: "ระบบจะส่งลิงก์ชำระเงิน HERO PAY ที่ปลอดภัยให้หลังตรวจสอบรายละเอียดสินค้าและวันจัดส่ง",
  },
  en: {
    announcement: "Mid-Autumn 2026 pre-orders are now open",
    story: "Our Story", collection: "Collection", gifts: "Gift Sets", corporate: "Corporate", guide: "Guide & FAQ", navCta: "Pre-order Now",
    eyebrow: "EMPEROR MOONCAKE · MID-AUTUMN 2026", titleA: "Modern flavour.", titleB: "Timeless craft.",
    intro: "A distinctive pink-and-blue mooncake collection where meaningful gifting, traditional craftsmanship and modern imagination meet.",
    primary: "Explore the collection", secondary: "Corporate gifting",
    voucher: "Receive a ฿200 HERO Insure privilege for every mooncake", voucherRule: "One privilege per vehicle and PRB policy. Privileges cannot be combined.",
    scroll: "Scroll to discover", season: "A season of reunion", seasonTitle: "Gifting begins with thoughtfulness",
    seasonBody: "EMPEROR Mooncake brings the beauty of tradition into contemporary gifting through its signature pink-blue palette, premium presentation and personal and corporate service.",
    statOne: "3 languages", statTwo: "Powered by HERO PAY", statThree: "A privilege with every piece",
    collectionKicker: "Pink–Blue Collection", collectionTitle: "Choose the meaning you want to give", collectionBody: "Every piece is ฿200 and generates its own individual HERO Insure privilege code.",
    ingredients: "Ingredients", allergens: "Allergens", availability: "Pre-order · Mid-Autumn 2026", add: "Add to cart",
    specification: "Launch flavour names and images are catalogue specifications. Final ingredients, net weight and allergen declarations must be approved by the manufacturer before live payment is enabled.",
    giftKicker: "Gift Collection", giftTitle: "From one thoughtful piece to company-wide gifting", giftBody: "Choose 1, 2, 4, 6 or 8 pieces, then add a message, corporate card and scheduled delivery.",
    from: "From", chooseSet: "Choose this set", corporateTitle: "Corporate gifts that speak for your appreciation", corporateBody: "Built for volume orders, logo cards, multi-address recipient lists and scheduled delivery.",
    bulk: "Corporate pricing", card: "Cards & company logo", delivery: "Scheduled delivery", requestQuote: "Request a quote",
    name: "Contact name", company: "Company", email: "Email", phone: "Phone", quantity: "Estimated quantity", message: "Additional details", send: "Send request",
    faqTitle: "Frequently asked questions", footerLine: "Premium Asian Lifestyle · Modern Flavours · Traditional Craftsmanship",
    cart: "Cart", empty: "Your cart is empty", subtotal: "Merchandise subtotal", checkout: "Proceed to checkout", continueShopping: "Continue shopping", remove: "Remove",
    boxStyle: "Gift box", coupon: "Coupon / Voucher", deliveryFee: "Delivery is calculated after the address is confirmed", checkoutTitle: "Checkout details",
    fullName: "Full name", address: "Delivery address", taxInvoice: "Tax invoice required", giftMessage: "Gift message", deliveryDate: "Preferred delivery date", instructions: "Special instructions",
    payMethod: "Payment method", placeOrder: "Confirm order", orderSuccess: "Order received", paymentFollow: "A secure HERO PAY payment link will be sent after product details and delivery date are confirmed.",
  },
  zh: {
    announcement: "2026 中秋系列现已开放预订",
    story: "品牌故事", collection: "月饼系列", gifts: "礼盒系列", corporate: "企业订购", guide: "指南与常见问题", navCta: "立即预订",
    eyebrow: "皇者月饼 · 2026 中秋节", titleA: "新风味，", titleB: "匠心传承。",
    intro: "粉蓝双色月饼，以现代创意诠释传统工艺，让每一份心意都成为值得珍藏的礼物。", primary: "探索月饼系列", secondary: "企业礼赠",
    voucher: "每购买一枚月饼，获赠 200 泰铢 HERO Insure 专属礼遇", voucherRule: "每辆车及每份强制车险限用一张，不可合并使用。",
    scroll: "向下探索", season: "团圆时节", seasonTitle: "心意，成就一份好礼", seasonBody: "EMPEROR Mooncake 以标志性的粉蓝配色、精美包装和个人及企业定制服务，将传统之美融入现代礼赠。",
    statOne: "三语服务", statTwo: "HERO PAY 安全支付", statThree: "每枚均享专属礼遇",
    collectionKicker: "粉蓝系列", collectionTitle: "选择您想传递的心意", collectionBody: "每枚 200 泰铢，并生成一个独立的 HERO Insure 礼遇码。",
    ingredients: "配料", allergens: "过敏原", availability: "预订 · 2026 中秋节", add: "加入购物车",
    specification: "口味名称与图片为上市目录信息。正式开放付款前，配料、净重与过敏原声明须经生产商最终确认。",
    giftKicker: "礼盒系列", giftTitle: "从一枚心意到企业礼赠", giftBody: "可选 1、2、4、6 或 8 枚，并添加祝福语、企业卡片和预约配送。",
    from: "起", chooseSet: "选择此礼盒", corporateTitle: "让企业好礼表达您的谢意", corporateBody: "支持批量订购、企业标识卡、多地址名单及预约配送。",
    bulk: "企业价格", card: "贺卡与企业标识", delivery: "预约配送", requestQuote: "索取报价",
    name: "联系人", company: "公司", email: "电子邮箱", phone: "电话", quantity: "预计数量", message: "补充说明", send: "提交需求",
    faqTitle: "常见问题", footerLine: "尊贵亚洲生活方式 · 新风味 · 匠心传承",
    cart: "购物车", empty: "购物车暂无商品", subtotal: "商品小计", checkout: "前往结账", continueShopping: "继续选购", remove: "删除",
    boxStyle: "礼盒款式", coupon: "优惠码 / 礼券", deliveryFee: "运费将在确认地址后计算", checkoutTitle: "结账信息",
    fullName: "姓名", address: "配送地址", taxInvoice: "需要税务发票", giftMessage: "祝福语", deliveryDate: "期望配送日期", instructions: "特别说明",
    payMethod: "付款方式", placeOrder: "确认订单", orderSuccess: "订单已收到", paymentFollow: "确认产品信息和配送日期后，我们将发送安全的 HERO PAY 付款链接。",
  },
} as const;

const faq: Record<Language, { q: string; a: string }[]> = {
  th: [
    { q: "สิทธิ์ HERO Insure 200 บาทได้รับอย่างไร?", a: "ขนมไหว้พระจันทร์ทุก 1 ชิ้นสร้างรหัสสิทธิ์แยก 1 รหัส ใช้เป็นส่วนลด 200 บาทสำหรับ พ.ร.บ. รถ 1 คัน ผ่าน HERO Insure เท่านั้น" },
    { q: "ซื้อ 4 ชิ้น รวมสิทธิ์ 800 บาทกับกรมธรรม์เดียวได้หรือไม่?", a: "ไม่ได้ สิทธิ์แต่ละรหัสใช้ได้กับรถ 1 คันและ พ.ร.บ. 1 กรมธรรม์เท่านั้น แต่สามารถโอนให้ครอบครัวหรือเพื่อนได้" },
    { q: "รองรับการชำระเงินแบบใด?", a: "HERO PAY รองรับ Dynamic Thai QR / PromptPay, บัตรเครดิตและเดบิต, Alipay, WeChat Pay และ Payment Link เมื่อบัญชีร้านค้าเปิดใช้งาน" },
    { q: "สั่งซื้อสำหรับองค์กรได้หรือไม่?", a: "ได้ รองรับการ์ดอวยพร โลโก้บริษัท รายชื่อจัดส่งหลายที่ และกำหนดวันส่ง พร้อมราคาองค์กรตามจำนวน" },
  ],
  en: [
    { q: "How does the ฿200 HERO Insure privilege work?", a: "Every mooncake creates one separate ฿200 code for one vehicle and one PRB policy, redeemable only through HERO Insure." },
    { q: "Can four codes be combined on one policy?", a: "No. Each code is individual and cannot be combined, but it may be transferred to a family member or friend." },
    { q: "Which payment methods are supported?", a: "Once the merchant account is activated, HERO PAY supports Dynamic Thai QR / PromptPay, credit and debit cards, Alipay, WeChat Pay and Payment Links." },
    { q: "Do you accept corporate orders?", a: "Yes. Corporate services include greeting and logo cards, multi-address delivery lists, scheduled delivery and volume pricing." },
  ],
  zh: [
    { q: "如何获得 200 泰铢 HERO Insure 礼遇？", a: "每枚月饼生成一个独立的 200 泰铢礼遇码，仅适用于一辆车及一份强制车险，并须通过 HERO Insure 兑换。" },
    { q: "四个礼遇码可以合并用于同一份保单吗？", a: "不可以。每个礼遇码须单独使用，但可转赠给家人或朋友。" },
    { q: "支持哪些付款方式？", a: "商户账户启用后，HERO PAY 支持泰国动态二维码 / PromptPay、信用卡、借记卡、支付宝、微信支付和付款链接。" },
    { q: "接受企业订购吗？", a: "接受。可提供祝福卡、企业标识卡、多地址配送名单、预约配送和批量价格。" },
  ],
};

function CrownMark() { return <span className="crown-mark" aria-hidden="true">♛</span>; }
const money = (value: number) => new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(value);

export default function Home() {
  const [language, setLanguage] = useState<Language>("th");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [giftBox, setGiftBox] = useState("individual");
  const [coupon, setCoupon] = useState("");
  const [orderResult, setOrderResult] = useState<{ orderNo: string; voucherCount: number } | null>(null);
  const [orderError, setOrderError] = useState("");
  const [orderBusy, setOrderBusy] = useState(false);
  const [corporateStatus, setCorporateStatus] = useState("");
  const t = copy[language];
  const itemCount = cart.reduce((sum, line) => sum + line.quantity * line.pieces, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.quantity * line.price, 0);

  useEffect(() => { document.documentElement.lang = language === "zh" ? "zh-CN" : language; }, [language]);

  const addProduct = (product: Product) => {
    const name = product.name[language];
    setCart((current) => {
      const found = current.find((line) => line.productId === product.id);
      if (found) return current.map((line) => line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, { productId: product.id, name, quantity: 1, price: product.price, pieces: 1 }];
    });
    setCartOpen(true);
  };

  const addGiftSet = (pieces: number) => {
    const id = `gift-${pieces}`;
    const name = language === "th" ? `ชุดของขวัญ ${pieces} ชิ้น` : language === "zh" ? `${pieces} 枚礼盒` : `${pieces}-Piece Gift Set`;
    setCart((current) => {
      const found = current.find((line) => line.productId === id);
      if (found) return current.map((line) => line.productId === id ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, { productId: id, name, quantity: 1, price: pieces * 200, pieces }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => setCart((current) => current.flatMap((line) => {
    if (line.productId !== productId) return [line];
    const quantity = line.quantity + delta;
    return quantity > 0 ? [{ ...line, quantity }] : [];
  }));

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrderBusy(true);
    setOrderError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer: Object.fromEntries(form.entries()),
          items: cart,
          giftBox,
          coupon: coupon.trim(),
          language,
          subtotal,
        }),
      });
      if (!response.ok) throw new Error("order_failed");
      const result = await response.json() as { orderNo: string; voucherCount: number };
      setOrderResult(result);
      setCart([]);
    } catch {
      setOrderError(language === "th" ? "ยังไม่สามารถบันทึกคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง" : language === "zh" ? "订单暂时无法保存，请重试" : "The order could not be saved. Please try again.");
    } finally { setOrderBusy(false); }
  };

  const submitCorporate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCorporateStatus(language === "th" ? "กำลังส่ง..." : language === "zh" ? "正在提交..." : "Sending...");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/corporate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
      if (!response.ok) throw new Error("failed");
      setCorporateStatus(language === "th" ? "ได้รับคำขอแล้ว ทีมงานจะติดต่อกลับ" : language === "zh" ? "需求已收到，我们将与您联系" : "Request received. Our team will contact you.");
      event.currentTarget.reset();
    } catch { setCorporateStatus(language === "th" ? "กรุณาลองอีกครั้งหรือติดต่อ EMPEROR FOODS" : language === "zh" ? "请重试或联系 EMPEROR FOODS" : "Please try again or contact EMPEROR FOODS."); }
  };

  const giftSizes = useMemo(() => [1, 2, 4, 6, 8], []);

  return (
    <main>
      <div className="announcement"><span>{t.announcement}</span><a href="#collection">{t.navCta} →</a></div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="EMPEROR FOODS home">
          <Image src="/brand/emperor-primary.png" width={112} height={112} alt="EMPEROR" priority unoptimized />
          <span><strong>EMPEROR</strong><small>FOODS</small></span>
        </a>
        <button className="menu-button" type="button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><span /><span /></button>
        <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Main navigation">
          <a href="#story" onClick={() => setMenuOpen(false)}>{t.story}</a><a href="#collection" onClick={() => setMenuOpen(false)}>{t.collection}</a><a href="#gifts" onClick={() => setMenuOpen(false)}>{t.gifts}</a><a href="#corporate" onClick={() => setMenuOpen(false)}>{t.corporate}</a><a href="#guide" onClick={() => setMenuOpen(false)}>{t.guide}</a>
        </nav>
        <div className="header-actions">
          <label className="language-select"><span className="sr-only">Language</span><select value={language} onChange={(event) => setLanguage(event.target.value as Language)}><option value="th">TH</option><option value="en">EN</option><option value="zh">中文</option></select></label>
          <button className="cart-button" type="button" onClick={() => setCartOpen(true)}><span>{t.cart}</span><b>{itemCount}</b></button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><CrownMark /> {t.eyebrow}</p><h1><span>{t.titleA}</span><em>{t.titleB}</em></h1><p className="hero-intro">{t.intro}</p>
          <div className="hero-actions"><a className="button button-gold" href="#collection">{t.primary}</a><a className="text-link" href="#corporate">{t.secondary} <span>↗</span></a></div>
          <div className="privilege-note"><span className="privilege-value">฿200</span><span><strong>{t.voucher}</strong><small>{t.voucherRule}</small></span></div>
        </div>
        <div className="hero-visual" aria-label="Pink and blue EMPEROR Mooncake"><div className="moon-glow" /><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-product-image" role="img" aria-label="Pink and blue mooncake, shown whole and in cross-section" /><p>THE PINK–BLUE COLLECTION</p></div>
        <a className="scroll-cue" href="#story"><span>{t.scroll}</span><i>↓</i></a>
      </section>

      <section className="story-intro" id="story">
        <div><p className="section-label">{t.season}</p><h2>{t.seasonTitle}</h2></div>
        <div><p>{t.seasonBody}</p><div className="story-stats"><span>{t.statOne}</span><span>{t.statTwo}</span><span>{t.statThree}</span></div></div>
      </section>

      <section className="collection-section" id="collection">
        <div className="section-heading"><div><p className="section-label">{t.collectionKicker}</p><h2>{t.collectionTitle}</h2></div><p>{t.collectionBody}</p></div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-photo" style={{ backgroundImage: `url(${product.image})` }} role="img" aria-label={`${product.name[language]} pink and blue mooncake`}><span>฿{product.price}</span></div>
              <div className="product-copy"><p className="availability">{t.availability}</p><h3>{product.name[language]}</h3><p>{product.description[language]}</p><dl><div><dt>{t.ingredients}</dt><dd>{product.weight[language]}</dd></div><div><dt>{t.allergens}</dt><dd>{product.allergens[language]}</dd></div></dl><button type="button" onClick={() => addProduct(product)}>{t.add} <span>＋</span></button></div>
            </article>
          ))}
        </div>
        <p className="specification-note">{t.specification}</p>
      </section>

      <section className="gift-section" id="gifts">
        <div className="gift-visual" role="img" aria-label="EMPEROR four-piece mooncake gift box" />
        <div className="gift-content"><p className="section-label">{t.giftKicker}</p><h2>{t.giftTitle}</h2><p>{t.giftBody}</p><div className="gift-options">{giftSizes.map((size) => <button type="button" key={size} onClick={() => addGiftSet(size)}><strong>{size}</strong><span>{language === "th" ? "ชิ้น" : language === "zh" ? "枚" : size === 1 ? "piece" : "pieces"}</span><small>{t.from} {money(size * 200)}</small></button>)}</div></div>
      </section>

      <section className="corporate-section" id="corporate">
        <div className="corporate-copy"><p className="section-label">EMPEROR CORPORATE</p><h2>{t.corporateTitle}</h2><p>{t.corporateBody}</p><div className="corporate-features"><span><b>01</b>{t.bulk}</span><span><b>02</b>{t.card}</span><span><b>03</b>{t.delivery}</span></div></div>
        <form className="corporate-form" onSubmit={submitCorporate}><h3>{t.requestQuote}</h3><div className="form-row"><label><span>{t.name}</span><input name="name" required /></label><label><span>{t.company}</span><input name="company" required /></label></div><div className="form-row"><label><span>{t.email}</span><input name="email" type="email" required /></label><label><span>{t.phone}</span><input name="phone" type="tel" required /></label></div><label><span>{t.quantity}</span><input name="quantity" type="number" min="20" required /></label><label><span>{t.message}</span><textarea name="message" rows={3} /></label><button className="button button-gold" type="submit">{t.send}</button>{corporateStatus && <p className="form-status" role="status">{corporateStatus}</p>}</form>
      </section>

      <section className="faq-section" id="guide"><div className="faq-intro"><p className="section-label">MOONCAKE GUIDE</p><h2>{t.faqTitle}</h2><p>EMPEROR Privilege Voucher · HERO PAY · Corporate Gifts · Mid-Autumn 2026</p></div><div className="faq-list">{faq[language].map((item) => <details key={item.q}><summary>{item.q}<span>＋</span></summary><p>{item.a}</p></details>)}</div></section>

      <section className="payment-strip" aria-label="HERO PAY payment partner">
        <a className="payment-link" href="https://heropay.co.th/" target="_blank" rel="noopener noreferrer">
          <span className="payment-logo-card"><Image src="/brand/hero-pay.jpg" alt="HERO PAY — Power Every Payment" width={1536} height={487} /></span>
          <span className="payment-copy"><b>SECURE PAYMENT BY HERO PAY</b><span>PromptPay · Dynamic Thai QR · Visa · Mastercard · Alipay · WeChat Pay · Payment Link</span><strong>Visit HERO PAY ↗</strong></span>
        </a>
      </section>
      <footer><div className="footer-brand"><CrownMark /><strong>EMPEROR</strong><span>FOODS</span></div><p>{t.footerLine}</p><nav><a href="#story">{t.story}</a><a href="#collection">{t.collection}</a><a href="#corporate">{t.corporate}</a><a href="#guide">FAQ</a></nav><small>© 2026 EMPEROR FOODS. All rights reserved.</small></footer>

      <aside className={cartOpen ? "cart-drawer open" : "cart-drawer"} aria-hidden={!cartOpen}>
        <div className="cart-heading"><h2>{t.cart} <small>{itemCount}</small></h2><button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">×</button></div>
        {cart.length === 0 ? <div className="empty-cart"><CrownMark /><p>{t.empty}</p><button type="button" onClick={() => setCartOpen(false)}>{t.primary}</button></div> : <><div className="cart-lines">{cart.map((line) => <article key={line.productId}><div className="cart-thumb" /><div><h3>{line.name}</h3><small>{money(line.price)} · {line.pieces} {language === "th" ? "สิทธิ์" : language === "zh" ? "个礼遇" : "privilege(s)"}</small><div className="quantity-control"><button type="button" onClick={() => updateQuantity(line.productId, -1)}>−</button><span>{line.quantity}</span><button type="button" onClick={() => updateQuantity(line.productId, 1)}>＋</button></div><button className="remove-line" type="button" onClick={() => setCart((current) => current.filter((item) => item.productId !== line.productId))}>{t.remove}</button></div><strong>{money(line.price * line.quantity)}</strong></article>)}</div><div className="cart-config"><label><span>{t.boxStyle}</span><select value={giftBox} onChange={(event) => setGiftBox(event.target.value)}><option value="individual">Individual wrap</option><option value="2-piece">2-piece box</option><option value="4-piece">4-piece box</option><option value="6-piece">6-piece box</option><option value="8-piece">8-piece box</option></select></label><label><span>{t.coupon}</span><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Optional" /></label></div><div className="cart-total"><span>{t.subtotal}</span><strong>{money(subtotal)}</strong><small>{t.deliveryFee}</small></div><button className="checkout-button" type="button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>{t.checkout} →</button><button className="continue-button" type="button" onClick={() => setCartOpen(false)}>{t.continueShopping}</button></>}
      </aside>
      {cartOpen && <button className="drawer-backdrop" aria-label="Close cart" onClick={() => setCartOpen(false)} />}

      {checkoutOpen && <div className="modal-layer" role="dialog" aria-modal="true" aria-label={t.checkoutTitle}><button className="modal-backdrop" type="button" aria-label="Close checkout" onClick={() => setCheckoutOpen(false)} /><section className="checkout-panel"><div className="cart-heading"><h2>{t.checkoutTitle}</h2><button type="button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout">×</button></div>{orderResult ? <div className="order-result"><CrownMark /><p className="section-label">{t.orderSuccess}</p><h3>{orderResult.orderNo}</h3><p>{t.paymentFollow}</p><div><strong>{orderResult.voucherCount}</strong><span>EMPEROR Privilege reservation(s)</span></div><button type="button" onClick={() => { setCheckoutOpen(false); setOrderResult(null); }}>OK</button></div> : <form className="checkout-form" onSubmit={submitOrder}><div className="form-row"><label><span>{t.fullName}</span><input name="fullName" required /></label><label><span>{t.phone}</span><input name="phone" type="tel" required /></label></div><label><span>{t.email}</span><input name="email" type="email" required /></label><label><span>{t.address}</span><textarea name="address" rows={3} required /></label><div className="form-row"><label><span>{t.deliveryDate}</span><input name="deliveryDate" type="date" required /></label><label><span>{t.payMethod}</span><select name="paymentMethod" defaultValue="promptpay"><option value="promptpay">PromptPay / Dynamic QR</option><option value="card">Credit / Debit Card</option><option value="alipay">Alipay</option><option value="wechat">WeChat Pay</option><option value="payment-link">Payment Link</option></select></label></div><label><span>{t.giftMessage}</span><input name="giftMessage" /></label><label><span>{t.instructions}</span><textarea name="instructions" rows={2} /></label><label className="checkbox-line"><input name="taxInvoice" type="checkbox" value="yes" /><span>{t.taxInvoice}</span></label><div className="checkout-summary"><span>{itemCount} mooncake(s) · {itemCount} voucher reservation(s)</span><strong>{money(subtotal)}</strong></div>{orderError && <p className="checkout-error" role="alert">{orderError}</p>}<button className="checkout-button" type="submit" disabled={orderBusy}>{orderBusy ? "…" : t.placeOrder}</button></form>}</section></div>}
    </main>
  );
}
