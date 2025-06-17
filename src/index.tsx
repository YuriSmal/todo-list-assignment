import { createRoot } from 'react-dom/client'

import { TaskProvider } from './context';
import App from './App.tsx'

import './globals/index.scss'

createRoot(document.getElementById('root')!).render(
  <TaskProvider>
    <App />
  </TaskProvider>,
)
