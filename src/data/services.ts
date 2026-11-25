// Service page content. Source: demo.html service data + DRAFT expansions.
// Every field marked in `draft` was written for the sprint from the demo's facts and general
// patient education, and is PENDING DOCTOR REVIEW (BUILD_PLAN Phase 9 gate). Not for production until approved.
import demo from './demo-data.json';
import { SERVICE_SLUGS } from './site';

export interface Faq { q: string; a: string }
export interface Service {
  slug: string; key: string; hubTitle: string; hubDesc: string;
  title: string; description: string; keyword: string;
  h1: string; eyebrow: string; intro: string;
  what: string[]; who: string[]; steps: { h: string; p: string }[]; benefits: string[];
  expect: string[]; acc: [string, string][]; faqs: Faq[]; related: string[]; bookLabel: string;
  emergency?: boolean;
}

type Draft = Pick<Service, 'title' | 'description' | 'keyword' | 'steps' | 'benefits' | 'faqs' | 'bookLabel'> & { moreWhat: string[]; related: string[]; emergency?: boolean };

const DRAFT: Record<string, Draft> = {
  'adult-senior': {
    title: 'Eye Exam Fort Worth | Adult & Senior Eye Exams | Pack',
    description: 'Thorough adult and senior eye exams in Fort Worth, TX. Retinal imaging, early disease checks and clear explanations at Pack Optical. Call 817-831-6141.',
    keyword: 'eye exam Fort Worth', bookLabel: 'Book an eye exam',
    moreWhat: [
      'A comprehensive exam is more than a glasses check. Your eyes are one of the few places in the body where a doctor can look directly at blood vessels and nerve tissue, so a careful exam can reveal changes in eye health, and sometimes clues about general health, long before you notice symptoms.',
      'We take the time each exam needs. Most visits run 30 to 60 minutes, and we explain what we are seeing as we go, so you leave understanding your results rather than just holding a prescription.',
    ],
    steps: [
      { h: 'Check-in and history', p: 'We review your health history, medications and any symptoms, such as blur, glare, headaches or trouble driving at night.' },
      { h: 'Vision and refraction', p: 'We measure how clearly you see at distance and up close and refine your prescription for glasses or contact lenses.' },
      { h: 'Eye health evaluation', p: 'We examine the front and back of each eye, check eye pressure and use digital retinal imaging (Optomap) to see the retina in detail.' },
      { h: 'Your results and plan', p: 'The doctor explains the findings, gives you your prescription and, if something needs a specialist, arranges the referral.' },
    ],
    benefits: ['Early detection of conditions that often have no early symptoms', 'Findings explained as we go, without jargon', 'Updated prescription for sharper, more comfortable vision', 'Glasses, contacts and eye health care at one address', '10% senior discount on frames and sunglasses'],
    faqs: [
      { q: 'How often should adults have an eye exam?', a: 'Adults and seniors are generally advised to have an exam every year, and sooner if vision changes. Your doctor will recommend a schedule based on your eye health and any medical conditions.' },
      { q: 'How long does an exam take?', a: 'Most exams take 30 to 60 minutes. We never rush, and a visit can run up to a full hour when more testing is helpful.' },
      { q: 'Will my eyes be dilated?', a: 'Dilation is used only when it is needed, and you will be told beforehand. Our retinal imaging often gives a detailed view without it.' },
      { q: 'What should I bring?', a: 'Please bring your insurance card, your medication list, your current glasses and, if you wear contacts, your contact lens box.' },
      { q: 'Do you take my insurance?', a: 'We work with most major vision and medical plans, including VSP, EyeMed, BCBS of Texas, Aetna, Cigna and Medicare. Use the checker in the Patient Centre or call us and we will verify before your visit.' },
    ],
    related: ['childrens', 'diabetic'],
  },
  childrens: {
    title: "Children's Eye Exams Fort Worth | Kids Eye Doctor | Pack",
    description: "Gentle children's eye exams in Fort Worth, TX, plus the $99 Packs Unlimited kids plan. Early checks, myopia options and honest answers. Call 817-831-6141.",
    keyword: "kids eye exam Fort Worth", bookLabel: "Book a kids' exam",
    moreWhat: [
      'Children rarely complain about their vision because they assume everyone sees the way they do. That is why regular exams matter: a problem can affect reading, schoolwork and confidence for a long time before anyone realises its source.',
      'We keep exams calm and age appropriate. Younger children are tested with pictures and shapes rather than letters, and we work at your child\'s pace so the visit feels easy rather than clinical.',
    ],
    steps: [
      { h: 'A friendly start', p: 'We chat with you and your child about reading, screen time, headaches and anything you have noticed at home or school.' },
      { h: 'Vision and eye teaming', p: 'We check how clearly your child sees, how the eyes work together, and how well they track and focus.' },
      { h: 'Eye health check', p: 'We look at the health of the eyes, check colour vision and depth perception, and screen for common childhood eye conditions.' },
      { h: 'A clear explanation', p: 'You receive a plain-language report of what we found, what it means for school and play, and whether glasses or follow-up are needed.' },
    ],
    benefits: ['Problems found early, while they are easier to manage', 'A patient, child-friendly approach', 'Packs Unlimited: $99 a year for unlimited exams, $25 frame and lens sets and $25 replacements', 'Same-day pickup on glasses', 'Myopia management options discussed when relevant'],
    faqs: [
      { q: 'When should my child first have an eye exam?', a: 'We follow the AOA schedule: a first exam at 6 to 12 months, another between ages 3 and 5, then before first grade and every year after that.' },
      { q: 'How do I know if my child has a vision problem?', a: 'Common signs include squinting, sitting close to the TV, losing their place while reading, rubbing their eyes, headaches and avoiding reading. Many children show no signs at all, which is why routine exams matter.' },
      { q: 'What is the Packs Unlimited plan?', a: 'Packs Unlimited is our kids plan at $99 per year. It includes unlimited children\'s eye exams for the year, $25 frame and lens sets and $25 replacements, with same-day pickup.' },
      { q: 'Can you help slow down nearsightedness in children?', a: 'Myopia management options such as Ortho-K, atropine, multifocal contacts and MiSight can be discussed during your visit, depending on your child\'s eyes.' },
      { q: 'Does my child need dilation?', a: 'Only when the doctor decides it will help. You will always be told in advance and given a chance to ask questions.' },
    ],
    related: ['adult-senior', 'contacts'],
  },
  diabetic: {
    title: 'Diabetic Eye Exam Fort Worth | Retina Screening | Pack',
    description: 'Annual diabetic eye exams in Fort Worth, TX with digital retinal imaging and OCT. Reports shared with your care team. Pack Optical, 817-831-6141.',
    keyword: 'diabetic eye exam Fort Worth', bookLabel: 'Book a diabetic eye exam',
    moreWhat: [
      'High blood sugar can damage the tiny blood vessels in the retina. In its early stages this usually causes no symptoms, so a person can feel fine while changes are already under way. Regular exams are how those changes are found early.',
      'Your exam also looks at the other eye problems that are more common with diabetes, including cataracts and glaucoma, so one visit covers the full picture of your eye health.',
    ],
    steps: [
      { h: 'Review of your diabetes history', p: 'We ask about how long you have had diabetes, recent blood sugar readings and any vision changes, along with your blood pressure and cholesterol.' },
      { h: 'Dilated retinal examination', p: 'Drops widen the pupil so the doctor can see the retina clearly. You may be light sensitive for a few hours, so sunglasses help.' },
      { h: 'Imaging', p: 'Digital retinal imaging and OCT record the retina in detail so changes can be compared from one year to the next.' },
      { h: 'Report and next steps', p: 'We explain any findings in plain language and send a report to your primary care doctor or endocrinologist.' },
    ],
    benefits: ['Changes found before they affect your vision', 'Imaging that tracks your eyes year over year', 'Report shared with your wider care team', 'Medical insurance often applies to diabetic eye exams', 'Clear guidance on what protects your eyes'],
    faqs: [
      { q: 'How often do I need a diabetic eye exam?', a: 'Most people with type 1 or type 2 diabetes are advised to have a dilated exam every year. Your doctor may recommend more often if changes are found.' },
      { q: 'I see fine. Do I still need an exam?', a: 'Yes. Early diabetic eye changes often cause no symptoms, so the exam is what finds them. By the time vision changes, damage can be harder to reverse.' },
      { q: 'Does the exam hurt?', a: 'No. The dilating drops may sting briefly, and bright lights can feel uncomfortable afterward, but the exam itself is painless.' },
      { q: 'Will you send results to my other doctors?', a: 'Yes. With your permission we share a report with your primary care doctor or endocrinologist so everyone is working from the same information.' },
      { q: 'Will my insurance cover it?', a: 'Diabetic eye exams are often billed to medical insurance rather than vision insurance. Bring both cards and we will confirm what applies before your visit.' },
    ],
    related: ['eye-disease', 'adult-senior'],
  },
  contacts: {
    title: 'Contact Lens Fitting Fort Worth | Exams & Brands | Pack',
    description: 'Contact lens exams and fittings in Fort Worth, TX. Daily, toric, multifocal, scleral and Ortho-K lenses with training. Pack Optical, 817-831-6141.',
    keyword: 'contact lens fitting Fort Worth', bookLabel: 'Book a contact lens fitting',
    moreWhat: [
      'Contacts sit directly on the surface of your eye, so a good fit matters for both comfort and eye health. A contact lens prescription includes measurements that a glasses prescription does not, which is why it needs its own fitting.',
      'There is a lens for most situations, from simple daily disposables to custom lenses for astigmatism, reading vision, or corneas that are hard to fit. We help you choose what suits your eyes and your routine.',
    ],
    steps: [
      { h: 'Measurements', p: 'We measure the curve of your cornea and assess your tear film, so the lens we choose sits comfortably and stays moist.' },
      { h: 'Lifestyle conversation', p: 'We ask about your work, screen time, sports and how many hours a day you want to wear lenses.' },
      { h: 'Trial lenses', p: 'You try lenses in the office so we can check the fit and your vision before you commit to a supply.' },
      { h: 'Training and follow-up', p: 'New wearers learn insertion, removal and care, and we schedule a follow-up to make sure everything is working well.' },
    ],
    benefits: ['A fit measured for your eyes, not a guess', 'Hands-on training for new wearers', 'Options for astigmatism, reading vision and hard-to-fit eyes', 'Major brands including Alcon, Acuvue, Bausch + Lomb and CooperVision', 'Easy reordering through our online contact lens store'],
    faqs: [
      { q: 'Is a contact lens exam different from a regular eye exam?', a: 'Yes. A contact lens fitting adds measurements of the cornea and tear film plus a check of how the lens sits on your eye. The prescription differs from a glasses prescription.' },
      { q: 'Can I wear contacts if I have astigmatism?', a: 'Often, yes. Toric lenses are designed for astigmatism, and your doctor will tell you whether they suit your eyes.' },
      { q: 'Can I sleep in my contacts?', a: 'Not unless your doctor has prescribed lenses for overnight wear. Sleeping in lenses raises the risk of eye infection.' },
      { q: 'What are scleral lenses and Ortho-K?', a: 'Scleral lenses are larger lenses that vault over the cornea and can help with keratoconus or severe dry eye. Ortho-K lenses are worn overnight to reshape the cornea and are sometimes used for myopia control.' },
      { q: 'How do I reorder my lenses?', a: 'Use the Order Contacts link at the top of this site to reorder through our online store at any time.' },
    ],
    related: ['childrens', 'adult-senior'],
  },
  'dry-eye': {
    title: 'Dry Eye Treatment Fort Worth | Dry Eye Clinic | Pack',
    description: 'Dry eye treatment in Fort Worth, TX. A Center of Excellence using IPL and radiofrequency to treat the cause, not just symptoms. Pack Optical, 817-831-6141.',
    keyword: 'dry eye treatment Fort Worth', bookLabel: 'Book a dry eye consultation',
    moreWhat: [
      'The most common form of dry eye is evaporative, where the oil layer of the tears is poor because the meibomian glands in the eyelids are blocked or underperforming. Replacing tears with drops can feel good for a few minutes without changing that underlying cause.',
      'That is why we begin with diagnosis. Understanding which type of dry eye you have, and how your glands are doing, lets us recommend care that fits, and tell you honestly when treatment will not help.',
    ],
    steps: [
      { h: 'Symptom review', p: 'We ask when your eyes feel worst, how drops help, how much screen time you have and what medications or contact lenses you use.' },
      { h: 'Diagnostic testing', p: 'Tests such as LipiView, LipiScan, meibography, tear osmolarity, MMP-9 and Schirmer\'s test show how your tears and glands are working.' },
      { h: 'Your personalised plan', p: 'We explain your type of dry eye and recommend care, which may include lid hygiene, warm compresses, prescription drops, plugs or in-office therapy.' },
      { h: 'In-office therapy', p: 'When it is appropriate, our four-step gland plan combines IPL therapy, radiofrequency, manual expression and Regener-Eyes, with follow-up to track progress.' },
    ],
    benefits: ['Care aimed at the cause, not only the symptoms', 'Thorough diagnostic testing before any treatment', 'A range of options from simple home care to in-office therapy', 'Honest guidance: treatment only if it will genuinely help', 'Dry eye and med spa technology under one roof'],
    faqs: [
      { q: 'What causes dry eye?', a: 'Common contributors include screens, aging, air conditioning, contact lens wear and hormonal changes. Meibomian gland dysfunction, blepharitis and rosacea are frequent underlying causes.' },
      { q: 'How do I know if I have dry eye?', a: 'Burning, grittiness, watering, blur that clears when you blink, and drops that no longer help are all common. The 60-second quiz in our Patient Centre is a good first check, and an exam confirms it.' },
      { q: 'Why do my eyes water if they are dry?', a: 'When the surface of the eye is irritated, it can trigger reflex tearing. Those tears are watery and do not have the oil that keeps the tear film stable, so the eye still feels dry.' },
      { q: 'What does the four-step plan involve?', a: 'The plan combines IPL therapy (typically a series of four sessions), radiofrequency, manual expression of the glands and Regener-Eyes. Your doctor will tell you which steps suit you.' },
      { q: 'Will I need treatment forever?', a: 'It depends on the cause and severity. Many people need periodic maintenance, and your doctor will explain what to expect for you after your evaluation.' },
    ],
    related: ['ipl', 'digital-strain'],
  },
  ipl: {
    title: 'IPL Dry Eye Treatment Fort Worth | OptimaMAX | Pack Optical',
    description: 'IPL dry eye treatment in Fort Worth, TX using InMode OptimaMAX with radiofrequency. Treat inflamed, blocked glands. Pack Optical, 817-831-6141.',
    keyword: 'IPL dry eye treatment Fort Worth', bookLabel: 'Book an IPL consultation',
    moreWhat: [
      'IPL stands for intense pulsed light. In dry eye care, the light is applied to the skin around the eyes to calm inflammation and to warm the meibomian glands so that the oils they produce can flow more freely.',
      'Our OptimaMAX device combines IPL with radiofrequency. Together they target the inflammation and gland blockage behind many cases of evaporative dry eye, and the same treatment can improve the look of the skin it touches.',
    ],
    steps: [
      { h: 'Consultation and skin assessment', p: 'We confirm that IPL is appropriate for you, check your skin type and review your dry eye evaluation.' },
      { h: 'Protection and preparation', p: 'We cover your eyes with protective eyewear and apply a cooling gel to the treatment area.' },
      { h: 'Treatment', p: 'The doctor applies gentle pulses of light around the lids. A session usually takes about 10 to 15 minutes.' },
      { h: 'Aftercare and follow-up', p: 'Mild redness usually fades within hours. A course is typically about four sessions spaced weeks apart, and we check your progress along the way.' },
    ],
    benefits: ['Targets the inflammation and gland problems behind dry eye', 'Short sessions, typically 10 to 15 minutes', 'Relief that builds across sessions rather than wearing off in minutes', 'A photofacial bonus for sun spots, redness and uneven tone', 'Delivered by the same team that diagnoses your dry eye'],
    faqs: [
      { q: 'What is IPL treatment for dry eye?', a: 'IPL uses pulses of light around the eyes to reduce inflammation and help blocked oil glands work better. Combined with radiofrequency in OptimaMAX, it supports healthier oil flow in the tears.' },
      { q: 'Does it hurt?', a: 'Most people describe a warm snap sensation. Cooling gel and protective eyewear are used, and the sessions are short.' },
      { q: 'How many sessions will I need?', a: 'A course is typically about four sessions spaced weeks apart. Your doctor will tailor the plan to your evaluation.' },
      { q: 'Is IPL right for everyone?', a: 'No. It is best suited to evaporative dry eye, and your doctor will decide after an evaluation whether it is likely to help you.' },
      { q: 'What is the difference between IPL and drops?', a: 'Drops replace tears for a short time. IPL works on the inflamed, blocked glands that cause tears to fail, so improvement can build across sessions.' },
    ],
    related: ['dry-eye', 'aesthetics'],
  },
  emergency: {
    title: 'Emergency Eye Doctor Fort Worth | Same-Day Eye Care',
    description: 'Emergency eye care in Fort Worth, TX. Same-day appointments and walk-ins for eye pain, injury, infection or sudden vision change. Call 817-831-6141.',
    keyword: 'emergency eye doctor Fort Worth', bookLabel: 'Call about an eye emergency', emergency: true,
    moreWhat: [
      'Some eye problems cannot wait. Sudden vision loss, a curtain or shadow over your sight, severe pain, trauma, a chemical splash and new flashes or floaters should all be treated as urgent.',
      'Call us first. During office hours we prioritise emergencies, and a quick call lets the team prepare and tell you the fastest safe route to care.',
    ],
    steps: [
      { h: 'Call 817-831-6141', p: 'Tell us what has happened and when it started. We will advise whether to come straight in.' },
      { h: 'Same-day assessment', p: 'We make room for urgent cases Monday to Thursday, and walk-ins are welcome when something cannot wait.' },
      { h: 'Examination and treatment', p: 'The doctor examines the eye, treats what we can in the office and explains what is happening.' },
      { h: 'Follow-up or referral', p: 'If you need a specialist or hospital care we arrange it, and we schedule follow-up for what we treat here.' },
    ],
    benefits: ['Same-day appointments and walk-ins during office hours', 'Experienced care for injuries, infections and sudden changes', 'Clear instructions on what to do while you travel to us', 'Referral to specialists when needed', 'Continuity with your regular eye doctor'],
    faqs: [
      { q: 'What counts as an eye emergency?', a: 'Sudden vision loss, severe pain, injury, chemical exposure, a curtain over your vision, new flashes or a sudden shower of floaters, and signs of infection all need prompt attention.' },
      { q: 'What should I do if a chemical gets in my eye?', a: 'Flush the eye with clean water for 15 minutes while you call us or emergency services, and bring the container or details of the chemical.' },
      { q: 'Should I remove something stuck in my eye?', a: 'No. Do not rub the eye or remove an embedded object. Protect the eye and get care right away.' },
      { q: 'What if you are closed?', a: 'We are closed Friday to Sunday. If symptoms are severe, go to urgent care or the emergency room and ask them to contact us.' },
      { q: 'Do I need an appointment?', a: 'No. Please call first so we can prepare, but walk-ins are welcome during office hours when something cannot wait.' },
    ],
    related: ['eye-disease', 'adult-senior'],
  },
  'digital-strain': {
    title: 'Digital Eye Strain Help Fort Worth | Screen Eyes | Pack',
    description: 'Digital eye strain relief in Fort Worth, TX. Setup tips, the 20-20-20 rule and honest exam advice for screen-tired eyes. Pack Optical, 817-831-6141.',
    keyword: 'digital eye strain help Fort Worth', bookLabel: 'Book an eye exam',
    moreWhat: [
      'When we look at a screen we blink less, and the tears evaporate faster. Add glare, small text and a poor setup, and the eyes and neck work harder than they should. The result is the familiar mix of tired eyes, headaches and blur.',
      'Many people can feel better with simple changes to how they work. If symptoms continue, an exam can check for a prescription or focusing problem that makes screen work harder than it needs to be.',
    ],
    steps: [
      { h: 'Talk through your day', p: 'We ask how many hours you spend on screens, what devices you use and when symptoms appear.' },
      { h: 'Check your vision and focusing', p: 'We test your prescription, how well your eyes focus up close and how they work together.' },
      { h: 'Look at your eyes', p: 'We check for dryness and other eye health issues that can add to screen discomfort.' },
      { h: 'Personal recommendations', p: 'We suggest changes to your setup and habits, and lens options if they will help you.' },
    ],
    benefits: ['Practical changes you can start the same day', 'A check for prescription and focusing problems', 'Honest advice on whether blue-light glasses are worth it for you', 'Support for children and teens with heavy screen time', 'Dry eye care available if it is part of the picture'],
    faqs: [
      { q: 'What is digital eye strain?', a: 'It is a group of symptoms from prolonged screen use, including dry eyes, headaches, blurry vision and neck or shoulder pain.' },
      { q: 'What is the 20-20-20 rule?', a: 'Every 20 minutes, look at something 20 feet away for 20 seconds. It gives your focusing muscles a break and reminds you to blink.' },
      { q: 'How should I set up my screen?', a: 'A common guide is to place the screen about 4 to 5 inches below eye level and roughly 20 to 28 inches away, with lighting that avoids glare.' },
      { q: 'Do blue-light glasses work?', a: 'They help some people, and not others. We will tell you honestly whether they are worth it for your situation.' },
      { q: 'Are children affected too?', a: 'Yes. Children who spend more than three hours a day on screens are at higher risk, and regular exams help us catch problems early.' },
    ],
    related: ['dry-eye', 'adult-senior'],
  },
  'eye-disease': {
    title: 'Eye Disease Treatment Fort Worth | Glaucoma & AMD | Pack',
    description: 'Eye disease diagnosis and management in Fort Worth, TX. Glaucoma, cataracts and macular degeneration care with specialist co-management. 817-831-6141.',
    keyword: 'eye disease treatment Fort Worth', bookLabel: 'Book an eye health exam',
    moreWhat: [
      'Many serious eye diseases develop slowly and painlessly. Glaucoma can quietly reduce peripheral vision, cataracts cloud the lens over years, and macular degeneration can change central vision gradually. Catching them early gives you the most options.',
      'Our role is to diagnose and stage these conditions, monitor them over time and treat what we can in the office. When surgery or specialist treatment is needed, we coordinate with specialists and continue your care here.',
    ],
    steps: [
      { h: 'Risk and history review', p: 'We review your family history, health conditions and medications, plus any symptoms such as foggy vision, halos or wavy lines.' },
      { h: 'Detailed testing', p: 'Depending on your needs, testing may include eye pressure, visual fields, optic nerve imaging and retinal imaging.' },
      { h: 'Diagnosis and staging', p: 'We explain what we found, how advanced it is and what it means for your daily life.' },
      { h: 'Monitoring and co-management', p: 'We set a follow-up schedule, treat what is appropriate here and coordinate with specialists for surgery or injections.' },
    ],
    benefits: ['Early detection when treatment works best', 'Clear explanations of staging and what to expect', 'Ongoing monitoring close to home', 'Co-management with specialists when needed', 'Guidance on protecting your eyes long term'],
    faqs: [
      { q: 'What is glaucoma?', a: 'Glaucoma is a group of conditions that damage the optic nerve, often related to eye pressure. It is diagnosed with pressure checks, visual fields and nerve imaging, and managed with drops, laser or surgery referral.' },
      { q: 'How do I know if I have cataracts?', a: 'Foggy vision, trouble driving at night, halos and faded colours are common signs. An exam confirms them, and surgery is timed to when vision interferes with daily life.' },
      { q: 'What is macular degeneration?', a: 'It affects the central part of the retina. Signs include blurry central vision and straight lines that look wavy. There are dry and wet forms, managed differently.' },
      { q: 'Who is at higher risk?', a: 'Age and family history raise risk for several conditions, and diabetes, smoking, UV exposure and steroid use are also factors. Your doctor can explain which apply to you.' },
      { q: 'Can eye disease be prevented?', a: 'Not always, but UV protection, not smoking, a healthy diet and regular exams all help protect your eyes and catch changes early.' },
    ],
    related: ['diabetic', 'adult-senior'],
  },
  laser: {
    title: 'LASIK Consultation Fort Worth | Laser Eye Surgery | Pack',
    description: 'LASIK, PRK and SMILE consultations in Fort Worth, TX. Candidacy checks, honest advice and pre- and post-op co-management. Pack Optical, 817-831-6141.',
    keyword: 'LASIK consultation Fort Worth', bookLabel: 'Book a laser consultation',
    moreWhat: [
      'Laser vision correction reshapes the cornea so that light focuses properly on the retina. It is not right for everyone, and the first step is a careful assessment of your eyes, your prescription and your expectations.',
      'We act as your guide. We take the measurements and talk through the options with you, refer you to a surgeon for the procedure itself, and look after you before and after surgery.',
    ],
    steps: [
      { h: 'Consultation and goals', p: 'We talk about why you want laser correction, your lifestyle and what results you are hoping for.' },
      { h: 'Measurements and screening', p: 'We measure your prescription and corneas and check your eye health and dryness to see whether you are a candidate.' },
      { h: 'Options and risks', p: 'We explain how LASIK, PRK and SMILE differ and cover the risks honestly, including dry eye, halos and glare.' },
      { h: 'Referral and co-management', p: 'If you go ahead, we refer you to a surgeon and handle your pre-operative and post-operative care at Pack.' },
    ],
    benefits: ['An honest candidacy assessment before you commit', 'A clear comparison of LASIK, PRK and SMILE', 'Risks explained plainly', 'One care team from consultation through recovery', 'Follow-up close to home after surgery'],
    faqs: [
      { q: 'Am I a candidate for laser eye surgery?', a: 'Candidates are generally 18 or older with a stable prescription and healthy corneas. A consultation and measurements are needed to know for sure.' },
      { q: 'What is the difference between LASIK and PRK?', a: 'LASIK creates a corneal flap and has a quick recovery. PRK treats the surface with no flap and has a longer recovery, and it is often considered for thinner corneas.' },
      { q: 'What is SMILE?', a: 'SMILE is another laser option that can be discussed at your consultation, if it suits your eyes.' },
      { q: 'What are the risks?', a: 'Dry eye, halos and glare are possible. Most patients achieve 20/20 vision, but results are not guaranteed, and your consultation covers the full picture.' },
      { q: 'What is co-management?', a: 'Your optometrist handles the consultation, measurements and pre- and post-operative care, while the surgeon performs the procedure.' },
    ],
    related: ['contacts', 'adult-senior'],
  },
  aesthetics: {
    title: 'Med Spa Fort Worth | Morpheus8 & Aesthetics | Pack Optical',
    description: 'Med spa in Fort Worth, TX at your eye doctor. Morpheus8, IPL photofacial, Forma, Botox and laser with a written quote first. Call 817-831-6141.',
    keyword: 'med spa Fort Worth, Morpheus8 Fort Worth', bookLabel: 'Book a med spa consultation',
    moreWhat: [
      'Our med spa sits inside your eye doctor\'s office, so treatments around the eyes and face are planned by a medical team that knows the area well. We call the approach Spa-tometry: refreshed, never done.',
      'Every plan starts with a conversation, not a sales pitch. You will know what we recommend, what it costs and what to expect before any treatment begins.',
    ],
    steps: [
      { h: 'Consultation', p: 'You tell us your goals, we assess your skin and give honest advice about what will and will not help.' },
      { h: 'Personalised plan', p: 'We write down your plan and give you an exact quote before any treatment.' },
      { h: 'Treatment', p: 'Your treatment is performed by the medical team using technology matched to your plan.' },
      { h: 'Follow-up and aftercare', p: 'We check in, maintain your results and give you aftercare guidance to protect them.' },
    ],
    benefits: ['A written plan and exact quote before treatment', 'A medical team experienced around the eyes', 'Morpheus8, IPL photofacial, Forma, Botox, fillers, face contouring and laser hair removal', 'Eye care and aesthetics at one address', 'Natural-looking goals: refreshed, never done'],
    faqs: [
      { q: 'What is Morpheus8?', a: 'Morpheus8 combines microneedling with radiofrequency to treat texture and laxity on the face, jawline and neck. A plan is typically three sessions, 4 to 6 weeks apart, with best results about three months after the last one.' },
      { q: 'Do I need a consultation first?', a: 'Yes. Every aesthetics plan starts with a consultation, an honest assessment and an exact quote before any treatment.' },
      { q: 'How should I care for my skin afterward?', a: 'Avoid sun, heat and sauna for 48 to 72 hours, keep your skin moisturised and use SPF. Full guidance is given at your appointment.' },
      { q: 'Can I book eye care and aesthetics together?', a: 'Yes. You can request both on the same visit, or call us and we will arrange them for you.' },
      { q: 'Are aesthetics covered by insurance?', a: 'No. Aesthetics are self-pay, with an exact written quote before treatment.' },
    ],
    related: ['ipl', 'dry-eye'],
  },
};

const sp = demo.SP as unknown as Record<string, { crumb: string; eye: string; h1: string; intro: string; what: string; who: string[]; expect: string[]; acc: [string, string][] }>;
const hub = Object.fromEntries(demo.HUB.map((h) => [h[0], h]));

export const services: Service[] = Object.keys(sp).map((key) => {
  const d = DRAFT[key], s = sp[key], h = hub[key];
  return {
    slug: SERVICE_SLUGS[key], key, hubTitle: h[1], hubDesc: h[2],
    title: d.title, description: d.description, keyword: d.keyword,
    h1: s.h1, eyebrow: s.eye, intro: s.intro,
    what: [s.what, ...d.moreWhat], who: s.who, steps: d.steps, benefits: d.benefits,
    expect: s.expect, acc: s.acc, faqs: d.faqs, related: d.related, bookLabel: d.bookLabel, emergency: d.emergency,
  };
});

const staticRelated: Record<string, { label: string; href: string }> = {
  eyewear: { label: 'Eyewear & brands', href: '/eyewear/' }, visit: { label: 'Visit & hours', href: '/visit/' },
  offers: { label: 'Offers', href: '/offers/' }, blog: { label: 'Blog', href: '/blog/' },
};
export function relatedLinks(s: Service) {
  return s.related.map((k) => staticRelated[k] ?? { label: hub[k][1], href: `/services/${SERVICE_SLUGS[k]}/` });
}
export const getService = (slug: string) => services.find((s) => s.slug === slug);
