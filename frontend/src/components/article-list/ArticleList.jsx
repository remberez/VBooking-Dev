import { useState } from "react";
import Article from "../article/Article";
import classes from "./ArticleList.module.css";
import Button from "../../UI/main-button/Button";
import classNames from 'classnames';

function ArticleList() {
    const [articles, setArticles] = useState([
        { id: 1, title: "adawdawdaw", subtitle: "aduhawuida" },
        { id: 2, title: "adawdawdaw", subtitle: "aduhawuida" },
        { id: 3, title: "adawdawфцвфцвцфцвф цвфцвфцdaw", subtitle: "aduhawuida" },
        { id: 4, title: "adawdawdaw", subtitle: "aduhawuida" },
    ]);
    
    return (
        <section className={classNames(classes.articles, "container")}>
            <ul className={classes.articleList}>
                {
                    articles.map(articleData => (
                        <li className={classes.articleItem} key={articleData.id}>
                            <Article articleData={articleData}/>
                        </li>
                    ))
                }
            </ul>
            <Button to={'/articles'} className={classes.readMoreButton}>
                Читать больше
            </Button>
        </section>
    )
}

export default ArticleList;