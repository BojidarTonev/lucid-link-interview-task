import SplitScreen from "./components/split-screen/SplitScreen.tsx";
import DirectoryPanel from "./components/directory-panel/DirectoryPanel.tsx";
import ContentPanel from "./components/content-panel/ContentPanel.tsx";
import Modal from "./components/modal/Modal.tsx";
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
