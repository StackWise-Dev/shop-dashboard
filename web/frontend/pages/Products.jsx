import React, { useState } from 'react';
import useApiRequest from "../hooks/useApiRequest";
import {Page, Layout, LegacyCard, Grid} from '@shopify/polaris';
import { Add, Delete } from '@mui/icons-material';
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';

function Products() {

  let {responseData, isLoading, error} = useApiRequest("/api/products/all", "GET");
  let [isModalOpen, setIsModalOpen] = useState(false);
  let [formData, setFormData] = useState({});
  let fetch = useAuthenticatedFetch();


  function productHandler(productid) {
    setIsModalOpen(true);
    let searchProduct = responseData?.data.find(elem => elem.id === productid);
    setFormData(() => ({
      ...searchProduct
    }));
  }

  let submitHandler = (e) => {
    e.preventDefault();
    fetch("/api/product/update", {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData)
    })
    .then(response => {
      if(response.ok) {
        setIsModalOpen(false);
      }
      return response.json();
    })
    .then(data => {
      console.log(data)
    }) 
    .catch(error => console.log(error))
  }

  let valueHandler = (e) => {
    let {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  let createHandler = async() => {
    try { 
      let request = await fetch("/api/product/create", {
        method: "POST",
      });
      let response = await request.json();
      console.log(response);
    }catch(error) {
      console.log(error)
    }
  }

  let deleteHandler = async() => {
    try { 
      let request = await fetch("/api/product/delete", {
        method: "DELETE",
      });
      let response = await request.json();
      console.log(response);
    }catch(error) {
      console.log(error)
    }
  }

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <button onClick={createHandler} className='button'>New <Add /></button>
          <button onClick={deleteHandler} className='button'>Delete <Delete /></button>
        </Layout.Section>
        <Layout.Section>
          <Grid>
            {
              !isLoading && responseData.data.map((product) => (
                <Grid.Cell key={product.id} columnSpan={{xs: 6, sm: 6, md: 2, lg: 4, xl: 3}}>
                  <div className="card" onClick={() => productHandler(product.id)}>
                    <LegacyCard sectioned>
                      <img src={product?.image?.src} alt="product media" className='product-image' />
                      <h2 className="product-title">{product.title}</h2>
                      <p className="product-price">${product.variants[0].price}</p>
                    </LegacyCard>
                  </div>
                </Grid.Cell>
              ))
            }
          </Grid>
        </Layout.Section>
      </Layout>
      {
        isModalOpen && (
          <div className='product-modal'>
            <p className="btn-close" onClick={() => setIsModalOpen(false)}>X</p>
            <div className="modal-form">
              <form onSubmit={submitHandler}>
                <div className="image-block">
                  <img src={formData?.image?.src} alt="product media" />
                </div>
                <div className="form-fields">
                  <input type="hidden" name="id" value={formData.id}/>
                  <input type="text" name="title" id="title" value={formData.title} onChange={valueHandler} />
                  <input type="number" name="formData.variants[0].price" id="price" value={formData.variants[0].price} onChange={valueHandler}/>
                  <textarea name="body_html" id="body_html" cols="30" rows="10" value={ formData.body_html } onChange={valueHandler}></textarea>
                  <input type="text" name="handle" id="handle" value={formData.handle} onChange={valueHandler}/>
                  <input className='button' type="submit" value="Update" />
                </div>
              </form>
            </div>
          </div>
        )
      }
    </Page>
  )
}

export default Products
