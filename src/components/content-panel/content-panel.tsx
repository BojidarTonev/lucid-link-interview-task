import {FC, useCallback, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/store.ts";
import Loader from "../loader/loader.tsx";
import LucidLinkLogo from '/lucidlink-logo.png';
import ErrorText from "../error-text/error-text.tsx";
import useS3Auth from "../../hooks/use-s3-auth.ts";
import Button from "../button/button.tsx";
import {ModalTypes, openModal} from "../../redux/features/modal-slice.ts";
import './content-panel.css';

const ContentPanel: FC = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useS3Auth();
    const { content, loading, error, selectedFileName } = useAppSelector((state) => state.fileContent);

    const onSeeFullTextButtonClick = () => {
        dispatch(openModal({
            title: 'FULL CONTENT OF FILE:',
            subTitle: selectedFileName,
            modalType: ModalTypes.ViewFileFullContentModal}
        ));
    }

    const isLongText = useMemo(() => {
        return content.length > 300;
    }, [content]);

    const renderContentPanelContent = useCallback(() => {
        if (error) {
            return <ErrorText text="Error loading content data. Please try again!" hasBackground />
        }
        if (loading) {
            return <Loader />
        }
        if (!content || !isAuthenticated) {
            return <div />
        }
        const textToRender = isLongText ? `${content.slice(0, 300)}...` : content;

        return <div className="text-content">
            {textToRender}
        </div>
    }, [content, error, loading, isLongText, isAuthenticated]);

    return (<div className="content-wrapper">
        <div className="title">Content Panel</div>
        <div className="file-content-container">
            {isAuthenticated && selectedFileName && <div className="selected-file-name">{selectedFileName}</div>}
            {renderContentPanelContent()}
            <img src={LucidLinkLogo} className="logo" alt="lucidlink-logo"/>
            {isLongText && <Button text="See full text" onClick={onSeeFullTextButtonClick} />}
        </div>
    </div>)
};

export default ContentPanel;