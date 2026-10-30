import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// globals.css에 정의한 HIG 타입 스케일을 글자 크기로 알려줘야
// `text-destructive text-body`처럼 색과 크기를 함께 쓸 때 색이 지워지지 않는다
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'large-title',
            'title1',
            'title2',
            'title3',
            'headline',
            'body',
            'callout',
            'subheadline',
            'footnote',
            'caption',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
