import React, { 
  ReactNode, 
  ReactElement, 
  useState, 
  useEffect} from 'react'
import {
  useFonts,
  DeliusUnicase_400Regular,
  DeliusUnicase_700Bold,
} from '@expo-google-fonts/delius-unicase';
import AppLoading from "expo-app-loading";
import { Auth, Hub } from "aws-amplify";
import { useAuth } from "@contexts/auth-context";

type AppBootstrapProps = {
  children: ReactNode;
}

export default function AppBootstrap({ children }: 
  AppBootstrapProps):
  ReactElement {
  const [fontLoaded] = useFonts({
    DeliusUnicase_400Regular,
    DeliusUnicase_700Bold
  });
  const [authLoaded, setAuthLoaded] = useState(false);
  const {setUser} = useAuth();
  useEffect(() => {
    async function checkCurrentuser() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
      } catch (error) {
        setUser(null);
        console.log(error);
      }
      setAuthLoaded(true);
    }
    checkCurrentuser();
    
    function hubListener(hubData: any) {
      const {data, event} = hubData.payload;
      switch (event) {
        case "signOut": 
          setUser(null);
          break;
        case "signIn":
          setUser(data);
          break
        default:
          break;
      }
    }

    Hub.listen("auth", hubListener);
    return() => {
      Hub.remove("auth", hubListener)
    }

  }, []);
  return fontLoaded && authLoaded ? (
    <>
      { children }
    </>
    ) : ( 
    <AppLoading />
    );
}