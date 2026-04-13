"use client";

const HOME_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAADK0lEQVR4nO2cPU9UQRSGx2jQxsRajTQQmEMMWebwEThnbyk2WpFoZ2XlR2lrp/4EKxP0D2jlL1BpxMrGSqNQqpgYE42YWT8W5Gth594ze/d9ktPwtTsPL3PnzSXXOQAAAAAAsIHBojhGrPeIZcUHWfWsd+PHNn4N6JKRxuxJYn1BrOubJshLCnNnuv35wDnnudnwrG+3SG7PBx9kGrK6YJTlEgX9uovkPyPfaFKvQPZ+WVg4HPfgvQVvHh/0flEUR/b9ev3IyOzscR/k8X4l/5PN8nR8vDhhvY6soUYx5FleH1TyBtlvxhpNb72eLBmb0HOe5WO3ktsnEl0jbl6wXldWEMtVH+R7Msnt498PCnLL9TuDsYQEXUwueGu6F/cqN0Q08LcQbTk+xgsz0YDr1RLiWZZKl9zet5fia+70fvY65cTPuxqWkPVyplXfty032yR5s+ggq66XoCCXOyshpcnettx08r2uziWEytpK/is3tRA90ioh+sRa7m7lpudF++nmcIoSUqLsVrnpadGe584TyydrmR3I7qgouRzx3LzZKgwZiKRE43JiaGj+qA/ywFoK1Vn0jndCuB7jcmA06IQP8s5aBtVZtH0J0ZqLzqyEUB1Fx4N+PPBbL54qnMrv3OReQqjEckNTQpVIpkmZT3onhHtsgq75oBdLlVzHEkIHm58+6G3n3KGkguPdBR/kUQYLXM9qgj5MeufFs9wxXxTnOdFNMtHxvpn1gijbkRWI5gpEB32fTHQ/lRIy3TrixfC3bGwhbPBvCNZpooqndKEQrRBNSLT9nzph61Bzadij2V4oLoZcnhSI5mrSB9EM0VkXFodEK0TXqRk6JFohGolWnKMJW4f9fkzYoyE6CdapJSQaopNinVpCoiE6KdapJSQaopNinVpCoiE6KdapJSTaXjRl8Mvri0QTRKu5sJ5LtGf5Yr14qmqCfrYUXdkDAsl+ntuJDnKjjxJ9zfixPvrKXAKXOz7osvmzSc9OFafrLNsHXR6emTnlciAmm4Jcj/tYHS6QPq4hyLO4XZgnGQAAAAAAAAAAAMDlxy8NpBOmbQb60gAAAABJRU5ErkJggg==";

const PATIENTS_PNG =
  "data:image/png;base64,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";

const CALENDAR_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACQUlEQVR4nO2dQW7TUBRF/z4YM2+7sPjRJaB/1Q2g/9UdwIBhafeEkFDbMC0yk1Z1IxsU5Pucc6UzSXT13/OJncxSyn/I7mN/H7V9HWq7D/Wnl4yvDbV9+VD7u2KaXfL5J8sMaj9eLzJZTO2741K75PNPMn6y5pZ5pn0uZonk80/y1m1+8FNW289iliH5/JO8Hvpv31872eff3EKRfP7NLRTJ59/cQuE4f9Tri1C/G2p7XP6L423mFnKnHHn+8ZoOtd2O13ixjKH2X64LRXIhz7T95VU7nxeifpdjoZ5cyJ+75WZWyDEeUwjpS3lYcodkWugpuZD5HwXZFgqEeC0UCPFaKBACgZC+WRAiLxAiLxAiLxAiLxAiLxAiLxAiLxCiZEIIIYSQf83aX3JxYiBEXiBEXiBEXiBEXiBEXiBEXiBEXiBEXiBEXiBEXiBEJy5k9sAD55YkPYSY9RBi1kOIWQ8hZj2EmPUQYtZDiFkPIWY9hJj10gmBjpBIBELkBUJ04kJmDzxwbknSQ4hZDyFmPYSY9RBi1kOIWQ8hZj2EmPUQYtZDiFkvnRDoCIlEIEReIEQnLmT2wAPnliQ9hJj1EGLWQ4hZDyFmPYSY9RBi1kOIWQ8hZj2EmPXSCYGOkEgEQuQFQuQFQuQFQuQFQuQFQuQFQuQFQuQFQuQFQpRMyLH/4B76QYba7pcIuV170DgRhtpu5h9Z9foi1PZrDxubp+2H+umsLMnlVTsP9W+h/rD+4H1zj6nxzlgsgxBCCCnL8hsKbqgkw22IfwAAAABJRU5ErkJggg==";

const PRESCRIPTION_PNG =
  "data:image/png;base64,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";

type IconProps = { className?: string };

export function SidebarHomeIcon({ className }: IconProps) {
  return (
    <svg
      width={26}
      height={24}
      viewBox='0 0 26 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      className={className ?? "h-6 w-auto shrink-0"}
      aria-hidden
    >
      <rect width='26' height='24' fill='url(#sidebar_pattern_home)' />
      <defs>
        <pattern
          id='sidebar_pattern_home'
          patternContentUnits='objectBoundingBox'
          width='1'
          height='1'
        >
          <use
            xlinkHref='#sidebar_image_home'
            transform='matrix(0.0102564 0 0 0.0111111 0.0384615 0)'
          />
        </pattern>
        <image
          id='sidebar_image_home'
          width='90'
          height='90'
          preserveAspectRatio='none'
          xlinkHref={HOME_PNG}
        />
      </defs>
    </svg>
  );
}

export function SidebarPatientsIcon({ className }: IconProps) {
  return (
    <svg
      width={26}
      height={24}
      viewBox='0 0 26 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      className={className ?? "h-6 w-auto shrink-0"}
      aria-hidden
    >
      <rect width='26' height='24' fill='url(#sidebar_pattern_patients)' />
      <defs>
        <pattern
          id='sidebar_pattern_patients'
          patternContentUnits='objectBoundingBox'
          width='1'
          height='1'
        >
          <use
            xlinkHref='#sidebar_image_patients'
            transform='matrix(0.0102564 0 0 0.0111111 0.0384615 0)'
          />
        </pattern>
        <image
          id='sidebar_image_patients'
          width='90'
          height='90'
          preserveAspectRatio='none'
          xlinkHref={PATIENTS_PNG}
        />
      </defs>
    </svg>
  );
}

export function SidebarCalendarIcon({ className }: IconProps) {
  return (
    <svg
      width={26}
      height={24}
      viewBox='0 0 33 25'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      className={className ?? "h-6 w-auto shrink-0"}
      aria-hidden
    >
      <rect width='33' height='25' fill='url(#sidebar_pattern_calendar)' />
      <defs>
        <pattern
          id='sidebar_pattern_calendar'
          patternContentUnits='objectBoundingBox'
          width='1'
          height='1'
        >
          <use
            xlinkHref='#sidebar_image_calendar'
            transform='matrix(0.00757576 0 0 0.01 0.121212 0)'
          />
        </pattern>
        <image
          id='sidebar_image_calendar'
          width='100'
          height='100'
          preserveAspectRatio='none'
          xlinkHref={CALENDAR_PNG}
        />
      </defs>
    </svg>
  );
}

export function SidebarPrescriptionIcon({ className }: IconProps) {
  return (
    <svg
      width={26}
      height={24}
      viewBox='0 0 30 39'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      className={className ?? "h-7 w-auto shrink-0"}
      aria-hidden
    >
      <rect width='30' height='39' fill='url(#sidebar_pattern_prescription)' />
      <defs>
        <pattern
          id='sidebar_pattern_prescription'
          patternContentUnits='objectBoundingBox'
          width='1'
          height='1'
        >
          <use
            xlinkHref='#sidebar_image_prescription'
            transform='matrix(0.01 0 0 0.00769231 0 0.115385)'
          />
        </pattern>
        <image
          id='sidebar_image_prescription'
          width='100'
          height='100'
          preserveAspectRatio='none'
          xlinkHref={PRESCRIPTION_PNG}
        />
      </defs>
    </svg>
  );
}
