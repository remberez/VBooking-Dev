import classes from "./Article.module.css";

function Article( { articleData } ) {
    return (
        <div className={classes.article}>
            <img

                src="https://cdnn21.img.ria.ru/images/07e8/09/1b/1975130969_0:160:3072:1888_480x0_80_0_0_0d6d60f40a6f0a780d97ab2c6da8e63c.jpg.webp"
                loading="lazy"
                className={classes.image}
                alt={`Изображение статьи ${articleData.name}`}
            />
            <h3 className={classes.title}>
                { articleData.title }
            </h3>
            <p className={classes.subtitle}>
                { articleData.subtitle }
            </p>
        </div>
    )
}

export default Article;