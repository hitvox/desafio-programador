import React from 'react'

function Loader() {
  return (
    <div class="w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50">
    <div class="flex justify-center items-center mt-[40vh]">
    <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    style={{
      margin: 'auto',
      display: 'block',
      shapeRendering: 'auto'
    }}
    width="80px"
    height="80px"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <path
      d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
      fill="#d611be"
      stroke="none"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        dur="1s"
        repeatCount="indefinite"
        keyTimes="0;1"
        values="0 50 51;360 50 51"
      ></animateTransform>
    </path>
  </svg>
    </div>
    </div>
  )
}

export default Loader