import React from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import classes from "./YandexMap.module.css";

const YandexMap = ({ objectsList }) => {
    const mapState = {
        center: [55.751574, 37.573856], // Координаты центра карты
        zoom: 10,
    };

    return (
        <YMaps query={{ apikey: "62f4f660-7f0b-4409-b4f5-978aedab83e4" }}>
            <Map state={mapState} style={{ width: '100%', height: '400px' }} className={classes.map}>
                <Placemark
                    modules={
                        ['geoObject.addon.balloon', 'geoObject.addon.hint']
                    } 
                    geometry={[55.751574, 37.573856]}
                    properties={{
                        balloonContent: "FfFfFfF", // Текст для балуна
                        hintContent: 'Нажмите, чтобы узнать больше', // Подсказка
                        balloonContentHeader: "WADAWDAWDAW",
                        iconContent: "adwadwa"
                    }}
                    options={{
                        iconLayout: 'default#image',
                        iconImageHref: '../../i', // URL вашей иконки
                        iconImageSize: [30, 42], // Размер иконки
                        iconImageOffset: [-15, -42], // Смещение иконки
                    }}
                    onClick={() => {
                        console.log('Плейсмарк нажат');
                    }}
                />
                {
                    objectsList.map(
                        value => (
                            <Placemark
                                modules={
                                    ['geoObject.addon.balloon', 'geoObject.addon.hint']
                                }
                                geometry={[value.address.longitude, value.address.latitude]}
                                properties={{
                                    balloonContent: value.name
                                }}
                            />
                        ), []
                    )
                }
            </Map>
        </YMaps>
    );
};

export default YandexMap;