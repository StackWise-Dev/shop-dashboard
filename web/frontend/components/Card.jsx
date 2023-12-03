import { Layout, LegacyCard } from '@shopify/polaris'
import React from 'react'

export function Card({title}) {
  return (
    <>
        <Layout.Section oneThird>
            <LegacyCard title={title} sectioned>
                <h2>34</h2>
            </LegacyCard>
        </Layout.Section>
    </>
  )
}
