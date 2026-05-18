import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FiUser, 
    FiMail, 
    FiFileText, 
    FiCheck, 
    FiX, 
    FiSearch, 
    FiArrowLeft,
    FiBriefcase,
    FiCalendar,
    FiDownload
} from 'react-icons/fi';
import { applicationAPI, jobAPI, dashboardAPI } from '../../api/services';
import Loader from '../../components/common/Loader';

const jobApplicantsStyles = `
    .applicants-page-container {
        padding: 40px;
        max-width: 1200px;
        margin: 0 auto;
        font-family: 'Inter', sans-serif;
    }

    .back-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background: none;
        border: none;
        color: #4B5563;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        margin-bottom: 24px;
        padding: 8px 12px;
        border-radius: 8px;
        transition: all 0.2s;
        width: fit-content;
    }

    .back-btn:hover {
        background-color: #F3F4F6;
        color: #111827;
    }

    .page-header {
        margin-bottom: 32px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 20px;
    }

    .header-info {
        flex: 1;
    }

    .page-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 2rem;
        font-weight: 800;
        color: #111827;
        margin-bottom: 8px;
    }

    .title-icon {
        color: #2563EB;
    }

    .page-subtitle {
        color: #6B7280;
        font-size: 1rem;
    }

    .search-filter-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        margin-bottom: 28px;
        flex-wrap: wrap;
    }

    .search-bar {
        position: relative;
        flex: 1;
        max-width: 400px;
        min-width: 280px;
    }

    .search-bar input {
        width: 100%;
        padding: 12px 16px 12px 44px;
        border: 1px solid #E5E7EB;
        border-radius: 12px;
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        background-color: #FFFFFF;
        box-sizing: border-box;
    }

    .search-bar input:focus {
        border-color: #2563EB;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    }

    .search-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: #9CA3AF;
        font-size: 1.1rem;
    }

    .status-tabs {
        display: flex;
        background: #F3F4F6;
        padding: 4px;
        border-radius: 12px;
        gap: 4px;
    }

    .tab-btn {
        padding: 8px 16px;
        border-radius: 8px;
        border: none;
        background: none;
        font-size: 0.9rem;
        font-weight: 600;
        color: #6B7280;
        cursor: pointer;
        transition: all 0.2s;
    }

    .tab-btn:hover {
        color: #111827;
    }

    .tab-btn.active {
        background: #FFFFFF;
        color: #2563EB;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .applicants-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .applicant-card {
        background: #FFFFFF;
        border: 1px solid #E5E7EB;
        border-radius: 16px;
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        transition: all 0.2s ease;
    }

    .applicant-card:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        border-color: #D1D5DB;
    }

    .applicant-profile {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        flex: 1;
    }

    .avatar-placeholder {
        width: 54px;
        height: 54px;
        border-radius: 12px;
        background: #EFF6FF;
        color: #2563EB;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 700;
        flex-shrink: 0;
    }

    .profile-details {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .applicant-name {
        font-size: 1.2rem;
        font-weight: 700;
        color: #111827;
    }

    .applicant-meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        color: #6B7280;
        font-size: 0.875rem;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .meta-item svg {
        color: #9CA3AF;
    }

    .job-badge {
        background: #F3F4F6;
        color: #374151;
        padding: 2px 8px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 0.8rem;
    }

    .action-area {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .status-badge {
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .status-pending { background: #FEF3C7; color: #92400E; }
    .status-accepted { background: #D1FAE5; color: #065F46; }
    .status-rejected { background: #FEE2E2; color: #991B1B; }

    .btn-actions {
        display: flex;
        gap: 8px;
    }

    .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 10px;
        border: 1px solid #E5E7EB;
        background: #FFFFFF;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 1.1rem;
    }

    .action-btn.accept:hover {
        background-color: #D1FAE5;
        border-color: #10B981;
        color: #059669;
    }

    .action-btn.reject:hover {
        background-color: #FEE2E2;
        border-color: #EF4444;
        color: #DC2626;
    }

    .btn-resume {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 10px;
        border: 1px solid #E5E7EB;
        background: #FFFFFF;
        font-size: 0.875rem;
        font-weight: 600;
        color: #4B5563;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.2s;
    }

    .btn-resume:hover {
        border-color: #2563EB;
        color: #2563EB;
        background-color: #EFF6FF;
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 80px 24px;
        background: #F9FAFB;
        border-radius: 20px;
        border: 2px dashed #E5E7EB;
        color: #6B7280;
        width: 100%;
        box-sizing: border-box;
    }

    .empty-icon {
        font-size: 4rem;
        color: #D1D5DB;
        margin-bottom: 24px;
        display: block;
    }

    @media (max-width: 768px) {
        .applicant-card {
            flex-direction: column;
            align-items: flex-start;
        }

        .action-area {
            width: 100%;
            justify-content: space-between;
            border-top: 1px solid #F3F4F6;
            padding-top: 16px;
        }
    }
`;

export default function JobApplicants() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    
    const [applicants, setApplicants] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const isAllJobs = jobId === 'all';

    useEffect(() => {
        const fetchApplicantsData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (isAllJobs) {
                    // Fetch all applicants for all jobs (using large limit to get all)
                    const res = await dashboardAPI.recruiterRecentApplications(100);
                    setApplicants(res.data);
                } else {
                    // Fetch specific job details
                    try {
                        const jobRes = await jobAPI.getById(jobId);
                        setJobDetails(jobRes.data);
                    } catch (err) {
                        console.error('Error fetching job details:', err);
                    }
                    
                    // Fetch applicants for specific job
                    const res = await applicationAPI.jobApplicants(jobId);
                    setApplicants(res.data);
                }
            } catch (err) {
                console.error('Error fetching applicants:', err);
                setError('Failed to fetch applicants. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchApplicantsData();
    }, [jobId, isAllJobs]);

    const handleUpdateStatus = async (appId, newStatus) => {
        const confirmMsg = `Are you sure you want to ${newStatus === 'accepted' ? 'accept' : 'reject'} this application? An email notification will be sent to the candidate.`;
        if (!window.confirm(confirmMsg)) return;

        try {
            await applicationAPI.updateStatus(appId, newStatus);
            // Update local state
            setApplicants(prev => prev.map(app => 
                app._id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const filteredApplicants = useMemo(() => {
        return applicants.filter(app => {
            const applicantName = app.applicant?.name || '';
            const jobTitle = app.job?.title || jobDetails?.title || '';
            
            const matchesSearch = applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (activeTab === 'all') return matchesSearch;
            return matchesSearch && app.status.toLowerCase() === activeTab;
        });
    }, [applicants, searchTerm, activeTab, jobDetails]);

    if (loading) return <Loader fullPage message="Fetching applicants information..." />;

    return (
        <div className="applicants-page-container">
            <style>{jobApplicantsStyles}</style>

            <button className="back-btn" onClick={() => navigate('/dashboard')}>
                <FiArrowLeft size={16} />
                Back to Dashboard
            </button>

            <header className="page-header">
                <div className="header-info">
                    <h1 className="page-title">
                        <FiUser className="title-icon" />
                        {isAllJobs ? 'Job Applicants' : `Applicants: ${jobDetails?.title || 'Job'}`}
                    </h1>
                    <p className="page-subtitle">
                        {isAllJobs 
                            ? 'Manage applications across all your posted positions' 
                            : `Review and manage candidates for ${jobDetails?.company || 'your company'}`}
                    </p>
                </div>
            </header>

            <div className="search-filter-row">
                <div className="search-bar">
                    <FiSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by candidate name or job..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="status-tabs">
                    {['all', 'pending', 'accepted', 'rejected'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="empty-state" style={{ borderColor: '#FEE2E2', background: '#FEF2F2' }}>
                    <p style={{ color: '#DC2626', fontWeight: 600 }}>{error}</p>
                    <button className="back-btn" style={{ margin: '16px auto 0' }} onClick={() => window.location.reload()}>Retry</button>
                </div>
            )}

            {!error && filteredApplicants.length > 0 ? (
                <div className="applicants-list">
                    {filteredApplicants.map((app) => {
                        const applicant = app.applicant;
                        const job = app.job || jobDetails;
                        if (!applicant) return null;

                        const nameInitials = applicant.name
                            .split(' ')
                            .map(n => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase();

                        return (
                            <div key={app._id} className="applicant-card">
                                <div className="applicant-profile">
                                    <div className="avatar-placeholder">
                                        {nameInitials}
                                    </div>
                                    <div className="profile-details">
                                        <h3 className="applicant-name">{applicant.name}</h3>
                                        <div className="applicant-meta">
                                            <div className="meta-item">
                                                <FiMail size={14} />
                                                <span>{applicant.email}</span>
                                            </div>
                                            <div className="meta-item">
                                                <FiCalendar size={14} />
                                                <span>Applied {formatDate(app.createdAt)}</span>
                                            </div>
                                            {isAllJobs && job && (
                                                <div className="meta-item">
                                                    <FiBriefcase size={14} />
                                                    <span className="job-badge">{job.title}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="action-area">
                                    {applicant.resumeUrl ? (
                                        <a 
                                            href={applicant.resumeUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn-resume"
                                        >
                                            <FiDownload size={14} />
                                            Resume
                                        </a>
                                    ) : (
                                        <span style={{ fontSize: '0.85rem', color: '#9CA3AF', fontStyle: 'italic' }}>
                                            No Resume
                                        </span>
                                    )}

                                    <div className={`status-badge status-${app.status.toLowerCase()}`}>
                                        {app.status}
                                    </div>

                                    {app.status === 'pending' && (
                                        <div className="btn-actions">
                                            <button 
                                                className="action-btn accept"
                                                onClick={() => handleUpdateStatus(app._id, 'accepted')}
                                                title="Accept Candidate"
                                            >
                                                <FiCheck />
                                            </button>
                                            <button 
                                                className="action-btn reject"
                                                onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                                title="Reject Candidate"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : !error && (
                <div className="empty-state">
                    <FiUser className="empty-icon" />
                    <h2>No candidates found</h2>
                    <p>
                        {searchTerm || activeTab !== 'all' 
                            ? 'Try clearing search terms or changing status filter.' 
                            : 'Candidates who apply to your posted jobs will appear here.'}
                    </p>
                </div>
            )}
        </div>
    );
}