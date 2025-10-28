import { useNavigate } from "react-router-dom"


export function LeftMenuButton(){

    const navigate = useNavigate();


    return (
        <div className="absolute left-6 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-4">
            <button
                type="button"
                onClick={() => navigate('/shop')}
                className="relative flex flex-col items-center"
            >
                <img
                    className="h-20 w-20 object-contain"
                    src="background/box.png"
                    alt="Фон кнопки"
                />
                <img
                    className="absolute top-2 h-10 w-10 object-contain"
                    src="иконки/9.png"
                    alt="Магазин"
                />
                <span className="absolute bottom-2 text-xs font-semibold uppercase tracking-wide text-black">
                    Магазин
                </span>
            </button>
            <button
                type="button"
                onClick={() => navigate('/sellmenu')}
                className="relative flex flex-col items-center"
            >
                <img
                    className="h-20 w-20 object-contain"
                    src="background/box.png"
                    alt="Фон кнопки"
                />
                <img
                    className="absolute top-2 h-10 w-10 object-contain"
                    src="иконки/8.png"
                    alt="Скупка"
                />
                <span className="absolute bottom-2 text-xs font-semibold uppercase tracking-wide text-black">
                    Скупка
                </span>
            </button>
            <button
                type="button"
                onClick={() => navigate('/quickquest')}
                className="relative flex flex-col items-center"
            >
                <img
                    className="h-20 w-20 object-contain"
                    src="background/box.png"
                    alt="Фон кнопки"
                />
                <img
                    className="absolute top-4 h-10 w-10 object-contain"
                    src="иконки/11.png"
                    alt="Квесты"
                />
                <span className="absolute bottom-2 text-xs font-semibold uppercase tracking-wide text-black">
                    Квесты
                </span>
            </button>
            <button
                type="button"
                onClick={() => navigate('/reward')}
                className="relative flex flex-col items-center"
            >
                <img
                    className="h-20 w-20 object-contain"
                    src="background/box.png"
                    alt="Фон кнопки"
                />
                <img
                    className="absolute top-2 h-10 w-10 object-contain"
                    src="иконки/10.png"
                    alt="Награды"
                />
                <span className="absolute bottom-2 text-xs font-semibold uppercase tracking-wide text-black">
                    Награды
                </span>
            </button>
        </div>
    )
}