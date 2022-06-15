import { createAction, handleActions } from 'redux-actions';

//#1. 상태 정의 
const INSERT = 'CHANGE_DATA/INSERT'


//#2. 함수 정의
export const INSERT_DATA = createAction(INSERT, arg => arg)

//#3. 상태
const DATA_STATUS = []

//#4. 리듀서  
const CHANGE_DATA = handleActions({
    [INSERT]: (state, action) => {
        return state.filter(arg => false).concat(action.payload.item) //전부 false로 제거하고 붙여줍니다.
    }
}, DATA_STATUS)

export default CHANGE_DATA

