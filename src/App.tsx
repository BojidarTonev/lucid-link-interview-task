import SplitScreen from "./components/split-screen/SplitScreen.tsx";
import DirectoryPanel from "./components/directory-panel/DirectoryPanel.tsx";
import ContentPanel from "./components/content-panel/ContentPanel.tsx";
import './App.css'
import Modal from "./components/modal/Modal.tsx";
import {useSelector} from "react-redux";
import {RootState} from "./redux/store.ts";

function App() {
  const { isOpen, isClosable, content } = useSelector((state: RootState) => state.modal);

  return (
    <>
        <SplitScreen left={<DirectoryPanel />} right={<ContentPanel />} />
        <Modal isOpen={isOpen} isClosable={isClosable}>{content}</Modal>
    </>
  )
}

export default App
