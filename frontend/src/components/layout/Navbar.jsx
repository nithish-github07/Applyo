import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    FiGrid, FiBriefcase, FiFileText, FiBookmark, FiLogOut, FiUser, FiPlusSquare, FiMenu
} from 'react-icons/fi';
import logo from '../../assets/applyo-logo.png';
import icon from "../../assets/applyo-icon.png";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem("sidebar_collapsed") === "true";
    });
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleCollapse = () => {
        const newValue = !isCollapsed;
        setIsCollapsed(newValue);
        localStorage.setItem("sidebar_collapsed", String(newValue));
    };

    const toggleMobileOpen = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);
    
    const hideOn = ["/login", "/register"];
    if (!user || hideOn.includes(location.pathname)) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menuItems = [
        {
            title: "Main",
            items: [
                { path: "/dashboard", icon: <FiGrid />, name: "Dashboard", roles: ["jobSeeker", "recruiter"] },
                { path: "/jobs", icon: <FiBriefcase />, name: "Browse Jobs", roles: ["jobSeeker", "recruiter"] },
            ]
        },
        {
            title: "Manage",
            role: "jobSeeker",
            items: [
                { path: "/my-applications", icon: <FiFileText />, name: "Job Applications", roles: ["jobSeeker"] },
                { path: "/saved-jobs", icon: <FiBookmark />, name: "Saved Jobs", roles: ["jobSeeker"] },
            ]
        },
        {
            title: "Management",
            role: "recruiter",
            items: [
                { path: "/jobs/create", icon: <FiPlusSquare />, name: "Post Job", roles: ["recruiter"] },
            ]
        },
        {
            title: "Account",
            items: [
                { path: "/profile", icon: <FiUser />, name: "Profile", roles: ["jobSeeker", "recruiter"] },
                { 
                    type: "button", 
                    onClick: handleLogout, 
                    icon: <FiLogOut />, 
                    name: "Logout", 
                    roles: ["jobSeeker", "recruiter"],
                    className: "logout-btn-nav"
                },
            ]
        }
    ];

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

        .sidebar {
            width: 280px;
            min-height: 100vh;
            background-color: #FFFFFF;
            border-right: 1px solid #EAECF0;
            display: flex;
            flex-direction: column;
            padding: 32px 20px;
            font-family: 'Inter', sans-serif;
            color: #344054;
            box-sizing: border-box;
            position: sticky;
            top: 0;
            height: 100vh;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease;
        }

        .sidebar.collapsed {
            width: 80px;
            padding: 32px 12px;
            align-items: center;
        }

        .sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 40px;
            padding: 0 8px;
            width: 100%;
            box-sizing: border-box;
        }

        .sidebar.collapsed .sidebar-header {
            flex-direction: column;
            gap: 16px;
            justify-content: center;
            align-items: center;
            padding: 0;
        }

        .collapse-toggle-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: #667085;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.2s;
            font-size: 1.25rem;
        }
        
        .collapse-toggle-btn:hover {
            background-color: #F9FAFB;
            color: #101828;
        }

        .sidebar-logo {
            height: 50px;
            width: auto;
            object-fit: contain;
        }

        .sidebar-logo-icon {
            height: 36px;
            width: auto;
            object-fit: contain;
            margin-bottom: 10px;
        }

        .sidebar-nav {
            flex-grow: 1;
        }

        .nav-section {
            margin-bottom: 28px;
        }

        .nav-title {
            font-size: 0.75rem;
            font-weight: 700;
            color: #98A2B3;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 0 12px;
            margin-bottom: 12px;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            border-radius: 10px;
            text-decoration: none;
            font-size: 0.9375rem;
            font-weight: 500;
            color: #475467;
            transition: all 0.2s;
            margin-bottom: 4px;
            border: 1px solid transparent;
        }

        .nav-link:hover {
            background-color: #F9FAFB;
            color: #101828;
        }

        .nav-link.active {
            background-color: #EFF6FF;
            color: #2563EB;
            font-weight: 600;
            border-color: #DBEAFE;
        }

        .nav-link svg {
            width: 20px;
            height: 20px;
            color: #667085;
            transition: color 0.2s;
        }

        .nav-link.active svg {
            color: #2563EB;
        }

        .sidebar.collapsed .nav-title {
            display: none;
        }

        .sidebar.collapsed .nav-link {
            justify-content: center;
            padding: 12px;
            gap: 0;
        }

        .logout-btn-nav {
            width: 100%;
            background: none;
            border: 1px solid transparent;
            cursor: pointer;
            font-family: inherit;
            text-align: left;
        }

        .logout-btn-nav:hover {
            background-color: #FFF1F0 !important;
            color: #D92D20 !important;
        }

        .logout-btn-nav:hover svg {
            color: #D92D20 !important;
        }

        /* Responsive Mobile Styles */
        .mobile-header {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background-color: #FFFFFF;
            border-bottom: 1px solid #EAECF0;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            z-index: 999;
        }

        .mobile-menu-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: #475467;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            border-radius: 8px;
        }

        .mobile-logo {
            height: 36px;
            width: auto;
            object-fit: contain;
        }

        .mobile-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(16, 24, 40, 0.4);
            backdrop-filter: blur(4px);
            z-index: 998;
        }

        @media (max-width: 768px) {
            .sidebar {
                position: fixed;
                left: 0;
                top: 0;
                bottom: 0;
                height: 100vh;
                transform: translateX(-100%);
                z-index: 1000;
                width: 280px !important;
                padding: 24px 20px !important;
                box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
            }

            .sidebar.mobile-open {
                transform: translateX(0);
            }

            .mobile-header {
                display: flex;
            }

            main {
                padding-top: 60px;
            }

            .collapse-toggle-btn {
                display: none;
            }
        }

        /* Hide scrollbar */
        .sidebar-nav::-webkit-scrollbar {
            display: none;
        }
    `;

    return (
        <>
            <style>{styles}</style>
            
            {/* Mobile Top Header */}
            <div className="mobile-header">
                <button onClick={toggleMobileOpen} className="mobile-menu-btn" title="Open Menu">
                    <FiMenu />
                </button>
                <img src={logo} alt="Applyo Logo" className="mobile-logo" />
                <div style={{ width: 40 }}></div>
            </div>

            {/* Backdrop for mobile menu */}
            {isMobileOpen && <div className="mobile-backdrop" onClick={toggleMobileOpen}></div>}

            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    {isCollapsed ? (
                        <img src={icon} alt="Applyo Icon" className="sidebar-logo-icon" />
                    ) : (
                        <img src={logo} alt="Applyo Logo" className="sidebar-logo" />
                    )}
                    <button onClick={toggleCollapse} className="collapse-toggle-btn" title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
                        <FiMenu />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((section, index) => (
                        (section.role === user.role || !section.role) && (
                            <div className="nav-section" key={index}>
                                {!isCollapsed && <h3 className="nav-title">{section.title}</h3>}
                                {section.items.map((item, idx) => (
                                    item.roles.includes(user.role) && (
                                        item.type === "button" ? (
                                            <button 
                                                key={idx}
                                                onClick={item.onClick} 
                                                className={`nav-link ${item.className || ''}`}
                                                title={isCollapsed ? item.name : ''}
                                            >
                                                {item.icon}
                                                {!isCollapsed && <span>{item.name}</span>}
                                            </button>
                                        ) : (
                                            <Link 
                                                to={item.path} 
                                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`} 
                                                key={item.path}
                                                title={isCollapsed ? item.name : ''}
                                            >
                                                {item.icon}
                                                {!isCollapsed && <span>{item.name}</span>}
                                            </Link>
                                        )
                                    )
                                ))}
                            </div>
                        )
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;