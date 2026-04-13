"use client";

import { useEffect, useRef, useState } from "react";
import {
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentList,
  HiOutlineMagnifyingGlass,
  HiOutlineDocumentDuplicate,
  HiOutlineShieldCheck,
  HiOutlinePhoto,
  HiOutlineCheckCircle,
  HiOutlineCalendarDays,
  HiOutlineTrash,
  HiOutlineViewColumns,
  HiOutlinePlus,
  HiOutlineMinus,
} from "react-icons/hi2";
import { MdOutlineScience, MdOutlineBloodtype } from "react-icons/md";
import { useRouter } from "next/navigation";
import { ANAESTHESIA_PLAN_OPTIONS } from "@/lib/anaesthesia";
import { todayIsoDate } from "@/lib/surgeryDate";
import AuthorizationSection from "@/components/AuthorizationSection";
import DashboardUserBar from "@/components/DashboardUserBar";
import {
  ImagingDateIcon,
  ImagingDeleteActionIcon,
  ImagingFileNameIcon,
  ImagingFileSizeIcon,
  ImagingViewActionIcon,
  LabSectionTitleIcon,
  VoiceRecordSymbolIcon,
} from "@/components/PreAnestheticIcons";

const SECTION_ICON_CLASS = "h-4 w-4 shrink-0 text-white";

function RelevantHistorySectionIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='shrink-0'
      aria-hidden
    >
      <path
        d='M9 6V9L10.875 10.875'
        stroke='#94A3B8'
        strokeWidth={1.125}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M4.20301 4.20298L3.80551 3.80548L4.20301 4.20298ZM3.25351 5.15323L2.69101 5.15548C2.69225 5.46409 2.9419 5.71408 3.25051 5.71573L3.25351 5.15323ZM5.16001 5.72473C5.47047 5.72618 5.72369 5.47531 5.72514 5.16485C5.72659 4.8544 5.47572 4.60118 5.16526 4.59973L5.16001 5.72473ZM3.80626 3.24073C3.80519 3.03977 3.69699 2.85464 3.52242 2.75509C3.34784 2.65554 3.13342 2.65668 2.95992 2.75809C2.78641 2.8595 2.68019 3.04577 2.68126 3.24673L3.80626 3.24073ZM2.87026 8.08873C2.89959 7.88868 2.8193 7.68828 2.65996 7.56383C2.50061 7.43937 2.28673 7.41001 2.09975 7.48692C1.91276 7.56383 1.78143 7.73518 1.75576 7.93573L2.87026 8.08873ZM14.1465 3.85348C11.2815 0.988478 6.65176 0.958478 3.80551 3.80548L4.60051 4.60048C7.00051 2.20123 10.9178 2.21548 13.3515 4.64848L14.1465 3.85348ZM3.85351 14.1465C6.71851 17.0115 11.3483 17.0415 14.1945 14.1945L13.3995 13.3995C10.9995 15.7987 7.08226 15.7845 4.64851 13.3515L3.85351 14.1465ZM14.1945 14.1945C17.0408 11.3482 17.0115 6.71848 14.1465 3.85348L13.3515 4.64848C15.7845 7.08223 15.7988 10.9995 13.3995 13.3995L14.1945 14.1945ZM3.80551 3.80548L2.85526 4.75498L3.65101 5.54998L4.60051 4.60048L3.80551 3.80548ZM3.25051 5.71573L5.16001 5.72473L5.16526 4.59973L3.25651 4.59073L3.25051 5.71573ZM3.81601 5.15023L3.80626 3.23998L2.68126 3.24598L2.69101 5.15473L3.81601 5.15023ZM1.75501 7.93498C1.44239 10.2196 2.21891 12.5186 3.85276 14.1457L4.64776 13.3507C3.26278 11.9722 2.60447 10.024 2.86951 8.08798L1.75501 7.93498Z'
        fill='#94A3B8'
      />
    </svg>
  );
}

function ClinicalDiagnosisLabelIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='shrink-0 text-white'
      aria-hidden
    >
      <path
        d='M8.25 1.5V3M3.75 1.5V3M3.75 2.25H3C2.17213 2.25 1.5 2.92213 1.5 3.75V6.75C1.5 9.23362 3.51638 11.25 6 11.25C8.48362 11.25 10.5 9.23362 10.5 6.75V3.75C10.5 2.92213 9.82787 2.25 9 2.25H8.25'
        stroke='currentColor'
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M6 11.25C6 13.7336 8.01638 15.75 10.5 15.75C12.9836 15.75 15 13.7336 15 11.25V9'
        stroke='currentColor'
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M13.5 7.5C13.5 8.32787 14.1721 9 15 9C15.8279 9 16.5 8.32787 16.5 7.5C16.5 6.67213 15.8279 6 15 6C14.1721 6 13.5 6.67213 13.5 7.5V7.5'
        stroke='currentColor'
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function CurrentMedicationHeaderIcon() {
  return (
    <svg
      width={19}
      height={11}
      viewBox='0 0 19 11'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='h-4 w-auto shrink-0'
      aria-hidden
    >
      <path
        d='M10.4292 10.1079L10.3097 10.601H7.62769C7.20435 9.5949 6.80342 8.73577 6.4249 8.02356C6.05137 7.30637 5.65542 6.55681 5.23706 5.77488H4.1314L3.3395 9.19646C3.32954 9.2363 3.31958 9.28362 3.30962 9.3384C3.30464 9.39319 3.30215 9.43303 3.30215 9.45793C3.30215 9.57249 3.32207 9.67209 3.36191 9.75676C3.40674 9.84143 3.48394 9.90867 3.59351 9.95847C3.66323 9.98835 3.81016 10.0207 4.03428 10.0556C4.26338 10.0855 4.45264 10.1029 4.60205 10.1079L4.48252 10.601H9.76538e-05L0.119629 10.1079C0.244141 10.0979 0.420947 10.0805 0.650049 10.0556C0.87915 10.0307 1.04351 9.99832 1.14312 9.95847C1.32241 9.88875 1.45938 9.78914 1.554 9.65964C1.64863 9.52517 1.71338 9.37078 1.74824 9.19646L3.53374 1.45681C3.5437 1.40701 3.55117 1.3572 3.55615 1.3074C3.56611 1.25261 3.57109 1.20032 3.57109 1.15051C3.57109 1.04592 3.55117 0.953784 3.51133 0.874097C3.47148 0.794409 3.39678 0.732153 3.28721 0.687329C3.18262 0.647485 3.03071 0.607641 2.83149 0.567798C2.63228 0.527954 2.46792 0.503052 2.33843 0.493091L2.45049 2.42819e-05H7.2168C7.64512 2.42819e-05 8.03608 0.0423583 8.3897 0.127026C8.74331 0.211694 9.03965 0.328735 9.27871 0.478149C9.54268 0.637524 9.74937 0.846704 9.89878 1.10569C10.0532 1.36467 10.1304 1.67097 10.1304 2.02458C10.1304 2.49275 10.0432 2.92107 9.8689 3.30955C9.69458 3.69304 9.45801 4.02175 9.15918 4.29568C8.84541 4.57957 8.48931 4.81614 8.09087 5.0054C7.69243 5.18967 7.25415 5.3366 6.77603 5.44617C7.1645 6.19822 7.48076 6.79338 7.7248 7.23166C7.96885 7.66995 8.25522 8.21033 8.58394 8.85281C8.75327 9.17654 8.90518 9.41062 9.03965 9.55505C9.17412 9.69451 9.31606 9.80657 9.46548 9.89124C9.58999 9.96096 9.75186 10.0133 9.95107 10.0481C10.1503 10.083 10.3097 10.1029 10.4292 10.1079ZM8.29258 2.18147C8.29258 1.67346 8.13569 1.27751 7.82192 0.993628C7.51313 0.709741 7.07734 0.567798 6.51455 0.567798H5.32671L4.27334 5.16975H5.33418C6.15098 5.16975 6.84824 4.88586 7.42598 4.31809C8.00371 3.74534 8.29258 3.03313 8.29258 2.18147ZM18.9234 3.88479C18.9184 4.17366 18.8113 4.38782 18.6021 4.52727C18.3979 4.66174 18.1738 4.72898 17.9298 4.72898C17.7804 4.72898 17.611 4.70408 17.4218 4.65427C17.2325 4.59949 17.0831 4.55466 16.9735 4.5198C16.7494 4.71902 16.4879 5.01287 16.1891 5.40134C15.8953 5.78982 15.6164 6.21814 15.3524 6.6863C15.4719 7.15945 15.579 7.56536 15.6736 7.90403C15.7683 8.23772 15.8704 8.5739 15.9799 8.91257C16.0746 9.21638 16.2215 9.46042 16.4207 9.6447C16.6249 9.824 16.8914 9.91365 17.2201 9.91365C17.3396 9.91365 17.504 9.89871 17.7131 9.86882C17.9223 9.83396 18.0842 9.79661 18.1987 9.75676L18.0643 10.2498C17.5861 10.449 17.225 10.5785 16.981 10.6383C16.7419 10.6981 16.483 10.728 16.2041 10.728C15.8554 10.728 15.5666 10.6483 15.3375 10.4889C15.1133 10.3295 14.9315 10.0008 14.7921 9.50276C14.6925 9.13918 14.6103 8.83538 14.5456 8.59133C14.4858 8.34231 14.426 8.09578 14.3663 7.85173C14.1372 8.19539 13.9479 8.48923 13.7985 8.73328C13.6491 8.97234 13.4 9.30354 13.0514 9.72688C12.7476 10.0954 12.4687 10.3569 12.2147 10.5113C11.9607 10.6657 11.7017 10.7429 11.4377 10.7429C11.2037 10.7429 11.0119 10.6757 10.8625 10.5412C10.7081 10.4017 10.6309 10.21 10.6309 9.96594C10.6309 9.73186 10.7206 9.53264 10.8999 9.36829C11.0792 9.19895 11.3257 9.11428 11.6395 9.11428C11.7988 9.11428 11.9532 9.14417 12.1026 9.20393C12.257 9.25872 12.4164 9.31101 12.5808 9.36082C12.77 9.18152 13.019 8.90261 13.3278 8.5241C13.6416 8.14558 13.933 7.71477 14.2019 7.23166C14.1073 6.87805 14.0027 6.48958 13.8881 6.06624C13.7786 5.6429 13.674 5.27185 13.5744 4.9531C13.4449 4.54968 13.2955 4.2907 13.1261 4.17615C12.9568 4.0616 12.7401 4.00432 12.4762 4.00432C12.3317 4.00432 12.1773 4.02424 12.013 4.06409C11.8536 4.10393 11.7042 4.14377 11.5647 4.18362L11.7067 3.69055C12.0902 3.53118 12.4338 3.40168 12.7376 3.30208C13.0464 3.19749 13.2556 3.14519 13.3652 3.14519C13.7088 3.14519 13.9927 3.22986 14.2168 3.39919C14.4459 3.56355 14.6277 3.88479 14.7622 4.36291C14.9166 4.91575 15.0063 5.25442 15.0312 5.37893C15.061 5.49846 15.1158 5.73752 15.1955 6.09612C15.4346 5.72756 15.6288 5.41628 15.7782 5.16228C15.9276 4.90828 16.1717 4.57209 16.5104 4.15374C16.8241 3.76028 17.113 3.49133 17.377 3.3469C17.6459 3.19749 17.9024 3.12278 18.1464 3.12278C18.3656 3.12278 18.5499 3.195 18.6993 3.33943C18.8537 3.47888 18.9284 3.66067 18.9234 3.88479Z'
        fill='white'
      />
    </svg>
  );
}

function PhysicalExaminationTitleEndIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='shrink-0'
      aria-hidden
    >
      <path
        d='M15 9.99998H14.3325C13.6408 9.99998 13.295 9.99998 13.0083 10.1625C12.7217 10.3241 12.5442 10.6208 12.1883 11.2133L12.1633 11.2566C11.8317 11.8091 11.6658 12.085 11.425 12.0808C11.1842 12.0766 11.0283 11.7941 10.7175 11.2291L9.31167 8.67332C9.0225 8.14665 8.87833 7.88332 8.64667 7.87082C8.41583 7.85832 8.24333 8.10415 7.89917 8.59582L7.66333 8.93332C7.29667 9.45582 7.11417 9.71665 6.84333 9.85832C6.57167 9.99998 6.2525 9.99998 5.615 9.99998H5'
        stroke='#2F80ED'
        strokeWidth={1.25}
        strokeLinecap='round'
      />
      <path
        d='M7.46866 16.1417L7.86366 15.6584L7.46866 16.1417ZM10.0003 4.58339L9.54199 5.00839C9.66027 5.13597 9.82636 5.20847 10.0003 5.20847C10.1743 5.20847 10.3404 5.13597 10.4587 5.00839L10.0003 4.58339ZM12.532 16.1434L12.927 16.6276L12.532 16.1434ZM7.86366 15.6592C6.65533 14.6734 5.24449 13.3817 4.14116 11.9676C3.02533 10.5384 2.29199 9.06923 2.29199 7.71756H1.04199C1.04199 9.48923 1.98366 11.2342 3.15533 12.7367C4.33949 14.2534 5.83033 15.6134 7.07366 16.6276L7.86366 15.6592ZM2.29199 7.71673C2.29199 5.44173 3.34033 3.92089 4.66699 3.36839C5.97783 2.82339 7.79449 3.12923 9.54199 5.00839L10.4587 4.15673C8.45616 2.00589 6.10616 1.41589 4.18699 2.21423C2.28533 3.00589 1.04199 5.06589 1.04199 7.71673H2.29199ZM12.927 16.6267C14.1712 15.6126 15.6603 14.2534 16.8453 12.7351C18.0178 11.2326 18.9587 9.48839 18.9587 7.71673H17.7087C17.7087 9.06839 16.9753 10.5376 15.8595 11.9667C14.7562 13.3809 13.3453 14.6726 12.137 15.6584L12.927 16.6267ZM18.9587 7.71673C18.9587 5.06673 17.7153 3.00506 15.8137 2.21423C13.8945 1.41589 11.5445 2.00589 9.54283 4.15589L10.4578 5.00839C12.2062 3.12923 14.0228 2.82339 15.3328 3.36839C16.6603 3.92006 17.7087 5.44173 17.7087 7.71673H18.9587ZM7.07366 16.6267C8.13199 17.4901 8.86699 18.1251 10.0003 18.1251V16.8751C9.39866 16.8751 9.02449 16.6042 7.86366 15.6584L7.07366 16.6267ZM12.137 15.6576C10.9762 16.6051 10.602 16.8751 10.0003 16.8751V18.1251C11.1328 18.1251 11.8678 17.4901 12.927 16.6267L12.137 15.6576Z'
        fill='#2F80ED'
      />
    </svg>
  );
}

function SystemicExaminationSectionIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='shrink-0'
      aria-hidden
    >
      <path
        d='M10.0517 18.3333H9.94835C9.31502 18.3333 8.99919 18.3333 8.72419 18.2083C8.44919 18.0841 8.25169 17.8516 7.85669 17.3866L5.87169 15.0508C5.48419 14.595 5.29085 14.3675 5.19002 14.0966C5.09002 13.8266 5.09002 13.5341 5.09002 12.95V8.56414C5.09002 7.99331 5.09002 7.70831 4.96669 7.45747C4.84419 7.20664 4.61419 7.02081 4.15419 6.64914L3.98085 6.50997C2.99585 5.71497 2.50335 5.31664 2.50002 4.74164C2.49669 4.16664 2.93335 3.80497 3.80669 3.08331C3.94002 2.9722 4.07002 2.87108 4.19669 2.77997C4.67419 2.43831 5.36502 2.06081 5.85169 1.80831C6.21591 1.62404 6.645 1.61911 7.01335 1.79497L7.23335 1.89831C7.29224 1.92608 7.33974 1.96553 7.37585 2.01664C8.62419 3.77997 11.3759 3.77997 12.6242 2.01664C12.6608 1.96565 12.7098 1.92491 12.7667 1.89831L12.9867 1.79497C13.355 1.61911 13.7841 1.62404 14.1484 1.80831C14.635 2.06081 15.3259 2.43831 15.8034 2.77997C15.9311 2.8722 16.0611 2.97303 16.1934 3.08247C17.0667 3.80497 17.5034 4.16664 17.5 4.74164C17.4967 5.31664 17.0034 5.71497 16.0192 6.50997L15.8459 6.64914C15.3859 7.02081 15.1559 7.20664 15.0334 7.45747C14.9109 7.70831 14.9109 7.99331 14.9109 8.56414V12.95C14.9109 13.5341 14.9109 13.8266 14.81 14.0966C14.71 14.3666 14.5159 14.595 14.1284 15.0508L12.1434 17.3866C11.7484 17.8516 11.5509 18.0841 11.2759 18.2091C11.0009 18.3333 10.6842 18.3333 10.0517 18.3333V18.3333'
        stroke='#2F80ED'
        strokeWidth={1.25}
        strokeLinecap='round'
      />
    </svg>
  );
}

function FunctionalCapacitySectionIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='shrink-0'
      aria-hidden
    >
      <path
        d='M12 3.375C12 4.40984 12.8402 5.25 13.875 5.25C14.9098 5.25 15.75 4.40984 15.75 3.375C15.75 2.34016 14.9098 1.5 13.875 1.5C12.8402 1.5 12 2.34016 12 3.375V3.375'
        stroke='#94A3B8'
        strokeWidth={1.125}
      />
      <path
        d='M6.75 12.75L6 13.65C5.4465 14.3145 5.16975 14.646 4.7925 14.823C4.41525 15 3.9825 15 3.11775 15H2.25'
        stroke='#94A3B8'
        strokeWidth={1.125}
        strokeLinecap='round'
      />
      <path
        d='M4.07722 6.61498L3.79972 6.12598L4.07722 6.61498ZM2.72197 6.73798C2.54727 6.83738 2.43887 7.02245 2.43761 7.22345C2.43635 7.42445 2.54242 7.61085 2.71586 7.71245C2.8893 7.81404 3.10377 7.81538 3.27847 7.71598L2.72197 6.73798ZM11.8127 7.59373L11.3447 7.90573L11.8127 7.59373ZM11.86 7.66423L12.328 7.35148L11.86 7.66423ZM8.22697 4.98973L8.28472 4.43023L8.22697 4.98973ZM8.05447 4.97698L8.02972 5.53948L8.05447 4.97698ZM7.61647 5.00473L7.53922 4.44748L7.61647 5.00473ZM15.7502 9.56248C16.0607 9.56248 16.3127 9.31043 16.3127 8.99998C16.3127 8.68952 16.0607 8.43748 15.7502 8.43748V9.56248ZM3.79897 6.12598L2.72197 6.73798L3.27847 7.71598L4.35472 7.10398L3.79897 6.12598ZM11.3447 7.90573L11.392 7.97548L12.328 7.35148L12.2807 7.28173L11.3447 7.90573ZM8.28472 4.43023C8.21662 4.42336 8.14834 4.41836 8.07997 4.41523L8.03047 5.53873C8.06697 5.54023 8.11297 5.54373 8.16847 5.54923L8.28472 4.43023ZM4.35472 7.10398C6.09397 6.11623 6.89422 5.67223 7.69297 5.56198L7.53922 4.44748C6.47497 4.59448 5.45497 5.18473 3.79897 6.12598L4.35472 7.10398ZM14.356 9.56248H15.7502V8.43748H14.3552L14.356 9.56248ZM8.07997 4.41523C7.89937 4.40969 7.71863 4.42049 7.53997 4.44748L7.69297 5.56198C7.82647 5.54398 7.93447 5.53423 8.03047 5.53948L8.07997 4.41523ZM11.392 7.97623C12.0527 8.96721 13.1649 9.56244 14.356 9.56248V8.43748C13.5409 8.4373 12.7799 8.02977 12.328 7.35148L11.392 7.97623ZM12.2807 7.28173C11.398 5.95723 10.072 4.61623 8.28472 4.43023L8.16847 5.54998C9.44572 5.68273 10.519 6.66748 11.3447 7.90648L12.2807 7.28173Z'
        fill='#94A3B8'
      />
      <path
        d='M10.5001 6.375L8.83511 8.457C8.20736 9.24075 7.89386 9.633 7.84361 10.0598C7.81561 10.2997 7.84597 10.5428 7.93211 10.7685C8.08511 11.1705 8.48486 11.4735 9.28586 12.0802C9.89561 12.5422 10.2001 12.7725 10.4071 13.0747C10.5251 13.2482 10.6176 13.4343 10.6846 13.6328C10.8001 13.9793 10.8001 14.3618 10.8001 15.1267V16.5'
        stroke='#94A3B8'
        strokeWidth={1.125}
        strokeLinecap='round'
      />
    </svg>
  );
}

function GeneralExaminationSectionIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='shrink-0'
      aria-hidden
    >
      <path
        d='M2.5 8.68091C2.5 6.01591 2.5 4.68341 2.815 4.23508C3.12917 3.78758 4.38167 3.35841 6.8875 2.50091L7.365 2.33758C8.67083 1.89008 9.32333 1.66675 10 1.66675C10.6767 1.66675 11.3292 1.89008 12.635 2.33758L13.1125 2.50091C15.6183 3.35841 16.8708 3.78758 17.185 4.23508C17.5 4.68341 17.5 6.01675 17.5 8.68091V9.99258C17.5 14.6909 13.9675 16.9717 11.7508 17.9392C11.15 18.2017 10.85 18.3334 10 18.3334C9.15 18.3334 8.85 18.2017 8.24917 17.9392C6.0325 16.9709 2.5 14.6917 2.5 9.99258V8.68091'
        stroke='#2F80ED'
        strokeWidth={1.25}
      />
      <path
        d='M7.9165 10.3333L9.10734 11.6666L12.0832 8.33325'
        stroke='#2F80ED'
        strokeWidth={1.25}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function AirwaySectionIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='shrink-0'
      aria-hidden
    >
      <path
        d='M7.5 13.3333C8.20833 13.8583 9.07083 14.1666 10 14.1666C10.9292 14.1666 11.7917 13.8583 12.5 13.3333'
        stroke='#2F80ED'
        strokeWidth={1.25}
        strokeLinecap='round'
      />
      <path
        d='M11.667 8.75C11.667 9.43989 12.0404 10 12.5003 10C12.9603 10 13.3337 9.43989 13.3337 8.75C13.3337 8.06011 12.9603 7.5 12.5003 7.5C12.0404 7.5 11.667 8.06011 11.667 8.75Z'
        fill='#2F80ED'
      />
      <path
        d='M6.66699 8.75C6.66699 9.43989 7.0404 10 7.50033 10C7.96025 10 8.33366 9.43989 8.33366 8.75C8.33366 8.06011 7.96025 7.5 7.50033 7.5C7.0404 7.5 6.66699 8.06011 6.66699 8.75Z'
        fill='#2F80ED'
      />
      <path
        d='M18.3337 11.6667C18.3337 14.8092 18.3337 16.3809 17.357 17.3567C16.3803 18.3326 14.8095 18.3334 11.667 18.3334M8.33366 18.3334C5.19116 18.3334 3.61949 18.3334 2.64366 17.3567C1.66783 16.3801 1.66699 14.8092 1.66699 11.6667M8.33366 1.66675C5.19116 1.66675 3.61949 1.66675 2.64366 2.64341C1.66783 3.62008 1.66699 5.19091 1.66699 8.33341M11.667 1.66675C14.8095 1.66675 16.3812 1.66675 17.357 2.64341C18.3328 3.62008 18.3337 5.19091 18.3337 8.33341'
        stroke='#2F80ED'
        strokeWidth={1.25}
        strokeLinecap='round'
      />
    </svg>
  );
}

function PlansAndAlertsIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M16.9262 10.5394L17.3571 8.92939C17.8604 7.05022 18.1129 6.11105 17.9237 5.29772C17.7738 4.65563 17.4368 4.07243 16.9554 3.62189C16.3462 3.05105 15.4062 2.79939 13.5271 2.29605C11.6479 1.79189 10.7079 1.54022 9.8954 1.72939C9.25331 1.87931 8.67011 2.2163 8.21957 2.69772C7.7304 3.21939 7.4754 3.98355 7.09623 5.37189L6.8929 6.12605L6.46207 7.73605C5.9579 9.61522 5.70623 10.5544 5.8954 11.3677C6.04533 12.0098 6.38231 12.593 6.86373 13.0436C7.4729 13.6144 8.4129 13.8661 10.2921 14.3702C11.9854 14.8236 12.9162 15.0727 13.6787 14.9786C13.7621 14.968 13.8437 14.9536 13.9237 14.9352C14.5656 14.7858 15.1488 14.4494 15.5996 13.9686C16.1704 13.3586 16.4221 12.4186 16.9262 10.5394V10.5394'
        stroke='#2F80ED'
        strokeWidth={1.25}
      />
      <path
        d='M13.6789 14.9781C13.5047 15.5117 13.1986 15.9927 12.7889 16.3764C12.1797 16.9473 11.2397 17.1989 9.36056 17.7023C7.4814 18.2056 6.5414 18.4581 5.7289 18.2681C5.08691 18.1184 4.50372 17.7817 4.05306 17.3006C3.48223 16.6914 3.22973 15.7514 2.7264 13.8723L2.29556 12.2623C1.7914 10.3831 1.53973 9.44311 1.7289 8.63061C1.87882 7.98852 2.21581 7.40532 2.69723 6.95477C3.3064 6.38394 4.2464 6.13227 6.12556 5.62811C6.48001 5.53255 6.80362 5.44672 7.0964 5.37061'
        stroke='#2F80ED'
        strokeWidth={1.25}
      />
      <path
        d='M9.814 8.3335L13.839 9.41183M9.1665 10.7485L11.5815 11.3952'
        stroke='#2F80ED'
        strokeWidth={1.25}
        strokeLinecap='round'
      />
    </svg>
  );
}

export function toHtmlTimeValue(raw: string | null | undefined): string {
  if (raw == null || raw === "") return "";
  const s = String(raw).trim();
  const m = s.match(/^(\d{1,2}):(\d{2})(?::\d{2}(?:\.\d+)?)?/);
  if (!m) return "";
  let h = parseInt(m[1], 10);
  let min = parseInt(m[2], 10);
  if (Number.isNaN(h) || Number.isNaN(min) || h > 23 || min > 59) return "";
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

const MEDICAL_CONDITIONS = [
  "Hypertension",
  "Bronchial Asthma",
  "Ischemic Heart Disease",
  "Liver Disease",
  "Diabetes Mellitus",
  "Thyroid Disorder",
  "Chronic Kidney Disease",
  "Tuberculosis",
];

export type PatientDTO = {
  id?: string;
  patientName?: string;
  gender?: string;
  age?: string;
  patientId?: string;
  height?: string;
  weight?: string;
  bmi?: string;
  ipNo?: string;
  date?: string;
  admissionDate?: string;
  ward?: string;
  attendingSurgeon?: string;
  assignedAnaesthesiologist?: string;
  admissionType?: string;
  medicalConditions?: string[];
  othersText?: string;
  clinicalDiagnosis?: string;
  proposedSurgery?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  preanaestheticConcern?: string;
  anaesthesiaPlan?: string;
  asaStatus?: string;
  mallampatiGrade?: string;
  icterus?: boolean;
  pallor?: boolean;
  cyanosis?: boolean;
  clubbing?: boolean;
  hbsag?: boolean;
  hiv?: boolean;
  previousSurgeries?: {
    type?: string;
    year?: string;
    complications?: string;
  }[];
  currentMedication?: {
    medicine?: string;
    strength?: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instruction?: string;
  }[];
  pulseRate?: string;
  temp?: string;
  respRate?: string;
  bpSys?: string;
  bpDia?: string;
  spo2?: string;
  physicalHeight?: string;
  physicalWeight?: string;
  respiratorySystem?: string;
  cns?: string;
  cvs?: string;
  perAbdomen?: string;
  breathHoldingTime?: string;
  otherRelevantFindings?: string;
  investigationFindings?: string;
  dentition?: string;
  thyroid?: string;
  spine?: string;
  mouthOpening?: string;
  mentoHyoidDistance?: string;
  neckMovement?: string;
  looseToothOrDentures?: boolean;
  hb?: string;
  totalCount?: string;
  differentialCount?: string;
  plateletCount?: string;
  sodium?: string;
  potassium?: string;
  chloride?: string;
  bicarbonate?: string;
  bloodSugar?: string;
  bloodUrea?: string;
  serumCreatinine?: string;
  prothrombinType?: string;
  inr?: string;
  plateletCountCoagulation?: string;
  bloodGrouping?: string;
  urineExamination?: string;
  bleedingTime?: string;
  clottingTime?: string;
  otherSpecificationVoiceRecord?: string;
  postOperativeAnalgesiaPlanned?: string[];
  anticipatedPostAnaesthesiaCare?: string[];
  preProcedureInstructionsVoiceRecord?: string;
  fitForSurgery?: string;
  imagingFiles?: { fileName?: string; fileSize?: string; date?: string }[];
  anaesthesiologistName?: string;
  signed?: string;
  submitted?: boolean;
};

function SectionHeader({
  title,
  icon,
  rightAction,
}: {
  title: string;
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
}) {
  return (
    <div
      className='flex items-center justify-between px-5 py-3'
      style={{ background: "var(--header-bg)" }}
    >
      <div className='flex min-w-0 items-center gap-2'>
        {icon ? <span className='shrink-0 text-white'>{icon}</span> : null}
        <span className='truncate font-semibold text-[var(--header-text)] text-sm text-white'>
          {title}
        </span>
      </div>
      {rightAction ? <span className='shrink-0'>{rightAction}</span> : null}
    </div>
  );
}

type Surgery = {
  type: string;
  year: string;
  complications: string;
};

type MedicationEntry = {
  medicine: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  instruction: string;
};

function PreAnestheticFormContent({
  initialData = null,
  readOnly: readOnlyProp,
  patientId,
  onSave,
}: {
  initialData?: PatientDTO | null;
  readOnly?: boolean;
  patientId?: string;
  onSave?: (payload: Record<string, unknown>, submitted: boolean) => void;
} = {}) {
  const readOnly = readOnlyProp ?? !!initialData;

  const [patientName, setPatientName] = useState(
    () => initialData?.patientName ?? "",
  );
  const [gender, setGender] = useState(() => initialData?.gender ?? "");
  const [age, setAge] = useState(() => initialData?.age ?? "");
  const [patientIdDisplay, setPatientIdDisplay] = useState(
    () => initialData?.patientId ?? "",
  );
  const [height, setHeight] = useState(() => initialData?.height ?? "");
  const [weight, setWeight] = useState(() => initialData?.weight ?? "");
  const [bmi, setBmi] = useState(() => initialData?.bmi ?? "");
  const [ipNo, setIpNo] = useState(() => initialData?.ipNo ?? "");
  const [date, setDate] = useState(() => initialData?.date ?? "");
  const [admissionDate, setAdmissionDate] = useState(
    () => initialData?.admissionDate ?? "",
  );
  const [ward, setWard] = useState(() => initialData?.ward ?? "");
  const [attendingSurgeon, setAttendingSurgeon] = useState(
    () => initialData?.attendingSurgeon ?? "",
  );
  const [assignedAnaesthesiologist, setAssignedAnaesthesiologist] = useState(
    () => initialData?.assignedAnaesthesiologist ?? "",
  );

  const [anaesthesiaPlan, setAnaesthesiaPlan] = useState<string>(
    () => initialData?.anaesthesiaPlan ?? "General",
  );
  const [medicalSearch, setMedicalSearch] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<Set<string>>(
    () =>
      new Set(
        initialData?.medicalConditions ?? ["Hypertension", "Thyroid Disorder"],
      ),
  );
  const [othersText, setOthersText] = useState(
    () => initialData?.othersText ?? "",
  );
  const [admissionType, setAdmissionType] = useState(
    () => initialData?.admissionType ?? "Elective",
  );
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState(
    () => initialData?.clinicalDiagnosis ?? "",
  );
  const [proposedSurgery, setProposedSurgery] = useState(
    () => initialData?.proposedSurgery ?? "",
  );
  const [scheduledDate, setScheduledDate] = useState(
    () => initialData?.scheduledDate?.trim() || todayIsoDate(),
  );
  const [scheduledTime, setScheduledTime] = useState(() =>
    toHtmlTimeValue(initialData?.scheduledTime ?? ""),
  );
  const [preanaestheticConcern, setPreanaestheticConcern] = useState(
    () => initialData?.preanaestheticConcern ?? "",
  );
  const scheduledDateInputRef = useRef<HTMLInputElement>(null);
  const scheduledTimeInputRef = useRef<HTMLInputElement>(null);
  const surgeryListScrollRef = useRef<HTMLDivElement>(null);
  const [isPreviousSurgeryOpen, setIsPreviousSurgeryOpen] = useState(true);

  const [surgeries, setSurgeries] = useState<Surgery[]>(() => {
    const prev = initialData?.previousSurgeries;
    if (prev && prev.length > 0) {
      return prev.map((s) => ({
        type: s.type ?? "",
        year: s.year ?? "",
        complications: s.complications ?? "",
      }));
    }
    return [{ type: "", year: "", complications: "" }];
  });

  const [currentMedication, setCurrentMedication] = useState<MedicationEntry[]>(
    () => {
      const meds = initialData?.currentMedication;
      if (meds && meds.length > 0) {
        return meds.map((m) => ({
          medicine: m.medicine ?? "",
          strength: m.strength ?? "",
          dosage: m.dosage ?? "",
          frequency: m.frequency ?? "",
          duration: m.duration ?? "",
          instruction: m.instruction ?? "",
        }));
      }
      return [
        {
          medicine: "",
          strength: "",
          dosage: "",
          frequency: "",
          duration: "",
          instruction: "",
        },
      ];
    },
  );

  useEffect(() => {
    if (!initialData) return;
    setPatientName(initialData.patientName ?? "");
    setGender(initialData.gender ?? "");
    setAge(initialData.age ?? "");
    setPatientIdDisplay(initialData.patientId ?? "");
    setHeight(initialData.height ?? "");
    setWeight(initialData.weight ?? "");
    setBmi(initialData.bmi ?? "");
    setIpNo(initialData.ipNo ?? "");
    setDate(initialData.date ?? "");
    setAdmissionDate(initialData.admissionDate ?? "");
    setWard(initialData.ward ?? "");
    setAttendingSurgeon(initialData.attendingSurgeon ?? "");
    setAssignedAnaesthesiologist(initialData.assignedAnaesthesiologist ?? "");
    setAdmissionType(initialData.admissionType ?? "Elective");
    setSelectedConditions(new Set(initialData.medicalConditions ?? []));
    setOthersText(initialData.othersText ?? "");
    setClinicalDiagnosis(initialData.clinicalDiagnosis ?? "");
    setProposedSurgery(initialData.proposedSurgery ?? "");
    setScheduledDate(initialData.scheduledDate?.trim() || todayIsoDate());
    setScheduledTime(toHtmlTimeValue(initialData.scheduledTime ?? ""));
    setPreanaestheticConcern(initialData.preanaestheticConcern ?? "");
    setAnaesthesiaPlan(initialData.anaesthesiaPlan ?? "General");
    setAsaStatus(initialData.asaStatus ?? null);
    setMallampatiGrade(initialData.mallampatiGrade ?? null);
    setGeneralExam({
      icterus: initialData.icterus ?? false,
      pallor: initialData.pallor ?? false,
      cyanosis: initialData.cyanosis ?? false,
      clubbing: initialData.clubbing ?? false,
    });
    setSerology({
      hbsag: initialData.hbsag ?? false,
      hiv: initialData.hiv ?? false,
    });
    const prev = initialData.previousSurgeries;
    if (prev && prev.length > 0) {
      setSurgeries(
        prev.map((s) => ({
          type: s.type ?? "",
          year: s.year ?? "",
          complications: s.complications ?? "",
        })),
      );
    }
    setPulseRate(initialData.pulseRate ?? "");
    setTemp(initialData.temp ?? "");
    setRespRate(initialData.respRate ?? "");
    setBpSys(initialData.bpSys ?? "");
    setBpDia(initialData.bpDia ?? "");
    setSpo2(initialData.spo2 ?? "");
    setPhysicalHeight(initialData.physicalHeight ?? "");
    setPhysicalWeight(initialData.physicalWeight ?? "");
    setRespiratorySystem(initialData.respiratorySystem ?? "");
    setCns(initialData.cns ?? "");
    setCvs(initialData.cvs ?? "");
    setPerAbdomen(initialData.perAbdomen ?? "");
    setBreathHoldingTime(initialData.breathHoldingTime ?? "");
    setOtherRelevantFindings(initialData.otherRelevantFindings ?? "");
    setInvestigationFindings(initialData.investigationFindings ?? "");
    setDentition(initialData.dentition ?? "");
    setThyroid(initialData.thyroid ?? "");
    setSpine(initialData.spine ?? "");
    setMouthOpening(initialData.mouthOpening ?? "");
    setMentoHyoidDistance(initialData.mentoHyoidDistance ?? "");
    setNeckMovement(initialData.neckMovement ?? "");
    setLooseToothOrDentures(initialData.looseToothOrDentures ?? false);
    setHb(initialData.hb ?? "");
    setTotalCount(initialData.totalCount ?? "");
    setDifferentialCount(initialData.differentialCount ?? "");
    setPlateletCount(initialData.plateletCount ?? "");
    setSodium(initialData.sodium ?? "");
    setPotassium(initialData.potassium ?? "");
    setChloride(initialData.chloride ?? "");
    setBicarbonate(initialData.bicarbonate ?? "");
    setBloodSugar(initialData.bloodSugar ?? "");
    setBloodUrea(initialData.bloodUrea ?? "");
    setSerumCreatinine(initialData.serumCreatinine ?? "");
    setProthrombinType(initialData.prothrombinType ?? "");
    setInr(initialData.inr ?? "");
    setPlateletCountCoagulation(initialData.plateletCountCoagulation ?? "");
    setBloodGrouping(initialData.bloodGrouping ?? "");
    setUrineExamination(initialData.urineExamination ?? "");
    setBleedingTime(initialData.bleedingTime ?? "");
    setClottingTime(initialData.clottingTime ?? "");
    setOtherSpecificationVoiceRecord(
      initialData.otherSpecificationVoiceRecord ?? "",
    );
    setPostOperativeAnalgesiaPlanned(
      new Set(initialData.postOperativeAnalgesiaPlanned ?? []),
    );
    setAnticipatedPostAnaesthesiaCare(
      new Set(initialData.anticipatedPostAnaesthesiaCare ?? []),
    );
    setPreProcedureInstructionsVoiceRecord(
      initialData.preProcedureInstructionsVoiceRecord ?? "",
    );
    setFitForSurgery(initialData.fitForSurgery ?? null);
    setAnaesthesiologistName(initialData.anaesthesiologistName ?? "");
    setSigned(initialData.signed ?? "");
    const meds = initialData.currentMedication;
    if (meds && meds.length > 0) {
      setCurrentMedication(
        meds.map((m) => ({
          medicine: m.medicine ?? "",
          strength: m.strength ?? "",
          dosage: m.dosage ?? "",
          frequency: m.frequency ?? "",
          duration: m.duration ?? "",
          instruction: m.instruction ?? "",
        })),
      );
    }
  }, [initialData]);

  const addSurgery = () => {
    setSurgeries((prev) => [
      ...prev,
      { type: "", year: "", complications: "" },
    ]);
    setTimeout(() => {
      surgeryListScrollRef.current?.scrollTo({
        top: surgeryListScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  const removeSurgery = (index: number) => {
    if (surgeries.length <= 1) return;
    setSurgeries((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSurgery = (
    index: number,
    field: keyof Surgery,
    value: string,
  ) => {
    setSurgeries((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addMedication = () => {
    setCurrentMedication((prev) => [
      ...prev,
      {
        medicine: "",
        strength: "",
        dosage: "",
        frequency: "",
        duration: "",
        instruction: "",
      },
    ]);
  };
  const removeMedication = (index: number) => {
    if (currentMedication.length <= 1) return;
    setCurrentMedication((prev) => prev.filter((_, i) => i !== index));
  };
  const updateMedication = (
    index: number,
    field: keyof MedicationEntry,
    value: string,
  ) => {
    setCurrentMedication((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const [generalExam, setGeneralExam] = useState(() => ({
    icterus: initialData?.icterus ?? false,
    pallor: initialData?.pallor ?? false,
    cyanosis: initialData?.cyanosis ?? false,
    clubbing: initialData?.clubbing ?? false,
  }));

  const [serology, setSerology] = useState(() => ({
    hbsag: initialData?.hbsag ?? false,
    hiv: initialData?.hiv ?? false,
  }));
  const [mallampatiGrade, setMallampatiGrade] = useState<string | null>(
    () => initialData?.mallampatiGrade ?? null,
  );
  const [asaStatus, setAsaStatus] = useState<string | null>(
    () => initialData?.asaStatus ?? null,
  );

  const [pulseRate, setPulseRate] = useState(
    () => initialData?.pulseRate ?? "",
  );
  const [temp, setTemp] = useState(() => initialData?.temp ?? "");
  const [respRate, setRespRate] = useState(() => initialData?.respRate ?? "");
  const [bpSys, setBpSys] = useState(() => initialData?.bpSys ?? "");
  const [bpDia, setBpDia] = useState(() => initialData?.bpDia ?? "");
  const [spo2, setSpo2] = useState(() => initialData?.spo2 ?? "");
  const [physicalHeight, setPhysicalHeight] = useState(
    () => initialData?.physicalHeight ?? "",
  );
  const [physicalWeight, setPhysicalWeight] = useState(
    () => initialData?.physicalWeight ?? "",
  );
  const [respiratorySystem, setRespiratorySystem] = useState(
    () => initialData?.respiratorySystem ?? "",
  );
  const [cns, setCns] = useState(() => initialData?.cns ?? "");
  const [cvs, setCvs] = useState(() => initialData?.cvs ?? "");
  const [perAbdomen, setPerAbdomen] = useState(
    () => initialData?.perAbdomen ?? "",
  );
  const [breathHoldingTime, setBreathHoldingTime] = useState(
    () => initialData?.breathHoldingTime ?? "",
  );
  const [otherRelevantFindings, setOtherRelevantFindings] = useState(
    () => initialData?.otherRelevantFindings ?? "",
  );
  const [investigationFindings, setInvestigationFindings] = useState(
    () => initialData?.investigationFindings ?? "",
  );
  const [dentition, setDentition] = useState(
    () => initialData?.dentition ?? "",
  );
  const [thyroid, setThyroid] = useState(() => initialData?.thyroid ?? "");
  const [spine, setSpine] = useState(() => initialData?.spine ?? "");
  const [mouthOpening, setMouthOpening] = useState(
    () => initialData?.mouthOpening ?? "",
  );
  const [mentoHyoidDistance, setMentoHyoidDistance] = useState(
    () => initialData?.mentoHyoidDistance ?? "",
  );
  const [neckMovement, setNeckMovement] = useState(
    () => initialData?.neckMovement ?? "",
  );
  const [looseToothOrDentures, setLooseToothOrDentures] = useState(
    () => initialData?.looseToothOrDentures ?? false,
  );
  const [hb, setHb] = useState(() => initialData?.hb ?? "");
  const [totalCount, setTotalCount] = useState(
    () => initialData?.totalCount ?? "",
  );
  const [differentialCount, setDifferentialCount] = useState(
    () => initialData?.differentialCount ?? "",
  );
  const [plateletCount, setPlateletCount] = useState(
    () => initialData?.plateletCount ?? "",
  );
  const [sodium, setSodium] = useState(() => initialData?.sodium ?? "");
  const [potassium, setPotassium] = useState(
    () => initialData?.potassium ?? "",
  );
  const [chloride, setChloride] = useState(() => initialData?.chloride ?? "");
  const [bicarbonate, setBicarbonate] = useState(
    () => initialData?.bicarbonate ?? "",
  );
  const [bloodSugar, setBloodSugar] = useState(
    () => initialData?.bloodSugar ?? "",
  );
  const [bloodUrea, setBloodUrea] = useState(
    () => initialData?.bloodUrea ?? "",
  );
  const [serumCreatinine, setSerumCreatinine] = useState(
    () => initialData?.serumCreatinine ?? "",
  );
  const [prothrombinType, setProthrombinType] = useState(
    () => initialData?.prothrombinType ?? "",
  );
  const [inr, setInr] = useState(() => initialData?.inr ?? "");
  const [plateletCountCoagulation, setPlateletCountCoagulation] = useState(
    () => initialData?.plateletCountCoagulation ?? "",
  );
  const [bloodGrouping, setBloodGrouping] = useState(
    () => initialData?.bloodGrouping ?? "",
  );
  const [urineExamination, setUrineExamination] = useState(
    () => initialData?.urineExamination ?? "",
  );
  const [bleedingTime, setBleedingTime] = useState(
    () => initialData?.bleedingTime ?? "",
  );
  const [clottingTime, setClottingTime] = useState(
    () => initialData?.clottingTime ?? "",
  );
  const [otherSpecificationVoiceRecord, setOtherSpecificationVoiceRecord] =
    useState(() => initialData?.otherSpecificationVoiceRecord ?? "");
  const [postOperativeAnalgesiaPlanned, setPostOperativeAnalgesiaPlanned] =
    useState<Set<string>>(
      () => new Set(initialData?.postOperativeAnalgesiaPlanned ?? []),
    );
  const [anticipatedPostAnaesthesiaCare, setAnticipatedPostAnaesthesiaCare] =
    useState<Set<string>>(
      () => new Set(initialData?.anticipatedPostAnaesthesiaCare ?? []),
    );
  const [
    preProcedureInstructionsVoiceRecord,
    setPreProcedureInstructionsVoiceRecord,
  ] = useState(() => initialData?.preProcedureInstructionsVoiceRecord ?? "");
  const [fitForSurgery, setFitForSurgery] = useState<string | null>(
    () => initialData?.fitForSurgery ?? null,
  );
  const [anaesthesiologistName, setAnaesthesiologistName] = useState(
    () => initialData?.anaesthesiologistName ?? "",
  );
  const [signed, setSigned] = useState(() => initialData?.signed ?? "");

  const buildPreanaestheticPayload = (
    submitted: boolean,
  ): Record<string, unknown> => ({
    admissionDate,
    ward,
    attendingSurgeon,
    assignedAnaesthesiologist,
    admissionType,
    medicalConditions: Array.from(selectedConditions),
    othersText,
    clinicalDiagnosis,
    proposedSurgery,
    scheduledDate,
    scheduledTime: toHtmlTimeValue(scheduledTime) || "",
    preanaestheticConcern,
    anaesthesiaPlan,
    asaStatus,
    mallampatiGrade,
    icterus: generalExam.icterus,
    pallor: generalExam.pallor,
    cyanosis: generalExam.cyanosis,
    clubbing: generalExam.clubbing,
    hbsag: serology.hbsag,
    hiv: serology.hiv,
    previousSurgeries: surgeries.map((s) => ({
      type: s.type,
      year: s.year,
      complications: s.complications,
    })),
    currentMedication: currentMedication.map((m) => ({
      medicine: m.medicine,
      strength: m.strength,
      dosage: m.dosage,
      frequency: m.frequency,
      duration: m.duration,
      instruction: m.instruction,
    })),
    pulseRate,
    temp,
    respRate,
    bpSys,
    bpDia,
    spo2,
    physicalHeight,
    physicalWeight,
    respiratorySystem,
    cns,
    cvs,
    perAbdomen,
    breathHoldingTime,
    otherRelevantFindings,
    investigationFindings,
    dentition,
    thyroid,
    spine,
    mouthOpening,
    mentoHyoidDistance,
    neckMovement,
    looseToothOrDentures,
    hb,
    totalCount,
    differentialCount,
    plateletCount,
    sodium,
    potassium,
    chloride,
    bicarbonate,
    bloodSugar,
    bloodUrea,
    serumCreatinine,
    prothrombinType,
    inr,
    plateletCountCoagulation,
    bloodGrouping,
    urineExamination,
    bleedingTime,
    clottingTime,
    otherSpecificationVoiceRecord,
    postOperativeAnalgesiaPlanned: Array.from(postOperativeAnalgesiaPlanned),
    anticipatedPostAnaesthesiaCare: Array.from(anticipatedPostAnaesthesiaCare),
    preProcedureInstructionsVoiceRecord,
    fitForSurgery,
    imagingFiles: initialData?.imagingFiles ?? [],
    anaesthesiologistName,
    signed: signed || anaesthesiologistName || "—",
    submitted,
  });

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) => {
      const next = new Set(prev);
      if (next.has(condition)) next.delete(condition);
      else next.add(condition);
      return next;
    });
  };

  const filteredConditions = MEDICAL_CONDITIONS.filter((c) =>
    c.toLowerCase().includes(medicalSearch.toLowerCase()),
  );

  const inputBase =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50";
  const inputCompact =
    "w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300/50";

  const cardClass =
    "overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm";

  return (
    <fieldset
      disabled={readOnly}
      className={`font-sans ${readOnly ? "cursor-not-allowed opacity-95" : ""}`}
    >
      {/* Patient Information */}
      <section className={`mb-6 ${cardClass}`}>
        <SectionHeader title='Patient Information' />
        <div className='grid grid-cols-2 gap-x-4 gap-y-4 p-4 text-sm sm:p-6 md:gap-x-8 xl:grid-cols-3 xl:gap-x-10 2xl:gap-x-12'>
          <InfoRow label='Patient Name:' value={patientName || "—"} />
          <InfoRow label='Gender:' value={gender || "—"} />
          <InfoRow label='Age:' value={age || "—"} />
          <InfoRow label='Patient ID:' value={patientIdDisplay || "—"} />
          <InfoRow label='Height:' value={height || "—"} />
          <InfoRow label='IP NO:' value={ipNo || "—"} />
          <InfoRow label='Weight:' value={weight || "—"} />
          <InfoRow label='BMI:' value={bmi || "—"} />
          <InfoRow label='Date:' value={date || "—"} />
        </div>
      </section>

      {/* Admission Information */}
      <section className={`mb-6 ${cardClass}`}>
        <SectionHeader title='Admission Information' />

        <div className='grid grid-cols-1 gap-x-4 gap-y-4 p-4 text-sm sm:p-6 md:gap-x-8 xl:grid-cols-2 xl:gap-x-10 2xl:gap-x-12'>
          <div className='space-y-4'>
            {readOnly ? (
              <InfoRow label='Admission Date:' value={admissionDate || "—"} />
            ) : (
              <div>
                <label className='mb-2 block text-sm text-[var(--header-text)]'>
                  Admission Date:
                </label>
                <input
                  type='text'
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  placeholder='e.g. 25 Feb 2025, 09:00 AM'
                  className={inputBase}
                />
              </div>
            )}

            {readOnly ? (
              <InfoRow label='Ward:' value={ward || "—"} />
            ) : (
              <div>
                <label className='mb-2 block text-sm text-[var(--header-text)]'>
                  Ward:
                </label>
                <input
                  type='text'
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder='e.g. Ward A'
                  className={inputBase}
                />
              </div>
            )}
          </div>

          <div className='space-y-4'>
            {readOnly ? (
              <InfoRow
                label='Attending Surgeon:'
                value={attendingSurgeon || "—"}
              />
            ) : (
              <div>
                <label className='mb-2 block text-sm text-[var(--header-text)]'>
                  Attending Surgeon:
                </label>
                <input
                  type='text'
                  value={attendingSurgeon}
                  onChange={(e) => setAttendingSurgeon(e.target.value)}
                  placeholder='e.g. Dr. Smith'
                  className={inputBase}
                />
              </div>
            )}

            {readOnly ? (
              <InfoRow
                label='Assigned Anaesthesiologist:'
                value={assignedAnaesthesiologist || "—"}
              />
            ) : (
              <div>
                <label className='mb-2 block text-sm text-[var(--header-text)]'>
                  Assigned Anaesthesiologist:
                </label>
                <input
                  type='text'
                  value={assignedAnaesthesiologist}
                  onChange={(e) => setAssignedAnaesthesiologist(e.target.value)}
                  placeholder='e.g. Dr. Jane'
                  className={inputBase}
                />
              </div>
            )}
          </div>

          <div className='col-span-1 flex flex-wrap items-center gap-4 sm:gap-6 xl:col-span-2'>
            <label className='text-sm text-[var(--header-text)] whitespace-nowrap'>
              Type:
            </label>

            <div className='relative inline-block xl:ml-10'>
              <select
                value={admissionType}
                onChange={(e) => setAdmissionType(e.target.value)}
                disabled={readOnly}
                className='appearance-none rounded-md px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none cursor-pointer'
                style={{
                  backgroundColor: "rgba(47,128,237,0.1)",
                  color: "#2F80ED",
                }}
              >
                <option value='Elective'>Elective</option>
                <option value='Emergency'>Emergency</option>
                <option value='Urgent'>Urgent</option>
              </select>

              {/* Triangle */}
              <span className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#2F80ED] text-[10px]'>
                ▼
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Relevant Medical History | Clinical Information*/}
      <div className='grid grid-cols-1 gap-6 min-w-0 xl:grid-cols-2 xl:gap-8'>
        <section className={`min-w-0 ${cardClass}`}>
          <div className='p-4 sm:p-6'>
            <div className='mb-4 flex flex-wrap items-center justify-between gap-2'>
              <h2 className='flex min-w-0 items-center gap-2 text-sm font-semibold text-[var(--header-text)]'>
                <RelevantHistorySectionIcon />
                Relevant Medical History
              </h2>

              <span className='text-sm text-[var(--accent-muted)]'>
                Select all that apply
              </span>
            </div>

            {/* Search bar (RIGHT SIDE, SMALL) */}
            <div className='mb-4 flex justify-end'>
              <div className='relative w-56'>
                <input
                  type='search'
                  placeholder='Start typing to Search'
                  value={medicalSearch}
                  onChange={(e) => setMedicalSearch(e.target.value)}
                  className='w-full rounded border border-slate-300 px-3 py-1.5 text-sm pr-8'
                />
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-slate-400'>
                  <HiOutlineMagnifyingGlass className='h-3.5 w-3.5' />
                </span>
              </div>
            </div>

            {/* Checkbox list */}
            <ul className='mb-5 flex flex-col gap-2'>
              {filteredConditions.map((condition) => (
                <li key={condition}>
                  <label className='flex cursor-pointer items-center gap-2.5 text-sm text-slate-700'>
                    <input
                      type='checkbox'
                      checked={selectedConditions.has(condition)}
                      onChange={() => toggleCondition(condition)}
                      className='h-3.5 w-3.5 rounded border-slate-300 text-slate-500 focus:ring-slate-400'
                    />
                    {condition}
                  </label>
                </li>
              ))}
            </ul>

            {/* Others */}
            <div>
              <label className='mb-2 block text-sm text-[var(--header-text)] '>
                Specify if Others
              </label>
              <input
                type='text'
                value={othersText}
                onChange={(e) => setOthersText(e.target.value)}
                className={inputBase}
              />
            </div>
          </div>
        </section>

        <section className={`min-w-0 ${cardClass}`}>
          <SectionHeader
            title='Clinical Information'
            icon={<ClinicalDiagnosisLabelIcon />}
          />

          <div className='flex min-w-0 flex-col gap-6 p-4 sm:p-6'>
            <div>
              <div className='mb-2 flex flex-wrap items-center justify-between gap-2'>
                <label className='flex items-center gap-2 text-xs font-medium text-[#6B7280]'>
                  CLINICAL DIAGNOSIS
                </label>

                <div className='flex shrink-0 cursor-pointer items-center'>
                  <VoiceRecordSymbolIcon />
                  <span className='text-xs text-[#434343] font-semibold'>
                    Voice Record
                  </span>
                </div>
              </div>

              <textarea
                value={clinicalDiagnosis}
                onChange={(e) => setClinicalDiagnosis(e.target.value)}
                rows={3}
                className='w-full rounded-md border border-slate-200 bg-[#F6F6F6] px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 resize-none'
              />
            </div>

            {/* PROPOSED SURGERY */}
            <div>
              <label className='mb-2 block text-xs font-medium text-[#6B7280]'>
                PROPOSED SURGERY / PROCEDURE
              </label>
              <textarea
                value={proposedSurgery}
                onChange={(e) => setProposedSurgery(e.target.value)}
                rows={3}
                className='w-full rounded-md border border-slate-200 bg-[#F6F6F6] px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 resize-none'
              />
            </div>

            {/* DATE + TIME + CONCERN — one row from md so inputs align */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end md:gap-3 lg:gap-4'>
              {/* DATE */}
              <div className='min-w-0'>
                <label className='mb-2 block text-xs font-medium text-[#6B7280]'>
                  SCHEDULED DATE
                </label>
                <div className='relative'>
                  <input
                    ref={scheduledDateInputRef}
                    type='date'
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className='h-10 w-full rounded-md border border-slate-200 bg-[#F6F6F6] px-4 py-2 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300'
                  />
                  <button
                    type='button'
                    onClick={() =>
                      scheduledDateInputRef.current?.showPicker?.()
                    }
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'
                  >
                    <HiOutlineCalendarDays className='h-3.5 w-3.5' />
                  </button>
                </div>
              </div>

              {/* TIME */}
              <div className='min-w-0'>
                <label className='mb-2 block text-xs font-medium text-[#6B7280]'>
                  SCHEDULED TIME
                </label>
                <div className='relative'>
                  <input
                    ref={scheduledTimeInputRef}
                    type='time'
                    step={60}
                    value={scheduledTime}
                    onChange={(e) =>
                      setScheduledTime(toHtmlTimeValue(e.target.value))
                    }
                    className='h-10 w-full rounded-md border border-slate-200 bg-[#F6F6F6] px-4 py-2 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300'
                  />
                  <button
                    type='button'
                    onClick={() =>
                      scheduledTimeInputRef.current?.showPicker?.()
                    }
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'
                  >
                    <HiOutlineClock className='h-3.5 w-3.5' />
                  </button>
                </div>
              </div>

              {/* PREANAESTHETIC CONCERN */}
              <div className='min-w-0'>
                <label className='mb-2 block text-xs font-medium text-[#6B7280]'>
                  PREANAESTHETIC CONCERN
                </label>
                <input
                  type='text'
                  value={preanaestheticConcern}
                  onChange={(e) => setPreanaestheticConcern(e.target.value)}
                  placeholder='Text Here...'
                  className='h-10 w-full rounded-md border border-slate-200 bg-[#F6F6F6] px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300'
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* current medication */}
      <div className='my-5 mx-1'>
        <span className='text-sm font-medium  text-[#334155]'>
          CURRENT MEDICATION
        </span>
      </div>
      <section className={`mb-6 ${cardClass} overflow-hidden`}>
        <SectionHeader
          title=''
          icon={<CurrentMedicationHeaderIcon />}
          rightAction={
            !readOnly && (
              <button
                type='button'
                onClick={addMedication}
                className='flex items-center gap-1.5 text-sm text-white hover:text-white/90'
              >
                <HiOutlinePlus className='h-4 w-4' />
                Add medication
              </button>
            )
          }
        />
        {/* Mobile: stacked fields — no horizontal scroll */}
        <div className='md:hidden'>
          <div className='divide-y divide-slate-100'>
            {currentMedication.map((row, index) => (
              <div
                key={index}
                className='space-y-3 px-4 py-4 text-sm first:pt-3 last:pb-4'
              >
                <div className='min-w-0'>
                  <p className='mb-1 text-xs font-medium text-[var(--header-text)]'>
                    Medicine
                  </p>
                  {readOnly ? (
                    <p className='font-medium text-slate-800'>
                      {row.medicine || "—"}
                    </p>
                  ) : (
                    <input
                      type='text'
                      value={row.medicine}
                      onChange={(e) =>
                        updateMedication(index, "medicine", e.target.value)
                      }
                      className={inputCompact}
                      placeholder='Medicine'
                    />
                  )}
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='min-w-0'>
                    <p className='mb-1 text-xs font-medium text-[var(--header-text)]'>
                      Strength
                    </p>
                    {readOnly ? (
                      <p>{row.strength || "—"}</p>
                    ) : (
                      <input
                        type='text'
                        value={row.strength}
                        onChange={(e) =>
                          updateMedication(index, "strength", e.target.value)
                        }
                        className={inputCompact}
                        placeholder='Strength'
                      />
                    )}
                  </div>
                  <div className='min-w-0'>
                    <p className='mb-1 text-xs font-medium text-[var(--header-text)]'>
                      Dosage
                    </p>
                    {readOnly ? (
                      <p>{row.dosage || "—"}</p>
                    ) : (
                      <input
                        type='text'
                        value={row.dosage}
                        onChange={(e) =>
                          updateMedication(index, "dosage", e.target.value)
                        }
                        className={inputCompact}
                        placeholder='Dosage'
                      />
                    )}
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='min-w-0'>
                    <p className='mb-1 text-xs font-medium text-[var(--header-text)]'>
                      Frequency
                    </p>
                    {readOnly ? (
                      <p>{row.frequency || "—"}</p>
                    ) : (
                      <input
                        type='text'
                        value={row.frequency}
                        onChange={(e) =>
                          updateMedication(index, "frequency", e.target.value)
                        }
                        className={inputCompact}
                        placeholder='Frequency'
                      />
                    )}
                  </div>
                  <div className='min-w-0'>
                    <p className='mb-1 text-xs font-medium text-[var(--header-text)]'>
                      Duration
                    </p>
                    {readOnly ? (
                      <p>{row.duration || "—"}</p>
                    ) : (
                      <input
                        type='text'
                        value={row.duration}
                        onChange={(e) =>
                          updateMedication(index, "duration", e.target.value)
                        }
                        className={inputCompact}
                        placeholder='Duration'
                      />
                    )}
                  </div>
                </div>
                <div className='min-w-0'>
                  <p className='mb-1 text-xs font-medium text-[var(--header-text)]'>
                    Instruction
                  </p>
                  {readOnly ? (
                    <p>{row.instruction || "—"}</p>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <input
                        type='text'
                        value={row.instruction}
                        onChange={(e) =>
                          updateMedication(
                            index,
                            "instruction",
                            e.target.value,
                          )
                        }
                        className={`${inputCompact} min-w-0 flex-1`}
                        placeholder='Instruction'
                      />
                      {currentMedication.length > 1 && (
                        <button
                          type='button'
                          onClick={() => removeMedication(index)}
                          className='shrink-0 p-1 text-slate-500 hover:text-red-600'
                          aria-label='Remove row'
                        >
                          <HiOutlineTrash className='h-4 w-4' />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='hidden overflow-x-auto md:block'>
          <table className='w-full table-fixed border-collapse text-sm'>
            <colgroup>
              <col style={{ width: "32%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "13%" }} />
            </colgroup>
            <thead>
              <tr className='border-b border-slate-200 bg-gray-50 text-left text-[var(--header-text)]'>
                <th className='py-3 pl-6 pr-2 font-medium'>Medicine</th>
                <th className='py-3 px-2 font-medium'>Strength</th>
                <th className='py-3 px-2 font-medium'>Dosage</th>
                <th className='py-3 px-2 font-medium'>Frequency</th>
                <th className='py-3 px-2 font-medium'>Duration</th>
                <th className='py-3 pl-2 pr-6 font-medium'>Instruction</th>
              </tr>
            </thead>
            <tbody className='text-slate-700'>
              {currentMedication.map((row, index) => (
                <tr
                  key={index}
                  className='border-b border-slate-100 last:border-0'
                >
                  <td className='py-4 pl-6 pr-2 font-medium'>
                    {readOnly ? (
                      row.medicine || "—"
                    ) : (
                      <input
                        type='text'
                        value={row.medicine}
                        onChange={(e) =>
                          updateMedication(index, "medicine", e.target.value)
                        }
                        className={inputCompact}
                        placeholder='Medicine'
                      />
                    )}
                  </td>
                  <td className='py-4 px-2'>
                    {readOnly ? (
                      row.strength || "—"
                    ) : (
                      <input
                        type='text'
                        value={row.strength}
                        onChange={(e) =>
                          updateMedication(index, "strength", e.target.value)
                        }
                        className={inputCompact}
                        placeholder='Strength'
                      />
                    )}
                  </td>
                  <td className='py-4 px-2'>
                    {readOnly ? (
                      row.dosage || "—"
                    ) : (
                      <input
                        type='text'
                        value={row.dosage}
                        onChange={(e) =>
                          updateMedication(index, "dosage", e.target.value)
                        }
                        className={inputCompact}
                        placeholder='Dosage'
                      />
                    )}
                  </td>
                  <td className='py-4 px-2'>
                    {readOnly ? (
                      row.frequency || "—"
                    ) : (
                      <input
                        type='text'
                        value={row.frequency}
                        onChange={(e) =>
                          updateMedication(index, "frequency", e.target.value)
                        }
                        className={inputCompact}
                        placeholder='Frequency'
                      />
                    )}
                  </td>
                  <td className='py-4 px-2'>
                    {readOnly ? (
                      row.duration || "—"
                    ) : (
                      <input
                        type='text'
                        value={row.duration}
                        onChange={(e) =>
                          updateMedication(index, "duration", e.target.value)
                        }
                        className={inputCompact}
                        placeholder='Duration'
                      />
                    )}
                  </td>
                  <td className='py-4 pl-2 pr-6'>
                    {readOnly ? (
                      row.instruction || "—"
                    ) : (
                      <div className='flex items-center gap-2'>
                        <input
                          type='text'
                          value={row.instruction}
                          onChange={(e) =>
                            updateMedication(
                              index,
                              "instruction",
                              e.target.value,
                            )
                          }
                          className={`${inputCompact} min-w-0 flex-1`}
                          placeholder='Instruction'
                        />
                        {currentMedication.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeMedication(index)}
                            className='shrink-0 p-1 text-slate-500 hover:text-red-600'
                            aria-label='Remove row'
                          >
                            <HiOutlineTrash className='h-4 w-4' />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* previous Surgery | physical examination */}
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.6fr] xl:gap-8'>
        <section className={`${cardClass} flex min-w-0 flex-col`}>
          <div className='flex items-center justify-between px-5 py-3 bg-[#F8FAFC] border-b border-slate-200'>
            <div className='flex items-center gap-2'>
              <HiOutlineClipboardDocumentList className={SECTION_ICON_CLASS} />
              <span className='text-sm font-semibold text-[var(--header-text)]'>
                Previous Surgery
              </span>
            </div>

            {!readOnly && (
              <button
                type='button'
                onClick={() => setIsPreviousSurgeryOpen((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPreviousSurgeryOpen ? "bg-[#80A6F0]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPreviousSurgeryOpen ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            )}
          </div>

          {isPreviousSurgeryOpen && (
            <div className='flex flex-col p-4 gap-3'>
              <div
                ref={surgeryListScrollRef}
                className='max-h-[260px] overflow-y-auto pr-1'
              >
                {surgeries.map((surgery, index) => (
                  <div
                    key={index}
                    className='border-b border-slate-100 pb-4 mb-4 last:border-0 last:mb-0'
                  >
                    {/* REMOVE */}
                    <div className='flex justify-end mb-1'>
                      {!readOnly && surgeries.length > 1 && (
                        <button
                          type='button'
                          onClick={() => removeSurgery(index)}
                          className='flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100'
                        >
                          <HiOutlineMinus className='h-4 w-4' />
                        </button>
                      )}
                    </div>

                    {/* TYPE + YEAR */}
                    <div className='grid grid-cols-1 gap-2 min-[480px]:grid-cols-[2fr_1fr]'>
                      <div>
                        <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                          Type of Surgery
                        </label>
                        <input
                          type='text'
                          value={surgery.type}
                          onChange={(e) =>
                            updateSurgery(index, "type", e.target.value)
                          }
                          className={`${inputBase} bg-[#F6F6F6]`}
                        />
                      </div>

                      <div>
                        <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                          Year
                        </label>
                        <input
                          type='text'
                          value={surgery.year}
                          onChange={(e) =>
                            updateSurgery(index, "year", e.target.value)
                          }
                          className={`${inputBase} bg-[#F6F6F6]`}
                        />
                      </div>
                    </div>

                    {/* COMPLICATION */}
                    <div className='mt-2'>
                      <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                        Anaesthesia Complications
                      </label>
                      <input
                        type='text'
                        value={surgery.complications}
                        onChange={(e) =>
                          updateSurgery(index, "complications", e.target.value)
                        }
                        className={`${inputBase} bg-[#F6F6F6]`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {!readOnly && (
                <button
                  type='button'
                  onClick={() => {
                    addSurgery();
                    setTimeout(() => {
                      const el = surgeryListScrollRef.current;
                      if (el) {
                        el.scrollTop = el.scrollHeight;
                      }
                    }, 100);
                  }}
                  className='flex items-center gap-1 text-sm font-medium text-[#80A6F0]'
                >
                  <HiOutlinePlus className='h-4 w-4' />
                  Add another surgery
                </button>
              )}
            </div>
          )}
        </section>

        <section className={`${cardClass} flex min-w-0 flex-col`}>
          <div className='flex items-center justify-between gap-2 px-4 py-3 bg-[#F8FAFC] border-b border-slate-200'>
            <span className='text-sm font-semibold text-[var(--header-text)]'>
              Physical Examination
            </span>
            <PhysicalExaminationTitleEndIcon />
          </div>

          <div className='grid min-w-0 grid-cols-2 gap-x-2 gap-y-2 p-3 text-sm sm:p-4 xl:grid-cols-4 xl:gap-x-3'>
            {/* Pulse */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Pulse Rate
              </label>
              <div className='relative'>
                <input
                  type='text'
                  value={pulseRate}
                  onChange={(e) => setPulseRate(e.target.value)}
                  className={`${inputCompact} pr-9 bg-[#F8FAFC]`}
                />
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400'>
                  bpm
                </span>
              </div>
            </div>

            {/* Temp */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Temp
              </label>
              <div className='relative'>
                <input
                  type='text'
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className={`${inputCompact} pr-8 bg-[#F8FAFC]`}
                />
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400'>
                  °C
                </span>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Weight
              </label>
              <div className='relative'>
                <input
                  type='text'
                  value={physicalWeight}
                  onChange={(e) => setPhysicalWeight(e.target.value)}
                  className={`${inputCompact} pr-8 bg-[#F8FAFC]`}
                />
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400'>
                  kg
                </span>
              </div>
            </div>

            {/* Resp */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Resp Rate
              </label>
              <div className='relative'>
                <input
                  type='text'
                  value={respRate}
                  onChange={(e) => setRespRate(e.target.value)}
                  className={`${inputCompact} pr-10 bg-[#F8FAFC]`}
                />
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400'>
                  /min
                </span>
              </div>
            </div>

            {/* BP */}
            <div className='col-span-2 min-w-0 xl:col-span-2'>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                BP
              </label>
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  placeholder='Sys'
                  value={bpSys}
                  onChange={(e) => setBpSys(e.target.value)}
                  className={`${inputCompact} text-center bg-[#F8FAFC]`}
                />
                <span className='text-slate-400 text-sm'>/</span>
                <input
                  type='text'
                  placeholder='Dia'
                  value={bpDia}
                  onChange={(e) => setBpDia(e.target.value)}
                  className={`${inputCompact} text-center bg-[#F8FAFC]`}
                />
              </div>
            </div>

            {/* SpO2 */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                SpO₂
              </label>
              <div className='relative'>
                <input
                  type='text'
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  className={`${inputCompact} pr-6 bg-[#F8FAFC]`}
                />
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400'>
                  %
                </span>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className='mb-1 block text-xs font-medium text-[#6B7280]'>
                Height
              </label>
              <div className='relative'>
                <input
                  type='text'
                  value={physicalHeight}
                  onChange={(e) => setPhysicalHeight(e.target.value)}
                  className={`${inputCompact} pr-8 bg-[#F8FAFC]`}
                />
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400'>
                  cm
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Systemic Examination */}
      <section className={`mb-6 mt-8 ${cardClass}`}>
        <div className='flex items-center gap-2 px-5 py-3'>
          <SystemicExaminationSectionIcon />
          <span className='py-1 text-sm font-semibold text-[var(--header-text)]'>
            Systemic Examination
          </span>
        </div>

        <div className='grid grid-cols-1 gap-x-4 gap-y-6 p-4 text-sm sm:p-6 xl:grid-cols-2 xl:gap-x-8 2xl:gap-x-12'>
          <div className='min-w-0 space-y-6'>
            {/* Respiratory System */}
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-sm font-medium text-[#64748B]'>
                  Respiratory System (RS)
                </label>
                <div className='flex gap-2'>
                  <span className='rounded-sm bg-[#F1F5F9] px-2 py-0.5 text-xs text-[#64748B]'>
                    Clear
                  </span>
                  <span className='rounded-sm bg-[#F1F5F9] px-2 py-0.5 text-xs text-[#64748B]'>
                    B/L AE+
                  </span>
                </div>
              </div>
              <input
                type='text'
                placeholder='Enter findings...'
                value={respiratorySystem}
                onChange={(e) => setRespiratorySystem(e.target.value)}
                className={`${inputBase} !bg-[#F8FAFC]`}
              />
            </div>

            {/* CNS */}
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-sm font-medium text-[#64748B]'>
                  Central Nervous System (CNS)
                </label>
                <div className='flex gap-2'>
                  <span className='rounded-sm bg-[#F1F5F9] px-2 py-0.5 text-xs text-[#64748B]'>
                    Conscious
                  </span>
                  <span className='rounded-sm bg-[#F1F5F9] px-2 py-0.5 text-xs text-[#64748B]'>
                    Oriented
                  </span>
                </div>
              </div>
              <input
                type='text'
                placeholder='Enter findings...'
                value={cns}
                onChange={(e) => setCns(e.target.value)}
                className={`${inputBase} !bg-[#F8FAFC]`}
              />
            </div>
          </div>

          <div className='min-w-0 space-y-6'>
            {/* CVS */}
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-sm font-medium text-[#64748B]'>
                  Cardiovascular (CVS)
                </label>
                <div className='flex gap-2'>
                  <span className='rounded-sm bg-[#F1F5F9] px-2 py-0.5 text-xs text-[#64748B]'>
                    S1 S2 Normal
                  </span>
                  <span className='rounded-sm bg-[#F1F5F9] px-2 py-0.5 text-xs text-[#64748B]'>
                    No Murmurs
                  </span>
                </div>
              </div>
              <input
                type='text'
                placeholder='Enter findings...'
                value={cvs}
                onChange={(e) => setCvs(e.target.value)}
                className={`${inputBase} !bg-[#F8FAFC]`}
              />
            </div>

            {/* Per Abdomen */}
            <div>
              <div className='mb-2 flex items-center justify-between'>
                <label className='text-sm font-medium text-[#64748B]'>
                  Per Abdomen (P/A)
                </label>
                <div className='flex gap-2'>
                  <span className='rounded-sm bg-[#F1F5F9] px-2 py-0.5 text-xs text-[#64748B]'>
                    Soft
                  </span>
                  <span className='rounded-sm bg-[#F1F5F9] px-2 py-0.5 text-xs text-[#64748B]'>
                    Non-Tender
                  </span>
                </div>
              </div>
              <input
                type='text'
                placeholder='Enter findings...'
                value={perAbdomen}
                onChange={(e) => setPerAbdomen(e.target.value)}
                className={`${inputBase} !bg-[#F8FAFC]`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Functional Capacity | General Examination */}
      <div className='mt-8 grid grid-cols-1 gap-6 min-w-0 xl:grid-cols-5 xl:gap-8'>
        <section className={`xl:col-span-3 ${cardClass} min-w-0`}>
          <div className='flex items-center gap-2 px-5 py-3 bg-[#F8FAFC] border-b border-slate-200'>
            <FunctionalCapacitySectionIcon />
            <span className='text-sm font-semibold text-[var(--header-text)]'>
              Functional Capacity
            </span>
          </div>

          <div className='flex flex-col gap-6 p-6 text-sm'>
            <div>
              <label className='mb-2 block font-medium text-[#64748B]'>
                Breath Holding Time / Effective Tolerance
              </label>
              <input
                type='text'
                placeholder='Time'
                value={breathHoldingTime}
                onChange={(e) => setBreathHoldingTime(e.target.value)}
                className={`${inputBase} !bg-[#F8FAFC] placeholder:text-[#757575]`}
              />
            </div>

            <div>
              <label className='mb-2 block font-medium text-[#64748B]'>
                Other Relevant Findings
              </label>
              <input
                type='text'
                placeholder='Enter findings'
                value={otherRelevantFindings}
                onChange={(e) => setOtherRelevantFindings(e.target.value)}
                className={`${inputBase} !bg-[#F8FAFC] placeholder:text-[#757575]`}
              />
            </div>
          </div>
        </section>

        <section className={`xl:col-span-2 ${cardClass} min-w-0`}>
          <div className='flex items-center gap-2 px-5 py-3'>
            <GeneralExaminationSectionIcon />
            <span className='text-sm font-semibold text-[var(--header-text)]'>
              General Examination
            </span>
          </div>

          <div className='flex flex-col gap-3 p-6 text-sm'>
            {[
              { label: "Icterus", key: "icterus" },
              { label: "Pallor", key: "pallor" },
              { label: "Cyanosis", key: "cyanosis" },
              { label: "Clubbing", key: "clubbing" },
            ].map((item) => {
              const isActive =
                generalExam[item.key as keyof typeof generalExam];

              return (
                <div
                  key={item.key}
                  className='flex items-center justify-between rounded-sm bg-[#F8FAFC] px-4 py-3'
                >
                  <label className='font-medium text-[#0F172A]'>
                    {item.label}
                  </label>

                  <button
                    type='button'
                    onClick={() =>
                      setGeneralExam((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof prev],
                      }))
                    }
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      isActive ? "bg-[#80A6F0]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        isActive ? "translate-x-4" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Investigations | Airway assessment | ASA status*/}
      <div className='mt-8 grid grid-cols-1 gap-6 min-w-0 xl:grid-cols-12 xl:gap-8'>
        {/* INVESTIGATION */}
        <section className={`xl:col-span-4 ${cardClass} min-w-0`}>
          <div className='flex items-center gap-2 px-5 py-3 bg-[#F8FAFC] border-b border-slate-200'>
            <HiOutlineMagnifyingGlass className={SECTION_ICON_CLASS} />
            <span className='text-sm font-semibold text-[var(--header-text)]'>
              Investigation
            </span>
          </div>

          <div className='p-6 text-sm space-y-6'>
            <div>
              <label className='block mb-2 font-medium text-[#64748B] text-xs'>
                Enter Findings
              </label>
              <input
                type='text'
                placeholder='Values'
                value={investigationFindings}
                onChange={(e) => setInvestigationFindings(e.target.value)}
                className={`${inputBase} text-xs !bg-[#F8FAFC] placeholder:text-[#757575]`}
              />
            </div>

            <div className='grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3'>
              {[
                { label: "Dentition", value: dentition, setter: setDentition },
                { label: "Thyroid", value: thyroid, setter: setThyroid },
                { label: "Spine", value: spine, setter: setSpine },
              ].map((item, i) => (
                <div key={i}>
                  <label className='block mb-2 font-medium text-[#64748B] text-xs'>
                    {item.label}
                  </label>
                  <input
                    type='text'
                    placeholder='Text'
                    value={item.value}
                    onChange={(e) => item.setter(e.target.value)}
                    className={`${inputBase} text-xs !bg-[#F8FAFC] placeholder:text-[#757575]`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AIRWAY */}
        <section className={`xl:col-span-4 ${cardClass}`}>
          <div className='flex items-center gap-2 px-5 py-3'>
            <AirwaySectionIcon />
            <span className='text-sm font-semibold text-[var(--header-text)]'>
              Airway Assessment
            </span>
          </div>

          <div className='p-6 text-sm space-y-6'>
            <div className='grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3 md:items-end md:gap-x-3 md:gap-y-4'>
              {[
                {
                  label: "Mouth Opening",
                  value: mouthOpening,
                  setter: setMouthOpening,
                  options: ["3 Fingers", "> 3 Fingers"],
                },
                {
                  label: "Mento Hyoid Distance",
                  value: mentoHyoidDistance,
                  setter: setMentoHyoidDistance,
                  options: ["< 4 cm", "> 4 cm"],
                },
                {
                  label: "Neck Movement",
                  value: neckMovement,
                  setter: setNeckMovement,
                  options: ["Adequate", "Restricted"],
                },
              ].map((item, i) => (
                <div key={i} className='flex min-h-0 min-w-0 flex-col'>
                  <label className='mb-2 block font-medium text-[#64748B] text-xs'>
                    {item.label}
                  </label>
                  <select
                    value={item.value || ""}
                    onChange={(e) => item.setter(e.target.value)}
                    className={`${inputBase} min-h-[2.5rem] w-full min-w-0 !bg-[#F8FAFC] text-xs`}
                  >
                    <option value=''>Select</option>
                    {item.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* MALLAMPATI */}
            <div>
              <label className='block mb-3 font-medium text-[#64748B] text-xs'>
                Mallampati Grade
              </label>
              <div className='flex flex-wrap justify-center gap-2 sm:gap-3'>
                {["I", "II", "III", "IV"].map((grade) => {
                  const isActive = mallampatiGrade === grade;

                  return (
                    <button
                      key={grade}
                      type='button'
                      onClick={() =>
                        setMallampatiGrade(isActive ? null : grade)
                      }
                      className={`min-w-[3rem] px-4 py-2.5 rounded-xl border transition ${
                        isActive
                          ? "bg-[#EFF6FF] text-[#2F80ED] border-[#2F80ED]"
                          : "border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {grade}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CHECKBOX */}
            <div className='flex items-center gap-3'>
              <input
                type='checkbox'
                className='h-4 w-4'
                checked={looseToothOrDentures}
                onChange={(e) => setLooseToothOrDentures(e.target.checked)}
              />
              <label className='text-[#64748B] text-xs'>
                Patient has loose tooth / Artificial dentures
              </label>
            </div>
          </div>
        </section>

        {/* ASA STATUS */}
        <section className={`xl:col-span-4 ${cardClass} flex flex-col`}>
          <div className='flex items-center gap-2 px-5 py-3'>
            <GeneralExaminationSectionIcon />
            <span className='text-sm font-semibold text-[var(--header-text)]'>
              ASA Status
            </span>
          </div>

          <div className='flex flex-1 items-center justify-center p-6 text-sm'>
            <div className='grid grid-cols-4 sm:grid-cols-7 gap-2 w-full'>
              {["I", "II", "III", "IV", "V", "VI", "E"].map((asa) => {
                const isActive = asaStatus === asa;

                return (
                  <button
                    key={asa}
                    type='button'
                    onClick={() => setAsaStatus(isActive ? null : asa)}
                    className={`flex items-center justify-center py-2.5 rounded-lg border transition ${
                      isActive
                        ? "bg-[#80A6F0] text-white border-[#80A6F0]"
                        : "border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {asa}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/*Haematology | Serum electrolytes | Bio Chemistry */}
      <div className='mt-8 grid grid-cols-1 gap-6 min-w-0 xl:grid-cols-12 xl:gap-8'>
        {/* ================= HAEMATOLOGY ================= */}
        <section className={`xl:col-span-4 ${cardClass}`}>
          <div className='px-5 py-3'>
            <span className='flex items-center gap-2 text-sm font-semibold text-[#334155]'>
              <LabSectionTitleIcon />
              Haematology
            </span>
          </div>

          <div className='min-w-0 px-3 pb-4 sm:px-6 sm:pb-6'>
            <table className='w-full table-fixed border-collapse text-xs sm:text-sm'>
              <thead>
                <tr className='border-b border-slate-100 text-left text-[#64748B]'>
                  <th className='w-[38%] pb-2 pr-1 font-medium'>Test</th>
                  <th className='w-[34%] pb-2 px-1 font-medium'>Value</th>
                  <th className='w-[28%] min-w-0 pb-2 pl-1 pr-0 text-left font-medium'>
                    Unit
                  </th>
                </tr>
              </thead>

              <tbody className='align-middle'>
                {[
                  { label: "Hb", value: hb, setter: setHb, unit: "g/dL" },
                  {
                    label: "Total Count",
                    value: totalCount,
                    setter: setTotalCount,
                    unit: "cells/mm³",
                  },
                  {
                    label: "Differential Count (DC)",
                    value: differentialCount,
                    setter: setDifferentialCount,
                    unit: "%",
                  },
                  {
                    label: "Platelet Count",
                    value: plateletCount,
                    setter: setPlateletCount,
                    unit: "cells/mm³",
                  },
                ].map((item, idx) => (
                  <tr key={idx}>
                    <td className='py-2 pr-1 align-top text-[11px] font-medium text-black sm:py-3 sm:text-sm'>
                      {item.label}
                    </td>

                    <td className='px-1 py-2 sm:py-3'>
                      <input
                        type='text'
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        className='h-8 w-full min-w-0 bg-transparent border-0 border-b border-dashed border-gray-300 text-black focus:outline-none'
                      />
                    </td>

                    <td className='min-w-0 py-2 pl-1 pr-0 align-top text-[10px] leading-snug text-[#64748B] break-words sm:py-3 sm:text-xs'>
                      {item.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= ELECTROLYTES ================= */}
        <section className={`xl:col-span-4 ${cardClass}`}>
          <div className='px-5 py-3'>
            <span className='flex items-center gap-2 text-sm font-semibold text-[#334155]'>
              <LabSectionTitleIcon />
              Serum Electrolytes
            </span>
          </div>

          <div className='min-w-0 px-3 pb-4 sm:px-6 sm:pb-6'>
            <table className='w-full table-fixed border-collapse text-xs sm:text-sm'>
              <thead>
                <tr className='border-b border-slate-100 text-left text-[#64748B]'>
                  <th className='w-[38%] pb-2 pr-1 font-medium'>Test</th>
                  <th className='w-[34%] pb-2 px-1 font-medium'>Value</th>
                  <th className='w-[28%] min-w-0 pb-2 pl-1 pr-0 text-left font-medium'>
                    Unit
                  </th>
                </tr>
              </thead>

              <tbody>
                {[
                  {
                    label: "Sodium",
                    value: sodium,
                    setter: setSodium,
                    unit: "g/dL",
                  },
                  {
                    label: "Potassium",
                    value: potassium,
                    setter: setPotassium,
                    unit: "cells/mm³",
                  },
                  {
                    label: "Chloride",
                    value: chloride,
                    setter: setChloride,
                    unit: "%",
                  },
                  {
                    label: "Bicarbonate",
                    value: bicarbonate,
                    setter: setBicarbonate,
                    unit: "cells/mm³",
                  },
                ].map((item, idx) => (
                  <tr key={idx}>
                    <td className='py-2 pr-1 align-top text-[11px] font-medium text-black sm:py-3 sm:text-sm'>
                      {item.label}
                    </td>

                    <td className='px-1 py-2 sm:py-3'>
                      <input
                        type='text'
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        className='h-8 w-full min-w-0 bg-transparent border-0 border-b border-dashed border-gray-300 text-black focus:outline-none'
                      />
                    </td>

                    <td className='min-w-0 py-2 pl-1 pr-0 align-top text-[10px] leading-snug text-[#64748B] break-words sm:py-3 sm:text-xs'>
                      {item.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= BIOCHEMISTRY ================= */}
        <section className={`xl:col-span-4 ${cardClass}`}>
          <div className='px-5 py-3'>
            <span className='flex items-center gap-2 text-sm font-semibold text-[#334155]'>
              <LabSectionTitleIcon />
              Bio Chemistry
            </span>
          </div>

          <div className='min-w-0 px-3 pb-4 sm:px-6 sm:pb-6'>
            <table className='w-full table-fixed border-collapse text-xs sm:text-sm'>
              <thead>
                <tr className='border-b border-slate-100 text-left text-[#64748B]'>
                  <th className='w-[38%] pb-2 pr-1 font-medium'>Test</th>
                  <th className='w-[34%] pb-2 px-1 font-medium'>Value</th>
                  <th className='w-[28%] min-w-0 pb-2 pl-1 pr-0 text-left font-medium'>
                    Unit
                  </th>
                </tr>
              </thead>

              <tbody>
                {[
                  {
                    label: "Blood Sugar",
                    value: bloodSugar,
                    setter: setBloodSugar,
                    unit: "g/dL",
                  },
                  {
                    label: "Blood Urea",
                    value: bloodUrea,
                    setter: setBloodUrea,
                    unit: "g/dL",
                  },
                  {
                    label: "Serum Creatinine",
                    value: serumCreatinine,
                    setter: setSerumCreatinine,
                    unit: "g/dL",
                  },
                ].map((item, idx) => (
                  <tr key={idx}>
                    <td className='py-2 pr-1 align-top text-[11px] font-medium text-black sm:py-3 sm:text-sm'>
                      {item.label}
                    </td>

                    <td className='px-1 py-2 sm:py-3'>
                      <input
                        type='text'
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        className='h-8 w-full min-w-0 bg-transparent border-0 border-b border-dashed border-gray-300 text-black focus:outline-none'
                      />
                    </td>

                    <td className='min-w-0 py-2 pl-1 pr-0 align-top text-[10px] leading-snug text-[#64748B] break-words sm:py-3 sm:text-xs'>
                      {item.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Coagulation profile | Serology | Blood & Urine */}
      <div className='mt-8 grid grid-cols-1 gap-6 min-w-0 xl:grid-cols-12 xl:gap-8'>
        {/* ================= COAGULATION ================= */}
        <section className={`xl:col-span-4 ${cardClass}`}>
          <div className='px-5 py-3'>
            <span className='flex items-center gap-2 text-sm font-semibold text-[#334155]'>
              <LabSectionTitleIcon />
              Coagulation Profile
            </span>
          </div>

          <div className='px-6 pb-6'>
            <table className='w-full text-sm border-collapse'>
              <thead>
                <tr className='text-left text-[#64748B] border-b border-slate-100'>
                  <th className='pb-2 pr-6 font-medium'>Test</th>
                  <th className='pb-2 px-4 font-medium'>Value</th>
                  <th className='pb-2 pl-1 font-medium'>Unit</th>
                </tr>
              </thead>

              <tbody>
                {[
                  {
                    label: "Prothrombin Time",
                    value: prothrombinType,
                    setter: setProthrombinType,
                    unit: "sec",
                  },
                  {
                    label: "INR",
                    value: inr,
                    setter: setInr,
                    unit: "cells/mm³",
                  },
                  {
                    label: "Platelet Count",
                    value: plateletCountCoagulation,
                    setter: setPlateletCountCoagulation,
                    unit: "%",
                  },
                ].map((item, idx) => (
                  <tr key={idx}>
                    <td className='py-3 pr-6 font-medium text-black'>
                      {item.label}
                    </td>

                    <td className='py-3 px-4'>
                      <input
                        type='text'
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        className='w-full bg-transparent border-0 border-b border-dashed border-gray-300 focus:outline-none text-black h-8'
                      />
                    </td>

                    <td className='py-3 pl-1 text-[#64748B] font-medium'>
                      {item.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= SEROLOGY ================= */}
        <section className={`xl:col-span-4 ${cardClass}`}>
          {/* TITLE */}
          <div className='px-5 py-3'>
            <span className='flex items-center gap-2 text-sm font-semibold text-[#334155]'>
              <LabSectionTitleIcon />
              Serology
            </span>
          </div>

          {/* TABLE */}
          <div className='px-6 pb-6'>
            <table className='w-full text-sm'>
              {/* HEADER */}
              <thead>
                <tr className='text-left text-[#64748B] border-b border-slate-100'>
                  <th className='pb-2 font-medium'>Test</th>
                  <th className='pb-2 text-right font-medium'>Positive</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {[
                  { label: "HBsAg", key: "hbsag" },
                  { label: "HIV", key: "hiv" },
                ].map((item, idx) => {
                  const key = item.key as keyof typeof serology;
                  const isActive = serology[key];

                  return (
                    <tr key={idx}>
                      {/* TEST NAME */}
                      <td className='py-3 font-medium text-black'>
                        {item.label}
                      </td>

                      {/* TOGGLE */}
                      <td className='py-3 text-right'>
                        <button
                          type='button'
                          onClick={() =>
                            setSerology((prev) => ({
                              ...prev,
                              [key]: !prev[key],
                            }))
                          }
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            isActive ? "bg-[#80A6F0]" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              isActive ? "translate-x-4" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= BLOOD & URINE ================= */}
        <section className={`xl:col-span-4 ${cardClass}`}>
          <div className='px-5 py-3'>
            <span className='flex items-center gap-2 text-sm font-semibold text-[#334155]'>
              <LabSectionTitleIcon />
              Blood & Urine
            </span>
          </div>

          <div className='px-6 pb-6'>
            <table className='w-full text-sm border-collapse'>
              <thead>
                <tr className='text-left text-[#64748B] border-b border-slate-100'>
                  <th className='pb-2 pr-6 font-medium'>Test</th>
                  <th className='pb-2 pl-4 font-medium'>Value</th>
                </tr>
              </thead>

              <tbody>
                {[
                  {
                    label: "Blood Grouping",
                    value: bloodGrouping,
                    setter: setBloodGrouping,
                  },
                  {
                    label: "Urine Examination",
                    value: urineExamination,
                    setter: setUrineExamination,
                  },
                  {
                    label: "Bleeding Time",
                    value: bleedingTime,
                    setter: setBleedingTime,
                  },
                  {
                    label: "Clotting Time",
                    value: clottingTime,
                    setter: setClottingTime,
                  },
                ].map((item, idx) => (
                  <tr key={idx}>
                    <td className='py-3 pr-6 font-medium text-black'>
                      {item.label}
                    </td>

                    <td className='py-3 pl-4'>
                      <input
                        type='text'
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        className='w-full bg-transparent border-0 border-b border-dashed border-gray-300 focus:outline-none text-black h-8'
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Imaging & Cardiac */}
      <div className='mt-8 mb-2'>
        <span className='p-2 text-sm font-semibold text-[#334155]'>
          Imaging & Cardiac Evaluation
        </span>
      </div>

      <section className={`mb-6 ${cardClass} min-w-0`}>
        <div className='hidden items-center px-5 py-3 bg-[#9FBAD8] border-b border-slate-200 xl:flex'>
          <div className='grid w-full grid-cols-4 text-sm font-semibold text-white'>
            <span>File Name</span>
            <span>File Size</span>
            <span>Date</span>
            <span className='text-center'>Action</span>
          </div>
        </div>
        <div className='border-b border-slate-200 bg-[#9FBAD8] px-4 py-3 text-sm font-semibold text-white xl:hidden'>
          Imaging & Cardiac files
        </div>

        <div className='p-4 sm:p-6'>
          {/** Mobile / tablet: stacked cards — no horizontal table squeeze */}
          <ul className='space-y-4 xl:hidden'>
            {[
              {
                name: "ECG_Report_Nov2023.pdf",
                size: "1.2 MB",
                date: "23 Nov 2023",
              },
              {
                name: "Chest_Xray.png",
                size: "2.8 MB",
                date: "22 Nov 2023",
              },
              {
                name: "Echo_Report.pdf",
                size: "950 KB",
                date: "21 Nov 2023",
              },
            ].map((file, index) => (
              <li
                key={index}
                className='rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-sm'
              >
                <div className='mb-3 flex min-w-0 items-start gap-2 font-medium text-slate-900'>
                  <ImagingFileNameIcon />
                  <span className='min-w-0 break-words'>{file.name}</span>
                </div>
                <div className='mb-2 flex items-center gap-2 text-[#364261]'>
                  <ImagingFileSizeIcon />
                  <span>{file.size}</span>
                </div>
                <div className='mb-4 flex items-center gap-2 text-[#364261]'>
                  <ImagingDateIcon />
                  <span>{file.date}</span>
                </div>
                <div className='flex items-center justify-end gap-3 border-t border-slate-200 pt-3'>
                  <button
                    type='button'
                    className='rounded p-1.5 text-slate-600 transition hover:bg-white hover:opacity-90'
                    aria-label='View'
                  >
                    <ImagingViewActionIcon />
                  </button>
                  <button
                    type='button'
                    className='rounded p-1.5 text-slate-600 transition hover:bg-white hover:opacity-90'
                    aria-label='Delete'
                  >
                    <ImagingDeleteActionIcon />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <table className='hidden w-full border-collapse text-sm xl:table'>
            <tbody>
              {[
                {
                  name: "ECG_Report_Nov2023.pdf",
                  size: "1.2 MB",
                  date: "23 Nov 2023",
                },
                {
                  name: "Chest_Xray.png",
                  size: "2.8 MB",
                  date: "22 Nov 2023",
                },
                {
                  name: "Echo_Report.pdf",
                  size: "950 KB",
                  date: "21 Nov 2023",
                },
              ].map((file, index) => (
                <tr
                  key={index}
                  className='border-b border-slate-100 transition last:border-0 hover:bg-slate-50'
                >
                  <td className='w-1/4 py-4'>
                    <span className='flex items-center gap-2 font-medium'>
                      <ImagingFileNameIcon />
                      {file.name}
                    </span>
                  </td>

                  <td className='w-1/4 py-4 text-[#364261]'>
                    <span className='flex items-center gap-2'>
                      <ImagingFileSizeIcon />
                      {file.size}
                    </span>
                  </td>

                  <td className='w-1/4 py-4 text-[#364261]'>
                    <span className='flex items-center gap-2'>
                      <ImagingDateIcon />
                      {file.date}
                    </span>
                  </td>

                  <td className='w-1/4 py-4'>
                    <div className='flex items-center justify-center gap-3'>
                      <button
                        type='button'
                        className='rounded p-1.5 text-slate-600 transition hover:opacity-80'
                        aria-label='View'
                      >
                        <ImagingViewActionIcon />
                      </button>
                      <button
                        type='button'
                        className='rounded p-1.5 text-slate-600 transition hover:opacity-80'
                        aria-label='Delete'
                      >
                        <ImagingDeleteActionIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Other Evaluation */}
      <section className={`mb-6 ${cardClass}`}>
        <div className='flex items-center gap-2 px-5 py-3 bg-[#F8FAFC] border-b border-slate-200'>
          <FunctionalCapacitySectionIcon />
          <span className='text-sm font-semibold text-[var(--header-text)]'>
            Other Specific Investigation
          </span>
        </div>

        <div className='p-6'>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col items-start gap-2 text-[#434343]'>
              <VoiceRecordSymbolIcon />
              <span className='text-xs text-[#434343] font-semibold'>
                Voice Record
              </span>
            </div>
            <input
              type='text'
              placeholder='Enter findings...'
              value={otherSpecificationVoiceRecord}
              onChange={(e) => setOtherSpecificationVoiceRecord(e.target.value)}
              className='w-full rounded-lg border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-slate-800 text-sm placeholder-[#757575] focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50'
            />
          </div>
        </div>
      </section>

      {/* Plans & Alerts */}
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8'>
        <section className={cardClass}>
          <div className='flex items-center gap-2 px-5 pt-5'>
            <PlansAndAlertsIcon />
            <span className='text-sm font-semibold text-[#334155]'>
              Plan & Alerts
            </span>
          </div>

          <div className='space-y-6 p-4 text-sm sm:p-6'>
            {/* Anaesthesia Plan */}
            <div>
              <label className='mb-2 block font-medium text-[var(--header-text)]'>
                Anaesthesia Plan
              </label>
              <select
                value={anaesthesiaPlan}
                onChange={(e) => setAnaesthesiaPlan(e.target.value)}
                className={inputBase}
              >
                {ANAESTHESIA_PLAN_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Post-Operative Analgesia Planned */}
            <div>
              <label className='mb-2 block font-medium text-[var(--header-text)]'>
                Post-Operative Analgesia Planned
              </label>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                {["Oral", "IV", "IM", "Epidural", "Block"].map((item) => (
                  <label
                    key={item}
                    className='flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition'
                  >
                    <input
                      type='checkbox'
                      className='h-4 w-4 rounded border-slate-300 shrink-0'
                      checked={postOperativeAnalgesiaPlanned.has(item)}
                      onChange={(e) => {
                        setPostOperativeAnalgesiaPlanned((prev) => {
                          const next = new Set(prev);
                          if (e.target.checked) next.add(item);
                          else next.delete(item);
                          return next;
                        });
                      }}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <div className='flex items-center gap-2 px-5 pt-5'>
            <PlansAndAlertsIcon />
            <span className='text-sm font-semibold text-[#334155]'>
              Plan & Alerts
            </span>
          </div>

          <div className='p-6 space-y-6 text-sm'>
            <div>
              <label className='mb-2 block font-medium text-[var(--header-text)]'>
                Anticipated Post-Anaesthesia Care
              </label>
              <div className='flex flex-col gap-2'>
                {["Elective", "Transfer to Ward", "ICU"].map((item) => (
                  <label
                    key={item}
                    className='flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition w-full'
                  >
                    <input
                      type='checkbox'
                      className='h-4 w-4 rounded border-slate-300 shrink-0'
                      checked={anticipatedPostAnaesthesiaCare.has(item)}
                      onChange={(e) => {
                        setAnticipatedPostAnaesthesiaCare((prev) => {
                          const next = new Set(prev);
                          if (e.target.checked) next.add(item);
                          else next.delete(item);
                          return next;
                        });
                      }}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Preprocedure Instructions | Fit for operations*/}
      <div className='mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8'>
        <section className={cardClass}>
          <div className='flex items-center gap-2 px-5 py-3 bg-[#F8FAFC] border-b border-slate-200'>
            <FunctionalCapacitySectionIcon />
            <span className='text-sm font-semibold text-[#334155]'>
              Pre-Operative / Pre-Procedure Instructions
            </span>
          </div>

          <div className='p-6 space-y-4 text-sm'>
            <div className='flex flex-col items-start gap-2 text-[#434343]'>
              <VoiceRecordSymbolIcon />
              <span className='text-xs text-[#434343] font-semibold'>
                Voice Record
              </span>
            </div>

            <input
              type='text'
              placeholder='Enter findings...'
              value={preProcedureInstructionsVoiceRecord}
              onChange={(e) =>
                setPreProcedureInstructionsVoiceRecord(e.target.value)
              }
              className='w-full rounded-lg border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-slate-800 placeholder-[#757575] focus:outline-none focus:ring-2 focus:ring-slate-300/50 focus:border-slate-400 transition'
            />
          </div>
        </section>

        <section className={cardClass}>
          <div className='flex items-center gap-2 px-5 py-3'>
            <PlansAndAlertsIcon />
            <span className='text-sm font-semibold text-[#334155]'>
              Fit for Operations
            </span>
          </div>

          <div className='p-6 text-sm'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              {["Fit for Surgery", "Provisional Fit", "Not Fit", "Others"].map(
                (item) => (
                  <label
                    key={item}
                    className='flex items-center gap-2 cursor-pointer rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition'
                  >
                    <input
                      type='radio'
                      name='fitForSurgery'
                      className='h-4 w-4 rounded border-slate-300 shrink-0'
                      checked={fitForSurgery === item}
                      onChange={() => setFitForSurgery(item)}
                    />
                    <span className='font-medium text-[var(--header-text)]'>
                      {item}
                    </span>
                  </label>
                ),
              )}
            </div>
          </div>
        </section>
      </div>

      <AuthorizationSection
        readOnly={readOnly}
        anaesthesiologistName={anaesthesiologistName}
        onAnaesthesiologistNameChange={
          readOnly ? undefined : setAnaesthesiologistName
        }
        signed={signed}
        onSignedChange={readOnly ? undefined : setSigned}
        actions={
          !readOnly && onSave && patientId ? (
            <>
              <button
                type='button'
                onClick={() => onSave(buildPreanaestheticPayload(false), false)}
                className='rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50'
              >
                Save draft
              </button>
              <button
                type='button'
                onClick={() => onSave(buildPreanaestheticPayload(true), true)}
                className='rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800'
              >
                Submit
              </button>
            </>
          ) : undefined
        }
      />
    </fieldset>
  );
}

export { PreAnestheticFormContent };

export default function PreAnestheticPage() {
  const router = useRouter();
  return (
    <div className='flex min-h-0 flex-col px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-8'>
      <header className='mb-6 flex min-h-[44px] items-center justify-between gap-2 sm:gap-4 lg:mb-8'>
        <div className='min-w-0 flex-1'>
          <select
            value='pre'
            onChange={(e) => {
              const v = e.target.value;
              if (v === "peri") router.push("/dashboard/perioperative");
              if (v === "recovery") router.push("/dashboard/recovery");
              if (v === "post-anaesthesia")
                router.push("/dashboard/post-anaesthesia");
            }}
            className='w-full max-w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-sans font-semibold text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50 sm:px-3 sm:py-2.5 sm:text-sm lg:max-w-3xl lg:px-4'
          >
            <option value='pre'>
              PRE-ANAESTHETIC ASSESSMENT / PRE-OPERATIVE CHECKUP
            </option>
            <option value='peri'>PERIOPERATIVE ANAESTHESIA</option>
            <option value='recovery'>
              RECOVERY (IMMEDIATE POST-OP / PROCEDURE)
            </option>
            <option value='post-anaesthesia'>
              POST ANAESTHESIA MONITORING CARE RECORD
            </option>
          </select>
        </div>
        <div className='shrink-0'>
          <DashboardUserBar />
        </div>
      </header>
      <PreAnestheticFormContent />
    </div>
  );
}

function InfoRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`grid min-w-0 grid-cols-1 items-start gap-y-1 sm:grid-cols-[minmax(7rem,140px)_1fr] sm:gap-x-3 sm:gap-y-0 ${className}`}
    >
      <span className='text-[var(--accent-muted)]'>{label}</span>
      <span className='min-w-0 break-words font-medium text-slate-700'>
        {value}
      </span>
    </div>
  );
}
