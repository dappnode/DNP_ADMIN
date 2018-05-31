import React from 'react';

// MdDashboard

export default function (props) {
  const scale = props.scale || 1
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24*scale} height={24*scale} viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
    </svg>
  )
}
