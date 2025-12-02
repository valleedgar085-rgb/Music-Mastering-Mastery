
import { DrawerNavigationProp } from '@react-navigation/drawer';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  SignUp: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type ScreenNavigationProp = DrawerNavigationProp<RootStackParamList>;

