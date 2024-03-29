import React, {useCallback, useEffect, useState} from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './src/pages/Home';
import Register from './src/pages/Register';
import Settings from './src/pages/Settings';
import Search from './src/pages/Search2';
import SearchResult from './src/pages/SearchResult';
import AlarmSetting from './src/pages/AlarmSetting';
import MyPage from './src/pages/MyPage';
import BasketSetting from './src/pages/BasketSetting';
import TrashCan from './src/pages/TrashCan';
import Alarm from './src/pages/Alarm';
import BasketDetail from './src/pages/BasketDetail';
import * as RootNavigation from './RootNavigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';
import Login from './src/pages/Login';
import RegisterModal from './src/pages/RegisterModal';
import EncryptedStorage from 'react-native-encrypted-storage';
import HeaderRight from './src/components/HeaderRight';
import BasketSettingDetail from './src/pages/BasketSettingDetail';
import Barcode from './src/pages/Barcode';
import SplashScreen from 'react-native-splash-screen';
import KakaoSDK from '@actbase/react-kakaosdk';
import Config from 'react-native-config';
import {LoginApiInstance, setJwtToken} from './src/api/instance';
import userSlice from './src/slices/user';
import {useAppDispatch} from './src/store';
import BasketInvite from './src/pages/BasketInvite';
import Manual from './src/pages/Manual';
import Manual2 from './src/pages/Manual2';
import Manual3 from './src/pages/Manual3';
import ItemList from './src/pages/ItemList';
import ItemDetail from './src/pages/ItemDetail';
import ItemModify from './src/pages/ItemModify';
import ReceiptRegister from './src/pages/ReceiptRegister';
import RegisterList from './src/pages/RegisterList';
import {getProfile, sendFCMKey} from './src/api/user';
import messaging from '@react-native-firebase/messaging';

export type RootStackParamList = {
  SignIn: undefined;
  Login: undefined;
  Home: undefined;
  Search: undefined;
  Settings: undefined;
  Register: undefined | Object;
  RegisterList: undefined | Object;
  SignUp: undefined;
  AlarmSetting: undefined;
  MyPage: undefined;
  Alarm: undefined;
  TrashCan: undefined;
  BasketSetting: undefined;
  ItemDetail: Object;
  ItemList: undefined;
  ItemModify: Object;
  RegisterModal: undefined;
  Barcode: undefined;
  Manual: undefined;
  Manual2: undefined;
  Manual3: undefined;
  ReceiptRegister: Object;
};

function AppInner() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isLogin = useSelector((state: RootState) => !!state.user.accessToken);
  // const isLogin = false;
  // const [isLogin, setIsLogin] = useState(false);
  const back = useCallback(() => {
    RootNavigation.pop();
  }, []);
  const Tab = createBottomTabNavigator();

  useEffect(() => {
    const init = async () => {
      try {
        const token = (await EncryptedStorage.getItem('accessToken')) as string;
        console.log(token);
        setJwtToken(token);
        console.log(token, 'token 확인!!!!!!!!!!!');
        if (!token) {
          SplashScreen.hide();
          return;
        }
        const res = await getProfile();
        console.log(res, 'userInfo');
        const user = {name: res.name, email: res.email, accessToken: token};
        const alramSetting = await EncryptedStorage.getItem('hour');
        console.log('초기', alramSetting);
        if (alramSetting === null) {
          await EncryptedStorage.setItem('hour', '9');
          await EncryptedStorage.setItem('min', '0');
        }
        dispatch(userSlice.actions.setUser(user));
      } catch (e) {
        console.log(e);
      }
    };
    init();
  }, [dispatch, navigation]);

  useEffect(() => {
    async function sendToken() {
      try {
        if (!messaging().isDeviceRegisteredForRemoteMessages) {
          await messaging().registerDeviceForRemoteMessages();
        }
        const token = await messaging().getToken();
        console.log('phone token', token);
        const res = await sendFCMKey(token);
      } catch (error) {
        console.error(error);
      }
    }
    sendToken();
  }, []);

  function BottomTab() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="ItemList"
          component={ItemList}
          options={{
            title: '홈',
            tabBarActiveTintColor: '#0094FF',
            headerShown: false,
            headerTitle: '',
            tabBarIcon: ({focused}) => (
              <AntDesign
                name="home"
                size={20}
                style={{color: focused ? '#0094FF' : '#757575'}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="alarm"
          component={Alarm}
          options={{
            title: '알림',
            tabBarActiveTintColor: '#0094FF',
            headerShown: false,
            unmountOnBlur: true,
            tabBarIcon: ({focused}) => (
              <AntDesign
                name="bells"
                size={20}
                style={{color: focused ? '#0094FF' : '#757575'}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="RegisterModal"
          component={RegisterModal}
          options={{
            title: '등록',
            tabBarActiveTintColor: '#0094FF',
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <AntDesign
                name="inbox"
                size={20}
                style={{color: focused ? '#0094FF' : '#757575'}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            title: '검색',
            tabBarActiveTintColor: '#0094FF',
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <AntDesign
                name="search1"
                size={20}
                style={{color: focused ? '#0094FF' : '#757575'}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            title: '설정',
            tabBarActiveTintColor: '#0094FF',
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <AntDesign
                name="ellipsis1"
                size={20}
                style={{color: focused ? '#0094FF' : '#757575'}}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
  const Stack = createNativeStackNavigator();
  return isLogin ? (
    <Stack.Navigator>
      <Stack.Screen
        name="BottomTab"
        component={BottomTab}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetail}
        options={{
          title: '상세 보기',
          headerShown: true,
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold',
          },
        }}
      />
      <Stack.Screen
        name="ReceiptRegister"
        component={ReceiptRegister}
        options={{
          title: '영수증 등록',
          headerShown: true,
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold',
          },
        }}
      />
      <Stack.Screen
        name="RegisterList"
        component={RegisterList}
        options={{
          title: '영수증 아이템 등록',
          headerShown: true,
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold',
          },
        }}
      />
      <Stack.Screen
        name="ItemModify"
        component={ItemModify}
        options={{
          title: '수정',
          headerShown: true,
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold',
          },
        }}
      />
      <Stack.Screen
        name="SearchResult"
        component={SearchResult}
        options={{
          headerShown: true,
          headerTitle: '검색 결과',
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold',
          },
        }}
      />
      <Stack.Screen
        name="AlarmSetting"
        component={AlarmSetting}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="MyPage"
        component={MyPage}
        options={{
          headerShown: true,
          headerTitle: '내 정보',
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold',
          },
        }}
      />
      <Stack.Screen
        name="BasketSetting"
        component={BasketSetting}
        options={{
          headerShown: true,
          headerTitle: '바구니 관리',
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold',
          },
        }}
      />
      <Stack.Screen
        name="BasketSettingDetail"
        component={BasketSettingDetail}
        options={{
          headerShown: true,
          headerTitle: '바구니 상세',
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold',
          },
        }}
      />
      <Stack.Screen
        name="TrashCan"
        component={TrashCan}
        options={{
          headerShown: true,
          headerTitle: '휴지통',
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold',
          },
        }}
      />
      <Stack.Screen
        name="Alarm"
        component={Alarm}
        options={{
          title: '알림',
          headerLeft: () => (
            <AntDesign
              name="left"
              size={20}
              style={style.topBarIcon}
              onPress={back}
            />
          ),
          headerShown: true,
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold',
          },
        }}
      />
      <Stack.Screen
        name="BasketDetail"
        component={BasketDetail}
        options={{
          headerShown: true,
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold',
          },
        }}
      />
      <Stack.Screen
        name="BasketInvite"
        component={BasketInvite}
        options={{
          headerShown: true,
          headerTitle: '바구니 멤버초대',
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold',
          },
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: true,
          headerTitle: '제품 등록',
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold',
          },
        }}
      />
      <Stack.Screen
        name="Barcode"
        component={Barcode}
        options={{
          title: '바코드로 등록',
          headerShown: true,
          headerTitleStyle: {
            fontFamily: 'Pretendard-Bold',
          },
        }}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="Manual"
        component={Manual}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Manual2"
        component={Manual2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Manual3"
        component={Manual3}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

const style = StyleSheet.create({
  tinyLogo: {
    width: 40,
    height: 40,
  },
  tinyLogoLeft: {
    width: 40,
    height: 40,
    marginLeft: 240,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBarIcon: {
    color: 'black',
  },
});

export default AppInner;
