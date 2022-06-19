import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form"
import axios from 'axios'
import { INSERT_DATA, UPDATE_DATA } from '../state/DataList'
import '../index.css';

function DashBoard() {

  const { register, getValues, handleSubmit, formState: { errors }, setError } = useForm();  //저장관리 useForm

  const dispatch = useDispatch()
  const DATA_LIST = useSelector(arg => arg.CHANGE_DATA);  //저장된 데이터 목록 입니다.
  const [fileData, setFileData] = useState([]);  //드랍된 파일 상태 입니다.

  //#1. 리스트 데이터를 매핑하는데 사용되는 공통 함수 입니다.
  const buildList = (arg, todo) => {
    if (arg.data?.result?.length > 0) {
      let list = JSON.parse(arg.data.result);
      list.map(arg => {
        arg.file_path = JSON.parse(arg.file_path);
        return arg;
      })
      todo(list);
    }
  }

  //#2. 화면 최초 로딩시 데이터를 가져옵니다.
  useEffect(() => {
    axios.post('data/getList', {}).then(arg => {
      buildList(arg, (list) => {
        dispatch(INSERT_DATA({ item: list }));
      });
    })
  }, [dispatch])

  //#3. 파일 드래그 앤 드롭 기능 입니다.
  const dragFunction = (event, type) => {
    event.preventDefault();
    event.stopPropagation();
    if (type === 'drop') {
      const files = event?.dataTransfer?.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          files[i].uniqueId = makeid(15);
          setFileData(oldData => oldData.concat(files[i]));
        }
      }
    }
  }

  //#4. 드래그 앤 드롭으로 추가된 파일을 제거할 때 사용 합니다.
  const removeTarget = (id) => {
    setFileData([...fileData.filter(arg => arg.uniqueId !== id)]);
  }

  //#5. 데이터를 저장합니다.
  const saveResult = () => {
    let param = getValues();
    let bodyFormData = new FormData();  //FormData를 활용하여 요청합니다.
    bodyFormData.append('name', param.name);
    bodyFormData.append('desc', param.desc);

    fileData.forEach((value, idx) => {
      bodyFormData.append(`file${idx}`, value);
    })

    if (fileData.length === 0) {
      setError("file", { type: "required", shouldFocus: true, message: '파일을 넣어야 저장되어요!' });
      return;
    }

    axios({
      method: "post",
      url: "/data/insert",
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    }).then(arg => {
      let { result } = arg.data;
      if (result) {
        axios.post('data/getList', {}).then(res => {
          buildList(res, (list) => {
            dispatch(INSERT_DATA({ item: list }))
          });
        });
      }
    });
  }

  //#6. 리스트 데이터가 변경된 경우에 상태를 변경하게 합니다.
  const changeValue = (arg, event, type) => {
    dispatch(UPDATE_DATA({ idx: arg.idx, [type]: event.target.value }));
  }

  //#7. 저장된 파일을 다운로드 받습니다.
  const fileDownload = (fname, tail) => {
    axios({
      url: `/data/download/${fname}/${tail}`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fname + '' + tail);
      document.body.appendChild(link);
      link.click();
    });
  }

  //#8. 리스트에서 수정버튼 기능 입니다.
  const updateInfo = (value) => {
    let { name, desc, idx } = value;
    axios.post('data/update', { name, desc, idx }).then(arg => {
      let { result } = arg.data;
      if (result) {
        axios.post('data/getList', {}).then(res => {
          buildList(res, (list) => {
            dispatch(INSERT_DATA({ item: list }));
          });
        });
      }
    });
  }

  //#9. 리스트에서 데이터를 제거할 때 사용 합니다.
  const removeData = (idx) => {
    axios.post('data/remove', { idx }).then(arg => {
      let { result } = arg.data;
      if (result) {
        axios.post('data/getList', {}).then(res => {
          buildList(res, (list) => {
            dispatch(INSERT_DATA({ item: list }));
          });
        });
      }
    });

  }
  return (
    <div className='container'>
      {/* *데이터 저장 영역 입니다.* */}
      <form onSubmit={handleSubmit(saveResult)} className='col-md-12'>
        <input type='text' {...register('name', { required: '이름이 비어있어요' })} className='form-control half' placeholder='이름' />
        <input type='text' {...register('desc', { required: '설명이 비어있어요' })} className='form-control half' placeholder='설명' />
        <div className='clearfix'></div>
        <div className='dropArea'
          onDragOver={(event) => { return dragFunction(event, 'over'); }}
          onDrop={(event) => dragFunction(event, 'drop')}
          onDragEnter={(event) => dragFunction(event, 'enter')}
          onDragLeave={(event) => dragFunction(event, 'leave')}>
          <div>File Drop zone</div>
        </div>
        <div>
          <div>드랍된 파일 목록</div>
          <div className='dropList'>
            {fileData && fileData.length > 0 && fileData.map((arg, idx) =>
              <div key={arg.uniqueId}>
                <span>{arg.name}</span>
                <span className='remove' onClick={(evt) => { removeTarget(arg.uniqueId) }}>X</span>
              </div>
            )}
          </div>
        </div>
        <div className='text-danger'>{errors?.name && errors.name.message}</div>
        <div className='text-danger'>{errors?.desc && errors.desc.message}</div>
        <div className='text-danger'>{errors?.file && errors.file.message}</div>
        <input type='submit' className='btn btn-primary' value='전송하기' />
      </form>

      {/* *저장된 데이터 목록 영역 입니다.* */}
      <div className='clearfix'></div>
      <div className='clearfix'></div>
      <div className='col-md-12'>
        <div> 저장 목록 </div>
        <table className='table table-bordered table-sm'>
          <tbody>
            {DATA_LIST && DATA_LIST.length > 0 && DATA_LIST.map((arg) =>
              <tr key={arg.idx}>
                <td><input type='text' value={arg.name} onChange={(event) => changeValue(arg, event, 'name')} className='form-control' /></td>
                <td><input type='text' value={arg.desc} onChange={(event) => changeValue(arg, event, 'desc')} className='form-control' /></td>
                <td>
                  {arg.file_path?.length > 0 && arg.file_path.map((f, idx) =>
                    <div key={idx} className='downloader' onClick={() => fileDownload(f.filename, f.tail)}>{f.filename + f.tail}</div>)}
                </td>
                <td>
                  <input type='button' value='수정' className='btn btn-sm btn-success' onClick={() => { updateInfo(arg) }} />
                  <input type='button' value='삭제' className='btn btn-sm btn-danger' onClick={() => { removeData(arg.idx) }} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

//랜덤한 문자를 만드는 함수 입니다.
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
