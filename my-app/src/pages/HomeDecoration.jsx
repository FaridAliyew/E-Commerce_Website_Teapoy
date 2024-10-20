// HomeDecoration.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../style/homeDecoration.css';
import { Pagination } from 'swiper/modules';
import { Container, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
// import { useTranslation } from 'react-i18next'; // i18next-in import edilməsi


function HomeDecoration({ setCartCount, setWishlistCount, setCartItems, setWishlistItems }) {
    // const { t } = useTranslation(); // Tercüməni əldə etmək

    const baseUrl = 'https://xnykiejhjsppxvnmqcev.supabase.co';
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueWtpZWpoanNwcHh2bm1xY2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMyODk0NDcsImV4cCI6MjAzODg2NTQ0N30.GTpLwlyahu9lMtSdKkCX4C9PtcT_7rvZPRCPYdkP1NY';

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/rest/v1/home-decoration?select=*`, {
                    headers: {
                        apikey: apiKey,
                        Authorization: `Bearer ${apiKey}`
                    }
                });
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [baseUrl, apiKey]);

    if (loading) {
        return (
            <div className="spinner-container">
                <Spinner animation="border" variant="light" />
            </div>
        );
    }

    if (error) return <p>Error: {error.message}</p>;

    const handleAddToCart = (item) => {
        setCartCount(prev => prev + 1);
        setCartItems(prev => [...prev, item]);
        toast.success('Successfully added to cart!');
    };

    const handleAddToWishlist = (item) => {
        setWishlistCount(prev => prev + 1);
        setWishlistItems(prev => [...prev, item]);
        toast.success('successfully added to wishlist!');
    };

    return (
        <div className="swiper-container">
            <Container>
                <Row>
                    <Swiper
                        spaceBetween={20}
                        pagination={{ clickable: true }}
                        modules={[Pagination]}
                        className="mySwiper"
                        breakpoints={{
                            320: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            1024: {
                                slidesPerView: 4,
                            },
                        }}
                    >
                        {data.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="image-wrapper">
                                    <img src={item.image_url} alt={item.title} className="slider-img rounded-4" />
                                    <div className="img-icons">
                                        <FaHeart className="icon" onClick={() => handleAddToWishlist(item)} />
                                        <FaShoppingCart className="icon" onClick={() => handleAddToCart(item)} />
                                    </div>
                                </div>
                                <div className="img-text">
                                    <p className='categoria'>{item.name1}</p>
                                    <p className='img-text-1 fs-5'>{item.name2}</p>
                                    <p className='img-text-1'>{item.price} $</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Row>
            </Container>
        </div>
    );
}

export default HomeDecoration;
