"use client";

/** Speaker / audio icon from design asset (pattern + embedded PNG). */
export default function AudioSupportIcon({ className }: { className?: string }) {
  const pid = "audio-support-icon";
  const patternId = `${pid}-pattern`;
  const imageId = `${pid}-image`;

  return (
    <svg
      className={className}
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-hidden
    >
      <rect width="25" height="25" fill={`url(#${patternId})`} />
      <defs>
        <pattern
          id={patternId}
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use href={`#${imageId}`} transform="scale(0.0111111)" />
        </pattern>
        <image
          id={imageId}
          width="90"
          height="90"
          preserveAspectRatio="none"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEEUlEQVR4nO2cTWhVRxTHfwgmJWohIkiTCLWx1k1XXVgXVgwuXFS3WqGLWiq2jW4suFQLfuCifvQD6aK2QYqudVHBhYti+mhJKkiLhrZEV1WJhNjaNNEnA0cIITP33vju3Jm55wezebx35/zPmzv3zDkzFxRFURRFURRFUZRCrAC2A18CF4Bh4A9gDJiUNiafDQHngUPym55iXdWLBcAm4AxwC2g+Z7sp1+qTa9eeHuAocKcFzrW128CRuo70l4FTwKMSHTy7melmAFhNDegADoroZkXtf/mTl5AoW+Q2bgbSRoG3SYh2GUFPCjhhWqIJ87v3gQ0y3XQCC6V1ymcb5DunJDqZLtCPsekE0EbkmAfQzzlFPwZ+AN4TJ86XpcBO4LJcM0/fDaCLSFkjt2czoz0ETgO9JdiwCvgc+CeHHX8BrxEZbwD3cozgbzyNpG7gbI4Rfldsj4JXgb8zBP0JvFWBbW/KYsZl2z25G4Ofk7Omi7MS5lXFIuC7HNNIV8jRhevBNw3sIxw+yYhQGqFGI6cznPwu4bENmHLY/RmBsdURJz8WQaGyw/GQfBLSoqZD5jTbqNhH+Ox32G9Ws4sJgOMOI78lHgYcOo5VbVyvJGnmMm4klJGQkyVSSJhLi0mCraRCvnbMbeuIj/WOZ40pJFQWM08mMGXM5pxF03+ywvTOUYtB/4Yc7OccQLaCxGE8s8CRW/6C+Dlj0Tbquwa5ybEweYX4We2IrTeG8I9fIR2uWjR+6dOIEYsRJuGeCrssGn/3ubnFFtItIx2WO0I9L9HHO5bOr5MeNyxaveRuDlk6NyWj1PjKovWAj84vWDrfTXp8bNH6vY/Oh0IIezzRZ9H6i4/ObSnRceAa8JHsu4iVNqBftIw7ap6lc9/S+cw2FOkyvBv4NYc+U8Atnbz75oakjhgLL8hOpzzaTIKpdJoF2h7iYW9BbaVTxJhB4qERs6MniIeHMTvai0Gp6grOoFR1BWdQqrqCMyhVXcEZlKqu4AxKVVdwBqWqKziDUtUVnEGp6poIzaAWUUSTSZ/WLyfQIoLL4QSX5WoRRTSZwkDptOdMjqfq6GGfZ1t6Cjg7FvI62fuO0nZJ7A9mPCBjwWb/hNQP+0M9paUoiqIoiqLMRezhaTSooz2hjvbAi1WmQ+vE2qoPBtWFkxZHX6RmtEse/CfZIzcmiZ5dLUj0vO44kvwhNaI7IyVrnP/SczjZ9rKtqUg305daZBgsMLIXy2vZTsqGcts1zYms2rC3YImpVe2BHOisDY0KnGxeHLCZmjFRgZNTPC8ZlKMf1HEk+5w6puTBV6s5eTZ7SnCsuUt+Ay7JNFGbEC4rvBtucXinOBYswxlOnu+CRbGcz362h8QswX8EPtCRrCiKoiiKwgyeAm8c8G5uFrV6AAAAAElFTkSuQmCC"
        />
      </defs>
    </svg>
  );
}
