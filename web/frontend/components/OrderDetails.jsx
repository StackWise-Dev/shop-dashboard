import { Layout, LegacyCard } from '@shopify/polaris'
import React from 'react'

export function OrderDetails() {
  return (
    <>
      <Layout>
        <Layout.Section>
            <LegacyCard title="Order Details" sectioned>
                <p className='text-medium'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta nesciunt ab deserunt doloribus odio quaerat rem voluptas laboriosam nostrum est! Ratione dolore, ducimus ad aut quidem in laborum aperiam excepturi!</p>
            </LegacyCard>
        </Layout.Section>
      </Layout>
    </>
  )
}
