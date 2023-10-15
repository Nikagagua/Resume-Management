import './home.scss';
import { FaBuilding, FaBriefcase, FaUser } from 'react-icons/fa'; // Import icons
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className='home'>
            <h1>Welcome to Resume Management</h1>

            <div className="button-container">
                <Link to="/companies" className="link">
                    <FaBuilding className="icon" />
                    <div className="description">
                        <h2>Companies</h2>
                        <p>Manage your company profiles</p>
                    </div>
                </Link>
                <Link to="/jobs" className="link">
                    <FaBriefcase className="icon" />
                    <div className="description">
                        <h2>Jobs</h2>
                        <p>Manage your job listings</p>
                    </div>
                </Link>
                <Link to="/candidates" className="link">
                    <FaUser className="icon" />
                    <div className="description">
                        <h2>Candidates</h2>
                        <p>Manage candidate applications</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Home;
