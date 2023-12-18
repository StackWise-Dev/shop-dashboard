import { Layout, LegacyCard } from '@shopify/polaris'
import React from 'react'

export function Card({title, orders, total, fulfilled, remains, productcount, collectioncount}) {
  let completed = orders?.data?.filter(item => item.fulfillment_status === 'fulfilled');
  return (
    <>
      <Layout.Section oneThird>
        <LegacyCard title={title} sectioned>
            <h1 className='total_count'>
              { total ? orders.data.length : '' }
              { fulfilled ? completed.length : '' }
              { remains ? (orders.data.length - completed.length) : '' }
              { productcount ? orders.count : ''}
              { collectioncount ? orders.data.length : ''}
            </h1>
        </LegacyCard>  
      </Layout.Section>  
    </>
  )
}
