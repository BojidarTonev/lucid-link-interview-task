import {FC, useCallback, useMemo} from 'react';
import {useGetFilesQuery} from "../../redux/services/s3-api.ts";
import TreeView from "../tree-view/TreeView.tsx";
import Loader from "../loader/Loader.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import Button from "../button/Button.tsx";
import {ModalTypes, openModal} from "../../redux/features/modalSlice.ts";
import {clearS3ClientConfig} from "../../redux/features/s3ClientSlice.ts";
import S3ClientSingleton from "../../s3ClientSingleton.ts";
import './DirectoryPanel.css';

const DirectoryPanel: FC = () => {
    const dispatch = useDispatch();
    const { config } = useSelector((state: RootState) => state.s3Client);
    const { data, error, isLoading } = useGetFilesQuery({});

    const isAuthenticated = useMemo(() => {
        if (!config) {
            return false
        }
        return S3ClientSingleton.getInstance(config);
    }, [config]);

    const onLoginButtonClick = () => {
        dispatch(openModal({title: 'SIGN IN', modalType: ModalTypes.AuthModal}));
    }

    const onLogoutIconClick = () => {
        dispatch(clearS3ClientConfig());
    }

    const renderDirectoryContent = useCallback(() => {
        if (!isAuthenticated) {
            return <div className="not-logged-in-wrapper">
                <div className="not-logged-in-message">You are not logged in. Please log in to access any services.</div>
                <Button isPrimary text="Login" onClick={onLoginButtonClick} />
            </div>
        }
        if (error) {
            return <div>Error loading files data. Please try again!</div>
        }
        if (isLoading) {
            return <Loader />
        }

        return <TreeView data={data} />
    }, [data, error, isLoading, isAuthenticated]);

    return (
        <div className="directory-wrapper">
            <div className="title">
                <div>Directory Panel</div>
                {isAuthenticated && <FontAwesomeIcon icon={faRightFromBracket} onClick={onLogoutIconClick} />}
            </div>
            <div className="directory-content">
                {renderDirectoryContent()}
            </div>
        </div>
    );
};

export default DirectoryPanel;