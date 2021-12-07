import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import styled from "styled-components";
import {
    UserInfoBackground,
    UserInfoContainer,
    UserInfoHeader,
    UserInfoUpdate,
    UserInfoForm,
    UserInfoNickname,
    UserInfoPwd,
    UserInfoEditPwd,
    UserInfoChkPassword,
    UserInfoSubmitBtn,
    UserInfoSnsLogined,
    UserInfoBox,
    UserInfoLabel,
} from "./UserInfoStyle"
import CheckMsg from "../../components/utils/checkMsg"
import {conditionPassword} from "../../utils/validator"
import CheckSignMsg from '../../components/utils/checkMsg';
import InfoUpdateModal from '../../components/Modal/InfoUpdateModal'
import WithDrawalBtn from '../../components/WithDrawal/WithDrawalBtn'
import WithDrawalModal from '../../components/WithDrawal/WithDrawalModal'

function UserInfo(){
    const [curUserPw, setCurUserPw] = useState('');
    const [updatePw, setUpdatePw] = useState('')
    const [checkUpdatePw, setCheckUpdatePw] = useState(''); 
    const [curUserNickname, setCurUserNickname] = useState('');
    const [fixUserName, setFixUserName] = useState('')
    const [sucUpdate, setSucUpdate] = useState(true);
    const [showUpdateModal, setShowUpdateModal] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [showWithDrawal, setShowWithDrawal] = useState(Boolean);

    const [validPw, setValidPw] = useState(false); // 유효성(문자, 숫자, 특수문자 각 하나씩)
    const [samePw, setSamePw] = useState(false); // 비번 확인용

    const userData =  useSelector(state => state.isLoginReducer.accessToken)

    useEffect(() => {
        console.log("useEffect get request")
        /*const curUser = window.sessionStorage.getItem('email');*/
        // 로딩 넣으면 좋을듯
        // console.log(userData)
        axios.get('http://localhost:80/mypage/users', {headers : {authorization: `Bearer ${userData}`}})
            .then(res => {
                setCurUserNickname(res.data.data.userName)
            })
            .catch(err => {

            })

    }, [])

    useEffect(() => {
        if(!conditionPassword(updatePw)){
            setValidPw(false);
        }else{
            setValidPw(true);
        }
        if(updatePw !== checkUpdatePw){
            setSamePw(false);
        }else{
            setSamePw(true);
        }
    }, [validPw, updatePw, checkUpdatePw, samePw])

    useEffect(() => { // disabled 조건문인데 확인 잘하자 이걸로 함수 실행하자 근데 이게 최선인가
        if(curUserPw){
            if(fixUserName && !validPw && samePw){
                setButtonDisabled(false)
            }else if(validPw && samePw){
                setButtonDisabled(false)
            }else if(fixUserName && validPw && samePw){
                setButtonDisabled(false)
            }else{
                setButtonDisabled(true)
            }
        }else{
            setButtonDisabled(true)
        }
    }, [curUserPw, fixUserName, validPw, samePw])
    function userPwInfo(e){
        setCurUserPw(e.target.value)
    }
    function chagePwInfo(e){
        setUpdatePw(e.target.value)
    }
    function checkChagePwInfo(e){
        setCheckUpdatePw(e.target.value)
    }
    function changeNickName(e){
        setFixUserName(e.target.value)
    }
    useEffect(() => {
        
    },[fixUserName, curUserPw, updatePw, checkUpdatePw])

    function updateInfoRequest(e){
        e.preventDefault()
        const userData2 = {userName: fixUserName, editPassword: updatePw, password: curUserPw}

        axios.patch('http://localhost:80/mypage/users',userData2,{headers: {authorization: `Bearer ${userData}`, withCredentials : true}})
            .then(res => {
                console.log(res)
                setSucUpdate(true)
                setShowUpdateModal(true)
                setCurUserNickname(fixUserName)
                setCurUserPw('')
                setUpdatePw('')
                setCheckUpdatePw('')
                setFixUserName('')
                console.log(curUserPw)
            })
            .catch(err => {
                setSucUpdate(false)
                setShowUpdateModal(true)
            })
    }

    return(
        <UserInfoBackground>
            <UserInfoContainer>
                <UserInfoHeader>
                    <h2>{curUserNickname}님</h2>
                    <WithDrawalBtn setShowWithDrawal={setShowWithDrawal}/>
                </UserInfoHeader>
                <UserInfoUpdate>
                    <UserInfoForm onSubmit={(e) => updateInfoRequest(e)}>
                        <UserInfoBox>
                            <UserInfoLabel htmlFor="nickName">변경 할 닉네임</UserInfoLabel>
                            <UserInfoNickname onChange={(e) => changeNickName(e)} value={fixUserName || ''}/>
                        </UserInfoBox>
                        <UserInfoBox>
                            <UserInfoLabel htmlFor="curPassword">현재 비밀번호 입력</UserInfoLabel >
                            <UserInfoPwd autocomplete="current-password" onChange={(e) => userPwInfo(e)} value={ curUserPw || ''}/>
                        </UserInfoBox>
                        <UserInfoBox>
                            <UserInfoLabel htmlFor="changePassword">새 비밀번호 입력</UserInfoLabel>
                            {/* 필수 아님 */}
                            <UserInfoEditPwd autocomplete="new-password" onChange={(e) => chagePwInfo(e)} value={ updatePw || ''}/>
                        </UserInfoBox>
                        {!validPw ? <CheckSignMsg message={'숫자, 영문, 특수문자 각 1자리 이상의 8~16 자리'} /> : null}
                        <UserInfoBox>
                            <UserInfoLabel htmlFor="checkPassword">새 비밀번호</UserInfoLabel>
                            <UserInfoChkPassword onChange={(e) => checkChagePwInfo(e)} value={ checkUpdatePw || ''}/>
                        </UserInfoBox>
                        {!samePw ? <CheckSignMsg message={'비밀번호가 일치하지 않습니다.'} /> : null}
                        <UserInfoSubmitBtn disabled={buttonDisabled}>
                            변경하기
                        </UserInfoSubmitBtn>
                    </UserInfoForm>
                </UserInfoUpdate>
                <UserInfoSnsLogined></UserInfoSnsLogined>
            </UserInfoContainer>
            {showUpdateModal ? <InfoUpdateModal setShowUpdateModal={setShowUpdateModal} showUpdateModal={showUpdateModal} sucUpdate={sucUpdate} /> : null}
            {showWithDrawal ? <WithDrawalModal setShowWithDrawal={setShowWithDrawal} /> : null}
        </UserInfoBackground>
    )

}

export default UserInfo;