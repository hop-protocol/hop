import React from 'react'

interface Props {}

export default function ClipboardIcon (props: Props) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.05056 0H9.68692V1.27273H2.05056V10.1818H0.777832V1.27273C0.777832 0.569819 1.34765 0 2.05056 0ZM11.596 2.54545H4.59601C3.89311 2.54545 3.32329 3.11527 3.32329 3.81818V12.7273C3.32329 13.4302 3.89311 14 4.59601 14H11.596C12.2989 14 12.8687 13.4302 12.8687 12.7273V3.81818C12.8687 3.11527 12.2989 2.54545 11.596 2.54545ZM11.596 12.7273H4.59601V3.81818H11.596V12.7273Z"
        fill="#A2B2C2"
      />
      <mask
        id="mask0"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="13"
        height="14"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.05056 0H9.68692V1.27273H2.05056V10.1818H0.777832V1.27273C0.777832 0.569819 1.34765 0 2.05056 0ZM11.596 2.54545H4.59601C3.89311 2.54545 3.32329 3.11527 3.32329 3.81818V12.7273C3.32329 13.4302 3.89311 14 4.59601 14H11.596C12.2989 14 12.8687 13.4302 12.8687 12.7273V3.81818C12.8687 3.11527 12.2989 2.54545 11.596 2.54545ZM11.596 12.7273H4.59601V3.81818H11.596V12.7273Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0)">
        <rect width="14" height="14" fill="#A2B2C2" />
      </g>
    </svg>
  )
}
