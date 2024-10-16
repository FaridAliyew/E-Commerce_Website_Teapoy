import React, { useEffect, useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Form, Button, Container, Modal } from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaUser, FaSearch } from 'react-icons/fa';
import '../style/navbar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Navbar({ cartCount, wishlistCount, isAuthenticated, setIsAuthenticated }) {
    const { t, i18n } = useTranslation(); // useTranslation istifadə olunur
    const [navBackground, setNavBackground] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' }); // Object state
    const location = useLocation();
    const userData = JSON.parse(localStorage.getItem('userData')) || {}; // Yoxlama əlavə edildi
    const navigate = useNavigate();

    const handleSignInModalOpen = () => setShowSignInModal(true);
    const handleSignInModalClose = () => setShowSignInModal(false);

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.setItem('isAuthenticated', 'false');
        setShowProfileModal(false);
    };

    // Scroll funksiyası
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setNavBackground(true);
            } else {
                setNavBackground(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Səhifə yenilənəndə "isAuthenticated" dəyərini yoxla
    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [setIsAuthenticated]);

    const getActiveLinkClass = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignIn = (e) => {
        e.preventDefault();

        const storedUserData = JSON.parse(localStorage.getItem('userData'));

        // Email və parol yoxlanışı
        if (storedUserData &&
            storedUserData.email === credentials.email &&
            storedUserData.password === credentials.password) {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            handleSignInModalClose();
        } else {
            alert('Invalid email or password');
        }
    };
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng); // Dil dəyişmə funksiyası
    };
    return (
        <>
            <BootstrapNavbar
                variant="dark"
                expand="lg"
                sticky="top"
                className={`${navBackground || menuOpen ? 'navbar-scrolled' : ''}`}
            >
                <Container fluid>
                    <BootstrapNavbar.Brand href="#">
                        <img
                            src='https://wdt-teapoy.myshopify.com/cdn/shop/files/logo.svg?v=1719825267&width=160'
                            alt="Profile"
                            style={{ width: '200px', height: '40px', borderRadius: '50%' }} />
                    </BootstrapNavbar.Brand>

                    <BootstrapNavbar.Toggle
                        aria-controls="basic-navbar-nav"
                        onClick={() => setMenuOpen(!menuOpen)}
                    />

                    <BootstrapNavbar.Collapse id="basic-navbar-nav">
                        <Nav className="d-flex align-items-center justify-content-center">
                            <Nav.Link as={Link} to="/" className={`me-4 ${getActiveLinkClass('/')}`}>{t('HOME')}</Nav.Link>
                            <Nav.Link as={Link} to="/collection" className={`me-4 ${getActiveLinkClass('/collection')}`}>{t('COLLECTION')}</Nav.Link>
                            <Nav.Link as={Link} to="/shop" className={`me-4 ${getActiveLinkClass('/shop')}`}>{t('SHOP')}</Nav.Link>
                            <Nav.Link as={Link} to="/blog" className={`me-4 ${getActiveLinkClass('/blog')}`}>{t('BLOG')}</Nav.Link>

                            <NavDropdown title={t('PAGES')} id="basic-nav-dropdown" className='me-4'>
                                <NavDropdown.Item as={Link} to="/about">{t('ABOUT')}</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/faq">{t('FAQ')}</NavDropdown.Item>
                            </NavDropdown>

                            <Nav.Link as={Link} to={"/contact"} className={`me-4 ${getActiveLinkClass('/contact')}`}>{t('CONTACT')}</Nav.Link>

                            {/* Dil seçimi */}
                            {/* <NavDropdown title="Languages" id="language-dropdown" className='me-4'>
                                <NavDropdown.Item onClick={() => changeLanguage('az')}>Az</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => changeLanguage('en')}>En</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => changeLanguage('ru')}>Ru</NavDropdown.Item>
                            </NavDropdown> */}
                        </Nav>

                        <Form className="d-flex ms-auto">
                            <Button variant="outline-light" className="fs-5 icons" onClick={() => navigate("/shop")}>
                                <FaSearch />
                            </Button>
                            <Button variant="outline-light" className="fs-5 icons" onClick={() => navigate("/wishlist")}>
                                <FaHeart />
                                {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
                            </Button>
                            <Button variant="outline-light" className="fs-5 icons" onClick={() => navigate("/addtocart")}>
                                <FaShoppingCart />
                                {cartCount > 0 && <span className="badge">{cartCount}</span>}
                            </Button>
                            {isAuthenticated ? (
                                <>
                                    {userData && (
                                        <Button variant="outline-light" className="ms-3" onClick={() => setShowProfileModal(true)}>
                                            {userData.username}
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <Button variant="outline-light" className="fs-5 icons" onClick={handleSignInModalOpen}>
                                    <FaUser />
                                </Button>
                            )}
                        </Form>
                    </BootstrapNavbar.Collapse>
                </Container>
            </BootstrapNavbar>

            {/* Sign In Modal */}
            <Modal show={showSignInModal} onHide={handleSignInModalClose} centered>
                <Modal.Header closeButton className='bg-black text-white'>
                    <Modal.Title className='w-100 text-center fs-2'>{t('SIGN_IN')}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='bg-black'>
                    <Form onSubmit={handleSignIn}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder={t('EMAIL_ADDRESS')}
                                className='p-2'
                                value={credentials.email}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder={t('PASSWORD')}
                                className='p-2'
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-50 d-block ms-auto me-auto mt-4" style={{ backgroundColor: '#eb8934', border: 'none' }}>
                            {t('SIGN_IN')}
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        <p className='text-white'>{t("DON'T_HAVE_ACCOUNT")} <Link to="/signup" className='text-white sign-up' onClick={handleSignInModalClose}>{t('SIGN_UP')}</Link></p>
                    </div>
                </Modal.Body>
            </Modal>


            {/* Profile Modal */}
            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
                <Modal.Header closeButton className='bg-black text-white'>
                    <Modal.Title className='w-100 text-center fs-2 ms-3'>{t('PROFILE')}:</Modal.Title>
                </Modal.Header>
                <Modal.Body className='bg-black'>
                    <p className='text-white fs-5'>{t('USERNAME')}: {userData?.username || ''}</p>
                    <p className='text-white fs-5'>{t('EMAIL')}: {userData?.email || ''}</p>
                    <Button onClick={handleLogout} variant="danger" className='w-50 d-block ms-auto me-auto mt-4'>
                        {t('LOG_OUT')}
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Navbar;