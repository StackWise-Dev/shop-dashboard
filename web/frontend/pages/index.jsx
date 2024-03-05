import {
  Page,
  Form, FormLayout, TextField, Button, Layout
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useState } from "react";

export default function HomePage() {
 
  let fetch = useAuthenticatedFetch();
  let [metaObject, setMetaObject] = useState({
    metaname: '',
    metavalue: '',
  });

  const handleSubmit = useCallback(() => {
    console.log(metaObject);
  }, []);

  const handleEmailChange = useCallback((value, id) => {
    setMetaObject((oldConfig) => ({
      ...oldConfig,
      [id]: value,
    }));
  }, []);

  useEffect(() => {
    fetch("/api/metafield/createGQL", {
      method: "POST",
      headers: {"Content-Type": "application/json"}
    })
    .then(response => response.json())
    .then(result => console.log(result.body))
    .catch(error => console.log(error));
  })


  return (
    <Page fullWidth>
      <Layout sectioned>
        <Layout.Section>
          <Form onSubmit={handleSubmit}>
            <FormLayout>
              <TextField
                value={metaObject.metaname}
                onChange={handleEmailChange}
                label="Name"
                name="metaname"
                id="metaname"
                type="text"
                autoFocus="on"
                autoComplete="name"
                helpText={<span>Write metafield name here...</span>
                }
              />
              <TextField 
                value={metaObject.metavalue}
                onChange={handleEmailChange}
                label="Value"
                name="metavalue"
                id="metavalue"
                type="text"
                autoComplete="off"
                multiline={4}
                helpText={<span>Write metafiled value. HTML and CSS are accepted.</span>}
              />
              <Button submit>Submit</Button>
            </FormLayout>
          </Form>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
