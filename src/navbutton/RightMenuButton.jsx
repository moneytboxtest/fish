import { useNavigate } from "react-router-dom"


export function RightMenuButton(){

    const navigate = useNavigate();


    return (
       <div className="absolute right-6 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-4">
            <button
                type="button"
                onClick={() => navigate('/inventory')}
                className="relative flex flex-col items-center"
            >
                <img
                    className="h-20 w-20 object-contain"
                    src="background/boll.png"
                    alt="Фон кнопки"
                />
                <img
                    className="absolute top-1/4 h-14 w-14 object-contain"
                    src="иконки/3.png"
                    alt="Снаряжение"
                />
                <span className="absolute bottom-2 text-xs font-semibold uppercase tracking-wide text-white">
                    Снаряжение
                </span>
            </button>

            <button
                type="button"
                onClick={() => navigate('/achievement')}
                className="relative flex flex-col items-center"
            >
                <img
                    className="h-20 w-20 object-contain"
                    src="background/boll.png"
                    alt="Фон кнопки"
                />
                <img
                    className="absolute top-1/4 h-14 w-14 object-contain"
                    src="иконки/2.png"
                    alt="Достижения"
                />
                <span className="absolute bottom-2 text-xs font-semibold uppercase tracking-wide text-white">
                    Достижения
                </span>
            </button>

            <button
                type="button"
                onClick={() => navigate('/inventory')}
                className="relative flex flex-col items-center"
            >
                <img
                    className="h-20 w-20 object-contain"
                    src="background/boll.png"
                    alt="Фон кнопки"
                />
                <img
                    className="absolute top-1/4 h-14 w-14 object-contain"
                    src="иконки/4.png"
                    alt="Инвентарь"
                />
                <span className="absolute bottom-2 text-xs font-semibold uppercase tracking-wide text-white">
                    Инвентарь
                </span>
            </button>
        </div>
    )
}