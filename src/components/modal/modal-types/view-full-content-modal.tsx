import {useAppSelector} from "../../../redux/store.ts";

const ViewFullContentModal = () => {
    const { content } = useAppSelector((state) => state.fileContent)
    return(<div className="long-file-content-wrapper">
        { content }
    </div>)
}

export default ViewFullContentModal;