import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Home/Home.css'
import Banner from '/src/assets/images/Buy-now.png'
import ControllerPS5 from '/src/assets/images/PS5-Controller-PNG.png'
import FurnitureCat from '/src/assets/images/Furniture.png'
import FashionCat from '/src/assets/images/Fashion.png'
import GamingCat from '/src/assets/images/Gaming.png'
import KitchenCat from '/src/assets/images/Kitchen.png'
import SchoolCat from '/src/assets/images/School.png'
import PlaygroundCat from '/src/assets/images/Toys.png'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { CustomerSupportToken, FastCheckout, FreeShippingToken, RefundToken, SecurePayementToken } from '../../assets/icons'
import { ProductService } from '../Services/ProductService'
import Product from '../Product/Product'

function Home() {

  const [popularProducts, setPopularProducts] = useState(null)

  useEffect(() => {
    ProductService.searchPopularProducts()
    .then(
      axRes => {
        setPopularProducts(axRes.data)
        // console.log(popularProducts)
      }
    )
    .catch(
      axErr => console.log(axErr.response.data.details)
    )
  }, [])

  

  return (
    <>
        <Header/>
        <main className='container header_offset'>

          {/* MAIN BANNER */}
          <section className='section main_banner_container'>

            <div className="main_banner">

              <img src={Banner} className='banner' alt="" />

            </div>

          </section>


          {/* POPULAR PRODUCTS */}
          <section className="section popular_products_container">
            <h2 className='section_header popular_products_header'>
              Pupular Products
            </h2>
            <div className="popular_products">
              {popularProducts && 
                popularProducts.map(
                  (product) => (
                    <Product 
                      key={product.id}
                      id={product.id} 
                      image={product.image} 
                      label={product.label} 
                      owner={product.owner} 
                      price={product.price}
                      stock={product.stock}
                      averageRating={product.averageRating}
                      reviewsCount={product.reviewsCount}
                    />
                  )
                )
              }
            </div>
          </section>


          {/* POPULAR CATEGORIES */}
          <section className="section popular_categories_container">
              <h2 className='section_header popular_categories_header'>
                Popular Categories
              </h2>
              <div className="popular_categories">
                {[
                  {categ: "Furniture", img: FurnitureCat}, 
                  {categ: "Fashion", img: FashionCat},
                  {categ: "Gaming", img: GamingCat},
                  {categ: "Kitchen", img: KitchenCat},
                  {categ: "School", img: SchoolCat},
                  {categ: "Playground", img: PlaygroundCat}
                ].map(
                  (cat) => (

                    <div className="popular_category" key={cat.categ}>

                      <img className='popular_category_image' src={cat.img} alt="" />

                      <div className='popular_category_title_container'>
                        <h2 className='popular_category_title'>
                          {cat.categ}
                        </h2>
                      </div>

                    </div>

                  )
                )}
              </div>
          </section>


          <section className="section trust_tokens_container">
            <div className="trust_tokens">
              {[
                {name: "Secure Gateways", img: SecurePayementToken},            
                {name: "Free Shipping", img: FreeShippingToken},
                {name: "100% Refund", img: RefundToken},
                {name: "24/7 Customer Service", img: CustomerSupportToken},
            ].map(
              (token => (
                <div className="trust_token" key={token.name}>
                  {token.img}
                  <h2 className='trust_token_title'>
                    {token.name}
                  </h2>
                </div>
              ))
            )}
            </div>
          </section>
        </main>
        <Footer/>
    </>
  )
}

export default Home
