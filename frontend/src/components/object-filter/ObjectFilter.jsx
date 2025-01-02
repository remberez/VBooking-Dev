import { useEffect, useState } from "react";
import classes from "./ObjectFilter.module.css";
import TagsService from "../../api/tagsService";
import Button from "../../UI/main-button/Button";

function ObjectFilter({ turnContainer, containerIsActive }) {
    const [tagsList, setTagsList] = useState({});

    useEffect(() => {
        async function fetchTags() {
            const tagsData = await TagsService.getTags();

            const groupedTags = tagsData.reduce((acc, tag) => {
                if (!acc[tag.type]) {
                    acc[tag.type] = [];
                }
                acc[tag.type].push(tag.title);
                return acc;
            }, {});

            setTagsList(groupedTags);
        }
        fetchTags()
    }, [])

    const [checkedTags, setCheckedTags] = useState({});

    const handleCheckboxChange = (type, value) => {
        setCheckedTags(prevState => ({
            ...prevState,
            [type]: {
                ...prevState[type],
                [value]: !prevState[type]?.[value]
            }
        }));
    };

    return (
        <aside className={classes.filter}>
            <div className={classes.map}>
                <Button onClick={(() => turnContainer(!containerIsActive))}>
                    Показать на карте
                </Button>
            </div>
            {
                Object.entries(tagsList).map(
                    ([type, tags]) => (
                        <div className={classes.tag} key={type}>
                            <strong className={classes.tagType}> { type } </strong>
                            <ul className={classes.tagsList}>
                                {
                                    tags.map(
                                        value => (
                                            <li key={value} className={classes.tagItem}>
                                                <label className={classes.checkboxContainer}>
                                                    <input 
                                                        type="checkbox" 
                                                        className={classes.checkbox} 
                                                        checked={checkedTags[type]?.[value] || false} // Проверяем состояние
                                                        onChange={() => handleCheckboxChange(type, value)} // Обработчик изменения
                                                    />
                                                    <span className={classes.checkmark}></span>
                                                    { value }
                                                </label>
                                            </li>
                                        )
                                    )
                                }
                            </ul>
                        </div>
                    )   
                )
            }
        </aside>
    )
}

export default ObjectFilter;