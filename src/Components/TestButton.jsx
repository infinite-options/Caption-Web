import React from 'react'

const TestButton = ({text, onClick}) => {
  return (
    <button onClick={() => onClick()}>{text}</button>
  )
}

export default TestButton