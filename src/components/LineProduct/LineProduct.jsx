import React from 'react'
import './LineProduct.css'
import QtyController from '../QtyController/QtyController'

export default function LineProduct(owner, label, price, image) {
  return (
    <div className='header_cart_lp'>
        <img src='src/assets/images/Fashion.png' alt="" className="header_cart_lp_image" />
        <div className="header_cart_lp_details">
            <i className='header_cart_lp_details_delete'>
                {TrashIcon}
            </i>
            <p className="header_cart_lp_details_owner">{owner}</p>
            <p className="header_cart_lp_details_label">{label}</p>
            <div className="header_cart_lp_details_extra">
                <QtyController handler={setLineQty} value={lineQty}/>
                <h2 className='header_cart_lp_details_extra_price'>$150</h2>
            </div>
        </div>
    </div>
  )
}
