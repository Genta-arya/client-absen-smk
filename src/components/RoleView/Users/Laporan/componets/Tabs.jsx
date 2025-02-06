import React from "react";

const Tabs = ({ tabs, tabsState, setTabsState }) => {
  return (
    <div className="w-full mx-auto">
      <div className="flex border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              tabsState === tab
                ? "border-b-2 border-blue text-blue"
                : "text-gray-500 hover:text-blue"
            }`}
            onClick={() => setTabsState(tab)}
          >
            {tab === "harian" ? "Harian" : "Mingguan"}
          </button>
        ))}
      </div>
     
    </div>
  );
};

export default Tabs;
