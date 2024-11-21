import React, { useRef, useEffect, useState } from 'react'



  const CircularSlider = ({ currentTime, duration, onSeek }) => {
  const svgRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const center = 50
  const radius = 45
  const strokeWidth = 4

  const normalizedCurrent = duration > 0 ? currentTime / duration : 0
  const circumference = 2 * Math.PI * radius
  // Calculate the stroke dash array
  const dashArray = `${(normalizedCurrent * circumference)} ${circumference}`;

  const startPoint = { x: center, y: center - radius }
  const endPoint = {
    x: center + radius * Math.sin(normalizedCurrent * 2 * Math.PI),
    y: center - radius * Math.cos(normalizedCurrent * 2 * Math.PI),
  }

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [])

  const handleSeek = (event) => {
    if (!svgRef.current) return

    const svgRect = svgRef.current.getBoundingClientRect()
    const svgX = svgRect.left + svgRect.width / 2
    const svgY = svgRect.top + svgRect.height / 2

    let clientX, clientY
    if ('touches' in event) {
      clientX = event.touches[0].clientX
      clientY = event.touches[0].clientY
    } else {
      clientX = event.clientX
      clientY = event.clientY
    }

    const deltaX = clientX - svgX
    const deltaY = clientY - svgY

    let angle = Math.atan2(deltaY, deltaX) + Math.PI / 2
    if (angle < 0) angle += 2 * Math.PI

    const newTime = (angle / (2 * Math.PI)) * duration
    onSeek(newTime)
  }

  const handleMouseDown = (event) => {
    setIsDragging(true)
    handleSeek(event)
  }

  const handleMouseMove = (event) => {
    if (isDragging) {
      handleSeek(event)
    }
  }

  return (
    <svg
      ref={svgRef}
      width="100"
      height="100"
      viewBox="0 0 100 100"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#e0e0e0"
        strokeWidth={strokeWidth}
      />
      <path
        d={`M ${startPoint.x},${startPoint.y} A ${radius},${radius} 0 ${
          normalizedCurrent > 0.5 ? 1 : 0
        } 1 ${endPoint.x},${endPoint.y}`}
        fill="none"
        stroke="#4f46e5"
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
      />
      <circle
        cx={endPoint.x}
        cy={endPoint.y}
        r={6}
        fill="#4f46e5"
      />
    </svg>
  )
}

export default CircularSlider