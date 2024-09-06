import SplitScreen from "./components/split-screen/split-screen.tsx";
import DirectoryPanel from "./components/directory-panel/directory-panel.tsx";
import ContentPanel from "./components/content-panel/content-panel.tsx";
import Modal from "./components/modal/modal.tsx";
import ErrorBoundary from "./components/error-boundary/error-boundary.tsx";
import './App.css'

function App() {
  return (
    <>
        <ErrorBoundary fallback="Something went wrong. Please try again later.">
            <SplitScreen left={<DirectoryPanel />} right={<ContentPanel />} />
            <Modal />
        </ErrorBoundary>
    </>
  )
}

export default App
