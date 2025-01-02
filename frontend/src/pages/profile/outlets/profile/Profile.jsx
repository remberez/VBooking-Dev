import { useContext, useEffect, useState } from "react";
import Input from "../../../../UI/multi-rows-placeholder-input/Input";
import classes from "./Profile.module.css";
import { Context } from "../../../../App";
import { observer } from "mobx-react-lite";
import Button from "../../../../UI/main-button/Button";
import UserService from "../../../../api/UserService";
import AvatarUpload from "../../../../components/avatar-upload/AvatarUpload";
import CustomCalendar from "../../../../UI/calendar/CustomCalendar";

function Profile() {
    const { store } = useContext(Context);
    const user = store.user;
    const [surname, setSurname] = useState("");
    const [name, setName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [citizenship, setCitizenship] = useState("");
    const [sex, setSex] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [errors, setErrors] = useState({});
    const [imageIsUpdated, setImageIsUpdated] = useState(false);
    const userId = user.id; 
    const [calendarIsActive, setCalendarIsActive] = useState();

    useEffect(() => {
        setErrors({});
        if (user) {
            setSurname(user.surname || "");
            setName(user.name || "");
            setDateOfBirth(user.date_of_birth || "");
            setCitizenship(user.citizenship_read?.name || "");
            setSex(user.sex || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
            setPatronymic(user.patronymic || "");
        }
    }, [user]);

    const handleSave = async () => {
        const updatedData = {};

        if (UserService.validateField(surname, user.surname)) updatedData.surname = surname;
        if (UserService.validateField(name, user.name)) updatedData.name = name;
        if (UserService.validateField(dateOfBirth, user.date_of_birth)) updatedData.date_of_birth = dateOfBirth;
        if (UserService.validateField(citizenship, user.citizenship_read.name)) updatedData.citizenship = citizenship;
        if (UserService.validateField(sex, user.sex)) updatedData.sex = sex;
        if (UserService.validateField(email, user.email)) updatedData.email = email;
        if (UserService.validateField(phone, user.phone)) updatedData.phone = phone;
        if (UserService.validateField(patronymic, user.patronymic)) updatedData.patronymic = patronymic;

        if (Object.keys(updatedData).length > 0) {
            try {
                const response = await UserService.changeProfileInfo(userId, updatedData);
            } catch (error) {
                console.error("Ошибка при сохранении:", error);
                if (error && error.response.data) {
                    setErrors(error.response.data);
                }
            }
        } else {
            console.log("Нет изменений для сохранения.");
        }
    };

    async function handleImageUpload(file) {
        try {
            const response = await UserService.changeProfileInfo(userId, {image: file});
            if (response.status === 200) {
                setImageIsUpdated(true);
            }
        } catch (error) {
            console.log(error)
        }
    };

    function calendarHandler(e) {
        e.preventDefault();
        setCalendarIsActive(!calendarIsActive);
    }

    function dateHandler(value) {
        const day = String(value.getDate()).padStart(2, '0');
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const year = value.getFullYear();
        setDateOfBirth(`${year}-${month}-${day}`)
        setCalendarIsActive(false);
    }

    return (
        <section className={classes.profile}>
            <h2 className={classes.title}>
                Профиль
            </h2>
            <p className={classes.subtitle}>
                Ваши данные, для автоматического заполнения при бронировании.
            </p>
            <div className={classes.avatar}>
                <AvatarUpload onImageUpload={ handleImageUpload } circleClassName={classes.circleAvatar} />
                    {
                        imageIsUpdated ?
                        <p className={`${classes.avatarDesc} ${classes.success}`}>Фото успешно загружено!</p> :
                        <p className={`${classes.avatarDesc}`}>Выберите файл на вашем компьютере и добавьте его в профиль!</p>
                    }
            </div>
            <div className={classes.sectionTitle}>
                Информация о вас
            </div>
            <div className={classes.baseInfoInputs}>
                <div className={classes.inputWrapper}>
                    <Input className={classes.input} value={surname} setValue={setSurname} error={errors.surname}>
                        <div className={classes.firstRowPlaceholder}>
                            Фамилия
                        </div>
                        <div className={classes.secondRowPlaceholder}>
                            Ivanov
                        </div>
                    </Input>
                </div>
                <div className={classes.inputWrapper}>
                    <Input className={classes.input} value={name} setValue={setName}>
                        <div className={classes.firstRowPlaceholder}>
                            Имя
                        </div>
                        <div className={classes.secondRowPlaceholder}>
                            Ivan
                        </div>
                    </Input>
                </div>
                <div className={classes.inputWrapper}>
                    <Input className={classes.input} value={patronymic} setValue={setPatronymic}>
                        <div className={classes.firstRowPlaceholder}>
                            Отчество
                        </div>
                        <div className={classes.secondRowPlaceholder}>
                            Ivanovich
                        </div>
                    </Input>
                </div>
                <div className={classes.inputWrapper}>
                    <Input className={classes.input} value={citizenship} setValue={setCitizenship}>
                        <div className={classes.firstRowPlaceholder}>
                            Гражданство
                        </div>
                        <div className={classes.secondRowPlaceholder}>
                            Russia
                        </div>
                    </Input>
                </div>
                <div className={classes.inputWrapper}>
                    <Input 
                        className={classes.input}
                        value={dateOfBirth} 
                        setValue={setDateOfBirth}
                        type="text"
                        onClick={calendarHandler}
                        readOnly
                    >
                        <div className={classes.firstRowPlaceholder}>
                            Дата рождения
                        </div>
                        <div className={classes.secondRowPlaceholder}>
                            дд.мм.ггг
                        </div>
                    </Input>
                    {
                        calendarIsActive && <CustomCalendar className={classes.calendar} onClickDay={dateHandler}/>
                    }
                </div>
            </div>
            <div className={classes.genderSelect}>
                <button 
                    className={`${classes.genderButton} ${sex === 'MAN' ? classes.active : ''}`} 
                    onClick={() => setSex('MAN')}
                >
                    Мужчина
                </button>
                <button 
                    className={`${classes.genderButton} ${sex === 'WOMAN' ? classes.active : ''}`} 
                    onClick={() => setSex('WOMAN')}
                >
                    Женщина
                </button>
            </div>
            <div className={classes.sectionTitle}>
                Ваши контакты
            </div>
            <div className={classes.contactInfoInputs}>
                <Input className={classes.input} value={phone} setValue={setPhone}>
                    <div className={classes.firstRowPlaceholder}>
                        Телефон
                    </div>
                    <div className={classes.secondRowPlaceholder}>
                        +70000000000   
                    </div>
                </Input>
                <Input className={classes.input} value={email} setValue={setEmail}>
                    <div className={classes.firstRowPlaceholder}>
                        Почта
                    </div>
                    <div className={classes.secondRowPlaceholder}>
                        user@example.com   
                    </div>
                </Input>
            </div>
            <Button className={classes.saveButton} onClick={() => handleSave()}>
                Сохранить
            </Button>
        </section>
    )
}

export default observer(Profile);
