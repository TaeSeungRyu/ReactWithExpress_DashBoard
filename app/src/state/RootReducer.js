import { combineReducers } from 'redux';

import CHANGE_DATA from './DataList';

//2개의 리듀서를 담당 하는 메인 리듀서입니다.
const root = combineReducers({
  CHANGE_DATA
});

export default root