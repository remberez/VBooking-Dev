import { Link } from "react-router-dom";
import Button from "../../UI/main-button/Button";
import ImageInput from "../../UI/input-with-image/ImageInput";
import ModalWindow from "../modal-window/ModalWindow";
import classes from "./RegisterModalWindow.module.css";
import { useContext, useState } from "react";
import { Context } from "../../App";

function RegisterModalWindow( { isOpen, onClose} ) {
    const {store} = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");

    async function login(e) {
        e.preventDefault();
        const response = await store.login(email, password);

        if (response.status / 100 === 2) {
            onClose();
        } else if (response.status === 401) {
            setAuthError("Неверный логин или пароль")
        }
    }

    return (
        <ModalWindow 
            isOpen={isOpen} 
            onClose={onClose}
        >       <div className={classes.content}>
                    <div className={classes.title}>
                        Авторизация
                    </div>
                    <div className={classes.subtitle}>
                        Нет аккаунта? <button type="button" className={classes.regButton} onClick={onClose}>Зарегистрируйтесь</button>
                    </div>
                    <form className={classes.regForm}>
                        <label htmlFor="email" className="visually-hidden">Электронная почта</label>
                        <ImageInput 
                            type="email" 
                            className={classes.input} 
                            name="email" 
                            placeholder={"Почта"} 
                            image={"user"}
                            value={email}
                            id={"email"}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <label htmlFor="password" className="visually-hidden">Пароль</label>
                        <ImageInput 
                            type="password" 
                            className={classes.input} 
                            name="password" 
                            id={"password"} 
                            placeholder={"Пароль "}
                            image={"lock"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Button 
                            type="submit" 
                            className={classes.submitButton} 
                            color={"blue"}
                            onClick={login}
                        >
                                Войти
                        </Button>
                    </form>
                    <div className={classes.authError}>
                        { authError }
                    </div>
                </div>
                <div className={classes.resetPass}>
                        Забыли пароль? <Link className={classes.resetLink}>Восстановить</Link>
                </div>
        </ModalWindow>
    )
}

export default RegisterModalWindow;