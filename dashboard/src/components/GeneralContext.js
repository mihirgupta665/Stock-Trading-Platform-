import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";
import AnalyticsModal from "./AnalyticsModal";

const GeneralContext = React.createContext({
  openBuyWindow: (uid) => {},
  openSellWindow: (uid) => {},
  closeBuyWindow: () => {},
  openAnalytics: (uid) => {},
  closeAnalytics: () => {},
  ordersChanged: false,
  triggerOrdersRefresh: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedStockPrice, setSelectedStockPrice] = useState(0.0);
  const [orderMode, setOrderMode] = useState("BUY");
  const [ordersChanged, setOrdersChanged] = useState(false);
  const [selectedAnalyticsStock, setSelectedAnalyticsStock] = useState(null);

  const handleOpenBuyWindow = (uid, price) => {
    setOrderMode("BUY");
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setSelectedStockPrice(price || 0.0);
  };

  const handleOpenSellWindow = (uid, price) => {
    setOrderMode("SELL");
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setSelectedStockPrice(price || 0.0);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    setSelectedStockPrice(0.0);
  };

  const handleOpenAnalytics = (uid) => {
    setSelectedAnalyticsStock(uid);
  };

  const handleCloseAnalytics = () => {
    setSelectedAnalyticsStock(null);
  };

  const triggerOrdersRefresh = () => {
    setOrdersChanged((prev) => !prev);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeBuyWindow: handleCloseBuyWindow,
        openAnalytics: handleOpenAnalytics,
        closeAnalytics: handleCloseAnalytics,
        ordersChanged,
        triggerOrdersRefresh,
      }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} mode={orderMode} price={selectedStockPrice} />}
      {selectedAnalyticsStock && (
        <AnalyticsModal 
          stockName={selectedAnalyticsStock} 
          onClose={handleCloseAnalytics} 
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
