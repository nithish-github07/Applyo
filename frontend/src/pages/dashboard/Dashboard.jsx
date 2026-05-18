import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    FiBriefcase, 
    FiMapPin, 
    FiFileText, 
    FiBookmark, 
    FiTrendingUp, 
    FiUser, 
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiChevronRight
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI, jobAPI, savedJobAPI } from '../../api/services';
import Loader from '../../components/common/Loader';

const dashboardStyles = `
    .dashboard-container {
        padding: 40px;
        max-width: 1300px;
        margin: 0 auto;
        font-family: 'Inter', sans-serif;
        color: #1F2937;
        box-sizing: border-box;
    }

    /* Banner styles */
    .banner {
        background: linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%);
        border-radius: 20px;
        padding: 40px;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 32px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15);
    }

    .banner-content {
        flex: 1;
        z-index: 2;
    }

    .banner-welcome {
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: #93C5FD;
        margin-bottom: 12px;
        font-weight: 600;
    }

    .banner-name {
        font-size: 2.5rem;
        font-weight: 800;
        letter-spacing: -0.02em;
    }

    .banner-illustration {
        width: 320px;
        height: 160px;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .banner-svg {
        width: 100%;
        height: 100%;
    }

    /* Grid Layout */
    .dashboard-grid {
        display: grid;
        grid-template-columns: 8fr 4fr;
        gap: 32px;
    }

    /* Stat Cards */
    .stats-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-bottom: 32px;
    }

    .stat-card {
        background: #FFFFFF;
        border: 1px solid #E5E7EB;
        border-radius: 20px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 140px;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
    }

    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.05);
        border-color: #2563EB;
    }

    .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: #2563EB;
    }

    .stat-card.approved::before {
        background: #10B981;
    }

    .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .stat-title {
        font-size: 0.95rem;
        font-weight: 600;
        color: #6B7280;
    }

    .stat-icon-wrapper {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: #EFF6FF;
        color: #2563EB;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
    }

    .stat-card.approved .stat-icon-wrapper {
        background: #ECFDF5;
        color: #10B981;
    }

    .stat-content {
        margin-top: 12px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    .stat-value {
        font-size: 2.25rem;
        font-weight: 800;
        color: #111827;
        line-height: 1;
    }

    .stat-btn {
        background: none;
        border: none;
        color: #2563EB;
        font-size: 0.85rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        border-radius: 8px;
        transition: all 0.2s;
    }

    .stat-btn:hover {
        background: #EFF6FF;
        gap: 6px;
    }

    .stat-card.approved .stat-btn {
        color: #10B981;
    }

    .stat-card.approved .stat-btn:hover {
        background: #ECFDF5;
    }

    /* Recommendations & Main Content */
    .section-container {
        background: #FFFFFF;
        border: 1px solid #E5E7EB;
        border-radius: 20px;
        padding: 28px;
        margin-bottom: 32px;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }

    .section-title {
        font-size: 1.35rem;
        font-weight: 800;
        color: #111827;
        letter-spacing: -0.01em;
    }

    .view-all-btn {
        background: none;
        border: none;
        color: #2563EB;
        font-size: 0.9rem;
        font-weight: 700;
        cursor: pointer;
        transition: color 0.2s;
    }

    .view-all-btn:hover {
        color: #1D4ED8;
        text-decoration: underline;
    }

    /* Job Recommendation Cards */
    .rec-jobs-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .rec-job-card {
        background: #FFFFFF;
        border: 1px solid #F3F4F6;
        border-radius: 16px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
    }

    .rec-job-card:hover {
        border-color: #2563EB;
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.04);
    }

    .job-left-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
    }

    .job-title {
        font-size: 1.15rem;
        font-weight: 700;
        color: #111827;
        letter-spacing: -0.01em;
    }

    .job-company-row {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #6B7280;
        font-size: 0.85rem;
        font-weight: 600;
    }

    .dot {
        width: 4px;
        height: 4px;
        background: #D1D5DB;
        border-radius: 50%;
    }

    .job-type-badge {
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        background: #FEF3C7;
        color: #B45309;
        text-transform: capitalize;
    }

    .job-meta-row {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #9CA3AF;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .job-meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .skills-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 4px;
    }

    .skill-tag {
        background: #F3F4F6;
        color: #4B5563;
        font-size: 0.75rem;
        font-weight: 500;
        padding: 2px 8px;
        border-radius: 6px;
    }

    .card-chevron {
        color: #9CA3AF;
        font-size: 1.25rem;
        transition: transform 0.2s;
    }

    .rec-job-card:hover .card-chevron {
        transform: translateX(4px);
        color: #2563EB;
    }

    /* Right column panel */
    .right-panel {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .side-card {
        background: #FFFFFF;
        border: 1px solid #E5E7EB;
        border-radius: 20px;
        padding: 24px;
    }

    .side-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid #F3F4F6;
        padding-bottom: 12px;
    }

    .side-card-title {
        font-size: 1.15rem;
        font-weight: 800;
        color: #111827;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .side-card-icon {
        color: #2563EB;
    }

    /* Saved Job Items */
    .saved-jobs-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .saved-job-item {
        padding: 12px;
        border-radius: 12px;
        border: 1px solid #F3F4F6;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .saved-job-item:hover {
        border-color: #2563EB;
        background: #F9FAFB;
    }

    .saved-job-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-width: 85%;
    }

    .saved-job-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: #111827;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .saved-job-company {
        font-size: 0.8rem;
        font-weight: 600;
        color: #6B7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    /* Recruiter Applicant Items */
    .applicants-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .applicant-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-bottom: 16px;
        border-bottom: 1px solid #F3F4F6;
    }

    .applicant-item:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    .applicant-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: #EFF6FF;
        color: #2563EB;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.95rem;
        flex-shrink: 0;
    }

    .applicant-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        overflow: hidden;
    }

    .applicant-name {
        font-size: 0.95rem;
        font-weight: 700;
        color: #111827;
    }

    .applicant-job {
        font-size: 0.8rem;
        color: #6B7280;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .applicant-status {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        padding: 2px 6px;
        border-radius: 4px;
        width: fit-content;
    }

    .status-pending { background: #FEF3C7; color: #92400E; }
    .status-accepted { background: #D1FAE5; color: #065F46; }
    .status-rejected { background: #FEE2E2; color: #991B1B; }

    /* Empty States */
    .empty-state {
        text-align: center;
        padding: 20px 0;
        color: #9CA3AF;
        font-size: 0.85rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    @media (max-width: 1024px) {
        .dashboard-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
        }
        .banner-illustration {
            width: 100%;
        }
        .stats-row {
            grid-template-columns: 1fr;
        }
    }
`;

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // States
    const [stats, setStats] = useState(null);
    const [recJobs, setRecJobs] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isRecruiter = user?.role?.toLowerCase() === 'recruiter';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (isRecruiter) {
                    const statsRes = await dashboardAPI.recruiterStats();
                    setStats(statsRes.data);

                    const appRes = await dashboardAPI.recruiterRecentApplications(5);
                    setApplicants(appRes.data);
                } else {
                    const statsRes = await dashboardAPI.userStats();
                    setStats(statsRes.data);

                    const savedRes = await savedJobAPI.getSaved();
                    setSavedJobs(savedRes.data.filter(item => item.job).slice(0, 5));
                }

                const jobsRes = await jobAPI.getAll();
                const jobsList = jobsRes.data || [];
                if (isRecruiter) {
                    setRecJobs(jobsList.slice(0, 4));
                } else {
                    setRecJobs(jobsList.slice(0, 4));
                }

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user, isRecruiter]);

    const handleJobClick = (job) => {
        navigate(`/jobs/${job._id}`, { 
            state: { 
                background: location,
                jobData: job,
                allJobs: recJobs 
            } 
        });
    };

    if (loading) return <Loader fullPage message="Loading your Dashboard..." />;

    return (
        <div className="dashboard-container">
            <style>{dashboardStyles}</style>

            {/* Banner Section */}
            <div className="banner">
                <div className="banner-content">
                    <h5 className="banner-welcome">Welcome To Applyo</h5>
                    <h1 className="banner-name">{user?.name || 'User'}</h1>
                </div>
                <div className="banner-illustration">
                    <svg viewBox="0 0 300 150" className="banner-svg">
                        <path d="M 50,75 C 50,40 100,20 150,40 C 200,60 250,30 250,75 C 250,120 200,130 150,110 C 100,90 50,110 50,75 Z" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeDasharray="6,4" opacity="0.6" />
                        <g transform="translate(65, 45)">
                            <path d="M 0,60 L 0,40 Q 0,25 15,25 L 20,25 Q 35,25 35,40 L 35,60 Z" fill="#F43F5E" />
                            <path d="M 8,60 L 27,60 L 22,40 L 13,40 Z" fill="#6366F1" />
                            
                            <circle cx="17" cy="15" r="9" fill="#FDBA74" />
                            <path d="M 7,15 Q 17,3 27,15 Q 17,8 7,15 Z" fill="#1E293B" />
                            
                            
                            <rect x="13" y="14" width="11" height="5" rx="1.5" fill="#FFFFFF" opacity="0.95" />
                            
                            
                            <path d="M 28,52 L 44,52 L 40,38 L 30,38 Z" fill="#94A3B8" />
                            <line x1="28" y1="52" x2="44" y2="52" stroke="#475569" strokeWidth="2.5" />
                        </g>

                        
                        <g transform="translate(195, 45)">
                            
                            <path d="M 0,60 L 0,40 Q 0,25 15,25 L 20,25 Q 35,25 35,40 L 35,60 Z" fill="#3B82F6" />
                            <path d="M 8,60 L 27,60 L 22,40 L 13,40 Z" fill="#F59E0B" />
                            
                            <circle cx="17" cy="15" r="9" fill="#FDBA74" />
                            <path d="M 7,11 Q 17,-1 27,11 Q 22,6 7,11 Z" fill="#78350F" />
                            
                            <rect x="7" y="14" width="11" height="5" rx="1.5" fill="#FFFFFF" opacity="0.95" />
                            
                            
                            <path d="M -8,52 L 8,52 L 5,38 L -5,38 Z" fill="#94A3B8" />
                            <line x1="-8" y1="52" x2="8" y2="52" stroke="#475569" strokeWidth="2.5" />
                        </g>

                        
                        
                        <line x1="50" y1="105" x2="250" y2="105" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="150" y1="105" x2="150" y2="135" stroke="#FFFFFF" strokeWidth="4" />
                        <line x1="110" y1="135" x2="190" y2="135" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />

                        
                        <g transform="translate(100, 10)">
                            <rect x="0" y="0" width="28" height="17" rx="5" fill="#FFFFFF" />
                            <polygon points="10,17 14,21 18,17" fill="#FFFFFF" />
                            <circle cx="7" cy="9" r="1.5" fill="#94A3B8" />
                            <circle cx="14" cy="9" r="1.5" fill="#94A3B8" />
                            <circle cx="21" cy="9" r="1.5" fill="#94A3B8" />
                        </g>
                        
                        <g transform="translate(165, 22)">
                            <rect x="0" y="0" width="28" height="17" rx="5" fill="#FFFFFF" />
                            <polygon points="10,17 14,21 18,17" fill="#FFFFFF" />
                            <circle cx="7" cy="9" r="1.5" fill="#94A3B8" />
                            <circle cx="14" cy="9" r="1.5" fill="#94A3B8" />
                            <circle cx="21" cy="9" r="1.5" fill="#94A3B8" />
                        </g>
                    </svg>
                </div>
            </div>

            {error && (
                <div className="section-container" style={{ borderColor: '#FEE2E2', background: '#FEF2F2', textAlign: 'center' }}>
                    <p style={{ color: '#DC2626', fontWeight: 600 }}>{error}</p>
                    <button className="view-all-btn" onClick={() => window.location.reload()}>Retry</button>
                </div>
            )}

            {!error && (
                <div className="dashboard-grid">
                    
                    {/* Left Main Content */}
                    <div className="left-content">
                        
                        {/* Two custom Stats cards */}
                        <div className="stats-row">
                            {isRecruiter ? (
                                <>
                                    <div className="stat-card">
                                        <div className="stat-header">
                                            <span className="stat-title">Applications Received</span>
                                            <div className="stat-icon-wrapper">
                                                <FiFileText />
                                            </div>
                                        </div>
                                        <div className="stat-content">
                                            <span className="stat-value">{stats?.totalApplications || 0}</span>
                                            <button className="stat-btn" onClick={() => navigate('/jobs/all/applicants')}>
                                                View more <FiChevronRight />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="stat-card approved">
                                        <div className="stat-header">
                                            <span className="stat-title">Applications Approved</span>
                                            <div className="stat-icon-wrapper">
                                                <FiCheckCircle />
                                            </div>
                                        </div>
                                        <div className="stat-content">
                                            <span className="stat-value">{stats?.acceptedApplications || 0}</span>
                                            <button className="stat-btn" onClick={() => navigate('/jobs/all/applicants')}>
                                                View more <FiChevronRight />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="stat-card">
                                        <div className="stat-header">
                                            <span className="stat-title">Applications Sent</span>
                                            <div className="stat-icon-wrapper">
                                                <FiFileText />
                                            </div>
                                        </div>
                                        <div className="stat-content">
                                            <span className="stat-value">{stats?.totalApplications || 0}</span>
                                            <button className="stat-btn" onClick={() => navigate('/my-applications')}>
                                                View more <FiChevronRight />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="stat-card approved">
                                        <div className="stat-header">
                                            <span className="stat-title">Applications Approved</span>
                                            <div className="stat-icon-wrapper">
                                                <FiCheckCircle />
                                            </div>
                                        </div>
                                        <div className="stat-content">
                                            <span className="stat-value">{stats?.accepted || 0}</span>
                                            <button className="stat-btn" onClick={() => navigate('/my-applications')}>
                                                View more <FiChevronRight />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Job Recommendations Section */}
                        <div className="section-container">
                            <div className="section-header">
                                <h2 className="section-title">Job Recommendations</h2>
                                <button className="view-all-btn" onClick={() => navigate('/jobs')}>
                                    View All
                                </button>
                            </div>

                            <div className="rec-jobs-list">
                                {recJobs.length > 0 ? (
                                    recJobs.map((job) => (
                                        <div 
                                            key={job._id} 
                                            className="rec-job-card"
                                            onClick={() => handleJobClick(job)}
                                        >
                                            <div className="job-left-info">
                                                <h3 className="job-title">{job.title}</h3>
                                                <div className="job-company-row">
                                                    <span>{job.company}</span>
                                                    <span className="dot"></span>
                                                    <span className="job-type-badge">{job.jobType.replace('-', ' ')}</span>
                                                </div>
                                                <div className="job-meta-row">
                                                    <div className="job-meta-item">
                                                        <FiMapPin size={13} />
                                                        <span>{job.location}</span>
                                                    </div>
                                                </div>
                                                <div className="skills-tags">
                                                    {job.skills?.slice(0, 3).map((skill, index) => (
                                                        <span key={index} className="skill-tag">{skill}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <FiChevronRight className="card-chevron" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <FiBriefcase size={36} />
                                        <p>No job recommendations available at the moment.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right column Panel */}
                    <div className="right-panel">
                        
                        {isRecruiter ? (
                            // Recruiter View: Recent Job Applicants
                            <div className="side-card">
                                <div className="side-card-header">
                                    <h3 className="side-card-title">
                                        <FiUser className="side-card-icon" />
                                        Job Applicants
                                    </h3>
                                    <button className="view-all-btn" onClick={() => navigate('/jobs/all/applicants')}>
                                        View All
                                    </button>
                                </div>

                                <div className="applicants-list">
                                    {applicants.length > 0 ? (
                                        applicants.map((app) => {
                                            const applicant = app.applicant;
                                            if (!applicant) return null;

                                            const nameInitials = applicant.name
                                                .split(' ')
                                                .map(n => n[0])
                                                .slice(0, 2)
                                                .join('')
                                                .toUpperCase();

                                            return (
                                                <div key={app._id} className="applicant-item">
                                                    <div className="applicant-avatar">
                                                        {nameInitials}
                                                    </div>
                                                    <div className="applicant-info">
                                                        <span className="applicant-name">{applicant.name}</span>
                                                        <span className="applicant-job">{app.job?.title || 'Job'}</span>
                                                        <span className={`applicant-status status-${app.status.toLowerCase()}`}>
                                                            {app.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="empty-state">
                                            <FiUser size={32} />
                                            <p>No recent applicants yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // Job Seeker View: Saved Jobs
                            <div className="side-card">
                                <div className="side-card-header">
                                    <h3 className="side-card-title">
                                        <FiBookmark className="side-card-icon" />
                                        Saved Jobs
                                    </h3>
                                    <button className="view-all-btn" onClick={() => navigate('/saved-jobs')}>
                                        View All
                                    </button>
                                </div>

                                <div className="saved-jobs-list">
                                    {savedJobs.length > 0 ? (
                                        savedJobs.map((item) => {
                                            const job = item.job;
                                            if (!job) return null;
                                            return (
                                                <div 
                                                    key={item._id} 
                                                    className="saved-job-item"
                                                    onClick={() => handleJobClick(job)}
                                                >
                                                    <div className="saved-job-details">
                                                        <span className="saved-job-title">{job.title}</span>
                                                        <span className="saved-job-company">{job.company}</span>
                                                    </div>
                                                    <FiChevronRight style={{ color: '#9CA3AF' }} />
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="empty-state">
                                            <FiBookmark size={32} />
                                            <p>No saved jobs yet.</p>
                                            <button className="view-all-btn" style={{ fontSize: '0.8rem', marginTop: '4px' }} onClick={() => navigate('/jobs')}>
                                                Browse Jobs
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            )}
        </div>
    );
}