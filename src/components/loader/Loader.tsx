import './Loader.css';

const Loader = () => {
    return(<div className="loader">
        <div className="line" style={{animationDelay: '0s'}}></div>
        <div className="line" style={{animationDelay: '0.2s'}}></div>
        <div className="line" style={{animationDelay: '0.4s'}}></div>
        <div className="line" style={{animationDelay: '0.6s'}}></div>
        <div className="line" style={{animationDelay: '0.8s'}}></div>
    </div>)
}

export default Loader;