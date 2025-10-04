import React from 'react'

export const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
)

export const AlertTriangleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

export const SproutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20v-8m0 0c-2.5 0-4-2-4-4 0-2.5 2-4 4-4s4 1.5 4 4c0 2-1.5 4-4 4z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4c2.5 0 4 1.5 4 4" />
  </svg>
)

export const FireIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
  </svg>
)

export const CircleIcon = ({ className = 'h-6 w-6' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="12" r="10" />
  </svg>
)

