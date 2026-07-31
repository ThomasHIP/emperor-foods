import type { Metadata } from "next";
import { notFound } from "next/navigation";

const pages = {
  "emperor-story": {
    eyebrow: "OUR STORY · 品牌故事",
    title: "EMPEROR FOODS: tradition with a future",
    lead: "A long-term food and gifting house built around Asian craftsmanship, thoughtful innovation and products people are proud to share.",
    th: "EMPEROR FOODS เริ่มต้นจากความตั้งใจที่จะสร้างแบรนด์อาหารและของขวัญเอเชียที่อยู่ได้มากกว่าหนึ่งเทศกาล เรานำรสชาติ ความทรงจำ และความประณีตของงานดั้งเดิมมาพัฒนาเป็นประสบการณ์ร่วมสมัย โดยเริ่มจาก EMPEROR Mooncake และต่อยอดสู่ EMPEROR Duck, Bakery, Tea, Kitchen และ Gift Collection ในอนาคต",
    zh: "EMPEROR FOODS 致力于打造一个跨越节庆周期的亚洲食品与礼赠品牌。我们将传统风味、共同记忆与精湛工艺融入现代体验，从 EMPEROR Mooncake 出发，未来延伸至烤鸭、烘焙、茶品、厨房食品与礼赠系列。",
  },
  "history-of-mooncake": {
    eyebrow: "MOONCAKE CULTURE · 月饼文化",
    title: "Why mooncakes still carry meaning",
    lead: "More than a seasonal pastry, the mooncake is a symbol of reunion, gratitude and shared abundance across generations.",
    th: "ขนมไหว้พระจันทร์เชื่อมโยงกับเทศกาลกลางฤดูใบไม้ร่วงและความหมายของความกลมเกลียว รูปทรงกลมสื่อถึงการกลับมาพบกัน การแบ่งขนมหนึ่งชิ้นจึงเป็นทั้งการแบ่งปันรสชาติและความปรารถนาดี EMPEROR เคารพความหมายนี้ พร้อมปรับรูปแบบ สี และการมอบให้เข้ากับชีวิตร่วมสมัย",
    zh: "月饼与中秋节及团圆寓意紧密相连。圆形象征相聚与圆满，分享一枚月饼，也是在分享祝福与情谊。EMPEROR 尊重这一文化内涵，并以现代色彩、呈现方式与礼赠服务赋予其新的表达。",
  },
  "pink-blue-mooncake": {
    eyebrow: "PINK–BLUE COLLECTION · 粉蓝系列",
    title: "The idea behind the Pink–Blue Mooncake",
    lead: "Two confident colours, one shared mooncake—a contemporary expression of identity, friendship and reunion.",
    th: "สีชมพูและสีฟ้าทำให้คอลเลกชันนี้โดดเด่นตั้งแต่แรกเห็น แต่หัวใจสำคัญคือการนำสองสีมาอยู่ร่วมกันอย่างสมดุลในขนมหนึ่งชิ้น สื่อถึงความต่างที่รวมกันได้ ความผูกพัน และการมอบของขวัญที่มีเรื่องราว ทุกชิ้นยังสร้างสิทธิ์ HERO Insure มูลค่า 200 บาทแยกหนึ่งรหัส",
    zh: "粉色与蓝色让这一系列一眼难忘，而真正的核心，是两种色彩在同一枚月饼中达到平衡，象征差异中的和谐、长久情谊与有故事的赠礼。每枚月饼还会生成一个独立的 200 泰铢 HERO Insure 礼遇码。",
  },
  "mid-autumn-festival-2026": {
    eyebrow: "MID-AUTUMN 2026 · 2026 中秋节",
    title: "A practical guide to Mid-Autumn gifting in 2026",
    lead: "Plan quantities, recipient lists, cards and delivery dates early so every gift arrives with intention.",
    th: "สำหรับการมอบของขวัญส่วนบุคคล ควรเลือกจำนวนชิ้นและวันรับสินค้าก่อน ส่วนองค์กรควรเตรียมรายชื่อผู้รับ โลโก้หรือข้อความบนการ์ด ที่อยู่จัดส่ง และช่วงเวลาที่ต้องการให้ถึง EMPEROR รองรับชุด 1, 2, 4, 6 และ 8 ชิ้น รวมถึงการจัดส่งหลายปลายทาง",
    zh: "个人赠礼建议提前确定数量与收货日期；企业赠礼则应准备收件人名单、企业标识或贺卡文案、配送地址及期望送达时间。EMPEROR 提供 1、2、4、6、8 枚装选择，并支持多地址配送。",
  },
  "corporate-mooncake-gifts": {
    eyebrow: "CORPORATE GIFTS · 企业礼赠",
    title: "Mooncake gifts designed for business relationships",
    lead: "A clear ordering workflow for volume pricing, company cards, scheduled delivery and many recipients.",
    th: "บริการสำหรับองค์กรออกแบบให้ลดงานประสานงาน ตั้งแต่การยืนยันจำนวนและราคา การ์ดอวยพรพร้อมโลโก้ การตรวจรายชื่อและที่อยู่ ไปจนถึงตารางส่งมอบ องค์กรสามารถขอใบเสนอราคาผ่านหน้าเว็บไซต์ และกำหนดรายละเอียดพิเศษก่อนชำระผ่าน HERO PAY",
    zh: "企业订购流程覆盖数量与价格确认、企业标识贺卡、收件名单与地址核对，以及配送日程安排。企业可通过网站提交报价需求，并在使用 HERO PAY 付款前确认全部细节。",
  },
  "mooncake-guide": {
    eyebrow: "BUYING GUIDE · 选购指南",
    title: "How to choose the right EMPEROR gift set",
    lead: "Start with the recipient, then choose the number of pieces, flavour mix, message and delivery format.",
    th: "หนึ่งชิ้นเหมาะสำหรับของขวัญส่วนตัวหรือกิจกรรมส่งเสริมการขาย ชุด 2–4 ชิ้นเหมาะกับครอบครัวและคู่ค้า ส่วนชุด 6–8 ชิ้นเหมาะกับของขวัญสำคัญหรือการแบ่งปันในทีม ตรวจสอบส่วนประกอบและสารก่อภูมิแพ้จากฉลากสินค้าจริงก่อนมอบทุกครั้ง",
    zh: "单枚适合个人赠礼或推广活动；2–4 枚装适合家庭与商务伙伴；6–8 枚装适合重要礼赠或团队分享。赠送前请务必以最终产品标签核对配料与过敏原信息。",
  },
} as const;

type Slug = keyof typeof pages;

export function generateStaticParams() { return Object.keys(pages).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug as Slug];
  if (!page) return {};
  return { title: page.title, description: page.lead, alternates: { canonical: `https://emperor-foods.vatisp.chatgpt.site/${slug}` }, openGraph: { title: page.title, description: page.lead, type: "article" } };
}

export default async function EditorialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug as Slug];
  if (!page) notFound();
  return <main className="editorial-page"><header><a href="/">♛ EMPEROR FOODS</a><a href="/#collection">Shop the collection →</a></header><article><p>{page.eyebrow}</p><h1>{page.title}</h1><strong>{page.lead}</strong><div className="editorial-visual" /><section><span>ภาษาไทย</span><p>{page.th}</p></section><section><span>简体中文</span><p>{page.zh}</p></section><aside><h2>EMPEROR Mooncake · Mid-Autumn 2026</h2><a href="/#collection">Explore the Pink–Blue Collection</a><a href="/#corporate">Corporate ordering</a></aside></article></main>;
}
