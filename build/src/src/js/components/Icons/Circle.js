import React from 'react';

// FaCircle

export default function (props) {
  const scale = props.scale || 1
  return (
    <svg height={10*scale} width={10*scale}>
      <circle cx={5*scale} cy={5*scale} r={4*scale} fill="currentColor" />
    </svg>
  )
}
