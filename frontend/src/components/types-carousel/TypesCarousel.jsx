import DraggableCarousel from "../../UI/draggable-carousel/DraggableCarousel";
import classes from "./Types.module.css";

function TypesCarousel( { types, selectedType, setSelectedType, className } ) {
    return (
        <DraggableCarousel className={className}>
                {
                    types.map(value => (
                            <li 
                                key={value.id} 
                                className={selectedType === value.id ? classes.typeItem + " " + classes.active : classes.typeItem} 
                                onClick={() => setSelectedType(value.id)}
                            >
                                {value.name}
                            </li>
                        )
                    )
                }
            </DraggableCarousel>
    )
}

export default TypesCarousel;