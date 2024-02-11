import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import useApiRequest from '../hooks/useApiRequest';

export function TopBar() {

  let {responseData, isLoading, error} = useApiRequest("/api/store/info", "GET");
  if(error) {
    console.log(error);
  }
  return (
    <div className='topbar-section'>
      <div className="logo-block">
        <img className='logo' src="../assets/shop logo.png" alt="Logo Image" />
        <h1 className='h4 text-bold'>
          {isLoading && '...'}
          {responseData && responseData?.data[0]?.name}
        </h1>
        <NavLink to="/" className="text-bold text-medium">Sales</NavLink>
        <NavLink to="/products" className="text-bold text-medium">Products</NavLink>
      </div>
    </div>
  )
}
