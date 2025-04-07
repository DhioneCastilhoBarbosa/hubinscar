import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./pages/_layouts/auth";
import Main from "./pages/components/main/main";
import SignIn from "./pages/components/Sigin/signIn";
import Budget from "./pages/components/budget/budget";
import RegisterClient from "./pages/components/register/register";
import Partners from "./pages/components/partners/partners";
import RegisterPart from "./pages/components/register/registerInstaller";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout menuType="full" buttonVisible={true} menuVisible={true} headModel={true}/>,
    children: [
      {
        path: "",
        element: <Main />
      }
    ]
  },

  {
    path: "/signin",
    element: <AuthLayout menuType="home" buttonVisible={false} headModel={true}/>,
    children: [
      {
        path: "",
        element: <SignIn/>
      }
    ]
  },

  {
    path: "/register",
    element: <AuthLayout menuType="full" buttonVisible={true} menuVisible={true} headModel={false}/>,
    children: [
      {
        path: "",
        element: <RegisterClient/>
      }
    ]
  },

  {
    path: "/budget",
    element: <AuthLayout menuType="full" buttonVisible={true} menuVisible={true} headModel={false}/>,
    children: [
      {
        path: "",
        element: <Budget/>
      }
    ]
  },

  {
    path: "/parceiros",
    element: <AuthLayout menuType="full" buttonVisible={true} menuVisible={true} headModel={false}/>,
    children: [
      {
        path: "",
        element: <Partners/>
      }
    ]
  },
  {
    path: "/cadastro-parceiro",
    element: <AuthLayout menuType="full" buttonVisible={true} menuVisible={true} headModel={false}/>,
    children: [
      {
        path: "",
        element: <RegisterPart/>
      }
    ]
  },
]);