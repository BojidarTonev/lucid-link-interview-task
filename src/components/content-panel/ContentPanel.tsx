import {FC, useCallback, useMemo} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import Loader from "../loader/Loader.tsx";
import LucidLinkLogo from '/lucidlink-logo.png';
import S3ClientSingleton from "../../s3ClientSingleton.ts";
import ErrorText from "../error-text/error-text.tsx";
import './ContentPanel.css';

const ContentPanel: FC = () => {
    const { content, loading, error, selectedFileName } = useSelector((state: RootState) => state.fileContent);
    const { config } = useSelector((state: RootState) => state.s3Client);

    const isAuthenticated = useMemo(() => {
        if (!config) {
            return false
        }
        return S3ClientSingleton.getInstance(config);
    }, [config]);

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