<script>
export let name = 'Ivan'
export let surname = 'Ivanov'
export let birthdate = '19.04.2005'

</script>

<main>
    <h1>{name.toUpperCase()} {surname.toUpperCase()}</h1>
    <p id="birthdate">Дата рождения: <br>
        {birthdate}
    </p>
    <hr>
    <p id="edit">Редактировать</p>
    <p id="delete">Удалить</p>
</main>

<style>
    main{
        width: 261px;
        border: 0.2px solid #49494931;
        border-radius: 5px;
        padding: 10px;
    }

    #edit, #delete{
        font-size: 14px;
        font-weight: 300;
        line-height: 16.59px;
    }

    #delete{
        color: gray;
        cursor: pointer;
        transition: 0.2s;
    }

    #delete:hover{
        color: red;
    }

    #edit{
        color: var(--color);
        cursor: pointer;
        margin-bottom: 3px;
    }

    h1{
        font-size: 16px;
        font-weight: 400;
        line-height: 18.96px;
        margin-bottom: 5px;
    }

    hr{
        margin: 8px 0 8px 0;
    }

    #birthdate{

        font-size: 12px;
        font-weight: 300;
        line-height: 14.22px;
    }
</style>