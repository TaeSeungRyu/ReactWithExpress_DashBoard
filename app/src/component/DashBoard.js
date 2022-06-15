import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form"
import axios from 'axios'
import { INSERT_DATA } from '../state/DataList'

/**
 * 분석용 페이지 입니다.
 */
function DashBoard() {

  const { register, handleSubmit, getValues, formState: { errors }, setError } = useForm();  //useForm을 한번 사용하여 보았습니다.
  const [askResult, setAskResult] = useState('');  //url을 요청한 뒤 결과를 담는 상태 입니다.
  const [saveBtnShow, setSaveBtnShow] = useState(false);  //결과값이 있으면 저장버튼을 보여주는 상태 입니다.

  const dispatch = useDispatch()
  const DATA_LIST = useSelector(arg => arg.CHANGE_DATA);  //저장된 데이터 목록 입니다.



  //데이터를 저장합니다.
  const saveResult = () => {
    let { url, node, type } = getValues();

    axios.post('data/insert', { url, node, type, ask_result: askResult }).then(arg => {
      let { result } = arg.data;
      if (result) {
        axios.post('data/getList', {}).then(res => {
          dispatch(INSERT_DATA({ item: JSON.parse(res.data.result) }))
        })
      }
    })
  }

  //화면 최초 로딩시 데이터를 가져옵니다.
  useEffect(() => {
    axios.post('data/getList', {}).then(arg => {
      console.log(arg)
      dispatch(INSERT_DATA({ item: JSON.parse(arg.data.result) }))
    })
  }, [dispatch])

  return (
    <div className='container'>

    </div>
  );
}

export default DashBoard;
