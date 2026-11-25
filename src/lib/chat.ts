// Rule-based chat. Answers come only from site content (hours, location, services, insurance, offers). No AI, no health advice.
import { SITE } from '../data/site';
import { openStatus } from './hours';
import { insuranceAnswer } from './tools';

export interface Link { label: string; href: string }
export interface Reply { text: string; links: Link[] }
export const CHIPS: { flow: string; label: string }[] = [
  { flow: 'book', label: 'Book an eye exam' }, { flow: 'dry', label: 'Dry eye help' }, { flow: 'insurance', label: 'Check insurance' },
  { flow: 'spa', label: 'Med spa / Botox' }, { flow: 'glasses', label: 'Glasses / frames' }, { flow: 'hours', label: 'Hours & directions' }, { flow: 'urgent', label: 'Eye emergency' },
];
const tel: Link = { label: `Call ${SITE.phone}`, href: `tel:${SITE.phoneTel}` };
const book: Link = { label: 'Request an appointment', href: '/book/' };

export function hoursText(now: Date): string {
  const chicago = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  const st = openStatus(chicago.getDay(), chicago.getHours() * 60 + chicago.getMinutes());
  return `${st.text}. Hours: ${SITE.hoursShort}.`;
}

const PLANS: [RegExp, string][] = [[/\bvsp\b/, 'vsp'], [/eyemed/, 'eyemed'], [/blue cross|bcbs/, 'bcbs'], [/aetna/, 'aetna'], [/cigna/, 'cigna'], [/medicare/, 'medicare'], [/community eye/, 'cec'], [/davis/, 'davis'], [/medicaid/, 'medicaid'], [/superior/, 'superior'], [/tricare/, 'tricare'], [/united ?health|uhc/, 'uhc']];

export function reply(input: string, now: Date = new Date()): Reply {
  const t = input.toLowerCase().trim();
  if (/(emergenc|urgent|sudden|pain|injur|chemical|curtain|flash|can't see|cannot see|bleeding)/.test(t) || t === 'urgent')
    return { text: `That could be an eye emergency. Please call us now on ${SITE.phone}. We prioritize emergencies Monday to Thursday. If we are closed (Friday to Sunday) and it is severe, go to urgent care or the ER.`, links: [tel, { label: 'Emergency eye care', href: '/services/emergency-eye-care/' }] };
  for (const [re, id] of PLANS) if (re.test(t)) return { text: insuranceAnswer(id)!, links: [{ label: 'Insurance checker', href: '/patient-centre/#insurance' }, tel] };
  if (/(insur|plan|cover|copay)/.test(t) || t === 'insurance')
    return { text: 'We work with most major vision and medical plans: Aetna, BCBS of Texas, Cigna, Community Eye Care, Davis Vision, EyeMed, Medicare, Medicaid (20 and under), Superior Vision, Tricare, United Healthcare and VSP. Tell me your plan, or use the checker.', links: [{ label: 'Insurance checker', href: '/patient-centre/#insurance' }] };
  if (/(hour|open|close|when are you|today|directions|where|address|location|parking|map)/.test(t) || t === 'hours')
    return { text: `${hoursText(now)} We are at ${SITE.addressLine}, on Airport Freeway between Beach St and Haltom Rd, with free parking.`, links: [{ label: 'Hours & directions', href: '/visit/' }, { label: 'Get directions', href: SITE.mapsUrl }] };
  if (/(dry|gritty|burning|ipl|tear)/.test(t) || t === 'dry')
    return { text: 'Our dry eye clinic is a Center of Excellence: we test first, then treat the cause with IPL and radiofrequency only if it will genuinely help. Try the 60-second quiz, or book a consultation.', links: [{ label: 'Dry eye treatment', href: '/services/dry-eye-treatment/' }, { label: 'Take the quiz', href: '/patient-centre/#dry-eye-quiz' }, book] };
  if (/(botox|morpheus|spa|aesthetic|filler|wrinkle|laser hair|forma|photofacial)/.test(t) || t === 'spa')
    return { text: 'Our med spa offers Morpheus8, IPL photofacial, Forma, Botox, fillers and laser hair removal. Every plan starts with a consultation and an exact written quote before any treatment. Aesthetics are self-pay.', links: [{ label: 'Aesthetics & med spa', href: '/services/aesthetics-med-spa/' }, book] };
  if (/(kid|child|son|daughter|baby)/.test(t))
    return { text: "We see children from 6 to 12 months. Packs Unlimited is our kids plan: $99 a year for unlimited exams, $25 frame and lens sets, and $25 replacements.", links: [{ label: "Children's eye exams", href: '/services/childrens-eye-exams/' }, { label: 'Offers', href: '/offers/' }] };
  if (/(glass|frame|sunglass|eyewear|brand|lens|ray-?ban|oakley)/.test(t) || t === 'glasses')
    return { text: 'We carry 300+ frames from 20 brands, with Essilor lenses including Varilux and Crizal. Sunglasses are 15% off and seniors get 10% off frames and sunglasses.', links: [{ label: 'Eyewear & brands', href: '/eyewear/' }, { label: 'Frame finder', href: '/patient-centre/#frame-guide' }, { label: 'Offers', href: '/offers/' }] };
  if (/(contact lens|contacts|reorder|ortho)/.test(t))
    return { text: 'We fit contact lenses of all kinds, from daily disposables to toric, multifocal, scleral and Ortho-K. You can reorder any time through our online contact lens store.', links: [{ label: 'Contact lens fittings', href: '/services/contact-lens-fittings/' }, { label: 'Order contacts', href: SITE.contactsOrderUrl }] };
  if (/(price|cost|how much|fee|offer|discount|special|deal)/.test(t))
    return { text: 'Current offers: Packs Unlimited kids plan at $99 a year, 15% off sunglasses and 10% senior discount on frames and sunglasses. Exam and treatment prices are quoted up front, and aesthetics include an exact written quote first.', links: [{ label: 'Offers', href: '/offers/' }, tel] };
  if (/(book|appoint|schedule|exam|see a doctor|visit)/.test(t) || t === 'book')
    return { text: 'You can request an appointment online in about a minute. Choose a service and a preferred day, and our office will call to confirm. Please do not share health details in the form.', links: [book, tel] };
  if (/(phone|call|number|contact|email|fax)/.test(t))
    return { text: `Phone: ${SITE.phone}. Email: ${SITE.email}. ${hoursText(now)}`, links: [tel, { label: 'Email the office', href: `mailto:${SITE.email}` }] };
  return { text: `I can help with hours, directions, services, insurance, offers and booking. For anything else, or for medical questions, please call ${SITE.phone}.`, links: [tel, book] };
}
export const GREETING = 'Hi! I am the Pack Optical assistant. I answer from this website: hours, services, insurance, offers and booking. I cannot give medical advice. What can I help with?';

