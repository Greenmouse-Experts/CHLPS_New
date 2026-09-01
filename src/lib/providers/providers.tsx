"use client";

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { getUserFromDB } from "@/lib/storage/user_db";
import { updateUser } from "@/features/auth/reducers/user_slice";
import ApiService from "@/lib/network/api";
import { RootState, store } from "@/lib/store/store";

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const existingToken = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    if (existingToken) return;

    const hydrate = async () => {
      const users = await getUserFromDB();
      const user = users[0];
      if (!user?.token) return;
      ApiService.setTokens(user.token, user.refreshToken);
      dispatch(updateUser(user));
    };

    hydrate();
  }, [dispatch, existingToken]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydrator>{children}</AuthHydrator>
    </Provider>
  );
}
