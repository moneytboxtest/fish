import { useNavigate } from "react-router-dom"


export function GameMenuButton(){

    const navigate = useNavigate();


    return (
        <div className="absolute bottom-6 right-6 z-30 flex gap-6">
            <button
                type="button"
                onClick={() => navigate('/game')}
                className="relative flex items-center justify-start"
                aria-label="Перейти в игру"
            >
                <img
                    className="h-[70px] w-[180px] object-contain"
                    src="background/but1.png"
                    alt="Кнопка игры"
                />
                <img
                    className="absolute left-3 bottom-1/3 h-12 w-12 object-contain"
                    src="удочки/1.png"
                    alt="Удочка"
                />
                <span className="absolute right-8 top-1/3 text-xl font-bold text-white drop-shadow-md">
                    Игра
                </span>
            </button>
            <button
                type="button"
                onClick={() => navigate('/tourn')}
                className="relative flex items-center justify-start"
                aria-label="Перейти в турниры"
            >
                <img
                    className="h-[70px] w-[180px] object-contain"
                    src="background/but1.png"
                    alt="Кнопка турниров"
                />
                <img
                    className="absolute left-3 bottom-1/3 h-10 w-10 object-contain"
                    src="иконки/7.png"
                    alt="Кубок"
                />
                <span className="absolute right-6 top-1/3 text-xl font-bold text-white drop-shadow-md">
                    Турниры
                </span>
            </button>
        </div>
    )
}