import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./components/Layout";
import "./style/App.css";
// import Checkout from "./pages/Checkout";
import Home, { homeLoader } from "./pages/Home";
import StoreLayout, { storeLoader } from "./pages/store/StoreLayout";
// import ShoppingCart from "./pages/ShoppingCart";
import NotFound from ".//pages/NotFound";
//   Link
import ProductPage from "./pages/store/ProductPage";

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
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} loader={homeLoader}></Route>
        <Route element={<StoreLayout />} path="/store" loader={storeLoader}>
          {/* <Route index element={<Store />}></Route> */}
          {/* <Route path="./" element={<StoreAside></StoreAside>}></Route> */}
          <Route
            path=":productId"
            element={<ProductPage></ProductPage>}
          ></Route>
        </Route>
        {/* Gotta use protected routes for account routes, remember about that. */}
        {/* <Route path="/account" element={<Login />}></Route> */}
        {/* <Route path="/product" element={<ProductLayout />}>
        <Route path=":productName" element={<Product />}></Route>
      </Route> */}
        {/* <Route path="/about" element={<About />}></Route> */}
        {/* <Route path="/shopping_cart" element={<ShoppingCart />} />
      <Route path="/checkout" element={<Checkout />} /> */}
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
