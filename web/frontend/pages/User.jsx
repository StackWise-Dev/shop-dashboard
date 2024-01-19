import React from 'react'
import {Page, Layout, LegacyCard} from '@shopify/polaris';
import useApiRequest from '../hooks/useApiRequest';

function User() {

  let {responseData, isLoading, error} = useApiRequest("/api/getusers", "GET");

  return (
    <div className='users-data'>
      <Page>
      <Layout sectioned>
        <Layout.Section>
          <LegacyCard title="Online store dashboard" sectioned>
            <ul>
              <li>
                <span>Name</span>
                <span>Email</span>
              </li>
              { responseData && responseData.map((user) => (
                  <li key={user._id}>
                    <span>{user.username}</span>
                    <span>{user.useremail}</span>
                  </li>
                ))
              }
            </ul>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
    </div>
  )
}

export default User
