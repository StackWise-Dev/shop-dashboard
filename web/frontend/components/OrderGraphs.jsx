import React, { useState } from 'react';
import { storeData } from '../data';

import {
    Layout,
    LegacyCard
  } from "@shopify/polaris";
import { Chart } from './Chart';

export function OrderGraphs() {

  let [data, setData] = useState({
      labels: storeData.map((d) => d.year),
      datasets: [{
          label: "Total Orders",
          data: storeData.map((d) => d.order),
          backgroundColor: ['#008170', '#000000', '#8e8e8e', '#81BF37']
      }]
  });

  return (
    <>
      <Layout>
        <Layout.Section oneHalf>
          <LegacyCard title="Total Orders" sectioned>
            <Chart chartData={data} line />
          </LegacyCard>
        </Layout.Section>
        <Layout.Section oneThird>
          <LegacyCard title="Completed" sectioned>
            <Chart chartData={data} doughnut />
          </LegacyCard>
        </Layout.Section>
        <Layout.Section oneThird>
          <LegacyCard title="Remaining" sectioned>
            <Chart chartData={data} bar />
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </>
  )
};