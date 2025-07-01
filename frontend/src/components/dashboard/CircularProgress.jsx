export const CircularProgress = ({
  outCount,
  inCount,
  otherCount,
  total,
  outColor = "#4c51bf",
  inColor = "#FFA500",
  otherColor = "#d3d3d3",
  size = 180,
  strokeWidth = 20
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const outPercentage = (outCount / total) * 100;
  const inPercentage = (inCount / total) * 100;
  const otherPercentage = (otherCount / total) * 100;

  const outLength = (circumference * outPercentage) / 100;
  const inLength = (circumference * inPercentage) / 100;
  const otherLength = circumference - outLength - inLength;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
  {/* شادو داخلي */}
  <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
    <feOffset dx="0" dy="0" />
    <feGaussianBlur stdDeviation={strokeWidth / 2} result="offset-blur" />
    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
    <feFlood floodColor="rgba(0,0,0,0.25)" result="color" />
    <feComposite operator="in" in="color" in2="inverse" result="shadow" />
    <feComposite operator="over" in="shadow" in2="SourceGraphic" />
  </filter>

  {/* شادو خارجي */}
  <filter id="outerShadow" x="-50%" y="-50%" width="200%" height="200%">
    <feDropShadow dx="0" dy="0" stdDeviation={strokeWidth / 2} floodColor="rgba(0,0,0,0.25)" />
  </filter>
</defs>


        {/* الخلفية */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />

        {/* OUT */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={outColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${outLength} ${circumference}`}
          strokeDashoffset={0}
          strokeLinecap="butt"
          filter="url(#shadow)"
        />

        {/* IN */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={inColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${inLength} ${circumference}`}
          strokeDashoffset={-outLength}
          strokeLinecap="butt"
          filter="url(#shadow)"
        />

        {/* OTHER */}
        {otherCount > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={otherColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${otherLength} ${circumference}`}
            strokeDashoffset={-outLength - inLength}
            strokeLinecap="butt"
            filter="url(#shadow)"
          />
        )}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{total}</span>
        <span className="text-sm text-gray-500">تذكرة</span>
      </div>
    </div>
  );
};
