import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import Layout, { headerLoader } from "./components/Layout";
import "./style/App.css";
// import Checkout from "./pages/Checkout";
import NotFound from ".//pages/NotFound";
import Home, { homeLoader } from "./pages/Home";
import ShoppingCart, { shoppingCartLoader } from "./pages/ShoppingCart";
import ProductPage from "./pages/store/ProductPage";
import Store from "./pages/store/Store";
import StoreLayout, { storeLoader } from "./pages/store/StoreLayout";
export const hasOwnNestedProperty = function (obj: any, propertyPath: string) {
  if (!propertyPath) return false;
  var properties = propertyPath.split(".");

  for (var i = 0; i < properties.length; i++) {
    var prop = properties[i];

    if (!obj || !obj.hasOwnProperty(prop)) {
      return false;
    } else {
      obj = obj[prop];
    }
  }
  return true;
};

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} loader={headerLoader}>
        <Route index element={<Home />} loader={homeLoader}></Route>
        <Route element={<StoreLayout />} path="/store" loader={storeLoader}>
          <Route path=":current_cathegory" element={<Store></Store>}>
            <Route path=":product_id" element={<ProductPage></ProductPage>}></Route>
          </Route>
        </Route>
        {/* Gotta use protected routes for account routes, remember about that. */}
        {/* <Route path="/account" element={<Login />}></Route> */}
        {/* <Route path="/product" element={<ProductLayout />}>
        <Route path=":productName" element={<Product />}></Route>
      </Route> */}
        {/* <Route path="/about" element={<About />}></Route> */}
        <Route path="/shopping_cart" element={<ShoppingCart />} loader={shoppingCartLoader} />
        {/* <Route path="/checkout/:transactionId" element={<Checkout />} /> */}
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;

// import HostVans, { loader as hostVansLoader} from "./pages/Host/HostVans"
// import HostVanDetail, { loader as hostVanDetailLoader } from "./pages/Host/HostVanDetail"

// import { requireAuth } from "./utils"

// const router = createBrowserRouter(createRoutesFromElements(
//   <Route path="/" element={<Layout />}>
//     <Route index element={<Home />} />
//     <Route path="about" element={<About />} />
//     <Route
//       path="login"
//       element={<Login />}
//       loader={loginLoader}
//       action={loginAction}
//     />
//     <Route
//       path="vans"
//       element={<Vans />}
//       errorElement={<Error />}
//       loader={vansLoader}
//     />
//     <Route
//       path="vans/:id"
//       element={<VanDetail />}
//       errorElement={<Error />}
//       loader={vanDetailLoader}
//     />

//     <Route path="host" element={<HostLayout />}>
//       <Route
//         index
//         element={<Dashboard />}
//         loader={dashboardLoader}
//       />
//       <Route
//         path="income"
//         element={<Income />}
//         loader={async ({ request }) => await requireAuth(request)}
//       />
//       <Route
//         path="reviews"
//         element={<Reviews />}
//         loader={async ({ request }) => await requireAuth(request)}
//       />
//       <Route
//         path="vans"
//         element={<HostVans />}
//         errorElement={<Error />}
//         loader={hostVansLoader}
//       />
//       <Route
//         path="vans/:id"
//         element={<HostVanDetail />}
//         errorElement={<Error />}
//         loader={hostVanDetailLoader}
//       >
//         <Route
//           path="pricing"
//           element={<HostVanPricing />}
//           loader={async ({ request }) => await requireAuth(request)}
//         />
//         <Route
//           path="photos"
//           element={<HostVanPhotos />}
//           loader={async ({ request }) => await requireAuth(request)}
//         />
//       </Route>
// ))
