import React, { useRef, useEffect } from 'react';

type TimePickerWheelProps = {
  values: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
};

export default function TimePickerWheel({ values, value, onChange, label }: TimePickerWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayValues = ['', ...values, ''];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const itemHeight = 40;
      const scrollTop = container.scrollTop;
      const selectedIndex = Math.floor((scrollTop + itemHeight / 2) / itemHeight);
      const selectedValue = displayValues[selectedIndex + 1];

      if (selectedValue !== value) {
        onChange(selectedValue);
        requestAnimationFrame(() => {
          container.scrollTop = selectedIndex * itemHeight;
        });
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [displayValues, value, onChange]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[120px] w-[60px] overflow-hidden">
        <div
          ref={containerRef}
          className="absolute inset-0 overflow-auto scrollbar-hide snap-y snap-mandatory"
        >
          {displayValues.map((v, index) => (
            <div
              key={`${v}-${index}`}
              className="h-[40px] flex items-center justify-center snap-start text-lg font-medium"
            >
              {v}
            </div>
          ))}
        </div>
        <div className="absolute inset-0 pointer-events-none time-picker-overlay" />
      </div>
      <span className="text-sm text-gray-500 mt-2">{label}</span>
    </div>
  );
}