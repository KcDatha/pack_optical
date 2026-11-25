// Aesthetics page content taken from the live site (content/wp-services-raw.json, service "aesthetics-in-fort-worth").
// Wording is shortened from the live text; no claims, prices or recovery times were added.
import type { ImageMetadata } from 'astro';
import diolazeLeg from '../assets/aesthetics/diolaze-leg.webp';
import formaJaw from '../assets/aesthetics/forma-jawline-neck.webp';
import defineForma from '../assets/aesthetics/define-forma-neck.webp';
import lumeccaFreckles from '../assets/aesthetics/lumecca-freckles.webp';
import morpheusOne from '../assets/aesthetics/morpheus8-one-session.webp';
import lumeccaIpl from '../assets/aesthetics/lumecca-ipl-one-session.webp';
import diolazeArms from '../assets/aesthetics/diolaze-arms.webp';
import morpheusThree from '../assets/aesthetics/morpheus8-three-treatments.webp';

export interface Treatment { id: string; name: string; liveHeading: string; text: string; learnMore?: string }
export const treatments: Treatment[] = [
  { id: 'morpheus8', name: 'Morpheus8', liveHeading: 'Microneedling – Face & Neck', learnMore: 'https://inmodemd.com/workstation/morpheus8/',
    text: 'Revitalize and firm up your skin with our Morpheus8 microneedling treatment. A go-to strategy for skin tightening on both the face and body, this procedure can reduce the appearance of stretch marks, scars, and fine lines while evening out wrinkles.' },
  { id: 'lumecca', name: 'Lumecca', liveHeading: 'IPL',
    text: 'Step into the light with Lumecca and intense pulsed light (IPL) therapy treatments that target pigment irregularities. IPL can diminish the appearance of sun spots, brown spots, freckles, age spots, and the redness associated with rosacea.' },
  { id: 'forma', name: 'Forma', liveHeading: 'Skin Tightening',
    text: 'With our radiofrequency skin tightening technology, you can remodel your facial features, improving skin texture and complexion without surgery. Experience a firmer, more contoured appearance and enjoy the benefits of a rejuvenated complexion.' },
  { id: 'define', name: 'Define face contouring', liveHeading: 'Face Contouring',
    text: 'Our Define contouring treatments bring you a hands-free, noninvasive option for enhancing your natural contours. Contouring can help elevate the look of your cheeks, neck, and jawline while offering a sleek, defined finish with minimal downtime.' },
  { id: 'diolaze', name: 'Diolaze', liveHeading: 'Hair Removal',
    text: 'Experience the convenience and comfort of comprehensive hair removal with Diolaze, our laser hair removal solution. Say goodbye to unwanted hair and hello to smooth, touchable skin. This high-speed treatment can ease your grooming routine and provide lasting results.' },
];
export const modernApproach = 'At Pack Optical, we are adapting with the times by offering InMode technologies that help bring forth the beauty that lies just beneath the surface. Our modern techniques offer safe, minimally-invasive procedures with a focus on lasting results. Whether you want to rejuvenate your complexion or contour your features, we have the tools and expertise to help you rediscover a more youthful version of yourself.';

export interface GalleryItem { src: ImageMetadata; treatment: string; alt: string; caption: string; sourceUrl: string }
const U = 'https://packoptical.com/wp-content/uploads/2024/04/';
export const gallery: GalleryItem[] = [
  { src: morpheusOne, treatment: 'Morpheus8', caption: 'Morpheus8, after one session', alt: 'Before and after photo of Morpheus8 microneedling on the face, after one session', sourceUrl: U + 'Morpheus8-Before-and-after.jpg' },
  { src: morpheusThree, treatment: 'Morpheus8', caption: 'Morpheus8, after three treatments', alt: 'Before and after photo of Morpheus8 microneedling on the face, after three treatments', sourceUrl: U + 'packoptical-aesthetics-before-and-after.jpg' },
  { src: lumeccaFreckles, treatment: 'Lumecca', caption: 'Lumecca IPL for pigmentation', alt: 'Before and after photo of Lumecca IPL treatment for freckles and pigmentation, face in profile', sourceUrl: U + 'Lumecca-Before-and-after.jpg' },
  { src: lumeccaIpl, treatment: 'Lumecca', caption: 'Lumecca IPL, before, day after and after one session', alt: 'Before and after photo of Lumecca IPL treatment, showing before, the day after and after one session', sourceUrl: U + 'image.png' },
  { src: formaJaw, treatment: 'Forma', caption: 'Forma skin tightening, jawline and neck', alt: 'Before and after photo of Forma skin tightening on the jawline and neck', sourceUrl: U + 'Forma-Before-and-after.jpg' },
  { src: defineForma, treatment: 'Define + Forma', caption: 'Define and Forma, neck and jawline', alt: 'Before and after photo of Define face contouring combined with Forma on the neck and jawline', sourceUrl: U + 'Lumecca-Before-and-after-2.jpg' },
  { src: diolazeLeg, treatment: 'Diolaze', caption: 'Diolaze laser hair removal, leg', alt: 'Before and after photo of Diolaze laser hair removal on a leg, untreated and treated side by side', sourceUrl: U + 'Diolaze-Before-and-after.jpg' },
  { src: diolazeArms, treatment: 'Diolaze', caption: 'Diolaze laser hair removal, arms', alt: 'Before and after photo of Diolaze laser hair removal on the arms after one session', sourceUrl: U + 'packoptical-aesthetics-before-and-after-1.jpg' },
];
