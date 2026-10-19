import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { scrollToTarget } from '../../hooks/useLenis';
import { FOOTER_DATA, EXPLORE_LINKS, SOURCE_LINK } from '../../data/footer';
import Wordmark from './Wordmark';
import './Footer.css';

export default function Footer() {
  const footerRef = useRef(null);
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [isEntered, setIsEntered] = useState(false);

  // Viewport IntersectionObserver to trigger masked entrance reveals
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsEntered(true);
        }
      },
      {
        threshold: 0.08,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleBackToTop = (e) => {
    e.preventDefault();
    scrollToTarget('#top', -65);
  };

  const handleScrollLink = (e, sectionId) => {
    e.preventDefault();
    scrollToTarget(`#${sectionId}`, -65);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const userFirstName = user?.displayName
    ? user.displayName.split(' ')[0]
    : user?.email
    ? user.email.split('@')[0]
    : 'Client';

  return (
    <footer id="footer" ref={footerRef} className="footer-section">
      <div className="footer-container">
        {/* Top Row: Brand Year & Back to Top */}
        <div className="footer-top-row">
          <span className="footer-brand-year">{FOOTER_DATA.brandYear}</span>
          <button
            type="button"
            className="footer-back-to-top"
            onClick={handleBackToTop}
            aria-label="Back to top of page"
          >
            <span>{FOOTER_DATA.backToTop}</span>
            <ArrowUp className="back-to-top-icon" size={14} strokeWidth={2.2} />
          </button>
        </div>

        {/* Middle Row: Links & Legal Credits */}
        <div className="footer-middle-row">
          {/* Navigation Groups */}
          <div className="footer-nav-groups">
            {/* Group 1: Explore */}
            <nav className="footer-link-group" aria-label="Explore">
              <span className="footer-group-label">Explore</span>
              <ul className="footer-links-list">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.id} className="footer-link-item">
                    <a
                      href={`#${link.id}`}
                      className="footer-link"
                      onClick={(e) => handleScrollLink(e, link.id)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Group 2: Account (renders nothing during auth loading to prevent flash) */}
            <nav className="footer-link-group" aria-label="Account">
              <span className="footer-group-label">Account</span>
              {!loading && (
                <ul className="footer-links-list">
                  {user ? (
                    <>
                      <li className="footer-link-item">
                        <span className="footer-account-user">{userFirstName}</span>
                      </li>
                      <li className="footer-link-item">
                        <button
                          type="button"
                          className="footer-link"
                          onClick={handleSignOut}
                        >
                          Sign out
                        </button>
                      </li>
                    </>
                  ) : (
                    <li className="footer-link-item">
                      <Link to="/login" className="footer-link">
                        Sign in
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </nav>

            {/* Group 3: Source */}
            <nav className="footer-link-group" aria-label="Source">
              <span className="footer-group-label">Source</span>
              <ul className="footer-links-list">
                <li className="footer-link-item">
                  <a
                    href={SOURCE_LINK.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    {SOURCE_LINK.label}
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Right Side: Credit & Legal Notice */}
          <div className="footer-meta-block">
            <p className="footer-credit-line">{FOOTER_DATA.creditLine}</p>
            <p className="footer-legal-line">{FOOTER_DATA.legalLine}</p>
          </div>
        </div>

        {/* Bottom Area: Copyright & Giant Cropped Wordmark */}
        <div className="footer-bottom-area">
          <p className="footer-copyright">{FOOTER_DATA.copyright}</p>
          <Wordmark isFooterInView={isEntered} />
        </div>
      </div>
    </footer>
  );
}
