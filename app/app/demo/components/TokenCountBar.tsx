interface TokenCountBarProps {
    tokens: number;
    maxTokens: number;
    color: 'red' | 'green' | 'blue';
}

export default function TokenCountBar({ tokens, maxTokens, color }: TokenCountBarProps) {
    const percentage = maxTokens > 0 ? (tokens / maxTokens) * 100 : 0;

    const colorClasses = {
        red: 'bg-red-500',
        green: 'bg-green-500',
        blue: 'bg-blue-500'
    };

    return (
        <div className="w-full">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{tokens} tokens</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
}
