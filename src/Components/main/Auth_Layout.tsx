import useAuthStore from "@/stores/Auth.store";
import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect } from "react";
type Props = {
  children: JSX.Element | JSX.Element[];
  title?: string;
};
const Auth_Layout = ({ children, title }: Props) => {
  const { isLogin } = useAuthStore();
  const router = useRouter();
  useLayoutEffect(() => {
    if (!isLogin) router.push("/");
  }, [isLogin, router]);

  return <>{children}</>;
};

export default Auth_Layout;
