<div align="center">
  <h1>
    Jumbo API Wrapper
  </h1>
  </br>
  <p>
    <a href="https://www.npmjs.com/package/jumbo-wrapper"><img src="https://img.shields.io/npm/v/jumbo-wrapper" alt="NPM version" /></a>
    <a href="https://github.com/RinseV/jumbo-wrapper"><img src="https://img.shields.io/npm/l/jumbo-wrapper" alt="NPM license" /></a>
    <a href="https://www.npmjs.com/package/jumbo-wrapper"><img src="https://david-dm.org/RinseV/jumbo-wrapper.svg" alt="NPM dependencies"/></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/jumbo-wrapper/"><img src="https://nodei.co/npm/jumbo-wrapper.svg" alt="npm installnfo" /></a>
  </p>
</div>

Node.js API wrapper for [Jumbo](https://www.jumbo.com/).

This package is still a work in progress.

## Installation
```sh
npm install jumbo-wrapper
``` 
or 
```sh
yarn add jumbo-wrapper
```
then
```javascript
import { Jumbo } from 'jumbo-wrapper';
```

## Usage
```javascript
// Creates Jumbo object using username and password, set verbose=true if you want to see all requests
const jumbo = new Jumbo(username, password, verbose) ;
// Gets product as response from ID
const product = await jumbo.product().getProductFromId('67649PAK'); 
```

### Functions

You **don't** need to be logged in to use the following functions:
#### Products
```javascript
// Returns product with given ID
Jumbo.product().getProductFromId(productId); 
// Returns list of products that match the name
Jumbo.product().getProductsFromName(productName, offset, limit, filters); 
// Returns first product that mathces the name
Jumbo.product().getFirstProductFromName(productName); 
```

#### Promotions
```javascript
// Returns promotion of given store (via store ID)
Jumbo.promotion().getPromotionsFromStore(storeId);
```

#### Recipes
```javascript
// Returns recipe of given recipe ID
Jumbo.recipe().getRecipeFromId(recipeId);
```

#### Stores
```javascript
// Returns store with given ID
Jumbo.store().getStoreFromId(storeId);
// Returns stores sorted by distance that are closest to given location
Jumbo.store().getStoresFromLongLat(long, lat);
// Returns closest store given location
Jumbo.store().getNearestStoreFromLongLat(long, lat);
```

You **do** need to be logged in to use the following functions, for instructions how to login, see [Auth](#Auth).
#### Orders
```javascript
// Returns order from ID (if order is yours)
Jumbo.order().getMyOrderById(orderId);
// Returns all of your orders
Jumbo.order().getMyOrders();
// Returns your latest order (must be logged in)
Jumbo.order().getLatestOrder();
```

#### Users
```javascript
// Returns info of currently logged in user
Jumbo.user().getMyInfo();
```


### Example usage
For all of these examples, please keep in mind that your function in which you request something should be ``async`` since the requests return a ``Promise``.
#### Product
If I want to find the first 5 product names that match a given query:
```javascript
import { Jumbo } from 'jumbo-wrapper';

async function findFirstFiveProducts(productName: string): string[] {
    const jumbo = new Jumbo();
    const products = await jumbo.product().getProductsFromName('melk', 0, 5);
    console.log(
        products.map((product) => {
            return product.product.data.title;
        })
    );
}

findFirstFiveProducts("melk");
```
```sh
[
  'Jumbo Verse Halfvolle Melk 2L',
  'Jumbo Verse Halfvolle Melk 1L',
  'Jumbo Verse Halfvolle Melk 1, 5L',
  'Jumbo Houdbare Halfvolle Melk Voordeelverpakking 6 x 1',
  'Jumbo Verse Volle Melk 1L'
]
```

#### Store
If I want to find the name of the store that is closest to a given location:
```javascript
import { Jumbo } from 'jumbo-wrapper';

async function findJumboStore(longitude: number, latitude: number): string {
    const jumbo = new Jumbo();
    const res = await jumbo.store().getNearestStoreFromLongLat(longitude, latitude);
    console.log(res.store.data.name);
}

findJumboStore(4.4993409, 51.9106489);
```
```sh
Jumbo Rotterdam Vijf Werelddelen
```

#### Order
If I want to see the ID of the latest order of my Jumbo account:
```javascript
import { Jumbo } from 'jumbo-wrapper';

async function getLatestOrder(username: string, password: string): string {
    const jumbo = new Jumbo(username, password);
    const res = await jumbo.order().getMyLatestOrder();
    console.log(res.order.data.id);
}

findJumboStore({username}, {password});
```
Keep in mind that you need to be logged in to get your orders, for instructions see [Auth](#Auth).

### Advanced usage
Every request can also be provided with additional headers and queries. If you want to add your own headers or queries to any request, simply do the following:
```javascript
import { Headers, Query } from '../jumbo';

const myHeaders: Headers = {
    "Connection": "keep-alive",
}

const myQueries: Query = {
    "distance": "15000"
}

const store = await jumbo.store().getStoresFromLongLat(long, lat, undefined, undefined, myHeaders, myQueries);
```
Keep in mind that you must use the ``Headers`` and ``Query`` interfaces defined in ``../jumbo``.

## Auth
The token is created via creation of the ```Jumbo``` object:
```javascript
const jumbo = new Jumbo(username, password);
```
Since you need a username and password, I'd recommend providing them via a ``.env`` file. A ``.env.example`` file is provided, once your username and password are filled in, you can create a ``Jumbo`` object as follows:
```javascript
require('dotenv').config({ path: '.env.local' });
const username = process.env.JUMBO_USERNAME;
const password = process.env.JUMBO_PASSWORD;

const jumbo = new Jumbo(username, password);
```
Keep in mind that you do need the [dotenv](https://www.npmjs.com/package/dotenv) package to load ``.env`` files.


Once authenticated, you'll be able to access your orders as well as see your user information:
```javascript
const orders = await jumbo.orders().getMyOrders();
const users = await jumbo.users().getMyInfo();
```