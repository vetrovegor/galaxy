import React, { useState } from "react"
import "./Auth.scss";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useMutation } from "react-query";
import useUserStore from "../../stores/userStore";
import Layout from "../Layout/Layout";

const Auth = () => {
    const login = useUserStore((state) => state.login);

    const [isLogin, setIsLogin] = useState(true);

    const [loginData, setLoginData] = useState({
        nickname: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        nickname: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const { mutate: loginMutate, isLoading: loginIsLoading } = useMutation({
        mutationKey: ['login'],
        mutationFn: () => authService.login(loginData.nickname, loginData.password),
        onSuccess(data) {
            if (data) {
                login(data.user);
                localStorage.setItem('accessToken', data.accessToken);
                navigate('/');
            }
        }
    });

    const { mutate: registerMutate, isLoading: registerIsLoading } = useMutation({
        mutationKey: ['register'],
        mutationFn: () => authService.register(registerData.nickname, registerData.email, registerData.password),
        onSuccess(data) {
            if (data) {
                login(data.user);
                navigate('/');
            }
        }
    });

    return (
        <Layout>
            <div className="auth">
                {isLogin
                    ? <div className="auth__form">
                        <h1 className="title">Вход</h1>
                        <div className="inputs">
                            <div className="input-wrapper">
                                <p className="placeholder">Никнейм</p>
                                <input
                                    type="text"
                                    placeholder="Никнейм"
                                    className="input"
                                    minLength={3}
                                    maxLength={24}
                                    required
                                    value={loginData.nickname}
                                    onChange={(e) => setLoginData(prev => {
                                        return {
                                            ...prev,
                                            nickname: e.target.value
                                        }
                                    })}
                                />
                            </div>
                            <div className="input-wrapper">
                                <p className="placeholder">Пароль</p>
                                <input
                                    type="password"
                                    placeholder="Пароль"
                                    className="input"
                                    minLength={4}
                                    maxLength={16}
                                    required
                                    value={loginData.password}
                                    onChange={(e) => setLoginData(prev => {
                                        return {
                                            ...prev,
                                            password: e.target.value
                                        }
                                    })}
                                />
                            </div>
                        </div>
                        <button onClick={loginMutate} className={`btn auth__btn${loginIsLoading ? " disabled" : ""}`}>Вход</button>
                        <div className="auth__text item">
                            Нет аккаунта?
                            <button onClick={() => setIsLogin(false)} className="auth__text-btn main-color">Регистрация</button>
                        </div>
                    </div>
                    : <div className="auth__form">
                        <h1 className="title">Регистрация</h1>
                        <div className="auth__inputs">
                            <div className="input-wrapper">
                                <p className="placeholder">Никнейм</p>
                                <input
                                    type="text"
                                    placeholder="Никнейм"
                                    className="input"
                                    minLength={3}
                                    maxLength={24}
                                    required
                                    value={registerData.nickname}
                                    onChange={(e) => setRegisterData(prev => {
                                        return {
                                            ...prev,
                                            nickname: e.target.value
                                        }
                                    })}
                                />
                            </div>
                            <div className="input-wrapper">
                                <p className="placeholder">Почта</p>
                                <input
                                    type="email"
                                    placeholder="Почта"
                                    className="input"
                                    required
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData(prev => {
                                        return {
                                            ...prev,
                                            email: e.target.value
                                        }
                                    })}
                                />
                            </div>
                            <div className="input-wrapper">
                                <p className="placeholder">Пароль</p>
                                <input
                                    type="password"
                                    placeholder="Пароль"
                                    className="input"
                                    minLength={4}
                                    maxLength={16}
                                    required
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData(prev => {
                                        return {
                                            ...prev,
                                            password: e.target.value
                                        }
                                    })}
                                />
                            </div>
                        </div>
                        <button onClick={registerMutate} className={`btn auth__btn${registerIsLoading ? " disabled" : ""}`}>Регистрация</button>
                        <div className="auth__text item">
                            Есть аккаунт?
                            <button onClick={() => setIsLogin(true)} className="auth__text-btn main-color">Вход</button>
                        </div>
                    </div>
                }
            </div>
        </Layout>
    )
};

export default Auth;