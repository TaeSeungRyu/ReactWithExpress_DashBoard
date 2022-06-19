import { createAction, handleActions } from 'redux-actions';

//#1. 상태 정의 
const INSERT = 'CHANGE_DATA/INSERT'
const UPDATE = 'CHANGE_DATA/UPDATE'

//#2. 함수 정의
export const INSERT_DATA = createAction(INSERT, arg => arg);
export const UPDATE_DATA = createAction(UPDATE, arg => arg);

//#3. 상태
const DATA_STATUS = []

//#4. 리듀서  
const CHANGE_DATA = handleActions({
    [INSERT]: (state, action) => {
        return state.filter(arg => false).concat(action.payload.item) //전부 false로 제거하고 붙여줍니다.
    },
    [UPDATE]: (state, action) => {  //변경된 데이터를 교체하여 줍니다.
        return state.map(arg => {
            if (arg.idx === action.payload.idx) {
                arg = { ...arg, ...action.payload };
            }
            return arg
        });
    }
}, DATA_STATUS)

export default CHANGE_DATA

