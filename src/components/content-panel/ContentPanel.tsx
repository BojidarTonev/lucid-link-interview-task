import {FC, useCallback} from 'react';
import {useAppSelector} from "../../redux/store.ts";
import Loader from "../loader/Loader.tsx";
import LucidLinkLogo from '/lucidlink-logo.png';
import ErrorText from "../error-text/error-text.tsx";
import useS3Auth from "../../hooks/use-s3-auth.ts";
import './ContentPanel.css';

const ContentPanel: FC = () => {
    const isAuthenticated = useS3Auth();
    const { content, loading, error, selectedFileName } = useAppSelector((state) => state.fileContent);

    const renderContentPanelContent = useCallback(() => {
        if (error) {
            return <ErrorText text="Error loading content data. Please try again!"/>
        }
        if (loading) {
            return <Loader />
        }
        if (!content || !isAuthenticated) {
            return <div />
        }

        return <div className="text-content">{content}</div>
    }, [content, error, loading, isAuthenticated]);

    return (<div className="content-wrapper">
        <div className="title">Content Panel</div>
        <div className="file-content-container">
            {isAuthenticated && selectedFileName && <div className="selected-file-name">{selectedFileName}</div>}
            {renderContentPanelContent()}
            <img src={LucidLinkLogo} className="logo" alt="lucidlink-logo"/>
        </div>
    </div>)
};

export default ContentPanel;