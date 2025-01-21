import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SubmissionForm from './pages/submissionForm'
import './stylesheets/submissionForm.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <SubmissionForm></SubmissionForm>
    </>
  )
}

export default App
