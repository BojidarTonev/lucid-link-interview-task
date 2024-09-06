import SplitScreen from "./components/split-screen/split-screen.tsx";
import DirectoryPanel from "./components/directory-panel/directory-panel.tsx";
import ContentPanel from "./components/content-panel/content-panel.tsx";
import Modal from "./components/modal/modal.tsx";
import './App.css'

function App() {
  return (
    <>
        <SplitScreen left={<DirectoryPanel />} right={<ContentPanel />} />
        <Modal />
    </>
  )
}

export default App
