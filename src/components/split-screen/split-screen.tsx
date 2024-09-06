import { FC, ReactNode } from 'react';
import './split-screen.css';

interface ISplitScreenProps {
    left: ReactNode;
    right: ReactNode;
}

const SplitScreen: FC<ISplitScreenProps> = ({left, right}) => {
    return (
        <div className="split-screen">
            <div className="split-screen-left">
                {left}
            </div>
            <div className="split-screen-right">
                {right}
            </div>
        </div>
    );
};

export default SplitScreen;