<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import axios from 'axios';

    export let checkInDate = new Date().toISOString().split('T')[0];  // Устанавливаем дату заезда на сегодня
    export let checkOutDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0];  // Устанавливаем дату выезда на 7 дней позже
    export let city = '';
    export let adults = '';
    export let width = 100
    export let type = "%"
    let availableCities = []; // Массив для хранения городов

    async function goToAboutPage(params) {
        navigate(`/search?${params}`);
    }

    async function fetchCities() {
        try {
            const response = await axios.get('http://localhost:8000/api/city/'); 
            availableCities = response.data.map(city => city.name)
        } catch (error) {
            console.error('Ошибка при получении городов:', error);
        }
    }

    onMount(() => {
        fetchCities();
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        const params = new URLSearchParams({
            city,
            adults,
            first_day: checkInDate,
            last_day: checkOutDate
        }).toString();

        try {
            await goToAboutPage(params);
            window.location.reload();
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    };
</script>

<main style="width: {width}{type};">
    <form on:submit={handleSubmit}>
        <div class="input">
            <label for="city">Курорт</label>
            <select id="city" bind:value={city} required>
                <option value="">Где хотите отдохнуть?</option>
                {#each availableCities as availableCity}
                <option value={availableCity}>{availableCity}</option>
                {/each}
            </select>
        </div>

        <div class="separator"></div>

        <div class="input">
            <label for="">Заезд</label>
            <input type="date" bind:value={checkInDate} class="date-input" />
        </div>

        <div class="separator"></div>

        <div class="input">
            <label for="">Выезд</label>
            <input type="date" bind:value={checkOutDate} class="date-input" />
        </div>
        
        <div class="separator" id="three"></div>

        <div class="input" id="colPeple">
            <label for="">Количество человек</label>
            <input type="number" bind:value={adults} placeholder="Введите количество" min="1" />
        </div>
    </form>
    <button on:click={handleSubmit} > <p id="search" >Найти</p> <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 56.966 56.966" style="enable-background:new 0 0 56.966 56.966;" xml:space="preserve"><path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23 s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92 c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17 s-17-7.626-17-17S14.61,6,23.984,6z"/></svg></button>
</main>

<style>

    button{
        width: 59px;
        height: 59px;
        border-radius: 20px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0.01px solid rgba(124, 124, 124, 0.705);
    }
    button svg{
        width: 29px;
    }

    #search{
        display: none;
    }

    main {
        background: white;
        padding-left: 10px;
        border-radius: 8px;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 1200px;
        flex-wrap: wrap;
        display: flex;
        justify-content: space-between;
    }

    .input {
        position: relative;
    }

    .input label {
        font-size: 14px;
        font-weight: 300;
        line-height: 16.59px;
        color: #808080;
        display: block;
        transition: transform 0.3s ease, color 0.3s ease;
    }

    select:focus, option:focus{
        outline: none;
        -webkit-border:none;
    }

    select {
        background-color: white;
        -webkit-appearance: none; 
        -moz-appearance: none; 
        appearance: none; 
        font-size: 14px;
        font-weight: 300;
        line-height: 16.59px;
    }

    input {
        width: 100%;
        transition: box-shadow 0.3s ease;
        color: black;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 300;
        line-height: 16.59px;
    }

    input[type="date"] {
        -webkit-appearance: initial; 
        -moz-appearance: initial; 
        background-color: white; 
    }

    input:focus {
        border-color: rgba(128, 128, 128, 0.5);
        outline: none;
    }

    option:focus{
        border-color: rgb(128, 128, 128);
        outline: none;
    }

    form {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        gap: 40px;
        padding: 5px;
    }

    .separator {
        border-left: 2px solid #cccccc5d; 
        height: 50px; 
        margin: 0 20px; 
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    @media (max-width:1101px){
        #search{
            display: block;
            color: black;
            font-size: 25px;
        }

        main{
            border-radius: 20px;
            padding: 20px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        #colPeple{
            width: 150px;
        }

        button{
            margin-top: 20px;
            width: 100%;
            display: flex;
            gap: 10px;
        }

        .separator{
            height: 2px;
            width: 100%;
            margin: 0;
            border-left: none;
            background-color: #cccccc5d; 
        }

        form{
            width: 100%;
            gap: 20px;
            align-items: start;
            flex-direction: column;
        }

        main{
            max-width: 800px;
        }
    }
</style>