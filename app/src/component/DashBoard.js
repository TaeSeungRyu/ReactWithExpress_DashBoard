import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form"
import axios from 'axios'
import { INSERT_DATA } from '../state/DataList'
import '../index.css';
/**
 * 분석용 페이지 입니다.
 */
function DashBoard() {

  const { register, handleSubmit, getValues, formState: { errors }, setError } = useForm();  //useForm을 한번 사용하여 보았습니다.
  const [askResult, setAskResult] = useState('');  //url을 요청한 뒤 결과를 담는 상태 입니다.


  const dispatch = useDispatch()
  const DATA_LIST = useSelector(arg => arg.CHANGE_DATA);  //저장된 데이터 목록 입니다.





  //화면 최초 로딩시 데이터를 가져옵니다.
  useEffect(() => {
    axios.post('data/getList', {}).then(arg => {
      console.log(arg)
      dispatch(INSERT_DATA({ item: JSON.parse(arg.data.result) }))
    })
  }, [dispatch])

  //
  const [fileData, setFileData] = useState([]);  //결과값이 있으면 저장버튼을 보여주는 상태 입니다.
  const dragFunction = (event, type) => {
    event.preventDefault();
    event.stopPropagation();
    if (type === 'drop') {
      const files = event?.dataTransfer?.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          //setFileData(fileData.append(i, files[i]))
          console.log(files[i])
          setFileData([...fileData, files[i]]);
        }
      }

    }
  }

  //데이터를 저장합니다.
  const saveResult = () => {
    //let { url, node, type } = getValues();

    //axios.post('data/insert', { url, node, type, ask_result: askResult }).then(arg => {
    let bodyFormData = new FormData();

    bodyFormData.append('name', ' 이름 ');
    bodyFormData.append('desc', '설명');
    fileData.forEach((value, idx) => {
      bodyFormData.append(`file${idx}`, value);
    })

    axios({
      method: "post",
      url: "/data/insert",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then(arg => {
      let { result } = arg.data;
      if (result) {
        axios.post('data/getList', {}).then(res => {
          dispatch(INSERT_DATA({ item: JSON.parse(res.data.result) }))
        })
      }
    })
  }

  return (
    <div className='container'>
      <input type='file' className='displayNone' />
      <div className='dropArea'
        onDragOver={(event) => { return dragFunction(event, 'over'); }}
        onDrop={(event) => dragFunction(event, 'drop')}
        onDragEnter={(event) => dragFunction(event, 'enter')}
        onDragLeave={(event) => dragFunction(event, 'leave')}>
        <div>Drop zone</div>
      </div>
      <div>
        <div>drop list</div>
        {fileData && fileData.length > 0 && fileData.map((arg, idx) =>
          <div key={idx}>{arg.name}</div>
        )}
      </div>
      <button type='button' className='btn btn-primary' onClick={saveResult}>전송</button>
    </div>
  );
}


function makeid(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

export default DashBoard;
