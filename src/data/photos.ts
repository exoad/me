import type { TShowcasePhoto } from '../types.d.ts';

import baImg from '../assets/images/photos/ba.webp';
import erImg from '../assets/images/photos/er.webp';
import jivImg from '../assets/images/photos/jiv.webp';
import livImg from '../assets/images/photos/liv.webp';
import qiImg from '../assets/images/photos/qi.webp';
import sanImg from '../assets/images/photos/san.webp';
import shiImg from '../assets/images/photos/shi.webp';
import shiyiImg from '../assets/images/photos/shiyi.webp';
import siImg from '../assets/images/photos/si.webp';
import wuImg from '../assets/images/photos/wu.webp';
import yiImg from '../assets/images/photos/yi.webp';


export const photos: TShowcasePhoto[] = [
    {
        src: yiImg,
        alt: "New York City @ 10th Ave",
        caption: "Urban NYC Evening",
        location: "New York City, NY",
        date: "2024-12-31",
        thumbnailSrc: yiImg
    },
    {
        src: erImg,
        alt: "Above The Clouds",
        caption: "Cloudscape from Above",
        location: "Warsaw, Poland",
        date: "2024-7-11",
        thumbnailSrc: erImg
    },
    {
        src: sanImg,
        alt: "Penn State - West Campus",
        caption: "Autumn Campus Walk",
        location: "State College, PA",
        date: "2024-11-04",
        thumbnailSrc: sanImg
    },
    {
        src: siImg,
        alt: "Sunset Pier",
        caption: "Sunset Over The Lake",
        location: "Great Neck, NY",
        date: "2025-07-22",
        thumbnailSrc: siImg
    },
    {
        src: wuImg,
        alt: "Hudson Evening Waterfront",
        caption: "Evening by the Hudson",
        location: "New York City, NY",
        date: "2024-06-01",
        thumbnailSrc: wuImg
    },
    {
        src: livImg,
        alt: "Evening Street View",
        caption: "A Quiet Street",
        location: "TangShan, China",
        date: "2024-07-22",
        thumbnailSrc: livImg
    },
    {
        src: qiImg,
        alt: "Penn State - Huck Institutes of the Life Sciences",
        caption: "Cold & Rainy",
        location: "State College, PA",
        date: "2024-11-14",
        thumbnailSrc: qiImg
    },
    {
        src: baImg,
        alt: "LIRR Train Station Platform",
        caption: "LIRR",
        location: "Little Neck, NY",
        date: "2024-12-31",
        thumbnailSrc: baImg
    },
    {
        src: jivImg,
        alt: "Waterfront NYC View",
        caption: "NYC Waterfront",
        location: "New York City, NY",
        date: "2024-12-31",
        thumbnailSrc: jivImg
    },
    {
        src: shiImg,
        alt: "In flight on a Cessna",
        caption: "Above the patchwork",
        location: "College Park, MD",
        date: "2025-08-31",
        thumbnailSrc: shiImg
    },
    {
        src: shiyiImg,
        alt: "SuZhou Canals",
        caption: "Canals of SuZhou",
        location: "SuZhou, China",
        date: "2024-07-22",
        thumbnailSrc: shiyiImg
    }
];
