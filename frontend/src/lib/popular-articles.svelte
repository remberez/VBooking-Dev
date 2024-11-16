<script>
    import NewsBlock from "./news-block.svelte";
</script>

<main>
    <h1 class="animate__animated wow animate__fadeInUp">Полезные статьи</h1>

    <section class="horizontal-scroll">
        <NewsBlock hrefs="https://www.wikihow.com/images/thumb/a/a2/Include-CSS-Within-HTML-Web-Pages-Step-6.jpg/aid4377690-v4-728px-Include-CSS-Within-HTML-Web-Pages-Step-6.jpg.webp"/>
        <NewsBlock hrefs="https://www.wikihow.com/images/thumb/a/a2/Include-CSS-Within-HTML-Web-Pages-Step-6.jpg/aid4377690-v4-728px-Include-CSS-Within-HTML-Web-Pages-Step-6.jpg.webp"/>
        <NewsBlock hrefs="https://www.wikihow.com/images/thumb/a/a2/Include-CSS-Within-HTML-Web-Pages-Step-6.jpg/aid4377690-v4-728px-Include-CSS-Within-HTML-Web-Pages-Step-6.jpg.webp"/>
        <NewsBlock hrefs="https://www.wikihow.com/images/thumb/a/a2/Include-CSS-Within-HTML-Web-Pages-Step-6.jpg/aid4377690-v4-728px-Include-CSS-Within-HTML-Web-Pages-Step-6.jpg.webp"/>
    </section>

    <a class="animate__animated wow animate__fadeInUp" href="">Читать больше</a>
</main>

<style>
    section {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        padding: 10px 0; 
        justify-content: center;
        align-items: center;

    }

    a:hover {
        background-color: var(--colorHover);
    }

    a {
        margin-top: 30px;
        width: 235px;
        height: 41px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        background: var(--color);
        color: white;
        font-family: Rubik;
        font-size: 20px;
        font-weight: 500;
        line-height: 23.7px;
        transition: 0.3s;
        margin-left: 10px;
    }

    h1 {
        font-family: Rubik;
        font-size: 32px;
        font-weight: 500;
        line-height: 37.92px;
        margin: 20px 0;
    }

    main {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
</style>