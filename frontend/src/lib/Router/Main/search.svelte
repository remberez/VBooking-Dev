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

<main>
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
    <button on:click={handleSubmit} > <p id="search" >Поиск</p></button>
</main>

<style>

    button{
        border-radius: 15px;
        padding: 0 20px;
        font-size: 20px;
        font-weight: 400;
        color: rgb(172, 172, 172);
        box-shadow: -1px 0px 5px rgba(0,35,215, 0.2);
    }

    button:hover {
        background-color: #eaedff;
        cursor: pointer;
    }

    main {
        overflow: hidden;
        background: white;
        border-radius: 8px;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 1200px;
        flex-wrap: wrap;
        display: flex;
        justify-content: flex-start;
    }

    .input {
        position: relative;
        padding: 15px 80px 15px 20px;
    }

    .input,
    .input *,
    button {
        transition: background-color 0.2s ease;
    }

    .input:hover,
    .input:hover * {
        background-color: #eaedff;
        cursor: pointer;
    }

    .input label {
        font-size: 14px;
        font-weight: 300;
        line-height: 16.59px;
        color: #808080;
        display: block;
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
        align-items: center;
        flex-wrap: wrap;
    }

    .separator {
        border-left: 2px solid #eaedff; 
        height: 70%; 
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
        main{
            border-radius: 20px;
            align-items: flex-start;
        }

        button{
            width: 100%;
            padding-top: 20px;
            padding-bottom: 20px;
        }

        .separator{
            height: 2px;
            width: 100%;
            margin: 0;
            border-left: none;
            background-color: #cccccc5d; 
        }

        main{
            max-width: 800px;
        }

        .input {
            width: 100%;
            padding-top: 20px;
            padding-bottom: 20px;
        }
    }
</style>