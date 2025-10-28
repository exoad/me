import type { TShowcasePhoto } from '../types.d.ts';

import baImg from '../assets/images/photos/ba.webp';
import erImg from '../assets/images/photos/er.webp';
import jivImg from '../assets/images/photos/jiv.webp';
import livImg from '../assets/images/photos/liv.webp';
import qiImg from '../assets/images/photos/qi.webp';
import shiImg from '../assets/images/photos/shi.webp';
import shiyiImg from '../assets/images/photos/shiyi.webp';
import siImg from '../assets/images/photos/si.webp';
import wuImg from '../assets/images/photos/wu.webp';
import yiImg from '../assets/images/photos/yi.webp';
import nycStreeImg from '../assets/images/photos/nyc_stree.webp';
import nycStreeImg2 from '../assets/images/photos/nyc_stree2.webp';
import nycDowntownImg from '../assets/images/photos/nyc_downtown.webp';

/* bucket endpoint: https://exoad.github.io/me-pictures-bucket/ */
export const photos: TShowcasePhoto[] = [
    {
        src: "https://exoad.github.io/me-pictures-bucket/photo%20(4).jpg",
        alt: "New York City @ 10th Ave",
        caption: "Urban NYC Evening",
        location: "New York City, NY",
        date: "2024-12-31",
        thumbnailSrc: yiImg
    },
    {
        src: "https://exoad.github.io/me-pictures-bucket/IMG_20251028_104400.jpg",
        alt: "Bustling NYC",
        caption: "Bustling NYC",
        location: "New York City, NY",
        date: "2024-06-07",
        thumbnailSrc: nycStreeImg
    },
    {
        src: "https://exoad.github.io/me-pictures-bucket/IMG_20251028_104651.jpg",
        alt: "City Cross Section",
        caption: "City Cross Section",
        location: "New York City, NY",
        date: "2024-12-24",
        thumbnailSrc: nycStreeImg2
    },
    {
        src: "https://exoad.github.io/me-pictures-bucket/photo%20(7).jpg",
        alt: "Sunset Pier",
        caption: "Sunset Over The Lake",
        location: "Great Neck, NY",
        date: "2025-07-22",
        thumbnailSrc: siImg
    },
    {
        src: "https://exoad.github.io/me-pictures-bucket/photo%20(11).jpg",
        alt: "LIRR Train Station Platform",
        caption: "LIRR",
        location: "Little Neck, NY",
        date: "2024-12-31",
        thumbnailSrc: baImg
    },
    {
        src: "https://exoad.github.io/me-pictures-bucket/photo%20(8).jpg",
        alt: "Hudson Evening Waterfront",
        caption: "Evening by the Hudson",
        location: "New York City, NY",
        date: "2024-06-01",
        thumbnailSrc: wuImg
    },
    {
        src: "https://exoad.github.io/me-pictures-bucket/IMG_20251028_105547.jpg",
        alt: "NYC Downtown Skyline",
        caption: "Downtown Skyline",
        location: "New York City, NY",
        date: "2024-12-31",
        thumbnailSrc: nycDowntownImg
    },
    {
        src: "https://exoad.github.io/me-pictures-bucket/photo%20(10).jpg",
        alt: "Penn State - Huck Institutes of the Life Sciences",
        caption: "Cold & Rainy",
        location: "State College, PA",
        date: "2024-11-14",
        thumbnailSrc: qiImg
    },
    {
        src: "https://exoad.github.io/me-pictures-bucket/photo%20(9).jpg",
        alt: "Evening Street View",
        caption: "A Quiet Street",
        location: "TangShan, China",
        date: "2024-07-22",
        thumbnailSrc: livImg
    },

    {
        src: "https://exoad.github.io/me-pictures-bucket/photo%20(1).jpg",
        alt: "Waterfront NYC View",
        caption: "NYC Waterfront",
        location: "New York City, NY",
        date: "2024-12-31",
        thumbnailSrc: jivImg
    },
    {
        src: "https://exoad.github.io/me-pictures-bucket/photo%20(2).jpg",
        alt: "In flight on a Cessna",
        caption: "Above the patchwork",
        location: "College Park, MD",
        date: "2025-08-31",
        thumbnailSrc: shiImg
    },
    {
        src: "https://exoad.github.io/me-pictures-bucket/photo%20(5).jpg",
        alt: "Above The Clouds",
        caption: "Cloudscape from Above",
        location: "Warsaw, Poland",
        date: "2024-7-11",
        thumbnailSrc: erImg
    },
    {
        src: "https://exoad.github.io/me-pictures-bucket/photo%20(3).jpg",
        alt: "SuZhou Canals",
        caption: "Canals of SuZhou",
        location: "SuZhou, China",
        date: "2024-07-22",
        thumbnailSrc: shiyiImg
    }
];
