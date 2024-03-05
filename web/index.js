// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

// GETTING ALL METAFIELDS OF THE STORE
app.get("/api/metafields/all", async(req, res) => {
  let metafields = await shopify.api.rest.Metafield.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(metafields);
})

// GET PRODUCT METAFIELDS
app.get("/api/metafields/product", async(req, res) => {
  let metafields = await shopify.api.rest.Metafield.all({
    session: res.locals.shopify.session,
    metafield: {
      "owner_id": "4526474690620",
      "owner_resource": "product",
    }
  });
  res.status(200).send(metafields);
})

// GET A SPECIFIC METAFIELD
app.get("/api/metafield/single", async(req, res) => {
  let metafields = await shopify.api.rest.Metafield.find({
    session: res.locals.shopify.session,
    product_id: '4526474690620',
    id: '20459344429116'
  });
  res.status(200).send(metafields);
});

// UPDATE METAFIELD
app.put("/api/metafield/update", async(req, res) => {
  let metafield = new shopify.api.rest.Metafield({
    session: res.locals.shopify.session,
  });
  metafield.product_id = 4526474690620;
  metafield.id = 21402034143292;
  metafield.value = "This is changed by app.";
  await metafield.save({
    update: true,
  })
  res.status(200).send(metafield);
});

// DELETE METAFIELD
app.delete("/api/metafield/delete", async(req, res) => {
  let metafield = await shopify.api.rest.Metafield.delete({
    session: res.locals.shopify.session,
    product_id: 4526474690620,
    id: 21402034143292,
  });
  res.status(200).send(metafield);
});

// CREATE METAFIELD USING REST API
app.post("/api/metafield/create", async(req, res) => {
  let metafield = new shopify.api.rest.Metafield({
    session: res.locals.shopify.session,
  });
  metafield.product_id = 4526474690620;
  metafield.namespace = "custom";
  metafield.key = "unit_price";
  metafield.type = "number_integer";
  metafield.value = "50";
  await metafield.save({
    update: true,
  })
  res.status(200).send(metafield);
});

// CREATE METAFIELD USING GQL WITHOUT DEFINITION
app.post("/api/metafield/createGQLwithoutdef", async(req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });
  const data = await client.query({
    "data": {
      "query": ` mutation {
        productUpdate(
        input : {
          id: "gid://shopify/Product/4526474690620",
          metafields: [
            {
              namespace: "instructions",
              key: "wash",
              value: "cold wash",
              type: "single_line_text_field",
            }
          ]
        }) {
          product {
            metafields(first: 100) {
              edges {
                node {
                  namespace
                  key
                  value
                }
              }
            }
          }
        }
      }`
    },
  });
  res.status(200).send(data);
});

// CREATE METAFIELD USING GQL WITH DEFINITION
app.post("/api/metafield/createGQL", async(req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });
  const data = await client.query({
    data: {
      "query": `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $definition) {
          createdDefinition {
            id
            name
          }
          userErrors {
            field
            message
            code
          }
        }
      }`,
      "variables": {
        "definition": {
          "name": "Bonus Price",
          "namespace": "custom",
          "key": "bonus_money",
          "type": "number_integer",
          "description": "This is the app metafield",
          "validations": [
            {
              "name": "min",
              "value": "0"
            },
            {
              "name": "max",
              "value": "20"
            }
          ],
          "ownerType": "PRODUCT",
          "pin": true,
          "visibleToStorefrontApi": true,
          "useAsCollectionCondition": true,
        }
      },
    },
  });
  res.status(200).send(data);
});

// CREATE APP METAFIELD USING GQL
app.post("/api/metafield/createWithApp", async(req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });
  const data = await client.query({
    "data": {
      "query": `mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafieldsSetInput) {
          metafields {
            id
            namespace
            key
          }
          userErrors {
            field
            message
          }
        }
      }`,
      "variables": {
        "metafieldsSetInput": [
          {
            "namespace": "custom",
            "key": "bonus_tag",
            "type": "number_integer",
            "value": "27",
            "ownerId": "gid://shopify/Product/4526474690620",
          }
        ]
      },
    },
  });
  res.status(200).send(data);
});


// GET THE NUMBER OF ALL PRODUCTS
app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

// CREATE A PRODUCT USING GRAPHQL
app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
