import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { InfoBar } from "../components/InfoBar";
import { GameMenuButton } from "../navbutton/GameMenuButton";
import { RightMenuButton } from "../navbutton/RightMenuButton";
import { LeftMenuButton } from "../navbutton/LeftMenuButton";
import { SaleButton } from "../navbutton/SaleButton";

export function MainMenu(){
    const navigate = useNavigate();
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "Капитан Рыбак",
            text: "Добро пожаловать на базу! Готовы к новым приключениям?",
            time: "10:30",
            isSystem: true,
            avatar: "🎣"
        },
        {
            id: 2,
            sender: "Алексей",
            text: "Привет всем! Кто-нибудь знает, где лучше ловить зимой?",
            time: "10:35",
            isSystem: false,
            avatar: "👨‍🦲"
        },
        {
            id: 3,
            sender: "Мария",
            text: "На северном озере отлично клюет! Вчера поймала трофейную щуку 🐟",
            time: "10:37",
            isSystem: false,
            avatar: "👩"
        },
        {
            id: 4,
            sender: "Система",
            text: "🏆 Игрок Алексей победил в турнире 'Зимняя рыбалка'!",
            time: "10:40",
            isSystem: true,
            avatar: "🏆"
        }
    ]);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            const message = {
                id: messages.length + 1,
                sender: "Вы",
                text: newMessage,
                time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                isSystem: false,
                avatar: "🎯"
            };
            setMessages([...messages, message]);
            setNewMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <InfoBar />
            <GameMenuButton />
            <RightMenuButton />
            <LeftMenuButton />
            <SaleButton />

            {/* Кнопка чата */}
            <div className="absolute bottom-8 left-1/2 z-40 -translate-x-1/2">
                <div
                    className="relative flex flex-col items-center cursor-pointer"
                    onClick={() => setShowChat(!showChat)}
                >
                    <img className="object-cover" src="background/boll.png" width={90} height={80} />
                    <div className="absolute top-3 text-2xl">💬</div>
                    <p className="absolute bottom-[30%] text-white text-[12px] font-bold text-center">Чат</p>
                    {/* Индикатор новых сообщений */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">3</span>
                    </div>
                </div>
            </div>

            {/* Окно чата */}
            {showChat && (
                <div className="absolute top-24 right-16 z-50">
                    <div className="relative">
                        <img src="43.png" width={650} alt="chat window" className="drop-shadow-2xl" />

                        <div className="absolute top-12 left-8 right-8 bottom-12">
                            <div className="h-full flex flex-col">
                                {/* Заголовок чата */}
                                <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-blue-200">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        💬 Общий чат
                                    </h2>
                                    <button 
                                        onClick={() => setShowChat(false)}
                                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                {/* Список сообщений */}
                                <div className="flex-1 overflow-y-auto pr-2 mb-4 max-h-[350px]">
                                    <div className="space-y-3">
                                        {messages.map((message) => (
                                            <div 
                                                key={message.id} 
                                                className={`rounded-lg p-3 shadow border ${
                                                    message.isSystem 
                                                        ? 'bg-blue-100/60 border-blue-300' 
                                                        : message.sender === "Вы"
                                                            ? 'bg-green-100/60 border-green-300 ml-8'
                                                            : 'bg-white/60 border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 border-2 rounded-full flex items-center justify-center flex-shrink-0 bg-white text-lg">
                                                        {message.avatar}
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="font-bold text-gray-800 text-sm">
                                                                {message.sender}
                                                            </h4>
                                                            <span className="text-xs text-gray-500">
                                                                {message.time}
                                                            </span>
                                                        </div>
                                                        
                                                        <p className="text-sm text-gray-700">
                                                            {message.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Поле ввода сообщения */}
                                <div className="border-t-2 border-blue-200 pt-3">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Введите сообщение..."
                                            className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white/80"
                                        />
                                        <button 
                                            onClick={handleSendMessage}
                                            disabled={newMessage.trim() === ""}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                                newMessage.trim() !== ""
                                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            📤 Отправить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
