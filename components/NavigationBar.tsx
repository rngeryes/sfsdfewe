// components/NavigationBar.tsx

/**
 * This project was developed by Nikandr Surkov.
 * 
 * YouTube: https://www.youtube.com/@NikandrSurkov
 * GitHub: https://github.com/nikandr-surkov
 */

'use client'

import { useTab } from '@/contexts/TabContext'
import Earn from '@/icons/Earn'
import Friends from '@/icons/Friends'
import Home from '@/icons/Home'
import { TabType } from '@/utils/types'

const NavigationBar = () => {
    const { activeTab, setActiveTab } = useTab()

    const tabs: { id: TabType; label: string; Icon: React.FC<{ className?: string }> }[] = [
        { id: 'home', label: 'Главная', Icon: Home },
        { id: 'friends', label: 'Колесо', Icon: Earn },
        { id: 'earn', label: 'Профиль', Icon: Friends },
    ]

    return (
        <div className="flex justify-center w-full">
            <div className="fixed bottom-0 bg-black/50 border-t border-gray-700 w-full max-w-md backdrop-blur-sm">
                <div className="flex justify-between px-6 py-4">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="flex flex-col items-center transition-all duration-300 ease-in-out"
                            >
                                <tab.Icon
                                    className={`w-9 h-9 mb-1 transform transition-all duration-300 ease-in-out 
                                        ${isActive
                                            ? 'text-white scale-110'
                                            : 'text-white/50 scale-100'
                                        }`}
                                />
                                <span
                                    className={`text-sm font-medium transition-all duration-300 ease-in-out
                                        ${isActive ? 'text-white opacity-100' : 'text-white/50 opacity-80'}
                                    `}
                                >
                                    {tab.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default NavigationBar
