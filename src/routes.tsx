import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./pages/_layouts/auth";
import Main from "./pages/components/main/main";
import SignIn from "./pages/components/Sigin/signIn";
import Register from "./pages/components/register/register";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout menuType="full" buttonVisible={true} menuVisible={true}/>,
    children: [
      {
        path: "/",
        element: <Main />
      }
    ]
  },

  {
    path: "/",
    element: <AuthLayout menuType="home" buttonVisible={false}/>,
    children: [
      {
        path: "/signin",
        element: <SignIn/>
      }
    ]
  },

  {
    path: "/",
    element: <AuthLayout menuType="full" buttonVisible={true} menuVisible={false}/>,
    children: [
      {
        path: "/register",
        element: <Register/>
      }
    ]
  },


])