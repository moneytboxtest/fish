import { useNavigate } from "react-router-dom";

export function SaleButton() {
    const navigate = useNavigate();

    const saleSlots = Array.from({ length: 3 });

    return (
        <div className="absolute left-1/2 top-6 z-30 flex -translate-x-1/2 gap-4">
            {saleSlots.map((_, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => navigate('/shop')}
                    className="relative flex flex-col items-center"
                    aria-label="Посмотреть акции"
                >
                    <img
                        className="h-24 w-24 object-contain"
                        src="background/action.png"
                        alt="Акционное предложение"
                    />
                    <img
                        className="absolute top-1 h-16 w-16 object-contain"
                        src="иконки/5.png"
                        alt="Значок акции"
                    />
                    <span className="absolute bottom-4 text-sm font-semibold uppercase tracking-wide text-white">
                        Sale
                    </span>
                </button>
            ))}
        </div>
    );
}
