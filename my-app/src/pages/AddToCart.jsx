import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import img from '../imgs/Rectangle_2.jpg';
import '../style/addToCart.css';
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import { GrNotes } from "react-icons/gr";
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

function AddToCart({ cartItems, setCartItems, setCartCount, quantities, setQuantities }) {
    const { t } = useTranslation(); // Initialize translation

    const navigate = useNavigate();

    useEffect(() => {
        const storedQuantities = localStorage.getItem('quantities');
        if (storedQuantities) {
            setQuantities(JSON.parse(storedQuantities));
        } else {
            const initialQuantities = cartItems.reduce((acc, item) => {
                acc[item.id] = 1;
                return acc;
            }, {});
            setQuantities(initialQuantities);
            localStorage.setItem('quantities', JSON.stringify(initialQuantities));
        }
    }, [cartItems]);

    const handleQuantityChange = (id, change) => {
        setQuantities((prev) => {
            const newQuantity = Math.max(1, (prev[id] || 1) + change);
            const updatedQuantities = {
                ...prev,
                [id]: newQuantity,
            };
            localStorage.setItem('quantities', JSON.stringify(updatedQuantities));
            return updatedQuantities;
        });
    };

    const handleDeleteItem = (id) => {
        const updatedCartItems = cartItems.filter((item) => item.id !== id);

        // Səbətdəki sayını yeniləyin
        setCartCount(updatedCartItems.length); // yeni sayını təyin edin
        setCartItems(updatedCartItems);

        const updatedQuantities = { ...quantities };
        delete updatedQuantities[id];
        localStorage.setItem('quantities', JSON.stringify(updatedQuantities));
        setQuantities(updatedQuantities);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + item.price * (quantities[item.id] || 1);
        }, 0);
    };

    return (
        <div className='addToCart'>
            <Container fluid className="p-0 m-0">
                <Row className="g-0">
                    <Col>
                        <div className='image-container'>
                            <img src={img} alt="" />
                            <p className='image-text'>{t('title')}</p>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container fluid className="mt-5">
                {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                        <Row key={index} className="align-items-center justify-content-center p-5">
                            <Col sm={12} lg={3}>
                                <div className="image-wrapper">
                                    <img src={item.image_url} alt={item.title} className="slider-img img-fluid w-50 rounded-4 " />
                                    <div className="img-text">
                                        <p className='categoria'>{item.name1}</p>
                                        <p className='img-text-1'>{item.name2}</p>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={12} lg={3} className='d-flex mt-4 mb-4 mb-lg-none mt-lg-none'>
                                <div className="quantity-control text-white d-flex justify-content-center py-2">
                                    <button onClick={() => handleQuantityChange(item.id, -1)} className='quantity'>-</button>

                                    <span className='fs-6 mx-3'>{quantities[item.id] || 1}</span>

                                    <button onClick={() => handleQuantityChange(item.id, 1)} className='quantity'>+</button>
                                </div>

                            </Col>

                            <Col sm={12} lg={3}>
                                <p className='text-white fs-4'>${(item.price * (quantities[item.id] || 1)).toFixed(2)}</p>
                            </Col>

                            <Col sm={12} lg={3}>
                                <RiDeleteBin5Line
                                    className='fs-2 mb-4 text-danger delete d-block ms-auto me-auto'
                                    onClick={() => handleDeleteItem(item.id)}  // Delete icon click
                                />
                            </Col>
                        </Row>

                    ))
                ) : (
                    <h1 className='text-center text-white mb-5' style={{ marginTop: '150px' }}>{t('empty')}</h1>
                )}
                {cartItems.length > 0 ? <hr className='text-white' /> : ''}
                <button onClick={() => navigate("/shop")} style={{ padding: '10px', borderRadius: '30px', backgroundColor: 'rgb(255, 111, 0)', border: 'none', marginBottom: '140px' }} className='text-white d-block ms-auto me-auto mt-4 '>{t('continueShopping')}</button>
            </Container>

            {cartItems.length > 0 ? (
                <Container className='mt-5'>
                    <Row>
                        <Col sm={12} md={6} >
                            <div className='d-flex text-white'>
                                <GrNotes className='me-3' />
                                <h6>{t('addNote')}</h6>

                            </div>
                            <textarea placeholder={t('addNotePlaceholder')} rows={4} className='rounded-4 p-3 w-100'></textarea>
                        </Col>

                        <Col sm={12} md={6} className='mt-4 mt-md-0'>
                            <div className='text-white text-center '>
                                <h3 className='fs-4 float-md-end'>{t('total')}: ${calculateTotal().toFixed(2)}</h3><br /> <br />
                                <p className='float-md-end'>{t('taxesNote')}</p> <br /><br />
                                <Link to={'/checkout'} className='float-md-end check-out text-white rounded-4 w-50 py-2 text-decoration-none'>{t('checkout')}</Link><br /><br />
                            </div>
                        </Col>
                    </Row>
                </Container>) : ''}
        </div>
    );
}

export default AddToCart;