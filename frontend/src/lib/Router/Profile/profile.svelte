<script>
    import { onDestroy } from 'svelte';
    import Header from "./header.svelte";
    import Footer from "../Main/footer.svelte";
    import Cookies from 'js-cookie';
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import axios from "axios";

    import Companion from './companion.svelte';
    import AddCompanion from './addCompanion.svelte';
    import Object from './object.svelte';

    let userInfo;
    let showUserInfo = false;
    const info = JSON.parse(Cookies.get('info') || '{}');
    let { surname, name, email, phone, position, id } = info;
    let gender = 'Мужчина';
    let url = 'http://127.0.0.1:8000/api/'
    let favotitsOBJ = []

    console.log(info)

    console.log(Cookies.get('token'))

    const toggleUserInfo = () => {
        showUserInfo = !showUserInfo;
        if (userInfo) {
            userInfo.style.display = showUserInfo ? 'block' : 'none';
        }
    };

    async function getFavorites() {
        try {
            const response = await axios.get(`http://localhost:8000/api/users/${id}/get_user_favorites/`);
            favotitsOBJ = await Promise.all(response.data.map(async (object) => {
                const cityName = await fetchCityName(object.address.city);
                console.log(cityName)
                return {
                    id: object.id,
                    city: cityName || object.address.city,
                    street: object.address.street,
                    house: object.address.house,
                    seaDistance: object.address.sea_distance,
                    title: object.name,
                    description: object.description || "No description",
                    minPrice: object.min_price,
                    type: object.type,
                    images: object.images.length > 0 ? object.images.map(image => image.media) : [],
                    tags: object.tags.map(tag => tag),
                    isFavorit: true,
                };
            }));
        } catch (error) {
            console.error('Error fetching objects:', error);
        }
    }

    let selectedImage; // Переменная для хранения загруженного изображения
    async function toEditUser() {
    const updatedData = {
        email,
        phone,
        surname,
        name,
        patronymic: '',
    };

    const formData = new FormData();
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('surname', surname);
    formData.append('name', name);
    formData.append('patronymic', '');
    if (selectedImage) {
        formData.append('image', selectedImage);
    }

    try {
        
        const response = await axios.patch(`http://localhost:8000/api/users/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${Cookies.get('token')}` 
            },
        });
        if (imageUrl) {
                await setImage(imageUrl);
            }
        console.log('Данные пользователя успешно обновлены:', response.data);
    } catch (error) {
        console.error("Ошибка изменения данных пользователя:", error.response);
    }
}
    
let imageUrl

function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                imageUrl = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    async function setImage(imageUrl) {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/users/${id}/set_image/`, {
                image: imageUrl
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`, 
                }
            });
            console.log('Изображение успешно обновлено:', response.data);
        } catch (error) {
            console.error("Ошибка обновления изображения:", error.response);
        }
    }


    const handleResize = () => {
        if (userInfo) { 
            userInfo.style.display = document.body.clientWidth > 769 ? 'block' : 'none'; 
        }
    };

    async function fetchCityName(cityId) {
        try {
            const response = await axios.get(`http://localhost:8000/api/city/${cityId}/`);
            return response.data.name; 
        } catch (error) {
            console.error('Error fetching city name:', error);
            return null; 
        }
    }

    window.addEventListener('resize', handleResize);
    onDestroy(() => window.removeEventListener('resize', handleResize));
    handleResize();

    if (!Cookies.get("token")) {
        navigate("/");
        window.location.reload();
    }

    //Переключение страниц
    let activeTab = 'settingsProfile';

    if(localStorage.getItem("activeTab") !== null){
        activeTab = localStorage.getItem("activeTab")
        
    }
    const switchTab = (tab) => {
        activeTab = tab
        localStorage.setItem("activeTab",tab);
    };

    onMount(() =>{
        getFavorites()
    })
</script>

<main>
    <Header/>

    <div class="content">
        <div class="size">
            <h1 id="profileText">
                Личный кабинет
                <svg on:click={toggleUserInfo} class="menu-icon" viewBox="0 0 24 24">
                    <path d="M3 6h18M3 12h18m-7 6h7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </h1>

            <div class="user">
                <div bind:this={userInfo} class="userInfo max">
                    <p id="email">{email}</p>
                    <a id="profileEdite" on:click={() => switchTab('settingsProfile')}>Настроить профиль</a>
                    <hr id="line">
                    <div class="userChoose">
                        <p on:click={() => switchTab('bookings')} class:selected={activeTab === 'bookings'}>Мои бронирования</p>
                        <p on:click={() => switchTab('favorites')} class:selected={activeTab === 'favorites'}>Избранное</p>
                        <p on:click={() => switchTab('reviews')} class:selected={activeTab === 'reviews'} >Мои отзывы</p>
                        <p on:click={() => switchTab('history')} class:selected={activeTab === 'history'} >История отелей</p>
                    </div>
                </div>

                <div class="userSettings">
                    {#if activeTab === 'settingsProfile'}
                    <div class="addUserInfo">
                        <h1>Настройка профиля</h1>
                        <p>Введите свои данные, для автоматического заполнения при бронировании.</p>

                        <form id="settingsUser" on:submit|preventDefault={toEditUser}>
                            <div class="block">
                                <div class="input">
                                    <input type="text" bind:value={surname} id="surname" placeholder=" " required>
                                    <label for="surname">Фамилия</label>
                                </div>
                                <div class="input">
                                    <input type="text" bind:value={name} id="name" placeholder=" " required>
                                    <label for="name">Имя</label>  
                                </div>
                            </div>
                        
                            <div class="block">
                                <div class="input">
                                    <input type="date"  id="birthdate" required>
                                    <label for="birthdate">Дата рождения</label>
                                </div>
                                <div class="input">
                                    <input type="text"  id="citizenship" placeholder=" " required>
                                    <label for="citizenship">Гражданство</label>
                                </div>
                            </div>
                        
                            <label id="gender">
                                <input type="radio" bind:group={gender} value="Мужчина" checked /> Мужчина
                                <input type="radio" bind:group={gender} value="Женщина" /> Женщина
                            </label>
                        
                            <div class="block">
                                <div class="input">
                                    <input type="text" bind:value={phone} id="phone" placeholder=" " required>
                                    <label for="phone">Номер Телефона</label>
                                </div>
                                <div class="input">
                                    <input type="text" bind:value={email} id="emailInput" placeholder=" " required>
                                    <label for="emailInput">Эл Почта</label>  
                                </div>


 

                            </div>
                            <button id="save" type="submit">Сохранить</button>
                        </form>
                        <hr style="margin-bottom: 20px;">
                    </div>

                    <div class="blockAddPhoto">
                        <form>

                            <img src="{info.image}" alt="">

                            <div class="input">
                                <input type="file" on:change={handleFileUpload} accept="image/*" />
                                <label for="imageInput">Загрузить изображение</label>
                                <a on:click={setImage}>отправить фото</a>
                            </div>
                        </form>
                    </div>

                    <div class="blockCompanion">
                        <hr>
                        <div class="companions">
                            <Companion/>
                            <Companion/>
                            <AddCompanion/>
                        </div>
                    </div>

                    <div class="blockResPassword">
                        <hr>
                        <h1>Смена пароля</h1>
                        <form class="formResPassword">
                            <div class="input">
                                <input type="password" id="currentPassword" placeholder=" " required>
                                <label for="currentPassword">Текущий пароль</label>
                            </div>
                            <div class="input">
                                <input type="password" id="newPassword" placeholder=" " required>
                                <label for="newPassword">Новый пароль</label>  
                            </div>
                            <div class="input">
                                <input type="password" id="repeatNewPassword" placeholder=" " required>
                                <label for="repeatNewPassword">Повторите новый пароль</label>  
                            </div>
                            <button id="save">Изменить</button>
                        </form>
                    </div>

                    

                    
                    {:else if activeTab === 'bookings'}
                        <div>"Мои бронирования"</div>
                    {:else if activeTab === 'favorites'}
                        <div id="favorites">
                            "Избранное"
                            <hr id="line">

                            <div class="blockFavorites">
                                {#each favotitsOBJ as apartment}
                                    <Object {apartment} />
                                {/each}
                            </div>
                        </div>
                    {:else if activeTab === 'reviews'}
                        <div>"Мои отзывы"</div>
                    {:else if activeTab === 'history'}
                        <div>"История отелей"</div>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <Footer/>
</main>

<style>
    .userInfo, .userSettings {
        border-radius: 7px;
    }

    .userInfo p.selected {
        border-left: 2px var(--color) solid;
        padding-left: 13px;
        background: linear-gradient(to right, rgba(0,35,215, 0.1) 1%, transparent 100%);
    }

    .userInfo p:hover {
        color: var(--color);
    }

    #email:hover {
        color: black;
    }

    .blockAddPhoto{
        margin-top: 100px;
    }

    .blockAddPhoto a{
        background-color: aqua;
    }

    .blockFavorites{
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 20px;
        
    }

    .blockResPassword h1{
        font-size: 18px;
        font-weight: 400;
        line-height: 21.33px;
        margin: 20px 0 20px 0;
    }

    .formResPassword{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }

    .blockCompanion hr{
        margin: 20px 0 20px 0;
        flex-grow: 1;
    }

    .companions{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        
    }

    .blockResPassword hr{
        margin: 20px 0 20px 0;
    }

    .formResPassword input{
        padding: 10px;
        margin-bottom: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        width: 100%;
        max-width: 400px;
        position: relative;
        color: grey;
        font-size: 14px;
    }

    #save{
        background-color: var(--color);
        color: white;
        width: 137px;
        height: 33px;
        border-radius: 5px;
        align-self: self-start;
    }

    .user {
        display: flex;
        align-items: start;
        gap: 40px;
    }

    #gender{
        width: 100%;
        display: flex;
        gap: 10px;
        padding: 10px;
    }

    h1 > svg {
        width: 30px;
        height: 30px;
        display: none;
    }

    input[type="text"] {
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        width: 100%;
        max-width: 400px;
        position: relative;
        color: grey;
        font-size: 14px;
    }

    input[type="date"] {
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        width: 100%;
        max-width: 400px;
        position: relative;
        color: grey;
        font-size: 14px;
    }

    .block {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }

    .input {
        position: relative;
        flex-grow: 1;
        width: 100%;
    }

    .input label {
        position: absolute;
        left: 10px;
        top: 10px;
        transition: 0.2s ease all;
        color: #aaa;
        pointer-events: none;
        border-radius: 5px;
    }

    .input input:focus + label,
    .input input:not(:placeholder-shown) + label {
        top: -10px;
        left: 10px;
        font-size: 12px;
        background: white;
        color: #474747;
    }

    #settingsUser {
        display: flex;
        margin-top: 20px;
        gap: 20px;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
    }

    #email {
        font-family: Rubik;
        font-size: 16px;
        font-weight: 400;
        line-height: 18.96px;
        text-align: left;
        padding-left: 15px;
    }

    .addUserInfo h1 {
        font-family: Rubik;
        font-size: 18px;
        font-weight: 400;
        line-height: 21.33px;
        padding-bottom: 10px;
    }

    .addUserInfo p {
        font-family: Rubik;
        font-size: 14px;
        font-weight: 300;
        line-height: 16.59px;
    }

    .userSettings {
        width: 100%;
        max-width: 873px;
        height: auto;
        padding: 30px;
        background: white;
    }

    .userChoose {
        display: flex;
        flex-direction: column;
        gap: 5px;
        font-family: Rubik;
        font-size: 14px;
        font-weight: 400;
        line-height: 16.59px;
        text-align: left;
    }

    .userChoose p {
        cursor: pointer;
        user-select: none; 
        padding-left: 15px;
        padding-top: 12px;
        padding-bottom: 12px
    }

    #profileEdite {
        font-family: Rubik;
        font-size: 12px;
        font-weight: 400;
        line-height: 14.22px;
        text-align: left;
        color: var(--color);
        padding-left: 15px;
        cursor: pointer;
    }

    #line {
        margin: 10px 0 20px 0;
    }

    .userInfo {
        width: 270px;
        background: white;
        padding: 15px 0;
    }

    .size {
        width: 100%;
        max-width: 1200px;
    }

    #profileText {
        font-family: Rubik;
        font-size: 26px;
        font-weight: 500;
        line-height: 30.81px;
        padding: 20px 0;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: row;
        gap: 20px;
    }

    .content {
        display: flex;
        justify-content: center;
    }

    main {
        background: #ECEFFF;
        display: flex;
        flex-direction: column;
        min-height: 100vh; 
    }

    .content {
        flex-grow: 1;
        padding: 20px;
    }

    @media(max-width: 768px) {
        .user {
            flex-direction: column; 
            align-items: center;
        }

        .addUserInfo input[type="text"],
        .addUserInfo input[type="date"] {
            min-width: 100%;
        }

        #email {
            font-size: 14px;
        }

        .addUserInfo h1 {
            font-size: 16px;
        }

        .addUserInfo p {
            font-size: 12px;
        }
    }

    @media(max-width:566px) {
        .block {
            flex-direction: column;
        }
    }

    @media(max-width:769px) {
        h1 > svg {
            display: block;
        }

        .userInfo {
            display: none;
        }

        .user {
            align-items: start;
        }
    }
</style>