"use client";

/** View / open patient action — pattern + embedded PNG (design asset). */
export default function PatientViewActionIcon({
  className,
}: {
  className?: string;
}) {
  const pid = "patient-view-action";
  const patternId = `${pid}-pattern`;
  const imageId = `${pid}-image`;

  return (
    <svg
      className={className}
      width='39'
      height='42'
      viewBox='0 0 39 42'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      aria-hidden
    >
      <defs>
        <pattern
          id={patternId}
          patternContentUnits='objectBoundingBox'
          width='1'
          height='1'
        >
          <use
            href={`#${imageId}`}
            transform='matrix(0.0111111 0 0 0.0103175 0 0.0357143)'
          />
        </pattern>
        <image
          id={imageId}
          width='90'
          height='90'
          preserveAspectRatio='none'
          href='data:image/png;base64,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'
        />
      </defs>
      <rect width='39' height='42' fill={`url(#${patternId})`} />
    </svg>
  );
}
